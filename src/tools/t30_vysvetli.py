# Test tlačítka „Nevím – vysvětli mi to“ (v27): zobrazí vysvětlení, po něm správná odpověď = 1 bod, téma se počítá jako chyba napoprvé
import asyncio
from playwright.async_api import async_playwright
MOCK="""window.__said=[]; const SS={speaking:false,pending:false,cancel(){},resume(){},getVoices(){return [{lang:'cs-CZ',name:'Google čeština',localService:false}]},speak(u){window.__said.push(u.text)},onvoiceschanged:null};
Object.defineProperty(window,'speechSynthesis',{value:SS}); window.SpeechSynthesisUtterance=function(t){this.text=t};"""
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True); pg=await ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.add_init_script("localStorage.setItem('ph-intro','1');localStorage.setItem('ph-read','0');"+MOCK)
    await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
    await pg.route('**/sw.js', lambda r: r.fulfill(status=404, body=''))
    await pg.route('**/fonts.g*/**', lambda r: r.abort())
    await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(600)
    await pg.evaluate("""()=>{ document.querySelectorAll('.modal').forEach(m=>m.remove()); S.profiles=[]; const a=newProfile({id:'a',name:'Víťa',grade:2,mode:'quest',cats:['seq2','rem']}); S.profiles.push(a); go({name:'hero',pid:'a'}); act('play'); }""")
    await pg.wait_for_timeout(700)
    for cat,q,a,typ in [('seq2','Pokračuj v řadě: 50, 45, 40, 35, ?',30,'num'),('rem','23 : 4',[5,3],'rem')]:
      await pg.evaluate(f"""()=>{{ const t=prof('a').today; t.problems[t.idx]={{cat:'{cat}',q:'{q}',a:{a},type:'{typ}',small:true}}; render(); }}""")
      await pg.wait_for_timeout(300)
      btn=await pg.query_selector('[data-explain]'); print(cat,'tlačítko:',bool(btn))
      pts0=await pg.evaluate("prof('a').points")
      await btn.tap(); await pg.wait_for_timeout(500)
      print('  okénko:',await pg.evaluate("!!document.getElementById('xpbox')"),'| tlačítko pryč:',await pg.evaluate("!document.querySelector('[data-explain]')"))
      await pg.screenshot(path=f'/tmp/hs/xp_{cat}.png', full_page=True)
      print('  tries',await pg.evaluate("prof('a').today.tries"),'cst',await pg.evaluate(f"JSON.stringify(prof('a').cst['{cat}'])"))
      # přerenderování okénko zachová
      await pg.evaluate("render()"); await pg.wait_for_timeout(200); print('  po render() okénko zůstává:',await pg.evaluate("!!document.getElementById('xpbox')"))
      await pg.tap('#xpsay'); await pg.wait_for_timeout(250); print('  přečteno:',(await pg.evaluate("window.__said.slice(-1)[0]||''"))[:90])
      if typ=='rem':
        await pg.evaluate("()=>{ $('#a1').value='5'; $('#a2').value='3'; key('ok'); }")
      else:
        await pg.evaluate(f"()=>{{ $('#a1').value='{a}'; key('ok'); }}")
      await pg.wait_for_timeout(300); print('  body +',await pg.evaluate("prof('a').points")-pts0, '| res', await pg.evaluate("prof('a').today.res.slice(-1)[0]"))
      await pg.wait_for_timeout(900)
    # úloha bez vysvětlení (angličtina) – tlačítko se nezobrazí
    await pg.evaluate("()=>{ const t=prof('a').today; CUR_GRADE=2; const pr=genOne('en_read'); pr.cat='en_read'; t.problems[t.idx]=pr; render(); }"); await pg.wait_for_timeout(300)
    print('angličtina bez tlačítka:', not await pg.query_selector('[data-explain]'))
    print('chyby:',errs); await b.close()
asyncio.run(main())
