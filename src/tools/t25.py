import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(viewport={'width':1000,'height':900}); pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('ph-intro','1')")
        await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
        await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(400)
        shots=[]
        for i,(js) in enumerate([
          "const p=newProfile({id:'a',name:'Kuba',mode:'quest'}); p.eq={weapon:9,shield:7,armor:7,head:7,boots:5,cape:5,pet:5,horse:4}; p.owned={...p.eq}; p.beaten=12; S.profiles=[p]; go({name:'hero',pid:'a'});",
          "const p=newProfile({id:'a',name:'Kuba',mode:'quest'}); p.eq={weapon:2,shield:1,horse:1}; p.owned={...p.eq}; S.profiles=[p]; go({name:'hero',pid:'a'});",
          "const p=newProfile({id:'a',name:'Ema',mode:'pet',species:'cat'}); p.xp=400; p.eq={toy:9,pbed:7,collar:7,phat:7,shoes:5,outfit:5,friend:5,buddy:4}; p.buddy='dog'; p.owned={...p.eq}; S.profiles=[p]; go({name:'hero',pid:'a'});",
          "const p=newProfile({id:'a',name:'Ema',mode:'pet',species:'bunny'}); p.xp=400; p.eq={collar:6,outfit:4,phat:6,shoes:4,buddy:2,toy:8,pbed:6}; p.buddy='fox'; p.owned={...p.eq}; S.profiles=[p]; go({name:'hero',pid:'a'});",
          "const p=newProfile({id:'a',name:'Anna',mode:'home',gender:'f'}); p.eq={bed:9,rug:7,wall:7,lamp:7,curtain:5,plant:5,hpet:5,treat:4}; p.owned={...p.eq}; S.profiles=[p]; go({name:'hero',pid:'a'});",
          "const p=newProfile({id:'a',name:'Anna',mode:'home',gender:'f'}); p.eq={bed:8,rug:6,wall:6,lamp:6,curtain:4,plant:4,hpet:4}; p.owned={...p.eq}; S.profiles=[p]; go({name:'hero',pid:'a'});",
        ]):
            await pg.evaluate("()=>{"+js+"}"); await pg.wait_for_timeout(900)
            el=await pg.query_selector('.stage'); await el.screenshot(path=f'/tmp/v{i}.png')
        for mode in ['quest','home','pet']:
            await pg.evaluate(f"()=>{{ const p=newProfile({{id:'a',name:'X',mode:'{mode}'}}); p.beaten=15; S.profiles=[p]; go({{name:'map',pid:'a'}}); }}"); await pg.wait_for_timeout(700)
            await pg.screenshot(path=f'/tmp/map_{mode}.png', full_page=True)
        await pg.evaluate("()=>{ const p=newProfile({id:'a',name:'Kuba',mode:'quest'}); p.eq={horse:3,weapon:9}; p.beaten=13; S.profiles=[p]; go({name:'map',pid:'a'}); startBattle(13); }"); await pg.wait_for_timeout(700)
        await pg.screenshot(path='/tmp/bat.png')
        print(errs); await b.close()
asyncio.run(main())
