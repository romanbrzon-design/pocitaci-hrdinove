import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(viewport={'width':1000,'height':900}); pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
        await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
        await pg.add_init_script("localStorage.setItem('ph-intro','1'); window.SAID=[]; Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>SAID.push(u.text),cancel:()=>{},getVoices:()=>[],addEventListener:()=>{}},configurable:true}); window.SpeechSynthesisUtterance=function(t){this.text=t};")
        await pg.goto('file:///home/claude/pocitani/site/index.html'); await pg.wait_for_timeout(500)
        r=await pg.evaluate("""()=>{ const a=newProfile({id:'k2',name:'Kuba',grade:2}); a.fx={stk:{zv0:2,zv10:1,jd3:1,vs4:1},setDone:{}}; 
           for(let i=0;i<12;i++) a.fx.stk['kz'+i]=1;  S.profiles.push(a);
           const f=fx(a); return JSON.stringify(f.stk)+' done:'+JSON.stringify(f.setDone); }""")
        print('migrated', r)
        await pg.evaluate("()=>go({name:'album',pid:'k2'})"); await pg.wait_for_timeout(300)
        await pg.screenshot(path='/home/claude/h_album.png', full_page=True)
        await pg.click('[data-stk=vs0]'); await pg.wait_for_timeout(300); await pg.screenshot(path='/home/claude/h_card.png')
        await pg.click('#scok'); await pg.wait_for_timeout(200)
        await pg.click('[data-quiz=cz]'); await pg.wait_for_timeout(300); await pg.screenshot(path='/home/claude/h_quiz.png')
        for i in range(3):
            await pg.locator('[data-o]').first.click(); await pg.wait_for_timeout(2000)
        await pg.screenshot(path='/home/claude/h_quizend.png')
        # play a day and see summary
        await pg.click('#qok'); await pg.evaluate("()=>go({name:'hero',pid:'k2'})"); await pg.wait_for_timeout(200)
        await pg.click('[data-act=play]'); await pg.wait_for_timeout(300)
        for i in range(10):
            pr=await pg.evaluate("()=>curProblem()"); await pg.evaluate("(a)=>submit(a)", pr['a']); await pg.wait_for_timeout(700)
        await pg.wait_for_timeout(500); await pg.screenshot(path='/home/claude/h_sum.png')
        print('errors',errs); await b.close()
asyncio.run(main())
