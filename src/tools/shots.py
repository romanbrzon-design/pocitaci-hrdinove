import asyncio
from playwright.async_api import async_playwright
O='/mnt/user-data/outputs/gp/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={'width':360,'height':640},device_scale_factor=3,is_mobile=True,has_touch=True)
        pg=await ctx.new_page()
        await pg.add_init_script("localStorage.setItem('ph-intro','1'); localStorage.setItem('ph-read','false'); document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style'); s.textContent='#readtg{display:none!important}'; document.head.appendChild(s);});")
        await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(800)
        setup="""()=>{ document.querySelectorAll('.modal').forEach(m=>m.remove()); S.profiles=[];
          const a=newProfile({id:'a',name:'Kuba',grade:3,mode:'quest',cats:defaultCats(3,['m','en','pr','cj'])}); a.xp=260; a.points=640; a.eq={weapon:5,shield:4,armor:4,head:4,boots:2,cape:2,pet:2,horse:2}; a.owned={...a.eq}; a.beaten=7; a.streak=5; a.lastDone=todayKey();
          const e=newProfile({id:'e',name:'Ema',grade:2,gender:'f',mode:'home',color:'#ff6fb5'}); e.points=410; e.eq={bed:5,rug:4,wall:4,lamp:5,curtain:2,plant:2,hpet:2}; e.owned={...e.eq}; e.beaten=5;
          const v=newProfile({id:'v',name:'Verunka',grade:0,gender:'f',mode:'pet',species:'bunny',petName:'Ňufík'}); v.xp=300; v.points=280; v.fedDate=todayKey(); v.eq={toy:3,pbed:3,collar:3,phat:2,shoes:2,outfit:2,friend:1}; v.owned={...v.eq}; v.beaten=4;
          a.fx={stk:{},setDone:{},read:{},stkV:2}; ALL_STICKERS.slice(0,40).forEach((s,i)=>{ if(i%3) a.fx.stk[s.id]=1; });
          S.profiles.push(a,e,v); }"""
        await pg.evaluate(setup)
        shots=[
          ("()=>go({name:'home'})",'1_domu'),
          ("()=>go({name:'hero',pid:'a'})",'2_hrdina'),
          ("()=>{ go({name:'map',pid:'a'}); startBattle(7); }",'3_souboj'),
          ("()=>go({name:'hero',pid:'e'})",'4_domecek'),
          ("()=>go({name:'hero',pid:'v'})",'5_zviratko'),
          ("()=>go({name:'album',pid:'a'})",'6_album'),
          ("()=>{ go({name:'hero',pid:'a'}); act('play'); }",'7_uloha'),
        ]
        for js,n in shots:
            await pg.evaluate(js); await pg.wait_for_timeout(1300); await pg.evaluate("()=>window.scrollTo(0,0)")
            await pg.screenshot(path=O+f'screenshot_{n}.png')
        await b.close()
asyncio.run(main())
