# kontaktní listy všech kombinací výbavy hrdiny
import asyncio, sys
from playwright.async_api import async_playwright
SHEETS={
 'weapon':[('weapon',t) for t in range(1,10)],
 'shield':[('shield',t) for t in range(1,8)],
 'head':[('head',t) for t in range(1,8)],
 'cape':[('cape',t) for t in range(1,6)],
 'boots':[('boots',t) for t in range(1,6)],
}
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1500,'height':900}); errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.add_init_script("localStorage.setItem('ph-intro','1');")
    await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
    await pg.route('**/sw.js', lambda r: r.fulfill(status=404, body=''))
    await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(600)
    which=sys.argv[1:] or list(SHEETS)+['full','rider']
    for name in which:
      if name in SHEETS: rows=[[{s:t,'armor':a} for (s,t) in SHEETS[name]] for a in range(8)]
      elif name=='full': rows=[[{'weapon':min(9,1+a+k%3),'shield':min(7,max(1,a)),'head':1+((a+k)%7),'cape':1+(a+k)%5,'boots':1+(a+2*k)%5,'armor':a} for k in range(6)] for a in range(8)]
      else: rows=[[{'weapon':min(9,1+a+k%3),'shield':min(7,max(1,a)),'head':1+((a+k)%7),'cape':1+(a+k)%5,'boots':1+(a+2*k)%5,'armor':a,'horse':1+(k%5),'pet':1+(a+k)%5} for k in range(4)] for a in range(8)]
      for g in 'mf':
        js="""(args)=>{ const [rows,g,rider]=args; document.body.innerHTML=''; document.body.style.background='#9fd4ff';
          const wrap=document.createElement('div'); wrap.style.cssText='display:grid;grid-template-columns:repeat('+rows[0].length+','+(rider?'220px':'170px')+');gap:6px;padding:8px'; document.body.appendChild(wrap);
          for(const r of rows) for(const eq of r){ const p=newProfile({id:'x',name:'X',grade:2,gender:g,mode:'quest'}); p.eq=eq; const d=document.createElement('div'); d.className='stage'; d.style.cssText='background:linear-gradient(#bfe3ff,#9be08a);border:2px solid #7a4a1d;border-radius:10px;overflow:hidden'; d.innerHTML=heroImg(p); wrap.appendChild(d); } }"""
        await pg.evaluate(js,[rows,g,name=='rider']); await pg.wait_for_timeout(1500)
        await pg.evaluate(js,[rows,g,name=='rider']); await pg.wait_for_timeout(700)
        await pg.screenshot(path=f'/tmp/hs/combo_{name}_{g}.png',full_page=True)
    print(errs); await b.close()
asyncio.run(main())
