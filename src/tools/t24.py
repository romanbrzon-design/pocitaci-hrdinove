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
        r=await pg.evaluate("""()=>{ const out=[];
          // gear plans: tiers per slot [weapon,shield,armor,head,boots,cape,pet,horse]
          const plans={9:[7,5,5,5,3,3,3,0],10:[8,6,5,5,3,3,3,1],11:[8,6,6,6,3,3,3,2],12:[9,6,6,6,4,4,4,2],13:[9,7,7,6,4,4,4,3],14:[9,7,7,7,5,5,5,4]};
          for(const [mi,pl] of Object.entries(plans)){ for(const L of [14,20]){ const p=newProfile({mode:'quest'}); p.xp=(L-1)*20; p.eq={}; SLOTS.forEach((s,i)=>p.eq[s.id]=pl[i]); const a=analyze(p,+mi); out.push(`#${+mi+1} ${MONSTERS[mi].name} L${L}: atk${a.st.atk} def${a.st.def} hp${a.st.hp} hits${a.hits} rounds${a.rounds} spare${a.spare}`);} }
          let tot=0; SLOTS.forEach(s=>s.items.forEach((it,i)=>{ if(i>=({weapon:7,shield:5,armor:5,head:5,boots:3,cape:3,pet:3,horse:0})[s.id]) tot+=price(s.id,i+1); })); out.push('cost of new gear: '+tot);
          out.push('home slots '+HOME_SLOTS.map(s=>s.id+':'+s.items.length).join(' ')); out.push('pet slots '+PET_SLOTS.map(s=>s.id+':'+s.items.length).join(' '));
          out.push('foes '+GUESTS.length+' '+CONTESTS.length+' '+MONSTERS.length);
          return out; }""")
        print('\n'.join(r)); print(errs); await b.close()
asyncio.run(main())
