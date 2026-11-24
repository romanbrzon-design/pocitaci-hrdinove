
/* ============ Zábava navíc: kolo štěstí, nálepky, výzvy, časovka, souboj, rodinný cíl, opakování chyb, zpráva, průvodce ============
   Vše se ukládá jen do nového pole p.fx (a S.settings.family) – stávající data hrdinů se nemění. */
function fx(p){ if(!p.fx) p.fx={}; const f=p.fx; f.stk=f.stk||{}; f.setDone=f.setDone||{}; f.rev=f.rev||[]; f.days=f.days||{}; f.chal=f.chal||{}; return f; }
function fxDay(p,k=todayKey()){ const d=fx(p).days; d[k]=d[k]||{}; const ks=Object.keys(d).sort(); while(ks.length>70) delete d[ks.shift()]; return d[k]; }
function addDays(k,n){ const d=new Date(k+'T12:00:00'); d.setDate(d.getDate()+n); return todayKey(d); }
function weekStart(k=todayKey()){ const d=new Date(k+'T12:00:00'); d.setDate(d.getDate()-((d.getDay()+6)%7)); return todayKey(d); }
function inWeek(k, ws){ return k>=ws && k<=addDays(ws,6); }
function realHeroes(){ return heroes().filter(p=>!isTest(p)); }

/* ---- statistiky (počítané z historie + p.fx.days) ---- */
function statsRange(p, from, to){
  const o={c:0,n:0,days:0,perfect:0,extra:0,tbest:0,subj:{},duelsWon:0};
  for(const [k,h] of Object.entries(p.history||{})) if(k>=from && k<=to){ o.c+=h.c||0; o.n+=h.n||0; o.days++; o.extra+=h.extra||0; }
  for(const [k,d] of Object.entries(fx(p).days)) if(k>=from && k<=to){
    o.c+=d.tc||0; o.n+=d.tn||0; o.perfect+=d.perf?1:0; o.tbest=Math.max(o.tbest,d.tb||0); o.duelsWon+=d.dw||0;
    for(const [s,v] of Object.entries(d.subj||{})){ o.subj[s]=o.subj[s]||[0,0]; o.subj[s][0]+=v[0]; o.subj[s][1]+=v[1]; } }
  return o;
}
function weekStats(p, ws=weekStart()){ return statsRange(p, ws, addDays(ws,6)); }
function subjCounts(t){ const o={}; t.problems.forEach((pr,i)=>{ const r=t.res[i]; if(r===undefined) return; const s=subjOf(pr.cat); o[s]=o[s]||[0,0]; o[s][1]++; if(r>0) o[s][0]++; }); return o; }
function addSubj(d, o){ d.subj=d.subj||{}; for(const [s,v] of Object.entries(o)){ d.subj[s]=d.subj[s]||[0,0]; d.subj[s][0]+=v[0]; d.subj[s][1]+=v[1]; } }

/* ---- 2) nálepky ---- */
var STICKER_SETS = [
  {id:'zv', name:'Zvířátka', e:['🐶','🐱','🐰','🦊','🐼','🐨','🐯','🦁','🐸','🐵','🦄','🐉']},
  {id:'jd', name:'Mňamky',   e:['🍎','🍌','🍓','🍉','🍕','🍔','🍟','🍩','🍪','🧁','🍰','🍭']},
  {id:'vs', name:'Vesmír',   e:['🌍','🌙','⭐','☀️','🪐','☄️','🌈','⚡','❄️','🔥','🚀','🛸']},
  {id:'sp', name:'Sport',    e:['⚽','🏀','🏈','⚾','🎾','🏐','🏓','🛹','🚲','⛸️','🏆','🥇']},
  {id:'kz', name:'Kouzla',   e:['🎩','🔮','🪄','✨','💎','👑','🗝️','🧪','📜','🎁','🧚','🧞']},
];
var ALL_STICKERS = STICKER_SETS.flatMap(s=>s.e.map((e,i)=>({id:s.id+i, e, set:s.id, rare:i>=10})));
function stickerCount(p){ return Object.keys(fx(p).stk).length; }
function dropSticker(p, quiet){
  const rare=Math.random()<0.15; const pool=ALL_STICKERS.filter(s=>s.rare===rare);
  const s=pool[Math.floor(Math.random()*pool.length)], f=fx(p);
  const dup=!!f.stk[s.id]; f.stk[s.id]=(f.stk[s.id]||0)+1;
  let extra='';
  if(dup){ p.points+=5; extra=' (už ji máš – +5 ⭐)'; }
  const set=STICKER_SETS.find(x=>x.id===s.set);
  if(!f.setDone[set.id] && set.e.every((_,i)=>f.stk[set.id+i])){ f.setDone[set.id]=1; p.points+=100; p.chests=p.chests||[]; p.chests.push('gold'); extra+=` · Celá sada „${set.name}“! +100 ⭐ a zlatá truhla`; confetti(60); }
  if(!quiet) stickerPop(s, extra);
  return {s, extra};
}
function stickerPop(s, extra){
  const d=document.createElement('div'); d.className='stkpop'+(s.rare?' rare':''); d.innerHTML=`<div class="e">${s.e}</div><div>${s.rare?'✨ Vzácná nálepka! ✨':'Nová nálepka!'}${extra||''}</div>`;
  document.body.appendChild(d); setTimeout(()=>d.classList.add('out'),2300); setTimeout(()=>d.remove(),2900);
  if(readOn()) speak((s.rare?'Vzácná nálepka!':'Nová nálepka!'));
}
function albumView(){
  const p=prof(view.pid); const f=fx(p);
  const sets=STICKER_SETS.map(set=>{ const have=set.e.filter((_,i)=>f.stk[set.id+i]).length;
    return `<div class="card albset"><h3 style="margin:0 0 8px">${set.name} <span class="muted" style="font-size:15px">${have}/12 ${f.setDone[set.id]?'✅ hotovo':''}</span></h3>
      <div class="stkgrid">${set.e.map((e,i)=>{ const n=f.stk[set.id+i]; return `<div class="stk ${n?'got':''} ${i>=10?'rare':''}">${n?e:'?'}${n>1?`<small>×${n}</small>`:''}</div>`; }).join('')}</div></div>`; }).join('');
  return `<div class="top"><button class="btn sec small" data-act="hero">← ${esc(p.name)}</button><h1>📒 Album nálepek</h1><span class="pill">${stickerCount(p)}/60</span></div>
    <p class="muted">Nálepky padají za správné odpovědi, za splněný den a za týdenní výzvy. Zlaté rámečky jsou vzácné. Za celou sadu dostaneš ⭐ 100 a zlatou truhlu!</p>
    <div class="albgrid">${sets}</div>`;
}

/* ---- 7) chytré opakování chyb ---- */
var REV_KEYS=['q','type','a','options','say','lang','pic','key','cat','word','small','noAuto','sayOnly'];
function revId(pr){ return pr.key||String(pr.q); }
function reviewTrack(p, pr, ok, firstTry){
  if(!pr || isTest(p)&&false) return;
  const f=fx(p), id=revId(pr), k=todayKey(); let it=f.rev.find(r=>r.id===id);
  if(!ok){ // chyba – zařadit / vrátit na začátek
    if(!it){ const c={}; REV_KEYS.forEach(x=>{ if(pr[x]!==undefined) c[x]=pr[x]; }); it={id, pr:c, n:0}; f.rev.push(it); }
    it.n=0; it.due=addDays(k, 1); it.miss=(it.miss||0)+1;
    while(f.rev.length>40) f.rev.shift();
  } else if(pr.review && it && firstTry){ it.n=(it.n||0)+1; if(it.n>=2) f.rev=f.rev.filter(r=>r!==it); else it.due=addDays(k, 4); }
}
function injectReview(p, t){
  const k=t.date, due=fx(p).rev.filter(r=>r.due<=k).slice(0,3);
  due.forEach((r,i)=>{ const pos=Math.min(t.problems.length-1, 1+i*3); t.problems[pos]=Object.assign({}, r.pr, {review:true}); });
}

/* ---- 1) kolo štěstí ---- */
function wheelPrizes(p){
  const s=streakAlive(p)?p.streak:0, m=1+Math.min(s,14)/14;
  const pr=[{t:'pts',v:Math.round(20*m),l:`⭐ ${Math.round(20*m)}`},{t:'stk',l:'Nálepka'},{t:'pts',v:Math.round(40*m),l:`⭐ ${Math.round(40*m)}`},{t:'chest',v:'wood',l:'Truhla'},
    {t:'pts',v:Math.round(30*m),l:`⭐ ${Math.round(30*m)}`},{t:'stk2',l:'2 nálepky'},{t:'pts',v:Math.round(60*m),l:`⭐ ${Math.round(60*m)}`},{t:'chest',v:s>=7?'gold':'wood',l:s>=7?'Zlatá truhla':'Truhla'}];
  if(s>=14) pr[2]={t:'chest',v:'gold',l:'Zlatá truhla'};
  return pr;
}
// kolo štěstí vypnuto na přání (24. 11. 2026) – nic nepřidávalo; kód ponechán kvůli starým datům fx(p).wheel
function canSpin(p){ return false; }
function wheelOpen(){
  const p=prof(view.pid); if(!p || !canSpin(p)) return;
  const pr=wheelPrizes(p), cols=['#ff6b6b','#ffd84d','#4fc3f7','#81c784','#ba68c8','#ffb74d','#f06292','#4db6ac'];
  const seg=360/pr.length, grad=pr.map((_,i)=>`${cols[i]} ${i*seg}deg ${(i+1)*seg}deg`).join(',');
  const s=streakAlive(p)?p.streak:0;
  const m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="card center" style="max-width:420px"><h2 style="margin:4px 0">🎡 Kolo štěstí</h2><p class="muted" style="margin:0 0 8px">${s>=3?`🔥 Série ${s} dní – kolo je silnější!`:'Čím delší série dní, tím lepší výhry!'}</p>
    <div class="wheelwrap"><div class="wpointer">▼</div><div class="wheel" id="wheel" style="background:conic-gradient(${grad})">${pr.map((x,i)=>`<span style="transform:rotate(${i*seg+seg/2}deg) translateY(-104px) rotate(${-(i*seg+seg/2)}deg)">${x.l}</span>`).join('')}</div></div>
    <p id="wtxt" style="font-size:20px;min-height:30px"></p><div id="wbtn"><button class="btn gold" id="wspin" style="font-size:20px">Zatočit!</button></div></div>`;
  document.body.appendChild(m);
  if(readOn()) speak('Kolo štěstí! Klikni na Zatočit.');
  m.querySelector('#wspin').onclick=()=>{
    const idx=Math.floor(Math.random()*pr.length); fx(p).wheel=todayKey(); save();
    const w=m.querySelector('#wheel'); const ang=360*6 + (360-(idx*seg+seg/2));
    m.querySelector('#wbtn').innerHTML=''; w.style.transition='transform 4.2s cubic-bezier(.17,.67,.2,1)'; requestAnimationFrame(()=>w.style.transform=`rotate(${ang}deg)`);
    setTimeout(()=>{
      const x=pr[idx]; let txt='';
      if(x.t==='pts'){ p.points+=x.v; txt=`Vyhrál/a jsi ⭐ ${x.v} bodů!`; }
      else if(x.t==='chest'){ p.chests=p.chests||[]; p.chests.push(x.v); txt=x.v==='gold'?'Vyhrál/a jsi zlatou truhlu!':'Vyhrál/a jsi truhlu!'; }
      else { const n=x.t==='stk2'?2:1; const got=[]; for(let i=0;i<n;i++) got.push(dropSticker(p,true).s.e); txt=`Nová nálepka: ${got.join(' ')}`; }
      save(); confetti(35); m.querySelector('#wtxt').innerHTML=txt; if(readOn()) speak(txt.replace(/[⭐]/g,''));
      m.querySelector('#wbtn').innerHTML=`<button class="btn ok">Super!</button>`; m.querySelector('#wbtn button').onclick=()=>{ m.remove(); render(); };
    }, 4400);
  };
}

/* ---- 3) týdenní výzvy ---- */
function weekChallenges(p, ws=weekStart()){
  const R2=mulberry(hashStr(p.id+'|'+ws)), subs=subjectsOf(p), g=+p.grade||0;
  const pool=[
    {id:'days', text:'Splň úkol dne aspoň 4 dny', goal:4, m:s=>s.days},
    {id:'perfect', text:'Měj jeden den všechno správně', goal:1, m:s=>s.perfect},
    {id:'extra', text:'Dokonči 2 sady navíc', goal:2, m:s=>s.extra},
    {id:'timed', text:`V časovce dosáhni ${[5,7,9,11,13,15][Math.min(5,g)]} bodů`, goal:[5,7,9,11,13,15][Math.min(5,g)], m:s=>s.tbest},
  ];
  const sj=subs[Math.floor(R2()*subs.length)]||'m';
  pool.push({id:'subj', text:`Vyřeš správně 15 úloh: ${SUBJECTS[sj].icon} ${SUBJECTS[sj].name}`, goal:15, m:s=>(s.subj[sj]||[0])[0]});
  const pick3=[]; const pl=pool.slice(); while(pick3.length<2 && pl.length) pick3.push(pl.splice(Math.floor(R2()*pl.length),1)[0]);
  return [{id:'solve', text:'Vyřeš správně 40 úloh', goal:40, m:s=>s.c}, ...pick3];
}
function checkChallenges(p){
  if(!p) return; const ws=weekStart(), st=weekStats(p,ws), f=fx(p); const c=f.chal[ws]=f.chal[ws]||{cl:[],all:0};
  for(const k of Object.keys(f.chal)) if(k<addDays(ws,-21)) delete f.chal[k];
  let changed=false;
  for(const ch of weekChallenges(p,ws)){ if(!c.cl.includes(ch.id) && ch.m(st)>=ch.goal){ c.cl.push(ch.id); p.points+=50; changed=true; toast(`🎯 Výzva splněna: ${ch.text} · +50 ⭐ a nálepka`); setTimeout(()=>dropSticker(p),600); } }
  if(!c.all && c.cl.length>=3){ c.all=1; p.chests=p.chests||[]; p.chests.push('gold'); changed=true; setTimeout(()=>{ toast('🏅 Všechny výzvy týdne splněny! Zlatá truhla je tvoje.'); confetti(60); },1500); }
  if(changed) save();
}
function challengesHTML(p){
  const ws=weekStart(), st=weekStats(p,ws), c=(fx(p).chal[ws]||{cl:[]});
  const left=6-((new Date().getDay()+6)%7);
  return `<div class="card"><h3 style="margin:0 0 6px">🎯 Výzvy týdne <span class="muted" style="font-size:14px">· ${left?`ještě ${left} ${plural(left,'den','dny','dní')}`:'poslední den!'} · každá +50 ⭐ a nálepka, všechny = zlatá truhla</span></h3>
    ${weekChallenges(p,ws).map(ch=>{ const v=Math.min(ch.goal, ch.m(st)), done=c.cl.includes(ch.id);
      return `<div class="chal ${done?'done':''}"><div>${done?'✅':'⬜'} ${ch.text}</div><div class="bar"><i style="width:${v/ch.goal*100}%"></i></div><small>${v}/${ch.goal}</small></div>`; }).join('')}</div>`;
}

/* ---- 4) časovka ---- */
function timedStart(){
  const p=prof(view.pid); if(!p) return;
  view={name:'timed', pid:p.id, tm:{score:0, wrong:0, end:0, pr:battleProblem(p), started:false}}; render();
}
function timedView(){
  const p=prof(view.pid), T=view.tm;
  if(!T.started) return `<div class="top"><button class="btn sec small" data-act="hero">← ${esc(p.name)}</button><h1>⏱️ Časovka</h1><span class="pill">🏅 ${fx(p).tbestAll||0}</span></div>
    <div class="card center"><div style="font-size:64px">⏱️</div><h2>Kolik úloh stihneš za 60 sekund?</h2><p style="font-size:18px">Za každou správnou odpověď 1 bod. Když se spleteš, jde se rovnou dál.<br>Tvůj rekord: <b>${fx(p).tbestAll||0}</b></p>
    <button class="btn gold" data-act="t-go" style="font-size:22px;padding:16px 30px">▶ Start!</button></div>`;
  const left=Math.max(0,Math.ceil((T.end-Date.now())/1000));
  return `<div class="top"><button class="btn sec small" data-act="hero">✖ Konec</button><h1 class="center">⏱️ <span id="tleft">${left}</span> s</h1><span class="pill">✅ ${T.score}</span></div>
    <div class="tbar"><i id="tbar" style="width:${left/60*100}%"></i></div>
    <div class="card" id="pcard">${probHTML(T.pr)}${inputHTML(T.pr).replace(/<div class="(pad|cmpbtns|choices)/,'<div class="fb" id="fb"></div><div class="$1')}</div>`;
}
let _tIv=null;
function timedGo(){
  const T=view.tm; T.started=true; T.end=Date.now()+60000; render();
  clearInterval(_tIv); _tIv=setInterval(()=>{ if(view.name!=='timed'){ clearInterval(_tIv); return; } const left=Math.max(0,(view.tm.end-Date.now())/1000);
    const a=$('#tleft'), b=$('#tbar'); if(a) a.textContent=Math.ceil(left); if(b) b.style.width=(left/60*100)+'%';
    if(left<=0){ clearInterval(_tIv); timedEnd(); } }, 200);
}
function timedAnswer(val){
  if(busy) return; const p=prof(view.pid), T=view.tm, pr=T.pr, ok=isCorrect(pr,val);
  if(ok){ T.score++; setFb('ok','✓'); } else { T.wrong++; setFb('bad',`Správně: <b>${shownAnswer(pr)}</b>`); }
  const d=fxDay(p); d.tn=(d.tn||0)+1; if(ok) d.tc=(d.tc||0)+1; addSubj(d,{[subjOf(pr.cat)]:[ok?1:0,1]});
  busy=true; setTimeout(()=>{ busy=false; if(view.name!=='timed') return; if(Date.now()>=T.end) return; T.pr=battleProblem(p); render(); }, ok?250:1100);
}
function timedEnd(){
  const p=prof(view.pid), T=view.tm, f=fx(p), d=fxDay(p);
  const rec=T.score>(f.tbestAll||0); if(rec) f.tbestAll=T.score; d.tb=Math.max(d.tb||0,T.score);
  d.truns=(d.truns||0)+1; const pts=d.truns<=3 ? T.score*3 : 0; p.points+=pts; save(); checkChallenges(p);
  if(rec && T.score>0) confetti(50);
  view={name:'timedEnd', pid:p.id, res:{score:T.score, wrong:T.wrong, rec, pts, runs:d.truns}}; render();
  if(readOn()) speak(`Konec! Stihl jsi ${T.score} správně.${rec?' To je nový rekord!':''}`);
}
function timedEndView(){
  const p=prof(view.pid), r=view.res;
  return `<div class="top"><h1>⏱️ Časovka – konec!</h1></div><div class="card center"><div style="font-size:64px">${r.rec?'🏆':'⏱️'}</div>
    <h2>${r.score} správně${r.wrong?` · ${r.wrong} ${plural(r.wrong,'chyba','chyby','chyb')}`:''}</h2>${r.rec?'<p style="font-size:22px">🎉 Nový rekord!</p>':`<p>Rekord: ${fx(p).tbestAll||0}</p>`}
    <p style="font-size:18px">${r.pts?`+${r.pts} ⭐ (3 body za každou správnou)`:'Body se dávají za první 3 časovky denně – teď už jen pro radost a rekord.'}</p>
    <div class="row" style="justify-content:center"><button class="btn gold" data-act="timed">🔁 Znovu</button><button class="btn sec" data-act="hero">← Zpět</button></div></div>`;
}

/* ---- 5) žebříček týdne (souboj dvou hrdinů je vypnutý – přání rodiče) ---- */
function leaderboardHTML(){
  const hs=realHeroes(); if(hs.length<2) return '';
  const rows=hs.map(p=>({p, s:weekStats(p)})).sort((a,b)=>b.s.c-a.s.c);
  return `<h3>📅 Žebříček týdne <span class="muted" style="font-size:14px">– správné odpovědi od pondělí</span></h3><div class="card"><table class="fame">${rows.map((r,i)=>`<tr><td style="width:36px">${['🥇','🥈','🥉'][i]||(i+1)+'.'}</td><td>${esc(r.p.name)}</td><td>✅ ${r.s.c}</td></tr>`).join('')}</table></div>`;
}
function duelSetupView(){
  const hs=realHeroes(); const a=view.a||(hs[0]&&hs[0].id), b=view.b2||(hs[1]&&hs[1].id);
  const sel=(id,v)=>`<select id="${id}" style="font-size:18px;padding:8px;border-radius:10px">${hs.map(p=>`<option value="${p.id}" ${p.id===v?'selected':''}>${esc(p.name)} (${gs(p.grade)})</option>`).join('')}</select>`;
  return `<div class="top"><button class="btn sec small" data-act="home">← Zpět</button><h1>⚔️ Souboj</h1></div>
    <div class="card center"><p style="font-size:18px">Dva hrdinové se střídají u jednoho počítače. Každý dostane 5 úloh podle své třídy. Vyhrává, kdo má víc správně – při shodě rychlejší.</p>
    <div class="row" style="justify-content:center;align-items:center;gap:14px">${sel('d-a',a)}<b style="font-size:28px">VS</b>${sel('d-b',b)}</div>
    <p class="muted">Vítěz +30 ⭐, druhý +10 ⭐ (první 3 souboje denně).</p><button class="btn gold" data-act="duel-go" style="font-size:20px">⚔️ Začít souboj</button></div>`;
}
function duelGo(){
  const a=$('#d-a').value, b=$('#d-b').value; if(a===b){ toast('Vyber dva různé hrdiny'); return; }
  const need=[a,b].map(prof).filter(p=>p.pin && !unlocked.has(p.id));
  const start=()=>{ view={name:'duel', pid:a, D:{ids:[a,b], turn:0, score:[0,0], time:[0,0], ready:false, pr:null}}; render(); };
  const ask=i=>{ if(i>=need.length) return start(); const p=need[i]; pinBox(`🔒 Tajný kód pro ${esc(p.name)}`, v=>{ if(v===String(p.pin)){ unlock(p.id); ask(i+1); } else toast('Špatný kód'); }); };
  ask(0);
}
function duelView(){
  const D=view.D, who=D.turn%2, p=prof(D.ids[who]), o=prof(D.ids[1-who]);
  const head=`<div class="top"><button class="btn sec small" data-act="home">✖ Konec</button><h1 class="center">⚔️ Kolo ${Math.floor(D.turn/2)+1} z 5</h1><span class="pill">${esc(prof(D.ids[0]).name)} ${D.score[0]} : ${D.score[1]} ${esc(prof(D.ids[1]).name)}</span></div>`;
  if(!D.ready) return head+`<div class="card center"><div style="max-width:160px;margin:0 auto">${avatarSVG(p)}</div><h2>Na řadě: ${esc(p.name)}</h2><p style="font-size:18px">${esc(o.name)}, nedívej se 😉</p><button class="btn gold" data-act="duel-ready" style="font-size:22px">▶ Jsem připraven/a</button></div>`;
  return head+`<div class="card" id="pcard"><div class="center muted" style="font-size:18px">${esc(p.name)} odpovídá…</div>${probHTML(D.pr)}${inputHTML(D.pr).replace(/<div class="(pad|cmpbtns|choices)/,'<div class="fb" id="fb"></div><div class="$1')}</div>`;
}
function duelReady(){ const D=view.D; D.pr=battleProblem(prof(D.ids[D.turn%2])); D.ready=true; D.t0=Date.now(); render(); if(readOn()) setTimeout(()=>speak(sayText(D.pr), D.pr.lang),250); }
function duelAnswer(val){
  if(busy) return; const D=view.D, who=D.turn%2, ok=isCorrect(D.pr,val), dt=(Date.now()-D.t0)/1000;
  if(ok) D.score[who]++; D.time[who]+=ok?dt:dt+5;
  const p=prof(D.ids[who]), d=fxDay(p); d.tn=(d.tn||0)+1; if(ok) d.tc=(d.tc||0)+1; addSubj(d,{[subjOf(D.pr.cat)]:[ok?1:0,1]});
  setFb(ok?'ok':'bad', ok?'Správně! 🎉':`Správně je <b>${shownAnswer(D.pr)}</b>`);
  busy=true; setTimeout(()=>{ busy=false; D.turn++; D.ready=false; if(D.turn>=10) duelEnd(); else render(); }, ok?800:1800);
}
function duelEnd(){
  const D=view.D; const [A,B]=D.ids.map(prof);
  let w = D.score[0]!==D.score[1] ? (D.score[0]>D.score[1]?0:1) : (D.time[0]<=D.time[1]?0:1);
  const award=(p,v)=>{ const d=fxDay(p); d.duels=(d.duels||0)+1; if(d.duels<=3){ p.points+=v; return v; } return 0; };
  const pw=award([A,B][w],30), pl=award([A,B][1-w],10); const dw=fxDay([A,B][w]); dw.dw=(dw.dw||0)+1;
  save(); [A,B].forEach(checkChallenges); confetti(50);
  view={name:'duelEnd', pid:D.ids[w], R:{D, w, pw, pl}}; render();
  if(readOn()) speak(`Vítězem je ${[A,B][w].name}!`);
}
function duelEndView(){
  const {D,w,pw,pl}=view.R, P=D.ids.map(prof);
  return `<div class="top"><h1>⚔️ Konec souboje</h1></div><div class="card center"><div style="font-size:60px">🏆</div><h2>Vítěz: ${esc(P[w].name)}!</h2>
    <p style="font-size:20px">${esc(P[0].name)} ${D.score[0]} : ${D.score[1]} ${esc(P[1].name)}</p><p class="muted">Čas: ${D.time[0].toFixed(1)} s : ${D.time[1].toFixed(1)} s</p>
    <p style="font-size:18px">${pw?`${esc(P[w].name)} +${pw} ⭐`:''} ${pl?` · ${esc(P[1-w].name)} +${pl} ⭐`:''}</p>
    <div class="row" style="justify-content:center"><button class="btn gold" data-act="duel">🔁 Odveta</button><button class="btn sec" data-act="home">← Domů</button></div></div>`;
}

/* ---- 6) společný rodinný cíl ---- */
function familyCfg(){ if(!S.settings.family) S.settings.family={goal:400, reward:'Společný rodinný výlet'}; return S.settings.family; }
function familyProgress(){ const m=todayKey().slice(0,7); return realHeroes().reduce((a,p)=>a+statsRange(p, m+'-01', m+'-31').c, 0); }
function familyHTML(){
  const F=familyCfg(); if(!(+F.goal>0)) return ''; const v=familyProgress(), g=+F.goal, done=v>=g;
  if(done){ const k='ph-fam-'+todayKey().slice(0,7); if(!lsGet(k)){ lsSet(k,1); setTimeout(()=>confetti(80),300); } }
  return `<div class="card famgoal ${done?'done':''}"><h3 style="margin:0 0 6px">👨‍👩‍👧‍👦 Rodinný cíl tohoto měsíce</h3>
    <div style="font-size:17px">Všichni dohromady: <b>${v}</b> z <b>${g}</b> správných odpovědí</div><div class="bar" style="margin:8px 0"><i style="width:${Math.min(100,v/g*100)}%"></i></div>
    <div>${done?'🎉 <b>Splněno!</b> Odměna: ':'🎁 Odměna pro celou rodinu: '}<b>${esc(F.reward||'')}</b></div></div>`;
}

/* ---- 8) týdenní zpráva pro rodiče ---- */
// přehled úspěšnosti po tématech (napoprvé správně / pokusů)
function topicTableHTML(p){
  const weak=weakCats(p,1), rows=Object.entries(p.cst||{}).filter(([c,r])=>CATS[c]&&r[1]>=3)
    .sort((a,b)=>['m','cj','en','pr'].indexOf(subjOf(a[0]))-['m','cj','en','pr'].indexOf(subjOf(b[0])) || a[1][0]/a[1][1]-b[1][0]/b[1][1]);
  if(!rows.length) return '';
  return `<details class="ttab"><summary>📚 Přehled po tématech (${rows.length})</summary><table>${rows.map(([c,r])=>{ const pc=Math.round(r[0]/r[1]*100), S_=SUBJECTS[subjOf(c)]||{};
    return `<tr><td>${S_.icon||''} ${CATS[c].label}</td><td class="tb"><i class="${weak.includes(c)?'w':pc>=90?'g':''}" style="width:${pc}%"></i></td><td><b>${pc} %</b> <span class="muted">z ${r[1]}</span>${weak.includes(c)?' ⚠️':''}</td></tr>`; }).join('')}</table>
    <div class="muted" style="font-size:13px">⚠️ = pod 75 % – ${p.weakOff?'opakování slabých témat je vypnuté':'hra mu teď dává tato témata častěji'}.</div></details>`;
}
function reportHTML(){
  const ws=weekStart(), pws=addDays(ws,-7), fmtD=k=>k.split('-').reverse().slice(0,2).map(x=>+x).join('. ')+'.';
  return `<p class="muted">Týden ${fmtD(ws)} – ${fmtD(addDays(ws,6))} Porovnání s minulým týdnem je v závorce.</p>`+realHeroes().map(p=>{
    const s=weekStats(p,ws), o=weekStats(p,pws), pc=s.n?Math.round(s.c/s.n*100):0, opc=o.n?Math.round(o.c/o.n*100):0;
    const cats={}; Object.entries(p.history||{}).filter(([k])=>k>=addDays(todayKey(),-14)).forEach(([k,h])=>(h.wrongCats||[]).forEach(c=>cats[c]=(cats[c]||0)+1));
    fx(p).rev.forEach(r=>{ if(r.pr.cat) cats[r.pr.cat]=(cats[r.pr.cat]||0)+(r.miss||1); });
    weakCats(p,1).forEach(c=>cats[c]=(cats[c]||0)+5); const weak=Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c])=>CATS[c]?CATS[c].label:c);
    const subj=Object.entries(s.subj).map(([k,v])=>`${SUBJECTS[k]?SUBJECTS[k].icon+' '+SUBJECTS[k].name:k}: ${v[0]}/${v[1]} (${Math.round(v[0]/v[1]*100)} %)`).join(' · ');
    const d=(a,b)=>a===b?'':` <span class="${a>b?'up':'down'}">(${a>b?'▲':'▼'} ${Math.abs(a-b)})</span>`;
    return `<div class="rep"><h3 style="margin:6px 0">${esc(p.name)} <span class="muted" style="font-size:14px">· ${gl(p.grade)} · ${modeOf(p).icon} ${p.beaten}/${FOE_N}</span></h3>
      <div class="repgrid"><div><b>${s.days}</b> ${plural(s.days,'den','dny','dní')} s úkolem${d(s.days,o.days)}</div><div><b>${s.c}</b> správně z ${s.n}${d(s.c,o.c)}</div><div>úspěšnost <b>${pc} %</b>${o.n?` (minule ${opc} %)`:''}</div><div>🔥 série ${streakAlive(p)?p.streak:0} · 📒 ${stickerCount(p)}/${STK_TOTAL} · ⏱️ rekord ${fx(p).tbestAll||0}</div></div>
      ${subj?`<div class="muted" style="margin-top:4px">${subj}</div>`:''}
      <div style="margin-top:4px">${weak.length?`⚠️ <b>S čím má potíže:</b> ${weak.join(', ')}`:'✅ Žádné opakované potíže.'}</div>
      ${topicTableHTML(p)}
      ${fx(p).rev.length?`<div class="muted" style="font-size:14px">🔁 Na opakování čeká ${fx(p).rev.length} ${plural(fx(p).rev.length,'úloha','úlohy','úloh')} – hra je bude dávat znovu, dokud je nezvládne.</div>`:''}</div>`; }).join('') || '<p>Zatím žádní hrdinové.</p>';
}

/* ---- úvodní průvodce ---- */
var INTRO=[
  ['👋','Vítej v Chytrolíncích!','Tady se učíš hrou. Každý den splníš pár úloh – z matematiky, a když rodiče zapnou, i z angličtiny, přírodovědy a češtiny – a za to sbíráš body a poklady.'],
  ['🦸','Vytvoř si hrdinu','Klikni na „Nový hrdina“, napiš své jméno, vyber třídu a dobrodružství: ⚔️ výprava za drakem, 🏡 vlastní domeček, nebo 🐾 zvířátko, které roste.'],
  ['🎯','Úkol dne','Každý den tě čeká 10 úloh. Za správnou odpověď dostaneš ⭐ body, za splněný den truhlu s překvapením. Kdo hraje každý den, má sérii a lepší výhry!'],
  ['🛍️','Nakupuj a vyhrávej','Za body si kupuj meče, nábytek nebo hračky pro zvířátko – a nezapomeň si je nasadit. Pak poraz obludy, pozvi návštěvy nebo vyhraj soutěže. Na konci tě čeká odměna od rodičů!'],
  ['📒','Ještě víc zábavy','Sbírej nálepky do alba, plň výzvy týdne, nebo překonej rekord v časovce. 🔊 Když neumíš číst, zapni dole vlevo předčítání.'],
  ['👨‍👩‍👧','Pro rodiče','V sekci „Rodič“ (výchozí PIN 1234 – změňte si ho) nastavíte každému dítěti třídu, obtížnost a předměty, odměnu za dokončení, tajný kód a rodinný cíl. Najdete tam i týdenní zprávu, co dítěti jde a s čím má potíže.'],
];
function introOpen(force){
  if(!force && lsGet('ph-intro')) return;
  let i=0; const m=document.createElement('div'); m.className='modal intro';
  const draw=()=>{ const [e,h,t]=INTRO[i];
    m.innerHTML=`<div class="card center" style="max-width:460px"><button class="say" id="isay" style="float:right">🔊</button><div style="font-size:70px;line-height:1.1">${e}</div><h2 style="margin:6px 0">${h}</h2><p style="font-size:18px">${t}</p>
      <div class="idots">${INTRO.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div>
      <div class="row" style="justify-content:center">${i?'<button class="btn sec" id="iback">← Zpět</button>':'<button class="btn sec" id="iskip">Přeskočit</button>'}<button class="btn gold" id="inext">${i<INTRO.length-1?'Dál →':'Jdeme na to! 🚀'}</button></div></div>`;
    const sayIt=()=>speak(cleanSpeech(h+'. '+t));
    m.querySelector('#isay').onclick=sayIt; if(readOn()) setTimeout(sayIt,200);
    m.querySelector('#inext').onclick=()=>{ if(i<INTRO.length-1){ i++; draw(); } else { lsSet('ph-intro',1); m.remove(); try{speechSynthesis.cancel();}catch(e){} } };
    const b=m.querySelector('#iback'); if(b) b.onclick=()=>{ i--; draw(); };
    const s=m.querySelector('#iskip'); if(s) s.onclick=()=>{ lsSet('ph-intro',1); m.remove(); };
  };
  draw(); document.body.appendChild(m);
}

/* ---- napojení na stávající hru ---- */
const _answer=answer;
answer=function(val){
  if(busy) return _answer(val);
  const p=prof(view.pid), t=view.practice||p.today, pr=t&&t.problems[t.idx];
  const ok=pr?isCorrect(pr,val):false, firstTry=t&&!t.tries;
  _answer(val);
  try{ if(firstTry && pr && !pr.review) catTrack(p, pr.cat, ok); reviewTrack(p, pr, ok, firstTry); if(ok && firstTry && Math.random()<0.05) setTimeout(()=>dropSticker(p),500); save(); }catch(e){}
};
const _battleAnswer=battleAnswer;
battleAnswer=function(val){ try{ if(!busy && view.b && view.b.pr){ catTrack(prof(view.pid), view.b.pr.cat, isCorrect(view.b.pr,val)); } }catch(e){} return _battleAnswer(val); };
const _finish=finish;
finish=function(t){
  const p=prof(view.pid), practice=!!view.practice, perfect=t.res.every(r=>r===2);
  try{ const d=fxDay(p); addSubj(d, subjCounts(t)); if(!practice && perfect) d.perf=1; }catch(e){}
  _finish(t);
  try{
    const got=[]; if(!practice){ got.push(dropSticker(p,true).s.e); if(perfect) got.push(dropSticker(p,true).s.e); }
    if(view.sum) view.sum.stk=got; save(); checkChallenges(p); render();
  }catch(e){}
};
const _ensureToday=ensureToday;
ensureToday=function(p){ const before=p.today; const t=_ensureToday(p); if(t!==before && !t.revDone){ try{ injectReview(p,t); }catch(e){} t.revDone=1; save(); } return t; };
const _probHTML=probHTML;
probHTML=function(pr){ return (pr&&pr.review?'<div class="revtag">🔁 Opakování – minule to nevyšlo, zkus to teď!</div>':'')+_probHTML(pr); };
const _act=act;
act=function(a){
  const F={ wheel:wheelOpen, album:()=>go({name:'album',pid:view.pid}), timed:timedStart, 't-go':timedGo, duel:()=>{ go({name:'home'}); }, 'duel-go':duelGo, 'duel-ready':duelReady, intro:()=>introOpen(true) };
  if(F[a]) return F[a]();
  if(a==='savesettings'){ const fg=$('#s-fgoal'), fr=$('#s-freward'); if(fg){ const F2=familyCfg(); F2.goal=Math.max(0,parseInt(fg.value)||0); F2.reward=(fr.value||'').trim(); } }
  if(a==='hero' && (view.name==='timed'||view.name==='timedEnd'||view.name==='album')){ clearInterval(_tIv); return go({name:'hero',pid:view.pid}); }
  return _act(a);
};
const _render=render;
render=function(){
  if(['duelSetup','duel','duelEnd'].includes(view.name)) view={name:'home'};
  if(['album','timed','timedEnd'].includes(view.name)){
    const V={album:albumView,timed:timedView,timedEnd:timedEndView,duelSetup:duelSetupView,duel:duelView,duelEnd:duelEndView}[view.name];
    $('#app').innerHTML=V(); bind(); updateSyncNote(); addReaders();
    if(view.name==='duelSetup'){ ['d-a','d-b'].forEach(id=>{ const s=$('#'+id); if(s) s.onchange=()=>{ view.a=$('#d-a').value; view.b2=$('#d-b').value; }; }); }
    return;
  }
  _render();
};
const _submit=submit;
submit=function(val){ if(view.name==='timed') return timedAnswer(val); if(view.name==='duel') return duelAnswer(val); return _submit(val); };
const _curProblem=curProblem;
curProblem=function(){ if(view.name==='timed') return view.tm.started?view.tm.pr:null; if(view.name==='duel') return view.D.ready?view.D.pr:null; return _curProblem(); };
// HTML bloky do stávajících obrazovek
function funHeroHTML(p){
  if(!p) return ''; checkChallenges(p);
  const sp=canSpin(p);
  return `<div class="funrow">${sp?`<button class="btn gold pulse" data-act="wheel">🎡 Kolo štěstí!</button>`:''}<button class="btn sec" data-act="timed">⏱️ Časovka</button><button class="btn sec" data-act="album">📒 Album nálepek (${stickerCount(p)}/${STK_TOTAL})</button></div>${challengesHTML(p)}`;
}
function funSummaryHTML(p,s){
  if(!p||!s) return '';
  return `${s.stk&&s.stk.length?`<p style="font-size:20px">📒 ${s.stk.length>1?'Nové nálepky':'Nová nálepka'}: <span style="font-size:34px">${s.stk.join(' ')}</span></p>`:''}${canSpin(p)?`<div style="margin:8px 0"><button class="btn gold pulse" data-act="wheel" style="font-size:20px">🎡 Zatoč si kolem štěstí!</button></div>`:''}`;
}
function funHomeHTML(){ return familyHTML(); } // žebříček týdne odstraněn na přání rodiče
setTimeout(()=>{ if(view.name==='home') introOpen(false); }, 600);

