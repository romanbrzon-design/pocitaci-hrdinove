import asyncio
from playwright.async_api import async_playwright
MOCK="""window.__said=[]; const SS={speaking:false,pending:false,cancel(){window.__said.push('[cancel]')},resume(){},getVoices(){return [{lang:'cs-CZ',name:'Google čeština',localService:false}]},speak(u){window.__said.push(u.text)},onvoiceschanged:null};
Object.defineProperty(window,'speechSynthesis',{value:SS}); window.SpeechSynthesisUtterance=function(t){this.text=t};"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':412,'height':900},device_scale_factor=2,is_mobile=True,has_touch=True); pg=await ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.add_init_script("localStorage.setItem('ph-intro','1');"+MOCK)
    await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
    await pg.route('**/sw.js', lambda r: r.fulfill(status=404, body=''))
    await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(600)
    print('TOUCH',await pg.evaluate("TOUCH"))
    await pg.evaluate("""()=>{ document.querySelectorAll('.modal').forEach(m=>m.remove()); S.profiles=[]; const a=newProfile({id:'a',name:'Míša',grade:0,mode:'quest',cats:['colors0']}); S.profiles.push(a); go({name:'hero',pid:'a'}); act('play'); }""")
    await pg.wait_for_timeout(800)
    await pg.evaluate("()=>{ const t=prof('a').today; CUR_GRADE=1; const pr=genOne('cj_opp'); pr.cat='cj_opp'; t.problems[t.idx]=pr; lastSpoken=null; window.__said=[]; render(); }")
    await pg.wait_for_timeout(600)
    print('auto read:',await pg.evaluate("window.__said"))
    ch=await pg.query_selector_all('[data-choice]'); print('choices',len(ch), [await c.inner_text() for c in ch])
    idx0=await pg.evaluate("prof('a').today.idx")
    A=await pg.evaluate('curProblem().a'); await ch[A].tap(); await pg.wait_for_timeout(300)
    print('after 1st tap: armed=',await pg.evaluate("!!document.querySelector('.choice.armed')"),'idx',await pg.evaluate("prof('a').today.idx"),'said',await pg.evaluate("window.__said.slice(-2)"))
    await ch[A].tap(force=True); await pg.wait_for_timeout(1800)
    print('after 2nd tap: idx',await pg.evaluate("prof('a').today.idx"),'(was',idx0,')')
    await pg.evaluate("()=>{ const t=prof('a').today; const pr=genOne('odd0'); pr.cat='odd0'; t.problems[t.idx]=pr; window.__said=[]; render(); }"); await pg.wait_for_timeout(500)
    await (await pg.query_selector('#app .prob')).tap(); await pg.wait_for_timeout(300); print('tap on question said:',await pg.evaluate("window.__said"))
    c2=await pg.query_selector_all('[data-choice]'); i0=await pg.evaluate("prof('a').today.idx"); A2=await pg.evaluate('curProblem().a'); await c2[A2].tap(force=True); await pg.wait_for_timeout(1500); print('picture answer single tap advances:',i0,'->',await pg.evaluate("prof('a').today.idx"))
    await pg.evaluate("()=>{ go({name:'home'}); }"); await pg.wait_for_timeout(600)
    await pg.wait_for_timeout(500); await pg.evaluate('window.scrollTo(0,1e6)'); await pg.wait_for_timeout(400); await pg.screenshot(path='/tmp/hs/m_home.png')
    print(errs); await b.close()
asyncio.run(main())
