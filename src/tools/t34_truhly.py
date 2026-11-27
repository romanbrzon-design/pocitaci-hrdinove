# v31: truhly dávají zkušenosti + nálepku, ne novou výbavu; poloviční body za příklady
import asyncio
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True); pg=await ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.add_init_script("localStorage.setItem('ph-intro','1');localStorage.setItem('ph-read','0');")
    await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
    await pg.route('**/sw.js', lambda r: r.fulfill(status=404, body=''))
    await pg.route('**/fonts.g*/**', lambda r: r.abort())
    await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(600)
    r=await pg.evaluate("""()=>{ document.querySelectorAll('.modal').forEach(m=>m.remove()); S.profiles=[]; const a=newProfile({id:'a',name:'Víťa',grade:2,mode:'quest'}); S.profiles.push(a);
      a.owned={weapon:3,shield:2}; const own0=JSON.stringify(a.owned); let xp=0,found=0,stk=0,pts0=a.points;
      for(let i=0;i<400;i++){ a.chests=[i%4?'wood':'gold']; const x=openChestFor(a); xp+=x.xp; if(x.found) found++; if(x.stk&&x.stk.s) stk++; }
      return {ownedSame: JSON.stringify(a.owned)===own0, avgXp:xp/400, found, stk, ptsFromDupStickers:a.points-pts0}; }""")
    print('400 truhel:', r)
    # bez výbavy nic nenajde
    print('nový hrdina:', await pg.evaluate("""()=>{ const a=prof('a'); a.owned={}; let f=0; for(let i=0;i<200;i++){ a.chests=['gold']; if(openChestFor(a).found) f++; } return {found:f, owned:JSON.stringify(a.owned)}; }"""))
    # okno truhly
    await pg.evaluate("()=>{ const a=prof('a'); a.owned={weapon:2}; a.chests=['gold']; go({name:'hero',pid:'a'}); showChest(); }")
    await pg.wait_for_timeout(1700); await pg.screenshot(path='/tmp/hs/chest.png')
    print('text:', await pg.evaluate("document.getElementById('chtxt').innerText"))
    await pg.evaluate("document.querySelectorAll('.modal').forEach(m=>m.remove())")
    # body za příklad
    await pg.evaluate("()=>{ go({name:'hero',pid:'a'}); act('play'); }"); await pg.wait_for_timeout(500)
    pts=await pg.evaluate("prof('a').points")
    await pg.evaluate("()=>{ const t=prof('a').today; t.problems[t.idx]={cat:'add20',q:'2 + 3',a:5,type:'num'}; render(); $('#a1').value='5'; key('ok'); }"); await pg.wait_for_timeout(300)
    print('napoprvé +', await pg.evaluate("prof('a').points")-pts); await pg.wait_for_timeout(900)
    pts=await pg.evaluate("prof('a').points")
    await pg.evaluate("()=>{ const t=prof('a').today; t.problems[t.idx]={cat:'add20',q:'2 + 4',a:6,type:'num'}; render(); $('#a1').value='7'; key('ok'); }"); await pg.wait_for_timeout(300)
    await pg.evaluate("()=>{ $('#a1').value='6'; key('ok'); }"); await pg.wait_for_timeout(300)
    print('napodruhé +', await pg.evaluate("prof('a').points")-pts)
    print('odměna za soupeře 1/9/14:', await pg.evaluate("[bounty(0),bounty(8),bounty(13)]"))
    print('chyby:',errs); await b.close()
asyncio.run(main())
