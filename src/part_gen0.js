
/* ============ Předškoláci: obrázkové otázky s výběrem ============ */
const gl = g => +g===0 ? 'Předškolák' : g+'. třída';
const gs = g => +g===0 ? 'předšk.' : g+'. tř.';
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(R()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function pickN(arr,n){ return shuffle(arr.slice()).slice(0,n); }
const em = (e, size=46) => `<span class="emo" style="font-size:${size}px">${e}</span>`;
const blob = c => `<svg viewBox="0 0 60 60" width="60" height="60"><path d="M30 4 C44 4 56 12 56 28 C56 46 44 56 30 56 C14 56 4 46 5 30 C6 14 16 4 30 4Z" fill="${c}" stroke="#2b2340" stroke-width="2.5"/></svg>`;
const SHAPES = {
  'kruh':        c=>`<circle cx="30" cy="30" r="24" fill="${c}"/>`,
  'čtverec':     c=>`<rect x="7" y="7" width="46" height="46" fill="${c}"/>`,
  'trojúhelník': c=>`<path d="M30 5 L56 53 H4Z" fill="${c}"/>`,
  'obdélník':    c=>`<rect x="2" y="15" width="56" height="30" fill="${c}"/>`,
  'hvězda':      c=>`<path d="M30 3 l7.6 16.4 17.9 2.1 -13.2 12.3 3.5 17.7 -15.8 -8.9 -15.8 8.9 3.5 -17.7 -13.2 -12.3 17.9 -2.1z" fill="${c}"/>`,
  'srdíčko':     c=>`<path d="M30 54 C6 38 2 24 10 14 C18 5 28 9 30 17 C32 9 42 5 50 14 C58 24 54 38 30 54Z" fill="${c}"/>`,
};
const SHAPE_ACC = {'kruh':'KRUH','čtverec':'ČTVEREC','trojúhelník':'TROJÚHELNÍK','obdélník':'OBDÉLNÍK','hvězda':'HVĚZDU','srdíčko':'SRDÍČKO'};
const shapeSvg = (name, c) => `<svg viewBox="0 0 60 60" width="62" height="62"><g stroke="#2b2340" stroke-width="2.5" stroke-linejoin="round">${SHAPES[name](c)}</g></svg>`;
const COLORS0 = [['červená','#e8323c'],['modrá','#2f6fe0'],['zelená','#2fae4f'],['žlutá','#f7d02c'],['oranžová','#ff8c1a'],['fialová','#9b4dd6'],['růžová','#ff8fc8'],['hnědá','#8a5a2b'],['černá','#2b2b2b'],['bílá','#ffffff']];
const COLOR_THINGS = [['🍓','jahoda','červená'],['🍌','banán','žlutá'],['🐸','žabka','zelená'],['🍊','pomeranč','oranžová'],['🍇','hrozny','fialová'],['☁️','mráček','bílá'],['🌻','slunečnice','žlutá'],['🍒','třešně','červená'],['🥒','okurka','zelená'],['🐷','prasátko','růžová'],['🐻','medvídek','hnědá'],['💙','srdíčko','modrá']];
const COUNT_THINGS = [['🍎','jablíček'],['⭐','hvězdiček'],['🐟','rybiček'],['🌸','kytiček'],['🚗','autíček'],['🎈','balónků'],['🦋','motýlků'],['🐥','kuřátek'],['🍄','hříbků'],['⚽','míčů']];
const ANIMALS0 = [['🐱','kočička'],['🐶','pejsek'],['🐰','zajíček'],['🐻','medvídek'],['🐷','prasátko'],['🐮','kravička'],['🦁','lvíček'],['🐵','opička'],['🐸','žabka'],['🐥','kuřátko'],['🐟','rybička'],['🐘','slon'],['🐴','koník'],['🦊','liška'],['🐭','myška'],['🐀','potkan']];
const GROUPS0 = {ovoce:['🍎','🍌','🍐','🍇','🍓','🍒','🍊'], zvířátka:['🐶','🐱','🐰','🐻','🐷','🐮','🐵'], doprava:['🚗','🚌','🚲','🚂','✈️','🚜','🚀'], oblečení:['👕','👖','🧦','🧢','👗','🧤','👟'], hračky:['🧸','⚽','🪀','🎈','🪁','🎲']};
function choice(q, say, options, a, pic, key){ return {type:'choice', q, say, options, a, pic, key: key || (q+'|'+options.join('|')+'|'+(pic||''))}; }

Object.assign(CATS, {
  colors0: {grade:0, label:'Poznávání barev', gen(){
    if(R()<.55){ const pool=EASY?COLORS0.slice(0,6):COLORS0; const opts=pickN(pool, EASY?3:4); const t=opts[ri(0,opts.length-1)];
      return choice(`Kde je <b>${t[0].toUpperCase()}</b> barva?`, `Kde je ${t[0]} barva?`, opts.map(o=>blob(o[1])), opts.indexOf(t)); }
    const th=pick(COLOR_THINGS); const right=COLORS0.find(c=>c[0]===th[2]);
    const others=pickN(COLORS0.filter(c=>c[0]!==th[2]), EASY?2:3); const opts=shuffle([right,...others]);
    return choice(`Jakou barvu má ${th[1]}?`, `Jakou barvu má ${th[1]}?`, opts.map(o=>blob(o[1])), opts.indexOf(right), em(th[0],70));
  }},
  shapes0: {grade:0, label:'Poznávání tvarů', gen(){
    const names=Object.keys(SHAPES); const opts=pickN(EASY?names.slice(0,4).concat(['srdíčko','hvězda']):names, EASY?3:4); const t=opts[ri(0,opts.length-1)];
    const col=pick(['#ffd84d','#5aa9e6','#ff8fb3','#7cc24f','#ffb02e']);
    return choice(`Najdi <b>${SHAPE_ACC[t]}</b>`, `Najdi ${SHAPE_ACC[t].toLowerCase()}.`, opts.map(n=>shapeSvg(n, R()<.5?col:pick(['#ffd84d','#5aa9e6','#ff8fb3','#7cc24f','#c9a0e8']))), opts.indexOf(t));
  }},
  count0: {grade:0, label:'Počítání obrázků (do 5 / do 10)', gen(){
    const th=pick(COUNT_THINGS), n=ri(1,EASY?5:10);
    const set=new Set([n]); while(set.size<3){ const d=n+pick([-2,-1,1,2]); if(d>=1&&d<=10) set.add(d); }
    const opts=shuffle([...set]);
    return choice(`Kolik je tu ${th[1]}?`, `Kolik je tu ${th[1]}?`, opts.map(x=>`<span class="num0">${x}</span>`), opts.indexOf(n), `<div class="many">${Array(n).fill(em(th[0],40)).join('')}</div>`, 'cnt|'+th[0]+n+'|'+opts.join(','));
  }},
  more0: {grade:0, label:'Kde je víc / míň', gen(){
    const th=pick(COUNT_THINGS); let a=ri(1,EASY?5:8), b=ri(1,EASY?5:8); while(a===b) b=ri(1,EASY?5:8);
    const more=R()<.6, want = more ? (a>b?0:1) : (a<b?0:1);
    const g=x=>`<div class="many sm">${Array(x).fill(em(th[0],28)).join('')}</div>`;
    return choice(`Kde je <b>${more?'VÍC':'MÍŇ'}</b> ${th[1]}?`, `Kde je ${more?'víc':'míň'} ${th[1]}?`, [g(a),g(b)], want, '', 'more|'+th[0]+a+'|'+b+more);
  }},
  odd0: {grade:0, label:'Co sem nepatří', gen(){
    const keys=Object.keys(GROUPS0); const k=pick(keys); let k2=pick(keys); while(k2===k) k2=pick(keys);
    const same=pickN(GROUPS0[k], EASY?2:3), odd=pick(GROUPS0[k2]); const opts=shuffle([...same, odd]);
    return choice('Co sem <b>nepatří</b>?', 'Co sem nepatří?', opts.map(e=>em(e)), opts.indexOf(odd));
  }},
  size0: {grade:0, label:'Největší a nejmenší', gen(){
    const e=pick(['🐘','🍎','⭐','🐟','🏠','🌳','🎈','🐻']); const sizes=shuffle(EASY?[26,44,66]:[22,36,50,66]); const big=R()<.5;
    const target = big ? Math.max(...sizes) : Math.min(...sizes);
    return choice(`Který je <b>${big?'NEJVĚTŠÍ':'NEJMENŠÍ'}</b>?`, `Který je ${big?'největší':'nejmenší'}?`, sizes.map(s=>em(e,s)), sizes.indexOf(target));
  }},
  pattern0: {grade:0, label:'Co bude dál (řady)', gen(){
    const pool=pick([['🔴','🔵','🟢','🟡'],['🍎','🍌','🍐'],['⭐','🌙','☀️'],['🐶','🐱','🐰'],['🟥','🟦','🟨']]);
    const len=EASY?2:pick([2,3]); const unit=pickN(pool,len); const seq=[]; for(let i=0;i<(len===2?5:6);i++) seq.push(unit[i%len]);
    const ans=unit[seq.length%len]; const opts=shuffle([...new Set([ans,...pickN(pool,3)])].slice(0,3)); if(!opts.includes(ans)) opts[0]=ans;
    return choice('Co bude dál?', 'Co bude dál?', opts.map(e=>em(e)), opts.indexOf(ans), `<div class="many">${seq.map(e=>em(e,38)).join('')}${em('❓',38)}</div>`);
  }},
  animals0: {grade:0, label:'Najdi zvířátko', gen(){
    const opts=pickN(ANIMALS0, EASY?3:4); const t=opts[ri(0,opts.length-1)];
    return choice(`Kde je <b>${t[1]}</b>?`, `Kde je ${t[1]}?`, opts.map(o=>em(o[0],52)), opts.indexOf(t));
  }},
});
DEFAULT_CATS[0] = ['colors0','shapes0','count0','more0','odd0','size0','pattern0','animals0'];

/* ---- Předčítání otázek (pro děti, které ještě nečtou) ---- */
let csVoice=null, enVoice=null;
function voiceScore(v){ const n=v.name||''; return (/natural/i.test(n)?100:0)+(/online/i.test(n)?50:0)+(/google/i.test(n)?30:0)+(/vlasta|sonia|libby|maisie/i.test(n)?5:0)+(v.localService?0:2); }
function bestVoice(vs, re){ const c=vs.filter(v=>re.test(v.lang)); c.sort((a,b)=>voiceScore(b)-voiceScore(a)); return c[0]||null; }
function pickVoice(){ try{ const vs=speechSynthesis.getVoices(); csVoice = bestVoice(vs,/^cs/i); enVoice = bestVoice(vs,/^en-GB/i) || bestVoice(vs,/^en/i); }catch(e){} }
function voiceNatural(){ return !!(csVoice && voiceScore(csVoice)>=50); }
try{ speechSynthesis.onvoiceschanged=pickVoice; pickVoice(); }catch(e){}
function speak(text, lang){
  try{ if(!('speechSynthesis' in window) || !text) return; speechSynthesis.cancel();
    const en=/^en/i.test(lang||'');
    const u=new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g,'')); u.lang=en?'en-GB':'cs-CZ'; const v=en?enVoice:csVoice; if(v) u.voice=v; u.rate=en?.9:(voiceNatural()?1:.95); speechSynthesis.speak(u); }catch(e){}
}
function sayText(pr){ if(pr.type==='choice') return pr.say || String(pr.q).replace(/<[^>]+>/g,' ');
  if(pr.type==='cmp'){ const n=String(pr.q).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').split('◯').map(s=>s.trim()); return `Porovnej. ${n[0]} a ${n[1]}. Je to větší, menší, nebo rovno? Vyber znaménko.`; } return pr.say || String(pr.q).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/·/g,' krát ').replace(/:/g,' děleno ').replace(/−/g,' mínus ').replace(/\?/g,' kolik? '); }
