import asyncio, json
from playwright.async_api import async_playwright
from PIL import Image
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        for vp,tag in [({'width':390,'height':844},'m'),({'width':1100,'height':860},'d')]:
            pg=await b.new_page(viewport=vp); pg.on('pageerror',lambda e: errs.append(str(e)))
            await pg.add_init_script("localStorage.setItem('ph-intro','1')")
            await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
            await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
            await pg.goto('file:///home/claude/pocitani/site/index.html'); await pg.wait_for_timeout(300)
            cases=[]
            for t in range(0,8):
                cases.append(('home',t,None,None)); cases.append(('quest',t,None,None))
            for sp in ['cat','dog','bunny','pony','rat','hamster','fox','panda','owl','dragon']:
                for t in [0,3,5]: cases.append(('pet',t,sp,None))
            shots={}
            for mode,t,sp,_ in cases:
                for g in (['m','f'] if mode!='pet' else ['m']):
                    js=f"""()=>{{ S.profiles=[]; const p=newProfile({{id:'x',name:'Test',grade:2,gender:'{g}',mode:'{mode}',species:'{sp or 'cat'}',petName:'Míša'}});
                      const sl=slotsOf(p); p.owned={{}}; for(const s of sl) p.owned[s.id]=Math.min({t}, s.items.length); p.eq={{...p.owned}}; p.beaten=Math.min({t}+2,9); p.xp={t}*60; S.profiles.push(p);
                      go({{name:'hero',pid:'x'}}); }}"""
                    await pg.evaluate(js); await pg.wait_for_timeout(120)
                    el=await pg.query_selector('.stage'); 
                    if el: await el.screenshot(path=f'/tmp/a3_{tag}_{mode}{t}{sp or ""}{g}_hero.png')
                    await pg.evaluate("()=>{ go({name:'map',pid:'x'}); startBattle(Math.min(prof('x').beaten,9)); }"); await pg.wait_for_timeout(150)
                    el=await pg.query_selector('.arena')
                    if el: await el.screenshot(path=f'/tmp/a3_{tag}_{mode}{t}{sp or ""}{g}_bat.png')
                    shots.setdefault(mode,[]).append(f'{mode}{t}{sp or ""}{g}')
            for mode,names in shots.items():
                for kind in ['hero','bat']:
                    ims=[]
                    for n in names:
                        try: ims.append(Image.open(f'/tmp/a3_{tag}_{n}_{kind}.png'))
                        except: pass
                    if not ims: continue
                    w=max(i.size[0] for i in ims); h=max(i.size[1] for i in ims); cols=4 if tag=='d' else 6
                    W=Image.new('RGB',(cols*w,((len(ims)+cols-1)//cols)*h),'white')
                    for k,im in enumerate(ims): W.paste(im,((k%cols)*w,(k//cols)*h))
                    W.thumbnail((2000,2000)); W.save(f'/home/claude/a3_{tag}_{mode}_{kind}.png'); print(tag,mode,kind,len(ims),W.size)
            await pg.close()
        print('errors',errs[:5]); await b.close()
asyncio.run(main())
