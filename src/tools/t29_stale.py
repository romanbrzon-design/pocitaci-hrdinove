# Incident 24.11.: staré zařízení s rodinným kódem a starými hrdiny nesmí přepsat novější postup na serveru
import asyncio, json
from playwright.async_api import async_playwright
DB={'settings':None,'profiles':{}}; SAVES=[]
def prog(j): p=json.loads(j); return (p.get('season',1), p.get('xp',0), p.get('totalCorrect',0))
async def handler(route):
  try:
    await _h(route)
  except Exception as e: print('HANDLER ERR', repr(e))
async def _h(route):
    req=route.request
    if req.method=='GET':
        await asyncio.sleep(0.6)
        await route.fulfill(status=200, content_type='application/json', body=json.dumps({'settings':DB['settings'],'profiles':DB['profiles']}))
    else:
        b=json.loads(req.post_data); rej=[]
        if b.get('action')=='save':
            SAVES.append(list(b['items'].keys()))
            for k,v in b['items'].items():
                if k!='settings' and k in DB['profiles']:
                    o,n=prog(DB['profiles'][k]),prog(v)
                    if n[0]<=o[0] and (n[1]<o[1] or n[2]<o[2]): rej.append(k); continue
                if k=='settings': DB['settings']=v
                else: DB['profiles'][k]=v
        await route.fulfill(status=200, content_type='application/json', body=json.dumps({'ok':True,'rejected':rej}))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        new={'id':'p4','name':'Romča','grade':4,'gender':'m','mode':'quest','points':900,'owned':{'weapon':5},'eq':{},'xp':425,'totalCorrect':331,'beaten':9,'cats':['add20'],'ts':2000}
        old={'id':'p4','name':'Čtvrťák','grade':4,'gender':'m','mode':'quest','points':10,'owned':{},'eq':{},'xp':240,'totalCorrect':176,'beaten':3,'cats':['add20'],'ts':5000}
        DB['settings']=json.dumps({'pin':'1234','reward':'x','length':'mid','perDay':10,'ver':3})
        DB['profiles']['p4']=json.dumps(new)
        state={'profiles':[old],'settings':{'pin':'1234','reward':'x','length':'mid','perDay':10,'ver':3}}
        pg=await b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('ph-intro','1'); localStorage.setItem('ph-family','\"TEST01\"'); localStorage.setItem('pocitani-hrdinove-v1', "+json.dumps(json.dumps(state))+");")
        async def cfg(r):
            print('CFG ROUTED'); await r.fulfill(status=200, content_type='application/javascript', body="window.BACKEND_URL='https://mock.backend/exec';")
        await pg.route('**/config.js', cfg)
        await pg.route('**/sw.js', lambda r: r.fulfill(status=404, body=''))
        await pg.route('https://mock.backend/**', handler)
        pg.on('request', lambda r: print('REQ', r.url[:70]) if 'config' in r.url else None)
        pg.on('requestfailed', lambda r: print('FAILED', r.url, r.failure))
        await pg.goto('http://localhost:8765/index.html')
        # podstrčit starý stav, jako by byl v zařízení, a znovu načíst
        # hned po startu: save() a skrytí stránky dřív, než dorazí pull
        await pg.wait_for_timeout(100)
        await pg.evaluate("()=>{ try{ save(); }catch(e){} Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true}); document.dispatchEvent(new Event('visibilitychange')); }")
        await pg.wait_for_timeout(2500)
        srv=json.loads(DB['profiles']['p4']); loc=await pg.evaluate("()=>{const p=S.profiles.find(p=>p.id==='p4'); return [p.name,p.xp]}")
        print("err", await pg.evaluate("async()=>{ try{ const r=await gas('loadAll'); for(const [id,j] of Object.entries(r.profiles)) migrate(JSON.parse(j)); return 'ok' }catch(e){ return String(e.stack) } }"))
        print("dbg", await pg.evaluate("()=>[pulledOnce, syncState, FAMILY, S.profiles.map(p=>p.id+p.name)]"))
        print("saves", SAVES, 'server', srv['name'], srv['xp'], 'local', loc)
        assert srv['name']=='Romča' and srv['xp']==425 and loc==['Romča',425]
        # rejected → převzetí serverové verze
        await pg.evaluate("()=>{ const p=prof('p4'); p.xp=1; p.totalCorrect=1; p.name='Zlý'; lastSent.p4='x'; flush(); }")
        await pg.wait_for_timeout(1500)
        loc=await pg.evaluate("()=>{const p=prof('p4'); return [p.name,p.xp]}"); print('po rejected', loc)
        assert loc==['Romča',425] and json.loads(DB['profiles']['p4'])['xp']==425
        await pg.evaluate("()=>{ view={name:'parent'}; parentOk=true; parentTab='backup'; render(); document.querySelector('#bk-load').click(); }")
        await pg.wait_for_timeout(800); t=await pg.evaluate("()=>document.querySelector('#bk-list').innerText"); print('zalohy', t)
        assert 'žádné zálohy' in t
        print('errors', errs); assert not errs; print('ALL OK')
        await b.close()
asyncio.run(main())
