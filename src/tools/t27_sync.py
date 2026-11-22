# Test ukládání: nákup se nesmí ztratit, když pull přijde dřív než odeslání; odeslání při zavření; změna z jiného zařízení se převezme
import asyncio, json
from playwright.async_api import async_playwright
DB={'settings':None,'profiles':{}}; LOG=[]
async def handler(route):
    req=route.request
    if req.method=='GET':
        await route.fulfill(status=200, content_type='application/json', body=json.dumps({'settings':DB['settings'],'profiles':DB['profiles']}))
    else:
        b=json.loads(req.post_data); LOG.append(b.get('action'))
        if b.get('action')=='save':
            for k,v in b['items'].items():
                if k=='settings': DB['settings']=v
                else: DB['profiles'][k]=v
        await route.fulfill(status=200, content_type='application/json', body='{"ok":true}')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        hero={'id':'s1','name':'Sárinka','grade':2,'gender':'f','mode':'quest','points':500,'owned':{},'eq':{},'xp':0,'beaten':2,'cats':['add20']}
        DB['settings']=json.dumps({'pin':'1234','reward':'x','length':'mid','perDay':10,'ver':3})
        DB['profiles']['s1']=json.dumps(hero)
        async def page():
            pg=await b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e)))
            await pg.add_init_script("localStorage.setItem('ph-intro','1'); localStorage.setItem('ph-family','\"TEST01\"');")
            await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body="window.BACKEND_URL='https://mock.backend/exec';"))
            await pg.route('**/sw.js', lambda r: r.fulfill(status=404, body=''))
            await pg.route('https://mock.backend/**', handler)
            await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(1200)
            await pg.evaluate("()=>document.querySelectorAll('.modal').forEach(m=>m.remove())")
            return pg
        pg=await page()
        print('family', await pg.evaluate("()=>FAMILY"), 'heroes', await pg.evaluate("()=>S.profiles.map(p=>p.name)"))
        # 1) nákup a okamžitý pull (dřív než 700 ms flush)
        await pg.evaluate("()=>{ go({name:'hero',pid:'s1'}); buy('weapon'); }")
        await pg.evaluate("()=>pull(true)"); await pg.wait_for_timeout(200)
        loc=await pg.evaluate("()=>({own:prof('s1').owned.weapon, eq:prof('s1').eq.weapon, pts:prof('s1').points})")
        print('1 po pull lokálně', loc)
        await pg.wait_for_timeout(1200)
        srv=json.loads(DB['profiles']['s1']); print('1 na serveru', srv['owned'], srv['eq'], srv['points'])
        assert loc['own']==1 and loc['eq']==1 and srv['owned'].get('weapon')==1 and srv['eq'].get('weapon')==1
        # 2) nákup a hned zavření aplikace
        print('2 cena štítu', await pg.evaluate("()=>price('shield',1,prof('s1'))"), await pg.evaluate("()=>{ buy('shield'); return prof('s1').owned; }"))
        await pg.evaluate("()=>{ Object.defineProperty(document,'visibilityState',{value:'hidden',configurable:true}); document.dispatchEvent(new Event('visibilitychange')); }")
        await pg.wait_for_timeout(300)
        srv=json.loads(DB['profiles']['s1']); print('2 po skrytí na serveru', srv['owned'])
        assert srv['owned'].get('shield')==1
        await pg.close()
        # 3) jiné zařízení: změna na serveru novější → převezme se
        pg=await page()
        print('3 načteno', await pg.evaluate("()=>prof('s1').owned"))
        s=json.loads(DB['profiles']['s1']); s['owned']['armor']=1; s['points']=10; s['ts']=s.get('ts',0)+100000; DB['profiles']['s1']=json.dumps(s)
        await pg.evaluate("()=>pull(true)"); await pg.wait_for_timeout(200)
        r=await pg.evaluate("()=>({o:prof('s1').owned, p:prof('s1').points})"); print('3 po pull', r)
        assert r['o'].get('armor')==1 and r['p']==10
        # 4) starý stav v telefonu (bez neodeslaných změn) nesmí přepsat server
        s=json.loads(DB['profiles']['s1']); s['owned']['head']=2; s['ts']+=1000; DB['profiles']['s1']=json.dumps(s)
        await pg.evaluate("()=>pull(true)"); await pg.wait_for_timeout(1000)
        print('4 server', json.loads(DB['profiles']['s1'])['owned'])
        assert json.loads(DB['profiles']['s1'])['owned'].get('head')==2
        print('errors', errs); print('ALL OK')
        await b.close()
asyncio.run(main())
