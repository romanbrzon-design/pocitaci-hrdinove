# Podrobná kontrola otázek: správnost výsledků, nabídky, text
import asyncio, json, sys
from playwright.async_api import async_playwright
JS = r"""
() => {
 const out={errors:[], bigr:{}, texts:{}, counts:{}};
 const strip=s=>String(s).replace(/<span class="frac"><span>(\d+)<\/span><span>(\d+)<\/span><\/span>/g,'$1/$2').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
 const ev=e=>{ e=e.replace(/·/g,'*').replace(/:/g,'/').replace(/−/g,'-').replace(/(\d) (\d{3})/g,'$1$2'); if(!/^[\d\s+\-*/()]+$/.test(e)) return null; return Function('return ('+e+')')(); };
 const err=(c,g,ez,pr,msg)=>{ if(out.errors.length<300) out.errors.push(`${c} g${g}${ez?'E':'N'}: ${msg} | ${strip(pr.q)} => ${JSON.stringify(pr.a)}`); };
 for(const c of Object.keys(CATS)) for(let g=0; g<=5; g++) for(const ez of [true,false]){
   EASY=ez; CUR_GRADE=g; R=Math.random;
   for(let k=0;k<1200;k++){
     let pr; try{ pr=genOne(c); }catch(e){ err(c,g,ez,{q:'EXC'},String(e)); break; }
     const q=strip(pr.q); const all=q+' '+(pr.say||'');
     out.counts[c]=(out.counts[c]||0)+1;
     if(/undefined|NaN|null|\$\{/.test(all)) err(c,g,ez,pr,'bad token');
     if(/  /.test(q)) err(c,g,ez,pr,'double space');
     const t=pr.type||'num';
     if(t==='choice'){
       if(!Array.isArray(pr.options)||pr.options.length<2) err(c,g,ez,pr,'few options');
       if(!(pr.a>=0 && pr.a<pr.options.length)) err(c,g,ez,pr,'answer idx out of range');
       if(new Set(pr.options).size!==pr.options.length) err(c,g,ez,pr,'duplicate options '+pr.options.map(strip).join('|'));
       const key=c+'|'+q+' || '+pr.options.map(strip).join(' / ')+' => '+strip(pr.options[pr.a]);
       if(/^(pr_|cj_|en_)/.test(c) || ['pr_quiz','cj_abc','cj_opp','cj_iy','cj_vyj','cj_end','cj_pos','cj_gen','en_read','en_phrase','en_write','odd0','colors0','animals0','shapes0'].includes(c)){
         const k2=c+'|'+q+' => '+(strip(pr.options[pr.a])||pr.say||'');
         out.texts[k2]=1; }
       continue;
     }
     if(t==='cmp'){ const [l,r]=q.split('◯').map(s=>ev(s.trim())); const exp=l<r?'<':l>r?'>':'='; if(exp!==pr.a) err(c,g,ez,pr,'cmp wrong'); continue; }
     if(t==='rem'){ const [x,d]=q.split(':').map(s=>+s.trim()); if(Math.floor(x/d)!==pr.a[0]||x%d!==pr.a[1]||pr.a[1]===0) err(c,g,ez,pr,'rem wrong'); continue; }
     const a=pr.a;
     if(typeof a!=='number'||!isFinite(a)||a<0||Math.round(a)!==a) err(c,g,ez,pr,'answer not natural');
     let exp=null;
     let m;
     if(!/desít|jednot/.test(q) && (m=q.match(/^(.*)=(.*)$/)) && q.includes('?') &&  !q.startsWith('🪙') && !/m|g|h|Kč/.test(q.replace(/min/,'m'))){ const L=m[1].replace('?',a), Rr=m[2].replace('?',a); const lv=ev(L), rv=ev(Rr); if(lv===null||rv===null) err(c,g,ez,pr,'unparsed eq'); else if(lv!==rv) err(c,g,ez,pr,'eq wrong'); continue; }
     if((m=q.match(/^🪙 (.*) = \? Kč$/))) exp=ev(m[1].replace(/ Kč/g,''));
     else if((m=q.match(/^(\d+)\/(\d+) z (\d+)$/))) exp=(+m[1])*(+m[3])/(+m[2]);
     else if((m=q.match(/^Zaokrouhli ([\d ]+) na (\S+)$/))){ const n=+m[1].replace(/ /g,''); const t={desítky:10,stovky:100,tisíce:1000}[m[2]]; exp=Math.floor(n/t+0.5)*t; }
     else if((m=q.match(/^Pokračuj v řadě: (.*), \?$/))){ const s=m[1].split(', ').map(x=>+x.replace(/ /g,'')); const d=s[1]-s[0]; if(s.some((x,i)=>i&&x-s[i-1]!==d)) err(c,g,ez,pr,'seq not arithmetic'); exp=s[s.length-1]+d; if(exp<0) err(c,g,ez,pr,'seq negative'); }
     else if((m=q.match(/^Které číslo je hned (za|před) (\d+)\?$/))) exp=m[1]==='za'?+m[2]+1:m[2]-1;
     else if((m=q.match(/^Jaká číslice je v čísle (\d+) na místě (stovek|desítek|jednotek)\?$/))) exp=Math.floor(m[1]/({stovek:100,desítek:10,jednotek:1}[m[2]]))%10;
     else if((m=q.match(/^Obvod čtverce se stranou (\d+) cm je \? cm$/))) exp=4*m[1];
     else if((m=q.match(/^Obvod obdélníku se stranami (\d+) cm a (\d+) cm je \? cm$/))) exp=2*((+m[1])+(+m[2]));
     else if((m=q.match(/^Dvakrát (\d+)$/))||(m=q.match(/^Dvojnásobek čísla (\d+)$/))) exp=2*m[1];
     else if((m=q.match(/^Polovina z (\d+)$/))) exp=m[1]/2;
     else if((m=q.match(/^O kolik je (\d+) (víc|méně) než (\d+)\?$/))) exp=Math.abs(m[1]-m[3]);
     else if((m=q.match(/^Kolik desítek má číslo (\d+)\?$/))) exp=Math.floor(m[1]/10);
     else if((m=q.match(/^(\d+) \S+ a (\d+) \S+ = \?$/))) exp=m[1]*10+(+m[2]);
     else if((m=q.match(/^Platíš ([\d ]+) Kč, nákup stojí ([\d ]+) Kč/))){ exp=m[1].replace(/ /g,'')-m[2].replace(/ /g,''); if(exp<=0) err(c,g,ez,pr,'nonpositive change'); }
     else if((m=q.match(/^(\d+) \S+ po (\d+) Kč stojí/))) exp=m[1]*m[2];
     else if((m=q.match(/^(\d+) (m|cm|kg|h|km) = \? (cm|m|mm|g|min)$/))){ const f={'m>cm':100,'cm>m':0.01,'cm>mm':10,'kg>g':1000,'h>min':60,'km>m':1000}[m[2]+'>'+m[3]]; exp=m[1]*f; }
     else if((m=q.match(/^(\d+) h (\d+) min = \? min$/))) exp=m[1]*60+(+m[2]);
     else if(CATS[c].word){ // word problems: record numeric bigrams
     }
     else { const v=ev(q); if(v===null) err(c,g,ez,pr,'unparsed'); else exp=v; }
     if(exp!==null && Math.abs(exp-a)>1e-9) err(c,g,ez,pr,'WRONG expected '+exp);
     if(CATS[c].word || /[a-zá-ž]{3}/i.test(q)){
       for(const mm of q.matchAll(/(?:^|\s)(\d+) ([A-Za-zÁ-ža-ž]+)/g)){ const n=+mm[1]; const cl=n===1?'1':(n<=4?'2-4':'5+'); out.bigr[cl+' '+mm[2]]=(out.bigr[cl+' '+mm[2]]||0)+1; }
       for(const mm of q.matchAll(/([A-Za-zÁ-ža-ž]+) (\d+)(?=[\s.?,])/g)){ const n=+mm[2]; const cl=n===1?'1':(n<=4?'2-4':'5+'); out.bigr[mm[1]+' '+cl]=(out.bigr[mm[1]+' '+cl]||0)+1; }
     }
   }
 }
 // daily sets: duplicates
 for(let g=0;g<=5;g++) for(const ez of ['normal','easy']){ const p=newProfile({id:'zz'+g,name:'X',grade:g,cats:defaultCats(g,['m','en','pr','cj'])}); p.diff=ez; for(let d=0;d<30;d++){ const set=genDaily(p,'2026-12-'+(d+1),10); const ks=set.map(x=>x.key||x.q); if(new Set(ks).size!==ks.length) out.errors.push('daily dup g'+g); if(set.length<10) out.errors.push('daily short g'+g+' '+set.length); } }
 return out;
}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(); errs=[]
        pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('ph-intro','1')")
        await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
        await pg.route('**/sw.js', lambda r: r.fulfill(status=404, body=''))
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(500)
        r=await pg.evaluate(JS)
        json.dump(r,open('/tmp/qaudit.json','w'),ensure_ascii=False,indent=0)
        print('page errors',errs[:3]); print('cats',len(r['counts']),'samples',sum(r['counts'].values()))
        print('ERRORS',len(r['errors']))
        for e in r['errors'][:60]: print(' ',e)
        await b.close()
asyncio.run(main())
