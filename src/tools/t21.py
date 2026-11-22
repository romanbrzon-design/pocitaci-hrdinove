import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(viewport={'width':1000,'height':850}); pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
        await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
        await pg.add_init_script("window.SAID=[]; Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>SAID.push(u.text),cancel:()=>{},getVoices:()=>[],addEventListener:()=>{}},configurable:true}); window.SpeechSynthesisUtterance=function(t){this.text=t};")
        await pg.goto('file:///home/claude/pocitani/site/index.html'); await pg.wait_for_timeout(900)
        await pg.screenshot(path='/home/claude/g_intro.png')
        for i in range(6): await pg.click('#inext'); await pg.wait_for_timeout(80)
        print('intro gone', await pg.locator('.modal').count()==0)
        await pg.evaluate("()=>{ const a=newProfile({id:'k2',name:'Kuba',grade:2,cats:defaultCats(2,['m','en','pr','cj'])}); const b=newProfile({id:'k4',name:'Ema',grade:4,gender:'f'}); S.profiles.push(a,b); go({name:'hero',pid:'k2'}); }")
        await pg.click('[data-act=play]'); await pg.wait_for_timeout(300)
        # answer: first 3 wrong twice to create review items, rest right
        for i in range(10):
            pr=await pg.evaluate("()=>curProblem()")
            if i<3:
                bad = (pr['a']+1)%len(pr['options']) if pr['type']=='choice' else ('>' if pr['type']=='cmp' and pr['a']!='>' else ('<' if pr['type']=='cmp' else ([99,9] if pr['type']=='rem' else 99999)))
                await pg.evaluate("(a)=>submit(a)", bad); await pg.wait_for_timeout(200)
                await pg.evaluate("(a)=>submit(a)", bad); await pg.wait_for_timeout(2400)
            else:
                await pg.evaluate("(a)=>submit(a)", pr['a']); await pg.wait_for_timeout(800)
        await pg.wait_for_timeout(500)
        await pg.screenshot(path='/home/claude/g_sum.png')
        print('review', await pg.evaluate("()=>fx(prof('k2')).rev.map(r=>r.id+' due '+r.due)"))
        await pg.click('[data-act=wheel]', force=True); await pg.wait_for_timeout(500); await pg.screenshot(path='/home/claude/g_wheel0.png')
        await pg.click('#wspin'); await pg.wait_for_timeout(4800); await pg.screenshot(path='/home/claude/g_wheel1.png')
        await pg.click('#wbtn button'); await pg.wait_for_timeout(200)
        await pg.evaluate("()=>go({name:'hero',pid:'k2'})"); await pg.wait_for_timeout(300)
        await pg.screenshot(path='/home/claude/g_hero.png', full_page=True)
        await pg.click('[data-act=album]'); await pg.wait_for_timeout(200); await pg.screenshot(path='/home/claude/g_album.png', full_page=True)
        await pg.evaluate("()=>go({name:'hero',pid:'k2'})")
        await pg.click('[data-act=timed]'); await pg.wait_for_timeout(200); await pg.click('[data-act=t-go]'); await pg.wait_for_timeout(300)
        for i in range(6):
            pr=await pg.evaluate("()=>curProblem()")
            await pg.evaluate("(a)=>submit(a)", pr['a']); await pg.wait_for_timeout(350)
        await pg.screenshot(path='/home/claude/g_timed.png')
        await pg.evaluate("()=>{ view.tm.end=Date.now(); }"); await pg.wait_for_timeout(600)
        await pg.screenshot(path='/home/claude/g_timedend.png')
        # review injection next day
        n=await pg.evaluate("()=>{ const p=prof('k2'); p.today=null; const k=todayKey(); const real=todayKey; window.todayKey=(d)=>d?real(d):addDays(k,1); const t=ensureToday(p); window.todayKey=real; return t.problems.filter(x=>x.review).length; }")
        print('review injected tomorrow:', n)
        # duel
        await pg.evaluate("()=>go({name:'home'})"); await pg.wait_for_timeout(200); await pg.screenshot(path='/home/claude/g_home.png', full_page=True)
        await pg.click('[data-act=duel]'); await pg.wait_for_timeout(200)
        await pg.select_option('#d-a','k2'); await pg.select_option('#d-b','k4')
        await pg.click('[data-act=duel-go]'); await pg.wait_for_timeout(200)
        for t in range(10):
            await pg.click('[data-act=duel-ready]'); await pg.wait_for_timeout(150)
            if t==1: await pg.screenshot(path='/home/claude/g_duel.png')
            pr=await pg.evaluate("()=>curProblem()")
            await pg.evaluate("(a)=>submit(a)", pr['a'] if t%3 else (99999 if pr['type'] in ('num',) else pr['a'])); await pg.wait_for_timeout(1900)
        await pg.screenshot(path='/home/claude/g_duelend.png')
        print('errors',errs); await b.close()
asyncio.run(main())
