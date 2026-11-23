import asyncio, sys
from playwright.async_api import async_playwright
SP=['cat','dog','bunny','pony','rat','hamster','fox','panda','owl','dragon']
SLOT=sys.argv[1]; N=int(sys.argv[2]); ST=int(sys.argv[3]) if len(sys.argv)>3 else 3
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':130*N+40,'height':900},device_scale_factor=2); errs=[]
    pg.on('pageerror',lambda e: errs.append(str(e)))
    await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
    await pg.route('**/sw.js', lambda r: r.fulfill(status=404, body=''))
    await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(500)
    js="""(a)=>{ const [SP,slot,N,st]=a; document.body.innerHTML=''; document.body.style.background='#bfe3ff'; const w=document.createElement('div'); w.style.cssText='display:grid;grid-template-columns:repeat('+(N+1)+',120px);gap:4px;padding:6px'; document.body.appendChild(w);
      for(const sp of SP) for(let t=0;t<=N;t++){ const eq={}; if(slot==='mix'){ Object.assign(eq,{collar:1+t%5,phat:1+(t+1)%5,shoes:1+t%5,outfit:1+(t+2)%5}); if(t===0){} } else if(t) eq[slot]=t; const d=document.createElement('div'); d.className='stage'; d.style.cssText='background:linear-gradient(#bfe3ff,#9be08a);border:1px solid #7a4a1d;height:120px'; d.innerHTML=petSVG({species:sp,eq,xp:9999},{stage:st}); w.appendChild(d); } }"""
    for _ in range(2): await pg.evaluate(js,[SP,SLOT,N,ST]); await pg.wait_for_timeout(900)
    await pg.screenshot(path=f'/tmp/hs/pet_{SLOT}_{ST}.png',full_page=True); print(errs); await b.close()
asyncio.run(main())
