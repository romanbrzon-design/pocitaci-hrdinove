import asyncio
from playwright.async_api import async_playwright
SETUP="""()=>{ S.profiles=[];
 const a=newProfile({id:'q1',name:'Kuba',grade:4,mode:'quest',color:'#4f7cff'}); a.owned={weapon:5,shield:4,armor:4,head:4,boots:2,cape:2,pet:2}; a.eq={...a.owned}; a.beaten=5; a.xp=200;
 const b=newProfile({id:'h1',name:'Ema',grade:2,gender:'f',mode:'home',color:'#ff6fb5'}); b.owned={bed:4,rug:3,wall:2,lamp:3,curtain:2,plant:2,hpet:2}; b.eq={...b.owned}; b.beaten=3;
 const c=newProfile({id:'t1',name:'Ela',grade:1,gender:'f',mode:'pet',species:'rat',petName:'Pepina',color:'#21b37a'}); c.owned={toy:3,pbed:3,collar:3,phat:3,shoes:2,outfit:2,friend:2}; c.eq={...c.owned}; c.beaten=4; c.xp=120; c.fedDate=todayKey();
 const d=newProfile({id:'t2',name:'Tom',grade:0,mode:'pet',species:'dragon',petName:'Ohník',color:'#e8435a'}); d.chests=['wood'];
 S.profiles.push(a,b,c,d); }"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        for vp,tag in [({'width':390,'height':844},'m'),({'width':1100,'height':860},'d')]:
            pg=await b.new_page(viewport=vp); pg.on('pageerror',lambda e: errs.append(str(e)))
            await pg.add_init_script("localStorage.setItem('ph-intro','1')")
            await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
            await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
            await pg.goto('file:///home/claude/pocitani/site/index.html'); await pg.wait_for_timeout(300)
            await pg.evaluate(SETUP)
            shots=[("home","()=>go({name:'home'})")]
            for pid in ['q1','h1','t1','t2']:
                shots+= [(f"hero_{pid}",f"()=>go({{name:'hero',pid:'{pid}'}})"),
                         (f"map_{pid}",f"()=>go({{name:'map',pid:'{pid}',sel:Math.min(prof('{pid}').beaten,9)}})"),
                         (f"battle_{pid}",f"()=>startBattle(Math.min(prof('{pid}').beaten,9))")]
            shots+=[("create","()=>{draft=null; go({name:'create'}); draft.mode='pet'; render();}"),("create_home","()=>{draft.mode='home'; render();}")]
            for name,js in shots:
                if name.startswith('battle'):
                    pid=name.split('_')[1]; await pg.evaluate(f"()=>go({{name:'map',pid:'{pid}'}})")
                await pg.evaluate(js); await pg.wait_for_timeout(250)
                await pg.screenshot(path=f'/home/claude/au_{tag}_{name}.png', full_page=True)
            await pg.close()
        print('errors',errs); await b.close()
asyncio.run(main())
