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
        await pg.evaluate("()=>{ const a=newProfile({id:'a',name:'Anna',grade:3,gender:'f',mode:'home',color:'#21b37a'}); a.owned={bed:3,rug:2,wall:5,lamp:2,curtain:1,plant:2,hpet:1}; a.eq={...a.owned}; a.points=500; S.profiles.push(a); go({name:'hero',pid:'a'}); }")
        await pg.wait_for_timeout(800); await pg.screenshot(path='/home/claude/l1.png')
        await pg.click('[data-act=look]'); await pg.wait_for_timeout(500)
        await pg.click('.sw[data-part=bottom][data-c="#4f7cff"]'); await pg.wait_for_timeout(700)
        await pg.screenshot(path='/home/claude/l2.png')
        await pg.click('#lkok'); await pg.wait_for_timeout(600)
        # quest hero
        await pg.evaluate("()=>{ const q=newProfile({id:'q',name:'Kuba',grade:2,gender:'m',mode:'quest',color:'#e8435a'}); S.profiles.push(q); go({name:'hero',pid:'q'}); }"); await pg.wait_for_timeout(800)
        await pg.screenshot(path='/home/claude/l3.png')
        # pet buy auto-equip
        await pg.evaluate("()=>{ const v=newProfile({id:'v',name:'Verunka',grade:0,gender:'f',mode:'pet',species:'bunny'}); v.points=999; S.profiles.push(v); go({name:'hero',pid:'v'}); buy('shoes'); }"); await pg.wait_for_timeout(500)
        print('pet eq', await pg.evaluate("()=>JSON.stringify(prof('v').eq)"))
        await pg.screenshot(path='/home/claude/l4.png')
        print(errs); await b.close()
asyncio.run(main())
