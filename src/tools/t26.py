import asyncio, json
from playwright.async_api import async_playwright
# fake backend implementing new protocol
DB={'h1':'{"id":"h1","name":"Romča","xp":5}','settings':'{"pin":"1234","reward":"x","length":"mid","perDay":10,"ver":3}'}
LEG='LEG777'
def fam_rows(f):
    out={'settings':None,'profiles':{}}
    for k,v in DB.items():
        if f==LEG:
            if '|' in k: continue
            kk=k
        else:
            if not k.startswith(f+'|'): continue
            kk=k[len(f)+1:]
        if kk=='settings': out['settings']=v
        else: out['profiles'][kk]=v
    return out
async def handle(route):
    req=route.request; from urllib.parse import urlparse, parse_qs
    if req.method=='GET':
        q=parse_qs(urlparse(req.url).query)
        if 'claim' in q: body={'code': LEG if q['claim'][0] in DB and json.loads(DB[q['claim'][0]])['name']==q.get('n',[''])[0] else ''}
        else:
            f=q.get('f',[''])[0]
            if not f: body={'error':'nofamily'}
            else:
                d=fam_rows(f); body=d if (d['settings'] or d['profiles'] or f==LEG) else {'error':'unknown'}
    else:
        b=json.loads(req.post_data); f=b.get('family') or LEG
        if b['action']=='create': body={'ok': not any(k.startswith(f+'|') for k in DB)}
        elif b['action']=='save':
            for k,v in b['items'].items(): DB[k if f==LEG else f+'|'+k]=v
            body={'ok':True}
        elif b['action']=='deleteFamily':
            for k in [k for k in DB if (k.startswith(f+'|') if f!=LEG else '|' not in k)]: del DB[k]
            body={'ok':True}
        else: body={'ok':True}
    await route.fulfill(status=200, content_type='application/json', body=json.dumps(body))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        async def mk(init=None):
            ctx=await b.new_context(viewport={'width':900,'height':800}); pg=await ctx.new_page(); pg.on('pageerror',lambda e: errs.append(str(e)))
            await pg.add_init_script("localStorage.setItem('ph-intro','1');"+(init or ''))
            await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
            await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body='window.BACKEND_URL="https://fake.backend/exec"'))
            await pg.route('https://fake.backend/**', handle)
            await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(1200); return pg
        # 1) old device with local hero h1 -> claims legacy
        pg=await mk("localStorage.setItem('pocitani-hrdinove-v1', JSON.stringify({v:2,settings:{pin:'1234',reward:'x',length:'mid',perDay:10,ver:3},profiles:[{id:'h1',name:'Romča',xp:5,owned:{},eq:{}}]}));")
        print('old device family:', await pg.evaluate("()=>FAMILY"), await pg.evaluate("()=>heroes().map(h=>h.name)"))
        # 2) new device -> family screen, create new
        pg2=await mk(); await pg2.screenshot(path='/home/claude/fam1.png')
        print('view:', await pg2.evaluate("()=>view.name"))
        await pg2.click('[data-act=fam-new]'); await pg2.wait_for_timeout(1500)
        code=await pg2.evaluate("()=>FAMILY"); print('new family', code, 'heroes', await pg2.evaluate("()=>heroes().length"))
        await pg2.screenshot(path='/home/claude/fam2.png')
        await pg2.evaluate("()=>{ document.querySelectorAll('.modal').forEach(m=>m.remove()); const h=newProfile({name:'Ema'}); S.profiles.push(h); save(); }"); await pg2.wait_for_timeout(1500)
        print('DB keys', sorted(DB.keys()))
        # 3) third device joins with code -> sees Ema, not Romča
        pg3=await mk(); await pg3.fill('#famcode', code.lower()); await pg3.click('[data-act=fam-join]'); await pg3.wait_for_timeout(1500)
        print('joined heroes:', await pg3.evaluate("()=>heroes().map(h=>h.name)"))
        # wrong code
        pg4=await mk(); await pg4.fill('#famcode','ZZZZZZ'); await pg4.click('[data-act=fam-join]'); await pg4.wait_for_timeout(800)
        print('wrong code msg:', await pg4.evaluate("()=>view.fst"))
        # parent settings box
        await pg3.evaluate("()=>{ parentOk=true; parentTab='settings'; go({name:'parent'}); }"); await pg3.wait_for_timeout(300)
        await pg3.screenshot(path='/home/claude/fam3.png', full_page=True)
        print('errors', errs); await b.close()
asyncio.run(main())
