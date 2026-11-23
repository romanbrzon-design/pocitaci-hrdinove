/* ============ Problem generators ============ */
const frac = (a,b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const NAMES = [['Tonda',0],['Ema',1],['Kuba',0],['Bára',1],['Matěj',0],['Anička',1],['Vojta',0],['Klárka',1]];

const CATS = {
  // ---- 1. třída ----
  add10: {grade:1, label:'Sčítání a odčítání do 10', gen(){
    const a=ri(1,9), b=ri(1,10-a); return R()<.5 ? {q:`${a} + ${b}`, a:a+b} : {q:`${a+b} − ${b}`, a:a};
  }},
  add20nb: {grade:1, label:'Do 20 bez přechodu přes desítku', gen(){
    const u=ri(1,8), v=ri(1,9-u);
    return R()<.5 ? {q:`1${u} + ${v}`, a:10+u+v} : {q:`1${u+v} − ${v}`, a:10+u};
  }},
  missing10: {grade:1, label:'Doplň číslo do 10', gen(){
    const a=ri(1,9), c=ri(a+1,10); return R()<.5 ? {q:`${a} + <u>&nbsp;?&nbsp;</u> = ${c}`, a:c-a} : {q:`<u>&nbsp;?&nbsp;</u> + ${c-a} = ${c}`, a:a};
  }},
  compare20: {grade:1, label:'Porovnávání do 20', gen(){
    const lv=ri(0,20), rv=R()<.2?lv:ri(0,20); const useSum=R()<.4 && lv>=2;
    const l = useSum ? (()=>{const x=ri(1,lv-1); return `${x} + ${lv-x}`;})() : lv;
    return {q:`${l} &nbsp;◯&nbsp; ${rv}`, type:'cmp', a: lv<rv?'<':lv>rv?'>':'='};
  }},
  word1: {grade:1, label:'Slovní úlohy (do 20)', word:true, gen(){
    const [n,f]=pick(NAMES), x=f?'a':'', k=ri(0,1);
    if(k===0){ const a=ri(2,9), b=ri(1,9); return {q:`${n} měl${x} ${a} pastelek a dostal${x} ještě ${b}. Kolik pastelek má teď?`, a:a+b}; }
    const a=ri(8,18), b=ri(1,7); return {q:`Na stromě sedělo ${a} ptáčků. ${b} odletělo. Kolik ptáčků zůstalo na stromě?`, a:a-b};
  }},
  // ---- 2. třída ----
  add20:   {grade:2, label:'Sčítání a odčítání do 20 (s přechodem)', gen(){
    const a=ri(3,9), b=ri(11-a,9), c=a+b;
    return R()<.5 ? {q:`${a} + ${b}`, a:c} : {q:`${c} − ${a}`, a:b};
  }},
  addsub100: {grade:2, label:'Sčítání a odčítání do 100', gen(){
    const k=ri(0,4);
    if(k===0){ const a=ri(12,89), b=ri(2,9); if(a+b<=100) return {q:`${a} + ${b}`, a:a+b}; return {q:`${a} − ${b}`, a:a-b}; }
    if(k===1){ const a=ri(21,95), b=ri(2,9); return {q:`${a} − ${b}`, a:a-b}; }
    if(k===2){ const a=ri(11,69), b=ri(1,3)*10; return R()<.5?{q:`${a} + ${b}`, a:a+b}:{q:`${a+b} − ${b}`, a:a}; }
    if(k===3){ const a=ri(11,59), b=ri(11,99-a); return {q:`${a} + ${b}`, a:a+b}; }
    const a=ri(40,99), b=ri(11,a-10); return {q:`${a} − ${b}`, a:a-b};
  }},
  mul2: {grade:2, label:'Malá násobilka 2, 3, 4, 5, 10 a dělení', gen(){
    const m=pick([2,3,4,5,10,2,3,4,5]), n=ri(1,10);
    return R()<.65 ? (R()<.5?{q:`${m} · ${n}`, a:m*n}:{q:`${n} · ${m}`, a:m*n}) : {q:`${m*n} : ${m}`, a:n};
  }},
  missing: {grade:2, label:'Doplň chybějící číslo', gen(){
    const k=ri(0,2);
    if(k===0){ const a=ri(3,9), b=ri(11-a,9); return {q:`<u>&nbsp;?&nbsp;</u> + ${b} = ${a+b}`, a:a}; }
    if(k===1){ const a=ri(20,80), b=ri(3,19); return {q:`${a} + <u>&nbsp;?&nbsp;</u> = ${a+b}`, a:b}; }
    const a=ri(30,90), b=ri(3,25); return {q:`${a} − <u>&nbsp;?&nbsp;</u> = ${a-b}`, a:b};
  }},
  compare: {grade:2, label:'Porovnávání (<, >, =)', gen(){
    const k=ri(0,2); let l,r,lv,rv;
    if(k===0){ lv=ri(10,99); rv=R()<.15?lv:ri(10,99); l=lv; r=rv; }
    else if(k===1){ const a=ri(3,9), b=ri(3,9); lv=a+b; rv=R()<.3?lv:ri(lv-3,lv+3); l=`${a} + ${b}`; r=rv; }
    else { const a=ri(20,60), b=ri(5,30); lv=a+b; const c=ri(20,60); const d=lv-c; if(d>0&&d<40&&R()<.4){rv=lv; r=`${c} + ${d}`;} else {rv=ri(lv-8,lv+8); r=rv;} l=`${a} + ${b}`; }
    return {q:`${l} &nbsp;◯&nbsp; ${r}`, type:'cmp', a: lv<rv?'<':lv>rv?'>':'='};
  }},
  word2: {grade:2, label:'Slovní úlohy (jednoduché)', word:true, gen(){
    const [n,f]=pick(NAMES), k=ri(0,3), x=f?'a':'';
    if(k===0){ const a=ri(12,40), b=ri(5,20); return {q:`${n} měl${x} ${a} kuliček a dostal${x} dalších ${b}. Kolik kuliček má teď?`, a:a+b}; }
    if(k===1){ const a=ri(25,60), b=ri(6,20); return {q:`V autobuse sedělo ${a} lidí. Na zastávce ${b} vystoupilo. Kolik lidí zůstalo v autobuse?`, a:a-b}; }
    if(k===2){ const m=pick([2,3,4,5]), n2=ri(2,8); return {q:`Na stole je ${n2} talířů a na každém leží ${m} jablka. Kolik jablek je dohromady?`.replace(' jablka',m===5?' jablek':' jablka'), a:m*n2}; }
    const m=pick([2,3,4,5]), n2=ri(2,8); return {q:`${m*n2} bonbónů rozdělíme spravedlivě mezi ${m} děti. Kolik bonbónů dostane každé dítě?`, a:n2};
  }},
  // ---- 4. třída ----
  mulall: {grade:4, label:'Celá násobilka a dělení', gen(){
    const m=ri(3,10), n=ri(2,10);
    return R()<.55 ? {q:`${m} · ${n}`, a:m*n} : {q:`${m*n} : ${n}`, a:m};
  }},
  rem: {grade:4, label:'Dělení se zbytkem', gen(){
    const d=ri(3,9), q=ri(2,9), r=ri(1,d-1);
    return {q:`${d*q+r} : ${d}`, type:'rem', a:[q,r]};
  }},
  big: {grade:4, label:'Sčítání a odčítání do 10 000 (zpaměti)', gen(){
    const k=ri(0,3);
    if(k===0){ const a=ri(12,75)*100, b=ri(3,24)*100; return {q:`${fmt(a)} + ${fmt(b)}`, a:a+b}; }
    if(k===1){ const a=ri(30,99)*100, b=ri(3,29)*100; return {q:`${fmt(a)} − ${fmt(b)}`, a:a-b}; }
    if(k===2){ const a=ri(1000,8999), b=ri(1,9)*(R()<.5?10:100); return R()<.5?{q:`${fmt(a)} + ${fmt(b)}`, a:a+b}:{q:`${fmt(a+b)} − ${fmt(b)}`, a:a}; }
    const a=ri(120,890), b=ri(110,600); return {q:`${a} + ${b}`, a:a+b};
  }},
  mulext: {grade:4, label:'Násobení mimo obor násobilky', gen(){
    const k=ri(0,2);
    if(k===0){ const a=ri(2,9)*10, b=ri(2,9); return {q:`${a} · ${b}`, a:a*b}; }
    if(k===1){ const a=ri(2,9)*100, b=ri(2,9); return {q:`${a} · ${b}`, a:a*b}; }
    const a=ri(12,29), b=ri(2,5); return {q:`${a} · ${b}`, a:a*b};
  }},
  divext: {grade:4, label:'Dělení mimo obor násobilky', gen(){
    const k=ri(0,1);
    if(k===0){ const d=ri(2,9), q=ri(2,9)*10; return {q:`${fmt(d*q)} : ${d}`, a:q}; }
    const d=ri(2,4), q=ri(12,24); return {q:`${d*q} : ${d}`, a:q};
  }},
  order: {grade:4, label:'Pořadí početních výkonů, závorky', gen(){
    const k=ri(0,3), a=ri(2,9), b=ri(2,9), c=ri(2,9);
    if(k===0) return {q:`${a+10} + ${b} · ${c}`, a:a+10+b*c};
    if(k===1) return {q:`(${a} + ${b}) · ${c}`, a:(a+b)*c};
    if(k===2) return {q:`${b*c+a} − ${b} · ${c}`, a:a};
    return {q:`${a*c} : ${c} + ${b}`, a:a+b};
  }},
  fractions: {grade:4, label:'Zlomky – část z celku', gen(){
    const den=pick([2,3,4,5,10]), k=ri(2,9);
    const num = (R()<.3 && den>2) ? ri(2,den-1) : 1;
    return {q:`${frac(num,den)} z ${den*k}`, a:num*k};
  }},
  round: {grade:4, label:'Zaokrouhlování', gen(){
    const n=ri(1012,9988), t=pick([10,100,1000]);
    const nm={10:'desítky',100:'stovky',1000:'tisíce'}[t];
    let r = Math.round(n/t)*t;
    return {q:`Zaokrouhli ${fmt(n)} na ${nm}`, a:r, small:true};
  }},
  word4: {grade:4, label:'Slovní úlohy (dvoukrokové)', word:true, gen(){
    const [n,f]=pick(NAMES), k=ri(0,3);
    if(k===0){ const p=ri(3,9), c=ri(12,25), m=p*c+ri(5,60); return {q:`${n} má ${m} Kč. Koupí ${p} sešitů po ${c} Kč. Kolik korun ${f?'jí':'mu'} zbude?`, a:m-p*c}; }
    if(k===1){ const b=ri(8,15), extra=ri(3,15); return {q:`Ve třídě je ${b} lavic a v každé sedí 2 žáci. Na výlet jede ještě ${extra} žáků z jiné třídy. Kolik žáků jede na výlet?`, a:b*2+extra}; }
    if(k===2){ const box=ri(3,8), per=ri(6,9), eaten=ri(2,box*per-5); return {q:`V ${box} krabicích je po ${per} kouscích čokolády. Děti snědly ${eaten} kousků. Kolik kousků zbylo?`, a:box*per-eaten}; }
    const km=ri(12,45), days=ri(3,7); return {q:`Cyklista ujede každý den ${km} km. Kolik kilometrů ujede za ${days} dní?`, a:km*days};
  }},
};

/* Lehčí varianty (výchozí obtížnost) */
let EASY = true;
const EASY_GEN = {
  addsub100(){ const k=ri(0,2);
    if(k===0){ const a=ri(11,89), b=ri(2,9); const u=a%10; if(u+b<10) return {q:`${a} + ${b}`, a:a+b}; const s=Math.min(b,u||b); return {q:`${a} − ${s}`, a:a-s}; }
    if(k===1){ const a=ri(1,8)*10, b=ri(1,9)*10; return a+b<=100 ? {q:`${a} + ${b}`, a:a+b} : {q:`${Math.max(a,b)} − ${Math.min(a,b)}`, a:Math.max(a,b)-Math.min(a,b)}; }
    const a=ri(11,69), b=ri(1,3)*10; return R()<.5?{q:`${a} + ${b}`, a:a+b}:{q:`${a+b} − ${b}`, a:a}; },
  mul2(){ const m=pick([2,3,4,5,10,2,5,10]), n=ri(1,10); return R()<.75 ? {q:`${m} · ${n}`, a:m*n} : {q:`${m*n} : ${m}`, a:n}; },
  missing(){ const a=ri(2,9), b=ri(2,9); return R()<.5 ? {q:`<u>&nbsp;?&nbsp;</u> + ${b} = ${a+b}`, a:a} : {q:`${a+b} − <u>&nbsp;?&nbsp;</u> = ${a}`, a:b}; },
  compare(){ const lv=ri(10,99), rv=R()<.15?lv:ri(10,99); return {q:`${lv} &nbsp;◯&nbsp; ${rv}`, type:'cmp', a: lv<rv?'<':lv>rv?'>':'='}; },
  word2(){ const [n,f]=pick(NAMES), x=f?'a':'', k=ri(0,2);
    if(k===0){ const a=ri(5,20), b=ri(2,9); return {q:`${n} měl${x} ${a} kuliček a dostal${x} ještě ${b}. Kolik kuliček má teď?`, a:a+b}; }
    if(k===1){ const a=ri(12,30), b=ri(2,9); return {q:`V autobuse sedělo ${a} lidí. ${b} vystoupilo. Kolik lidí zůstalo v autobuse?`, a:a-b}; }
    const m=pick([2,5,10]), n2=ri(2,4); return {q:`${n} má ${n2} krabičky a v každé je ${m} ${m===2?'pastelky':'pastelek'}. Kolik pastelek má dohromady?`, a:m*n2}; },
  mulall(){ const m=ri(2,9), n=ri(2,9); return R()<.7 ? {q:`${m} · ${n}`, a:m*n} : {q:`${m*n} : ${n}`, a:m}; },
  rem(){ const d=ri(2,5), q=ri(2,9), r=ri(1,d-1); return {q:`${d*q+r} : ${d}`, type:'rem', a:[q,r]}; },
  big(){ const a=ri(5,60)*100, b=ri(1,20)*100; return R()<.5 ? {q:`${fmt(a)} + ${fmt(b)}`, a:a+b} : {q:`${fmt(a+b)} − ${fmt(b)}`, a:a}; },
  mulext(){ const a=ri(2,9)*10, b=ri(2,5); return {q:`${a} · ${b}`, a:a*b}; },
  divext(){ const d=ri(2,5), q=ri(2,9)*10; return {q:`${d*q} : ${d}`, a:q}; },
  order(){ const a=ri(1,9), b=ri(2,5), c=ri(2,5); return R()<.5 ? {q:`${a} + ${b} · ${c}`, a:a+b*c} : {q:`(${a} + ${b}) · ${c}`, a:(a+b)*c}; },
  fractions(){ const den=pick([2,3,4,5,10]), k=ri(2,6); return {q:`${frac(1,den)} z ${den*k}`, a:k}; },
  round(){ const n=ri(101,999), t=pick([10,100]); return {q:`Zaokrouhli ${n} na ${t===10?'desítky':'stovky'}`, a:Math.round(n/t)*t, small:true}; },
  word4(){ const [n,f]=pick(NAMES), k=ri(0,2);
    if(k===0){ const p=ri(2,4), c=ri(2,9)*5, m=p*c+ri(1,9)*5; return {q:`${n} má ${m} Kč. Koupí ${p} sešity po ${c} Kč. Kolik korun ${f?'jí':'mu'} zbude?`, a:m-p*c}; }
    if(k===1){ const box=ri(3,6), per=ri(4,8); return {q:`V ${box} krabicích je po ${per} kouscích čokolády. Kolik kousků je dohromady?`, a:box*per}; }
    const km=ri(2,9)*10, days=ri(2,4); return {q:`Cyklista ujede každý den ${km} km. Kolik kilometrů ujede za ${days} dny?`, a:km*days}; },
};
function genOne(c){ const g = (EASY && EASY_GEN[c]) ? EASY_GEN[c] : CATS[c].gen; return g.call(CATS[c]); }
const DEFAULT_CATS = {1:['add10','add20nb','missing10','compare20','word1'],
  2:['add20','addsub100','mul2','missing','compare','word2'],
  3:['addsub100','mulall','missing','compare','divext','word2'],
  4:['mulall','rem','big','mulext','divext','order','fractions','round','word4'],
  5:['mulall','rem','big','mulext','divext','order','fractions','round','word4']};
/* ---- rodičovské volby: pololetí, poměr předmětů, slabá témata ---- */
// pololetí: 'easy' = 1. pololetí, 'normal' = 2. pololetí, jinak automaticky podle data (září–leden = 1. pololetí)
function halfOf(p){ if(p && p.diff==='easy') return 1; if(p && p.diff==='normal') return 2; const m=new Date().getMonth()+1; return (m>=9||m<=1)?1:2; }
function isEasy(p){ return halfOf(p)===1; }
// váha předmětu 1 = méně, 2 = normálně, 3 = více → pořadí, ve kterém se předměty střídají
function subjSeq(p, subs){ const mix=(p&&p.mix)||{}, slots=[];
  subs.forEach(s=>{ const w=Math.max(1,Math.min(3,+mix[s]||2)); for(let i=0;i<w;i++) slots.push([(i+.5)/w, s]); });
  slots.sort((a,b)=>a[0]-b[0] || subs.indexOf(a[1])-subs.indexOf(b[1])); return slots.length?slots.map(x=>x[1]):subs; }
// úspěšnost v tématech: p.cst[cat] = [správně napoprvé, pokusů]
function catTrack(p, cat, ok){ if(!p || !cat || !CATS[cat]) return; p.cst=p.cst||{}; const r=p.cst[cat]||[0,0]; r[1]++; if(ok) r[0]++;
  if(r[1]>=60){ r[0]=Math.round(r[0]/2); r[1]=30; } p.cst[cat]=r; }
function catRate(p, cat){ const r=(p&&p.cst||{})[cat]; return r&&r[1]?r[0]/r[1]:null; }
// slabé téma: aspoň 6 pokusů a méně než 75 % napoprvé → dostává dvojnásobný prostor (lze vypnout)
function weakCats(p, any){ if(!p || (p.weakOff && !any)) return []; return Object.entries(p.cst||{}).filter(([c,r])=>CATS[c] && r[1]>=6 && r[0]/r[1]<.75).map(([c])=>c); }
function catsOf(p){ let c=(p.cats&&p.cats.length)?p.cats.filter(x=>CATS[x]):(DEFAULT_CATS[p.grade]||DEFAULT_CATS[2]); return c.length?c:DEFAULT_CATS[2]; }
function battleProblem(p){
  R=Math.random; let cats=catsOf(p).filter(c=>!CATS[c].word); if(!cats.length) cats=['add20'];
  EASY = isEasy(p); CUR_GRADE = +p.grade||0;
  { const subs=[...new Set(cats.map(subjOf))]; const seq=subjSeq(p,subs); const sj=seq[Math.floor(Math.random()*seq.length)]; const f=cats.filter(c=>subjOf(c)===sj); if(f.length) cats=f.concat(f.filter(c=>weakCats(p).includes(c))); }
  const blocked=new Set(p.seen||[]);
  let pr, c;
  for(let i=0;i<60;i++){ c=pick(cats); pr=genOne(c); if(!blocked.has(qKey(pr))) break; }
  pr.cat=c; pr.type=pr.type||'num'; remember(p,[pr]); return pr;
}

function genDaily(profile, dateKey, count=20, onlySubj){
  EASY = isEasy(profile); CUR_GRADE = +profile.grade||0;
  R = mulberry(hashStr(profile.id + '|' + dateKey + '|' + (profile.cats||[]).join(',') + (EASY?'e':'') + (onlySubj||'') + JSON.stringify(profile.mix||'')));
  let cats = catsOf(profile);
  if(onlySubj){ const f=cats.filter(c=>subjOf(c)===onlySubj); if(f.length) cats=f; }
  // subjects take turns so every chosen subject gets its share; inside a subject categories take turns too
  const bySubj={}; for(const c of cats){ (bySubj[subjOf(c)]=bySubj[subjOf(c)]||[]).push(c); }
  const subjOrder=subjSeq(profile, ['m','en','pr','cj'].filter(x=>bySubj[x])), weak=weakCats(profile);
  const decks={};
  const out=[], seen=new Set(), blocked=new Set(profile.seen||[]); let guard=0, wordCount=0, turn=0;
  while(out.length<count && guard++<900){
    const sj=subjOrder[turn%subjOrder.length];
    if(!decks[sj]||!decks[sj].length){ decks[sj]=bySubj[sj].concat(bySubj[sj].filter(c=>weak.includes(c))); for(let i=decks[sj].length-1;i>0;i--){const j=Math.floor(R()*(i+1)); [decks[sj][i],decks[sj][j]]=[decks[sj][j],decks[sj][i]];} }
    const c=decks[sj].pop(), cat=CATS[c];
    if(cat.word && wordCount>=3) continue;
    const p=genOne(c); p.cat=c; p.type=p.type||'num'; if(cat.word) p.word=true;
    if(seen.has(p.key||p.q)) continue;
    if(blocked.has(qKey(p)) && guard<600) continue;
    seen.add(p.key||p.q);
    if(cat.word) wordCount++;
    out.push(p); turn++;
  }
  R = Math.random;
  remember(profile, out);
  return out;
}

