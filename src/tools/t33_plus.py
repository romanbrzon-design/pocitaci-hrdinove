import json
from playwright.sync_api import sync_playwright
SETUP="""()=>{ document.querySelectorAll('.modal').forEach(m=>m.remove()); S.profiles=[];
 const a=newProfile({id:'a',name:'Kuba',grade:3,mode:'quest',cats:defaultCats(3,['m','en','pr','cj'])}); a.xp=300; a.points=5000; a.beaten=12;
 a.fx={gearV:2}; a.owned={weapon:5,shield:5}; a.eq={weapon:5,shield:5}; S.profiles.push(a); }"""
def run(pg, plus, label):
    pg.goto('http://localhost:8765/index.html'); pg.wait_for_timeout(700)
    pg.evaluate("(v)=>{ if(v) localStorage.setItem('ph-plus', JSON.stringify(v)); else localStorage.removeItem('ph-plus'); }", plus)
    pg.reload(); pg.wait_for_timeout(900)
    pg.evaluate(SETUP)
    r={}
    r['subj']=pg.evaluate("()=>[...new Set(catsOf(prof('a')).map(subjOf))].join(',')")
    r['level']=pg.evaluate("()=>level(prof('a'))")
    r['daily_subj']=pg.evaluate("()=>[...new Set(genDaily(prof('a'),'2026-12-01',20).map(x=>subjOf(x.cat)))].join(',')")
    pg.evaluate("()=>go({name:'hero',pid:'a'})"); pg.wait_for_timeout(300)
    r['hero_plusbtns']=pg.evaluate("()=>document.querySelectorAll('.plusbtn').length")
    r['lvl_msg']=pg.evaluate("()=>/nejvyšší zdarma/.test(document.body.innerText)")
    r['buy_weapon_locked']=pg.evaluate("()=>!document.querySelector('[data-buy=\"weapon\"]')")
    pg.evaluate("()=>buy('weapon')"); pg.wait_for_timeout(200)
    r['buy_paywall']=pg.evaluate("()=>!!document.querySelector('.modal.plusm')"); pg.evaluate("()=>document.querySelectorAll('.modal').forEach(m=>m.remove())")
    pg.evaluate("()=>{view.pid='a'; startBattle(11);}"); pg.wait_for_timeout(200)
    r['foe12_paywall']=pg.evaluate("()=>!!document.querySelector('.modal.plusm')"); r['in_battle']=pg.evaluate("()=>view.name")
    pg.evaluate("()=>document.querySelectorAll('.modal').forEach(m=>m.remove())")
    pg.evaluate("()=>go({name:'map',pid:'a'})"); pg.wait_for_timeout(300)
    r['map_pluslock']=pg.evaluate("()=>document.querySelectorAll('.mcard.pluslock').length")
    pg.evaluate("()=>go({name:'hero',pid:'a'})"); pg.evaluate("()=>{ const p=prof('a'); p.today=p.today||ensureToday(p); p.today.done=true; p.today.date=todayKey(); act('mini'); }"); pg.wait_for_timeout(200)
    r['mini']=pg.evaluate("()=>document.querySelector('.modal.plusm')?'paywall':view.name")
    pg.evaluate("()=>document.querySelectorAll('.modal').forEach(m=>m.remove())")
    pg.evaluate("()=>{ parentOk=true; parentTab='plus'; go({name:'parent'}); }"); pg.wait_for_timeout(300)
    r['parent_tab']=pg.evaluate("()=>{ const c=[...document.querySelectorAll('#app .card')].pop(); return c? c.innerText.slice(0,70).replace(/\\n/g,' '):''}")
    r['tabs_on']=pg.evaluate("()=>[...document.querySelectorAll('.tabs button.on')].map(b=>b.textContent).join('|')")
    print(label, json.dumps(r, ensure_ascii=False))
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':420,'height':900})
    errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/config.js', lambda r: r.fulfill(body="window.BACKEND_URL='';", content_type='application/javascript'))
    run(pg, None, 'OFF   ')
    run(pg, {'on':True,'active':False}, 'LOCKED')
    run(pg, {'on':True,'active':True}, 'ACTIVE')
    print('errors', errs); b.close()
