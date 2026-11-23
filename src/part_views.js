/* ============ Day logic ============ */
function ensureToday(p){
  const k=todayKey();
  if(!p.today || p.today.date!==k){
    p.today = {date:k, idx:0, tries:0, res:[], problems:genDaily(p,k,S.settings.perDay||20), done:false, pts:0, wrong:[]};
    save();
  }
  return p.today;
}
function streakAlive(p){ return p.lastDone && dayDiff(p.lastDone, todayKey())<=1; }
const plural = (n, one, few, many) => n===1?one:(n>=2&&n<=4?few:many);

/* ============ Views ============ */
let view={name:'home'};
let parentOk=false, parentTab='settings', parentHero=null;
function go(v){ view=v; busy=false; render(); window.scrollTo(0,0); }
function render(){
  const app=$('#app');
  const V={home:homeView, create:createView, hero:heroView, play:playView, summary:summaryView, map:mapView, battle:battleView, bend:battleEndView, parent:parentView}[view.name]||homeView;
  app.innerHTML=V();
  bind();
  updateSyncNote();
  addReaders();
}
/* ---- předčítání pro děti, které ještě neumí číst ---- */
function readOn(){ const v=lsGet('ph-read',null); if(v!==null && v!==undefined) return !!v; const p=view.pid&&prof(view.pid); return !!(p && +p.grade<=1); }
function cleanSpeech(t){ return String(t||'').replace(/🔊/g,'').replace(/[\u{1F000}-\u{1FFFF}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{20E3}]/gu,' ').replace(/[＋+]\s*(\d)/g,'plus $1').replace(/·/g,', ').replace(/\s*\n\s*/g,'. ').replace(/\s+/g,' ').trim(); }
let _hoverT=null;
function addReaders(){
  let tg=document.getElementById('readtg');
  if(!tg){ tg=document.createElement('button'); tg.id='readtg'; document.body.appendChild(tg);
    tg.onclick=()=>{ const on=!readOn(); lsSet('ph-read',on); render(); if(on) speak(TOUCH?'Předčítání je zapnuté. Klepni na odpověď a já ti ji přečtu, klepni znovu a vybereš ji. Když podržíš prst na tlačítku, taky ti ho přečtu.':'Předčítání je zapnuté. Klikni na reproduktor nebo najeď myší na tlačítko a já ti to přečtu.'); else speechSynthesis.cancel(); }; }
  const on=readOn(); tg.className=on?'on':''; tg.innerHTML=on?'🔊':'🔇'; tg.title='Zapnout nebo vypnout předčítání';
  if(!on) return;
  document.querySelectorAll('#app .card').forEach(c=>{
    if(c.classList.contains('profile') || c.querySelector('[data-say]') || c.querySelector(':scope > .rd')) return;
    const b=document.createElement('button'); b.className='rd'; b.type='button'; b.textContent='🔊'; b.title='Přečíst nahlas';
    b.onclick=ev=>{ ev.stopPropagation(); ev.preventDefault(); speak(cleanSpeech(c.innerText)); };
    c.classList.add('hasrd'); c.prepend(b);
  });
  const top=document.querySelector('#app .top h1');
  document.querySelectorAll('#app .btn, #app .choice, #app .mcard, #app .chip, #app .card.profile, #app .top h1, #app .stat, #app .modebtn, #app .spbtn').forEach(el=>{
    el.addEventListener('pointerenter',e=>{ if(e.pointerType!=='mouse') return; clearTimeout(_hoverT); const pr=curProblem&&curProblem(); if(el.classList.contains('choice') && pr && pr.lang) return;
      _hoverT=setTimeout(()=>speak(cleanSpeech(el.innerText||el.title)),500); });
    el.addEventListener('pointerleave',()=>clearTimeout(_hoverT)); el.addEventListener('pointerdown',()=>clearTimeout(_hoverT));
    // dotykový displej: podržení prstu přečte tlačítko (a klepnutí pak nic nespustí)
    if(TOUCH && !el.classList.contains('choice')){ let lt=null;
      el.addEventListener('pointerdown',()=>{ clearTimeout(lt); el._lp=false; lt=setTimeout(()=>{ el._lp=true; speak(cleanSpeech(el.innerText||el.title)); },450); });
      ['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,()=>clearTimeout(lt)));
      el.addEventListener('click',e=>{ if(el._lp){ el._lp=false; e.stopImmediatePropagation(); e.preventDefault(); } },true);
      el.addEventListener('contextmenu',e=>e.preventDefault()); }
  });
}
function statsHTML(p){
  const st=stats(p), xi=xpInfo(p);
  const M=modeOf(p);
  return `<div class="stats"><div class="stat"><small>Úroveň</small>⭐ ${st.L}</div><div class="stat"><small>${M.st[0][1]}</small>${M.st[0][0]} ${st.atk}</div><div class="stat"><small>${M.st[1][1]}</small>${M.st[1][0]} ${st.def}</div><div class="stat"><small>${M.st[2][1]}</small>${M.st[2][0]} ${st.hp}</div></div>
    <div style="margin:10px 6px 0" class="bar"><i style="width:${xi.cur/xi.per*100}%"></i></div>
    <div class="sub center" style="margin-top:3px">${xi.max?'Maximální úroveň!':`Zkušenosti ${xi.cur}/${xi.per} do úrovně ${st.L+1} (1 za každý správný příklad)`}</div>`;
}
function testBanner(p){ return isTest(p) ? `<div class="testbanner">🧪 <b>Testovací režim</b> – tenhle hrdina se nikam nepočítá a nic se neodesílá do výsledků.</div>` : ''; }

function homeView(){
  const hs=heroes();
  const cards = hs.map(p=>{
    const t = (p.today && p.today.date===todayKey()) ? p.today : null;
    const status = t&&t.done ? `✅ Dnes splněno (+${t.pts})` : t&&t.idx ? `▶️ Rozpracováno ${t.idx}/${t.problems.length}` : `🎯 Čeká ${S.settings.perDay||20} příkladů`;
    const locked = p.pin && !unlocked.has(p.id);
    return `<div class="card profile" data-open="${p.id}">${locked?'<span class="lock">🔒</span>':''}
      <div class="hero ${p.mode==='home'?'roomthumb':''}">${avatarSVG(p,{glow:p.beaten>REWARD_AT})}</div>
      <h2>${esc(p.name)}</h2>
      <div class="sub">${gl(p.grade)} · úroveň ${level(p)} · ⭐ ${p.points}</div>
      <div class="sub">${modeOf(p).icon} ${p.beaten>=FOE_N?'🌟 Legenda!':p.beaten>REWARD_AT?modeOf(p).doneShort+` · ${p.beaten}/${FOE_N}`:`${modeOf(p).progW}: ${p.beaten}/${FOE_N}`}</div>
      <div class="status ${t&&t.done?'done':''}">${status}</div></div>`;}).join('');
  const fame = hs.length>1 ? `<h3>🏆 Síň slávy</h3><div class="card"><table class="fame">${hs.slice().sort((a,b)=>(b.beaten-a.beaten)||((b.xp||0)-(a.xp||0))).map((p,i)=>
      `<tr><td style="width:36px">${['🥇','🥈','🥉'][i]||(i+1)+'.'}</td><td>${esc(p.name)} <span class="muted">${gs(p.grade)}</span></td><td>${modeOf(p).icon} ${p.beaten}/${FOE_N}</td><td>úroveň ${level(p)}</td></tr>`).join('')}</table></div>` : '';
  return `<div class="top"><h1>🧠 Chytrolínci</h1><div class="row" style="gap:6px"><button class="btn sec small" data-act="intro">❓ Jak hrát</button><button class="btn sec small" data-act="parent">👨‍👩‍👦 Rodič</button></div></div>
    <p class="muted" style="margin-top:0">Vyber svého hrdinu, nebo si vytvoř nového.</p>
    <div class="grid3">${cards}<div class="card profile newhero" data-act="create"><b>＋</b>Nový hrdina</div></div>
    ${funHomeHTML()}
    ${fame}
    <div class="syncnote" id="syncnote"></div>`;
}

/* ---- create hero ---- */
let draft=null;
function createView(){
  if(!draft) draft={name:'', gender:'m', grade:2, color:TUNICS[0], pin:'', reward:'', mode:'quest', species:'cat', petName:'', subjects:['m']};
  return `<div class="top"><button class="btn sec small" data-act="home">← Zpět</button><h1>Nový hrdina</h1></div>
  <div class="grid2"><div class="card">
    <div class="field"><label>Jak se jmenuješ?</label><input type="text" id="c-name" maxlength="20" value="${esc(draft.name)}" placeholder="Tvoje jméno"></div>
    <div class="field"><label>Kdo bude tvoje postava?</label><div class="row">
      <button class="btn small ${draft.gender==='m'?'':'sec'}" data-gender="m">🧒 Hrdina</button><button class="btn small ${draft.gender==='f'?'':'sec'}" data-gender="f">👧 Hrdinka</button></div></div>
    <div class="field"><label>Do které třídy chodíš? (podle toho budou příklady)</label><select id="c-grade">${[0,1,2,3,4,5].map(g=>`<option value="${g}" ${draft.grade==g?'selected':''}>${gl(g)}</option>`).join('')}</select></div>
    <div class="field"><label>Barva oblečení</label><div class="row colors">${TUNICS.map(c=>`<button data-ccolor="${c}" style="background:${c};border:${draft.color===c?'4px solid #2b2340':'2px solid #fff'}"></button>`).join('')}</div></div>
    <div class="field"><label>Tajný kód (4 číslice) – aby za tebe nikdo jiný nehrál. Nepovinné.</label><input type="password" id="c-pin" inputmode="numeric" maxlength="4" value="${esc(draft.pin)}"></div>
    <div class="field"><label>Co budeš procvičovat? (můžeš víc)</label><div class="row">${Object.entries(SUBJECTS).map(([k,s])=>`<button class="btn small ${(draft.subjects||['m']).includes(k)?'':'sec'}" data-subj="${k}">${s.icon} ${s.name}</button>`).join('')}</div></div>
    <div class="field"><label>Vyber si dobrodružství</label><div class="modes">${Object.values(MODES).map(M=>`<button class="modebtn ${draft.mode===M.key?'on':''}" data-mode="${M.key}"><span style="font-size:30px">${M.icon}</span><b>${M.title}</b><small>${M.desc}</small></button>`).join('')}</div></div>
    ${draft.mode==='pet'?`<div class="field"><label>Vyber si mládě</label><div class="species">${SPECIES.map(sp=>`<button class="spbtn ${draft.species===sp.id?'on':''}" data-species="${sp.id}">${petSVG({species:sp.id,eq:{}},{stage:1})}<span>${sp.name}</span></button>`).join('')}</div></div>
      <div class="field"><label>Jak se bude zvířátko jmenovat?</label><input type="text" id="c-petname" maxlength="16" value="${esc(draft.petName||'')}" placeholder="např. Ťapka"></div>`:''}
    <div class="field"><label>🎁 Odměna od rodičů za splnění celého dobrodružství (ať vyplní rodič, nepovinné)</label><input type="text" id="c-reward" maxlength="80" value="${esc(draft.reward)}" placeholder="např. kino s tátou"></div>
    <button class="btn ok" data-act="createok" style="width:100%">Vytvořit ${draft.gender==='f'?'hrdinku':'hrdinu'} ✨</button>
  </div>
  <div class="card hero center" id="c-preview"><div class="stage">${draft.mode==='pet'?petSVG({species:draft.species,eq:{}},{stage:0}):draft.mode==='home'?roomSVG({gender:draft.gender,color:draft.color,eq:{}}):heroImg({gender:draft.gender,eq:{}})}</div><p class="muted">${draft.mode==='pet'?'Zatím je to malé mládě. Počítáním mu vyděláš na jídlo a doplňky – a poroste!':draft.mode==='home'?'Zatím prázdný pokojíček. Počítáním si ho krásně zařídíš!':'Zatím bez výbavy. Meč, štít a brnění si vybojuješ počítáním!'}</p></div></div>`;
}

/* ---- hero ---- */
function heroView(){
  const p=prof(view.pid); if(!p) return homeView();
  const t=ensureToday(p);
  const M=modeOf(p), FO=foesOf(p);
  const next = p.beaten<FOE_N ? FO[p.beaten] : null;
  const xs = p.extraSet && p.extraSet.date===todayKey() && p.extraSet.idx>0 ? p.extraSet : null;
  const SJ=subjectsOf(p);
  const playLabel = t.done ? (xs ? `▶️ Pokračovat v sadě navíc (${xs.idx}/${xs.problems.length})` : `➕ Dnes splněno – procvičovat dál`) : t.idx ? `▶️ Pokračovat v úkolu dne (${t.idx}/${t.problems.length})` : `🎯 Úkol dne – ${t.problems.length} úloh`;
  const gear = slotsOf(p).map(sl=>{
    const eqT=(p.eq||{})[sl.id]||0, own=(p.owned||{})[sl.id]||0;
    const chips = own ? `<div class="chips">${sl.items.slice(0,own).map((it,i)=>`<button class="chip ${eqT===i+1?'on':''} ${p.newItem===sl.id+':'+(i+1)?'new':''}" data-eq="${sl.id}:${i+1}" title="${itemStatText(it,p)}">${eqT===i+1?'✓ ':''}${it[0]}</button>`).join('')}</div>` : `<div class="sub">Zatím nic nemáš.</div>`;
    let buy;
    if(own<sl.items.length){ const it=sl.items[own], c=price(sl.id,own+1,p), can=p.points>=c;
      buy=`<div class="buy"><span>Koupit: <b>${it[0]}</b><br><span class="muted">${itemStatText(it,p)}</span></span><button class="btn small ${can?'gold':'sec'}" data-buy="${sl.id}" ${can?'':'disabled'}>⭐ ${c}</button></div>`;
    } else buy=`<div class="buy"><span class="muted">Máš všechno ✨</span></div>`;
    const ic=itemIcon(p, sl.id, eqT);
    return `<div class="slot"><h4><span>${sl.name}</span><span class="muted" style="font-size:13px">${eqT?itemStatText(sl.items[eqT-1],p):''}</span></h4>
      ${(ic||p.mode==='quest')?`<div class="slotpic">${ic||'<span class="empty">prázdné</span>'}</div>`:''}<div class="eqd">${M.wearing}: <b>${eqT?sl.items[eqT-1][0]:'nic'}</b></div>${chips}${buy}</div>`;
  }).join('');
  const testTools = isTest(p) ? `<div class="card" style="margin-top:14px"><b>🧪 Testovací nástroje</b><div class="row" style="margin-top:8px">
      <button class="btn small" data-act="t-pts">+500 ⭐</button><button class="btn small" data-act="t-lvl">+1 úroveň</button><button class="btn small" data-act="t-unlock">Odemknout všechny výzvy</button><button class="btn small" data-act="t-all">Koupit a nasadit vše</button><button class="btn small" data-act="t-chest">+1 truhla</button><button class="btn small" data-act="t-stk5">+5 nálepek</button><button class="btn small" data-act="t-stkall">Všechny nálepky</button><button class="btn small" data-act="t-wheel">Kolo štěstí znovu</button><button class="btn small sec" data-act="t-reset">Začít znovu</button></div></div>` : '';
  const dragon = p.beaten>REWARD_AT ? `<div class="reward" style="margin-top:16px"><div style="font-size:44px">${M.finalIcon}🏆</div><h2>${M.doneShort}</h2>
      <p style="font-size:18px">Odměna: <b>${esc(rewardOf(p))}</b></p><p class="muted">${p.rewardClaimed?'Odměna byla předána. 🎉':'Ukaž to rodičům!'}</p></div>` : '';
  return `<div class="top"><button class="btn sec small" data-act="home">← Zpět</button><h1>${esc(p.name)}</h1><span class="pill">⭐ ${p.points}</span></div>
    ${testBanner(p)}
    ${p.chests&&p.chests.length?`<div class="card row" style="margin-bottom:14px;background:#fff8dc;border-color:#f5d76e"><div style="width:70px">${chestSVG(p.chests[0])}</div><div style="flex:1;font-size:18px">Máš ${p.chests.length} ${plural(p.chests.length,'truhlu','truhly','truhel')} k otevření!</div><button class="btn gold" data-chest="1">🎁 Otevřít</button></div>`:''}
    <div class="grid2">
      <div class="card hero"><div class="stage ${p.mode==='home'?'roomstage':''}">${avatarSVG(p,{glow:p.beaten>REWARD_AT})}</div>${p.mode==='pet'?petInfoHTML(p):''}${statsHTML(p)}</div>
      <div class="card" style="display:flex;flex-direction:column;gap:12px;justify-content:center">
        ${t.done && !xs && SJ.length>1 ? `<div class="center" style="font-size:18px">➕ Dnes splněno! Procvičovat dál:</div><div class="row" style="justify-content:center">${SJ.map(s=>`<button class="btn ok small" data-playsubj="${s}">${SUBJECTS[s].icon} ${SUBJECTS[s].name}</button>`).join('')}</div>` : `<button class="btn ${t.done?'ok':''}" data-act="play" style="font-size:19px;padding:16px">${playLabel}</button>`}
        <div class="sub center">Předměty: ${SJ.map(s=>SUBJECTS[s].icon+' '+SUBJECTS[s].name).join(' · ')}</div>
        <button class="btn red" data-act="map" style="font-size:19px;padding:16px">${next?`${M.mapTitle} – další: ${next.name}`:`${M.mapTitle} (${M.doneShort})`}</button>
        <div class="sub">Za správný příklad ⭐ 7 bodů (napodruhé 3). Splněný den +20 a <b>truhla</b> s překvapením, všechno správně +20 a <b>zlatá truhla</b>, série 3+ dny +10. Po splnění můžeš počítat další sady (za každou +10, za všechno správně truhla). Za body si kupuj věci v obchodě – a nezapomeň si je <b>${p.mode==='home'?'dát do pokoje':p.mode==='pet'?'dát zvířátku':'nasadit'}</b>!</div>
        <div>🔥 Série: <b>${streakAlive(p)?p.streak:0}</b> ${plural(streakAlive(p)?p.streak:0,'den','dny','dní')} v řadě</div>
        <div class="sub">🎁 Za ${M.finalName}: <b>${esc(rewardOf(p))}</b></div>
      </div>
    </div>
    ${funHeroHTML(p)}
    ${dragon}${testTools}
    ${p.mode==='pet'?feedHTML(p):''}
    <h3>${M.gearTitle}</h3>
    <div class="gear">${gear}</div>`;
}

/* ---- practice ---- */
function probHTML(pr){
  const plain=String(pr.q).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ');
  const hasEq=/=/.test(plain), long=!pr.word && plain.length>16;
  const sayB = ((pr.type==='choice'&&pr.say!=='')||pr.word||(readOn()&&!pr.noAuto)) ? ` <button class="say" data-say title="Přečíst nahlas">🔊</button>` : '';
  if(pr.type==='choice') return `<div class="prob mid">${pr.q}${sayB}</div>${pr.pic?`<div class="pic0">${pr.pic}</div>`:''}`;
  return `<div class="prob ${pr.word?'word':''} ${long?'mid':''}">${pr.q}${pr.word||pr.small||pr.type==='cmp'||hasEq?'':' = '}${sayB}</div>${pr.pic?`<div class="pic0">${pr.pic}</div>`:''}`;
}
function inputHTML(pr){
  let input='';
  if(pr.type==='num') input=`<div class="ansrow">${pr.word||pr.small?'<span style="font-size:22px">Výsledek:</span>':''}<input class="ans active" id="a1" inputmode="numeric" autocomplete="off" maxlength="6"></div>`;
  if(pr.type==='rem') input=`<div class="ansrow"><input class="ans sm active" id="a1" inputmode="numeric" autocomplete="off" maxlength="4"><span style="font-size:26px">zbytek</span><input class="ans sm" id="a2" inputmode="numeric" autocomplete="off" maxlength="3"></div>`;
  if(pr.type==='choice') return `<div class="choices n${pr.options.length}">${pr.options.map((o,i)=>`<button class="choice" data-choice="${i}">${o}</button>`).join('')}</div>`;
  const pad = pr.type==='cmp' ? `<div class="cmpbtns"><button data-cmp="<">&lt;</button><button data-cmp="=">=</button><button data-cmp=">">&gt;</button></div>` :
    `<div class="pad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-k="${n}">${n}</button>`).join('')}<button data-k="del">⌫</button><button data-k="0">0</button><button data-k="ok" class="go">✓</button></div>`;
  return input+pad;
}
function playView(){
  const p=prof(view.pid); const t=view.practice ? view.practice : ensureToday(p);
  const pr=t.problems[t.idx];
  const dots=t.problems.map((_,i)=>{ const r=t.res[i]; const cl = r===undefined ? (i===t.idx?'cur':'') : r===2?'c':r===1?'h':'w'; return `<i class="${cl}"></i>`; }).join('');
  return `<div class="top"><button class="btn sec small" data-act="back">← ${esc(p.name)}</button><h1 class="center">${view.practice?'Sada navíc · ':''}Úloha ${t.idx+1} z ${t.problems.length}</h1><span class="pill">⭐ ${p.points}</span></div>
    <div class="dots">${dots}</div>
    <div class="card" id="pcard">${probHTML(pr)}${inputHTML(pr).replace('<div class="pad">','<div class="fb" id="fb">'+(t.tries?'Zkus to ještě jednou 🙂':'')+'</div><div class="pad">').replace('<div class="cmpbtns">','<div class="fb" id="fb">'+(t.tries?'Zkus to ještě jednou 🙂':'')+'</div><div class="cmpbtns">').replace('<div class="choices','<div class="fb" id="fb">'+(t.tries?'Zkus to ještě jednou 🙂':'')+'</div><div class="choices')}</div>`;
}
function summaryView(){
  const p=prof(view.pid); const s=view.sum;
  return `<div class="top"><h1>${s.practice?'Sada navíc hotová!':'Dnešní úkol splněn!'}</h1></div>
    <div class="card center">
      <div style="font-size:64px">${s.correct===s.total?'🏆':s.correct>=s.total*0.75?'🌟':'💪'}</div>
      <h2 style="margin:6px 0">${s.correct} z ${s.total} správně</h2>
      ${s.practice?`<p style="font-size:19px">Za příklady: ⭐ ${s.base}<br>Dokončení sady: ⭐ 15${s.perfect?'<br>Všechno správně: 🎁 truhla':''}</p><h2 style="color:var(--pri)">Celkem +${s.pts} bodů</h2>`:`
      <p style="font-size:19px">Za příklady: ⭐ ${s.base}<br>Splnění dne: ⭐ 30${s.perfect?'<br>Všechno správně: ⭐ 30':''}${s.streakBonus?`<br>Série ${p.streak} dní: ⭐ 10`:''}</p>
      <h2 style="color:var(--pri)">Celkem +${s.pts} bodů</h2>`}
      ${p.chests&&p.chests.length?`<div style="max-width:170px;margin:6px auto" class="${'pop'}">${chestSVG(p.chests[0])}</div><button class="btn gold" data-chest="1" style="font-size:20px">🎁 Otevřít ${p.chests[0]==='gold'?'zlatou ':''}truhlu!</button>`:''}
      ${funSummaryHTML(p,s)}
      ${s.lvlUp?`<p style="font-size:20px">🎉 Nová úroveň ${level(p)}! Máš víc síly a životů.</p>`:''}
      ${s.wrong.length?`<div style="text-align:left;margin:14px auto;max-width:420px"><b>Na tyhle si dej pozor:</b><ul>${s.wrong.map(w=>`<li>${w}</li>`).join('')}</ul></div>`:''}
      <div class="row" style="justify-content:center;margin-top:10px">${subjectsOf(p).length>1 ? subjectsOf(p).map(s=>`<button class="btn small" data-playsubj="${s}">➕ ${SUBJECTS[s].icon} ${SUBJECTS[s].name}</button>`).join('') : `<button class="btn" data-act="play">➕ Dalších ${S.settings.perDay||10} úloh</button>`}</div><div class="row" style="justify-content:center;margin-top:10px"><button class="btn gold" data-act="hero">🛍️ Obchod</button><button class="btn red" data-act="map">${modeOf(p).mapTitle}</button></div>
    </div>`;
}

/* ---- map / pre-fight ---- */
function analysisHTML(p, mi){
  const a=analyze(p,mi), m=a.m, st=a.st, M=modeOf(p), RW=M.roundsW;
  let cls, txt;
  if(a.spare>=2){ cls='good'; txt=`💪 Máš dobrou šanci! Potřebuješ <b>${a.hits}</b> správných odpovědí a vydržíš <b>${a.rounds}</b> ${plural(a.rounds,RW[0],RW[1],RW[2])}. Můžeš udělat až ${a.spare} ${plural(a.spare,'chybu','chyby','chyb')}.`; }
  else if(a.spare>=0){ cls='tight'; txt = a.spare===0 ? `😬 Bude to hodně těsné – nesmíš udělat ani jednu chybu! (${a.hits} zásahů, vydržíš ${a.rounds} ${plural(a.rounds,RW[0],RW[1],RW[2])})` : `😬 Těsné! Můžeš udělat jen 1 chybu. (${a.hits} zásahů, vydržíš ${a.rounds} ${plural(a.rounds,RW[0],RW[1],RW[2])})`; }
  else {
    cls='bad';
    const atkNeed=Math.ceil(m.hp/a.rounds)+m.def;
    txt=`⛔ Na tohle jsi zatím ${G(p,M.weakW[0],M.weakW[1])}. Potřebuješ ${a.hits} správných odpovědí, ale vydržíš jen ${a.rounds} ${plural(a.rounds,RW[0],RW[1],RW[2])} – nepovede se to ani bez chyby.`;
    if(st.atk<=m.def) txt+=`<br>${M.st[0][1]} ${M.st[0][0]} musí být vyšší než ${m.def}!`;
    else txt+=`<br>Pomůže vyšší ${M.st[0][1].toLowerCase()} ${M.st[0][0]} (aspoň ${atkNeed}, teď máš ${st.atk}), nebo víc ${M.st[1][0]} a ${M.st[2][0]}.`;
  }
  return `<div class="analysis ${cls}">${txt}</div><div class="sub" style="margin-top:8px">💡 Tip: ${tipFor(p,mi)}.</div>`;
}
function mapView(){
  const p=prof(view.pid);
  const sel = view.sel;
  let pre='';
  if(sel!==undefined && sel!==null){
    const M=modeOf(p), m=foesOf(p)[sel], a=analyze(p,sel), beaten = sel<p.beaten;
    pre=`<div class="card" style="margin-bottom:16px"><div class="grid2">
      <div class="center"><div class="prestage">${foeScene(p,sel)}<div class="mon">${foeSVG(p,sel)}</div></div><h2 style="margin:4px 0">${sel+1}. ${m.name}</h2><div class="sub">${m.where}</div>
        <div class="stats"><div class="stat"><small>${M.fst[0][1]}</small>${M.fst[0][0]} ${m.atk}</div><div class="stat"><small>${M.fst[1][1]}</small>${M.fst[1][0]} ${m.def}</div><div class="stat"><small>${M.fst[2][1]}</small>${M.fst[2][0]} ${m.hp}</div></div></div>
      <div><b>Ty:</b> ${M.st[0][0]} ${a.st.atk} · ${M.st[1][0]} ${a.st.def} · ${M.st[2][0]} ${a.st.hp}
        <div class="sub" style="margin-top:6px">${M.explain(a.myDmg,a.monDmg)}</div>
        ${analysisHTML(p,sel)}
        ${beaten?'<p class="sub">Tohle už máš splněné – můžeš si to zopakovat, ale odměnu už nedostaneš.</p>':`<p class="sub">Odměna za vítězství: ⭐ ${bounty(sel)}${sel===REWARD_AT?' + velká odměna od rodičů!':sel===FOE_N-1?' + legendární odměna'+(reward2Of(p)?' od rodičů':' a 3 zlaté truhly')+'!':''}</p>`}
        <div class="row"><button class="btn red" data-fight="${sel}" style="font-size:20px">${M.fightBtn}</button><button class="btn sec" data-act="hero">🛍️ Obchod</button></div>
      </div></div></div>`;
  }
  const M=modeOf(p);
  const cards = foesOf(p).map((m,i)=>{
    const locked=i>p.beaten, beaten=i<p.beaten, next=i===p.beaten;
    return `<div class="mcard ${locked?'locked':''} ${beaten?'beaten':''} ${next?'next':''}" ${locked?'':`data-sel="${i}"`}>
      <span class="num">${i+1}.</span>${beaten?'<span class="badge">✅</span>':locked?'<span class="badge">🔒</span>':''}
      <div class="mpic">${foeScene(p,i)}<div class="mon">${foeSVG(p,i)}</div></div><div><b>${locked?'???':m.name}</b></div><div class="sub">${locked?'Nejdřív splň předchozí':`${M.fst[0][0]}${m.atk} ${M.fst[1][0]}${m.def} ${M.fst[2][0]}${m.hp}`}</div></div>`;
  }).join('');
  return `<div class="top"><button class="btn sec small" data-act="hero">← ${esc(p.name)}</button><h1>${M.mapTitle}</h1><span class="pill">⭐ ${p.points}</span></div>
    ${testBanner(p)}${pre}
    <p class="muted" style="margin-top:0">${M.goal}</p>
    <div class="mapgrid">${cards}</div>`;
}

/* ---- battle ---- */
function battleView(){
  const p=prof(view.pid), b=view.b, m=foesOf(p)[b.mi], st=stats(p), M=modeOf(p);
  return `<div class="top"><button class="btn sec small" data-act="flee">🏃 Utéct</button><h1 class="center">Kolo ${b.round}</h1><span class="pill">${m.name}</span></div>
    <div class="arena">${foeScene(p,b.mi)}
      <div class="fighter" id="fh">${p.mode==='home'?kidSVG(p):avatarSVG(p)}<div class="nm">${esc(p.mode==='pet'?(p.petName||p.name):p.name)}</div><div class="bar hp"><i id="hhp" style="width:${b.hp/b.maxHp*100}%"></i></div><div class="sub" id="hhpt">${M.st[2][0]} ${b.hp}/${b.maxHp}</div></div>
      <div class="vs">VS</div>
      <div class="fighter" id="fm">${foeSVG(p,b.mi)}<div class="nm">${p.mode==='pet'?m.where.replace('Soupeř: ',''):m.name}</div><div class="bar mhp"><i id="mhp" style="width:${b.mhp/m.hp*100}%"></i></div><div class="sub" id="mhpt">${M.fst[2][0]} ${b.mhp}/${m.hp}</div></div>
    </div>
    <div class="card" id="pcard" style="margin-top:12px">
      <div class="sub center">${M.line(Math.max(1,st.atk-m.def), Math.max(1,m.atk-st.def))}</div>
      ${probHTML(b.pr)}${inputHTML(b.pr).replace(/<div class="(pad|cmpbtns|choices)/,'<div class="fb" id="fb"></div><div class="$1')}
    </div>`;
}
function battleEndView(){
  const p=prof(view.pid), e=view.e, m=foesOf(p)[e.mi], M=modeOf(p);
  if(e.win){
    const dragon = e.mi===REWARD_AT || e.mi===FOE_N-1;
    return `<div class="top"><h1>${M.winTitle(dragon)}</h1></div>
      <div class="${dragon?'reward':'card'} center">
        <div style="max-width:180px;margin:0 auto;${p.mode==='quest'?'opacity:.5;transform:rotate(-8deg)':''}">${foeSVG(p,e.mi)}</div>
        <h2>${M.winText(p,m)} ${dragon?'🏆':'🎉'}</h2>
        <p style="font-size:18px">Správně: ${e.hits} · Chyb: ${e.miss}</p>
        ${e.first&&e.gold?`<p style="font-size:20px">Odměna: ⭐ ${e.gold}</p>`:''}
        ${e.mi===REWARD_AT&&e.first?`<p style="font-size:22px">🎁 Tvoje odměna od rodičů: <b>${esc(rewardOf(p))}</b></p><p>Ukaž tuhle obrazovku mamce nebo taťkovi! A pokračuj – čeká tě ještě 5 legendárních výzev!</p>`:''}${e.mi===FOE_N-1&&e.first?`<p style="font-size:22px">🌟 Jsi LEGENDA! ${reward2Of(p)?`Odměna od rodičů: <b>${esc(reward2Of(p))}</b>`:'K tomu 3 zlaté truhly!'}</p>`:''}
        ${e.first?`<p style="font-size:18px">A k tomu truhla! 🎁</p><button class="btn gold" data-chest="1" style="margin-bottom:12px">🎁 Otevřít truhlu</button>`:''}
        ${e.mi<FOE_N-1&&e.first?`<p>Odemklo se další: <b>${foesOf(p)[e.mi+1].name}</b> 🔓</p>`:''}
        <div class="row" style="justify-content:center"><button class="btn" data-act="map">${M.mapTitle}</button><button class="btn gold" data-act="hero">🛍️ Obchod</button></div>
      </div>`;
  }
  return `<div class="top"><h1>Tentokrát to nevyšlo…</h1></div>
    <div class="card center">
      <div style="max-width:180px;margin:0 auto">${foeSVG(p,e.mi)}</div>
      <h2>${M.loseText(p,m)}</h2>
      <p style="font-size:18px">Správně: ${e.hits} · Chyb: ${e.miss} · Zbývalo ${M.fst[2][0]} ${e.mhp}</p>
      ${analysisHTML(p,e.mi)}
      <p>Počítej dál, získej body a kup si lepší věci – nebo to zkus znovu a dej si pozor na chyby!</p>
      <div class="row" style="justify-content:center"><button class="btn red" data-fight="${e.mi}">🔁 Zkusit znovu</button><button class="btn gold" data-act="hero">🛍️ Obchod</button><button class="btn sec" data-act="play">🧮 Počítat</button></div>
    </div>`;
}

/* ---- parent ---- */
function heroEditHTML(p){
  const mySubs=subjectsOf(p), half=halfOf(p), mix=p.mix||{}, weak=weakCats(p,1);
  const rateTag=k=>{ const r=(p.cst||{})[k]; if(!r||r[1]<3) return ''; const pc=Math.round(r[0]/r[1]*100);
    return ` <span class="cstat ${weak.includes(k)?'weak':pc>=90?'good':''}" title="úspěšnost napoprvé">${weak.includes(k)?'⚠️ ':pc>=90?'✅ ':''}${pc} %</span>`; };
  const cats=Object.entries(SUBJECTS).map(([sk,S_])=>{
    const rec=defaultCats(+p.grade||0,[sk],half);
    const list=Object.entries(CATS).filter(([k,c])=>(c.subj||'m')===sk).sort((a,b)=>(a[1].grade||0)-(b[1].grade||0));
    const grp={}; for(const [k,c] of list){ const g=Math.min(4,c.grade||0); (grp[g]=grp[g]||[]).push([k,c]); }
    let rows='';
    for(const g of Object.keys(grp).map(Number).sort((a,b)=>a-b)){ const items=grp[g], open=items.some(([k])=>(p.cats||[]).includes(k)||rec.includes(k)) || g===Math.min(4,+p.grade||0);
      rows+=`<details class="cgrpd" ${open?'open':''}><summary class="cgrp">${g===0?'Předškoláci a všichni':g>=4?'Od 4. třídy':g+'. třída'} <span class="muted">(${items.length})</span></summary>`+
        items.map(([k,c])=>`<label class="chk"><input type="checkbox" data-cat="${k}" ${(p.cats||[]).includes(k)?'checked':''}> ${c.label}${rec.includes(k)?' <span class="crec" title="doporučeno pro ročník a pololetí">⭐</span>':''}${rateTag(k)}</label>`).join('')+`</details>`; }
    return `<div class="subjbox"><div class="row" style="align-items:center;justify-content:space-between;gap:6px"><label class="chk" style="font-size:17px"><input type="checkbox" data-subjon="${sk}" ${mySubs.includes(sk)?'checked':''}> <b>${S_.icon} ${S_.name}</b></label>
      <select data-mix="${sk}" title="kolik otázek z tohoto předmětu" style="font-size:14px">${[[1,'méně otázek'],[2,'normálně'],[3,'víc otázek']].map(([v,l])=>`<option value="${v}" ${(+mix[sk]||2)===v?'selected':''}>${l}</option>`).join('')}</select></div>
      <div style="padding-left:26px">${rows}</div></div>`; }).join('');
  return `<div class="grid2"><div>
    <div class="field"><label>Jméno</label><input type="text" id="p-name" value="${esc(p.name)}"></div>
    <div class="row"><div class="field" style="flex:1"><label>Ročník</label><select id="p-grade">${[0,1,2,3,4,5].map(g=>`<option value="${g}" ${p.grade==g?'selected':''}>${gl(g)}</option>`).join('')}</select></div>
      <div class="field" style="flex:1"><label>Postava</label><select id="p-gender"><option value="m" ${p.gender!=='f'?'selected':''}>Hrdina</option><option value="f" ${p.gender==='f'?'selected':''}>Hrdinka</option></select></div></div>
    <div class="field"><label>Pololetí (určuje obtížnost a doporučená témata ⭐)</label><select id="p-diff">
      <option value="auto" ${p.diff!=='easy'&&p.diff!=='normal'?'selected':''}>Automaticky podle data (teď ${halfOf({})}. pololetí)</option>
      <option value="easy" ${p.diff==='easy'?'selected':''}>1. pololetí (září–leden) – lehčí, v 1. třídě čísla do 10</option>
      <option value="normal" ${p.diff==='normal'?'selected':''}>2. pololetí (únor–červen) – v 1. třídě čísla do 20</option></select></div>
    <label class="chk" style="margin:-4px 0 10px"><input type="checkbox" id="p-weak" ${p.weakOff?'':'checked'}> Častěji procvičovat témata, ve kterých dělá chyby (pod 75 % ⚠️)</label>
    <div class="field"><label>Barva oblečku</label><div class="row colors">${TUNICS.map(c=>`<button data-color="${c}" style="background:${c};border:${p.color===c?'4px solid #2b2340':'2px solid #fff'}"></button>`).join('')}</div></div>
    <div class="field"><label>Tajný kód hrdiny (prázdné = bez kódu)</label><input type="text" id="p-pin" inputmode="numeric" maxlength="4" value="${esc(p.pin||'')}"></div>
    <div class="field"><label>Dobrodružství (změna vynuluje body a postup)</label><select id="p-mode">${Object.values(MODES).map(M=>`<option value="${M.key}" ${(p.mode||'quest')===M.key?'selected':''}>${M.icon} ${M.title}</option>`).join('')}</select></div>
    ${p.mode==='pet'?`<div class="row"><div class="field" style="flex:1"><label>Zvířátko</label><select id="p-species">${SPECIES.map(s=>`<option value="${s.id}" ${p.species===s.id?'selected':''}>${s.name}</option>`).join('')}</select></div><div class="field" style="flex:1"><label>Jméno zvířátka</label><input type="text" id="p-petname" value="${esc(p.petName||'')}"></div></div>`:''}
    <div class="field"><label>Odměna za splnění celého dobrodružství (prázdné = výchozí: „${esc(S.settings.reward)}“)</label><input type="text" id="p-reward" value="${esc(p.reward||'')}"></div>
    <div class="field"><label>Co procvičovat (⭐ = probírá se v tomto ročníku a pololetí podle učebnic, % = úspěšnost napoprvé). Změna platí od zítřka, nebo hned po „Vygenerovat dnešek znovu“.</label>${cats}</div>
    <div class="row"><button class="btn ok small" data-act="saveprofile">Uložit</button><button class="btn sec small" data-act="defcats">⭐ Podle ročníku a pololetí</button><button class="btn sec small" data-act="regen">Vygenerovat dnešek znovu</button></div>
  </div><div>
    <div class="card center" style="padding:10px"><div class="stage">${avatarSVG(p)}</div><div>⭐ ${p.points} · úroveň ${level(p)} · ${modeOf(p).icon} ${p.beaten}/${FOE_N}</div></div>
    <div class="field"><label>Přidat / ubrat body (např. bonus za úkol)</label><div class="row"><input type="number" id="p-bonus" value="20" style="width:110px"><button class="btn small" data-act="bonus">Připsat</button></div></div>
    <div class="row" style="margin-top:8px">
      ${p.beaten>REWARD_AT && !p.rewardClaimed ? `<button class="btn gold small" data-act="claimed">🎁 Odměna předána</button>`:''}
      <button class="btn sec small" data-act="newseason">🔄 Nová výprava</button>
      <button class="btn sec small" data-act="delhero" style="color:#a8322a">🗑️ Smazat hrdinu</button>
    </div>
    <p class="muted" style="font-size:13px">Nová výprava vynuluje body, věci, úroveň a postup. Historie zůstane.</p>
  </div></div>`;
}
function parentView(){
  if(!parentOk) return `<div class="top"><button class="btn sec small" data-act="home">← Zpět</button><h1>Rodičovská sekce</h1></div>
    <div class="card" style="max-width:380px;margin:0 auto"><div class="field"><label>Zadej PIN</label><input type="password" id="pin" inputmode="numeric" maxlength="8" autocomplete="off"></div>
    <button class="btn" data-act="pinok">Vstoupit</button><p class="muted" style="font-size:14px">Výchozí PIN je 1234 – po přihlášení si ho změňte.</p></div>`;
  const tabs=[['settings','Nastavení'],['heroes','Hrdinové'],['report','📊 Týdenní zpráva'],['history','Historie'],['test','🧪 Testování'],['backup','Záloha']];
  let body='';
  if(parentTab==='settings'){
    body=`<div class="field"><label>Výchozí odměna za splnění celého dobrodružství</label><input type="text" id="s-reward" value="${esc(S.settings.reward)}"></div>
      <div class="field"><label>Odměna za legendární konec (15. soupeř) – nepovinné; když je prázdné, dítě dostane 3 zlaté truhly</label><input type="text" id="s-reward2" value="${esc(S.settings.reward2||'')}"></div>
      <div class="field"><label>Délka dobrodružství (jak rychle se dá dojít na konec)</label><select id="s-len">
        <option value="short" ${S.settings.length==='short'?'selected':''}>Krátká – zhruba 2 týdny</option>
        <option value="mid" ${S.settings.length==='mid'?'selected':''}>Střední – zhruba 3–4 týdny</option>
        <option value="long" ${S.settings.length==='long'?'selected':''}>Dlouhá – zhruba 6 týdnů</option></select></div>
      <div class="field"><label>Počet příkladů denně</label><input type="number" id="s-per" min="5" max="40" value="${S.settings.perDay||20}"></div>
      <div class="field"><label>Nový rodičovský PIN (prázdné = beze změny)</label><input type="text" id="s-pin" inputmode="numeric" maxlength="8"></div>
      <div class="field"><label>👨‍👩‍👧‍👦 Rodinný cíl na měsíc – kolik správných odpovědí mají děti nasbírat dohromady (0 = vypnuto)</label><input type="number" id="s-fgoal" min="0" max="10000" value="${familyCfg().goal}"></div>
      <div class="field"><label>Odměna za rodinný cíl</label><input type="text" id="s-freward" value="${esc(familyCfg().reward||'')}"></div>
      <button class="btn ok" data-act="savesettings">Uložit nastavení</button>`;
  } else if(parentTab==='heroes'){
    const hs=heroes(); if(!parentHero || !prof(parentHero) || prof(parentHero).deleted) parentHero = hs[0] && hs[0].id;
    body = hs.length ? `<div class="field"><label>Hrdina</label><select id="p-sel">${hs.map(p=>`<option value="${p.id}" ${p.id===parentHero?'selected':''}>${esc(p.name)} (${gs(p.grade)}, ${modeOf(p).icon} ${p.beaten}/${FOE_N})</option>`).join('')}</select></div>${heroEditHTML(prof(parentHero))}` : '<p>Zatím žádní hrdinové.</p>';
  } else if(parentTab==='report'){
    body=reportHTML();
  } else if(parentTab==='history'){
    body = heroes().map(p=>{
      const keys=Object.keys(p.history||{}).sort().reverse().slice(0,21);
      const rows=keys.map(k=>{const h=p.history[k]; return `<tr><td>${k.split('-').reverse().join('. ')}</td><td>${h.c}/${h.n}</td><td>+${h.pts}</td><td class="muted" style="font-size:13px">${(h.wrongCats||[]).map(c=>CATS[c]?CATS[c].label:c).join(', ')}</td></tr>`;}).join('');
      return `<h3>${esc(p.name)} <span class="muted" style="font-size:15px">· ${gl(p.grade)} · správně celkem ${p.totalCorrect} · ${modeOf(p).icon} ${p.beaten}/${FOE_N}</span></h3>${rows?`<table class="hist"><tr><th>Den</th><th>Správně</th><th>Body</th><th>Kde chyboval</th></tr>${rows}</table>`:'<p class="muted">Zatím žádné dokončené dny.</p>'}`;}).join('') + `<p class="muted" style="font-size:13px">Podrobný přehled je i ve vaší Google tabulce na listu „Výsledky“.</p>`;
  } else if(parentTab==='test'){
    body=`<p>Vyzkoušejte si hru sami. Testovací hrdina se ukládá jen v tomto prohlížeči, nezobrazuje se dětem a nic neposílá do výsledků. V testu máte tlačítka na přidání bodů, úrovní a odemčení všech výzev.</p>
      <div class="row"><div class="field"><label>Ročník příkladů</label><select id="t-grade">${[0,1,2,3,4,5].map(g=>`<option value="${g}" ${(TEST?TEST.grade:2)==g?'selected':''}>${gl(g)}</option>`).join('')}</select></div>
      <div class="field"><label>Postava</label><select id="t-gender"><option value="m">Hrdina</option><option value="f" ${TEST&&TEST.gender==='f'?'selected':''}>Hrdinka</option></select></div>
      <div class="field"><label>Dobrodružství</label><select id="t-mode">${Object.values(MODES).map(M=>`<option value="${M.key}" ${TEST&&TEST.mode===M.key?'selected':''}>${M.icon} ${M.title}</option>`).join('')}</select></div>
      <div class="field"><label>Zvířátko (pro 🐾)</label><select id="t-species">${SPECIES.map(s=>`<option value="${s.id}" ${TEST&&TEST.species===s.id?'selected':''}>${s.name}</option>`).join('')}</select></div></div>
      <div class="row">${TEST?'<button class="btn" data-act="t-open">▶️ Pokračovat s testovacím hrdinou</button>':''}<button class="btn ${TEST?'sec':''}" data-act="t-new">🧪 ${TEST?'Nový testovací hrdina':'Spustit testovacího hrdinu'}</button></div>`;
  } else if(parentTab==='backup'){
    body=`<p>Postup se ukládá automaticky do vaší Google tabulky. Pro jistotu si můžete zkopírovat zálohu.</p>
      <textarea id="bk" style="width:100%;height:120px;font-family:monospace;font-size:12px;border:2px solid var(--line);border-radius:12px;padding:8px">${esc(btoa(unescape(encodeURIComponent(JSON.stringify(S)))))}</textarea>
      <div class="row"><button class="btn small" data-act="copybk">Kopírovat</button><button class="btn sec small" data-act="importbk">Načíst vložený kód</button></div>`;
  }
  return `<div class="top"><button class="btn sec small" data-act="home">← Zpět</button><h1>Rodičovská sekce</h1><button class="btn sec small" data-act="lock">🔒 Zamknout</button></div>
    <div class="tabs">${tabs.map(([k,l])=>`<button class="${parentTab===k?'on':''}" data-tab="${k}">${l}</button>`).join('')}</div>
    <div class="card">${body}</div>`;
}

/* ============ Interaction ============ */
function confirmBox(text, cb){
  const m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="card center"><p style="font-size:18px">${text}</p><div class="row" style="justify-content:center"><button class="btn" id="mok">Ano</button><button class="btn sec" id="mno">Zrušit</button></div></div>`;
  document.body.appendChild(m);
  m.querySelector('#mok').onclick=()=>{m.remove(); cb();};
  m.querySelector('#mno').onclick=()=>m.remove();
}
function pinBox(text, cb){
  const m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="card center"><p style="font-size:18px">${text}</p><input type="password" class="ans sm" id="mpin" inputmode="numeric" maxlength="4" autocomplete="off" style="margin:6px auto"><div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="mok">OK</button><button class="btn sec" id="mno">Zrušit</button></div></div>`;
  document.body.appendChild(m);
  const inp=m.querySelector('#mpin'); inp.focus();
  const ok=()=>{ const v=inp.value; m.remove(); cb(v); };
  m.querySelector('#mok').onclick=ok; inp.onkeydown=e=>{ if(e.key==='Enter') ok(); };
  m.querySelector('#mno').onclick=()=>m.remove();
}
function showChest(){
  const p=prof(view.pid); if(!p || !p.chests || !p.chests.length) return;
  const kind=p.chests[0];
  const m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="card center"><div id="chbox" style="max-width:220px;margin:0 auto" class="shake">${chestSVG(kind)}</div><p id="chtxt" style="font-size:20px">Otevírám…</p><div id="chbtn"></div></div>`;
  document.body.appendChild(m);
  const box=m.querySelector('#chbox'); let n=0;
  const iv=setInterval(()=>{ box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); if(++n>=2) clearInterval(iv); },380);
  setTimeout(()=>{
    const r=openChestFor(p); save();
    box.innerHTML=chestSVG(kind,true);
    m.querySelector('#chtxt').innerHTML = r.item
      ? `<div style="font-size:26px">✨ ${r.item[0]} ✨</div><div class="muted">${r.slot} · ${itemStatText(r.item)}</div><p style="font-size:16px">Najdeš ho v batohu – klikni na něj a nasaď si ho!</p>`
      : `<div style="font-size:30px">⭐ +${r.points} bodů</div>`;
    m.querySelector('#chbtn').innerHTML=`<button class="btn ok">Super!</button>`;
    m.querySelector('#chbtn button').onclick=()=>{ m.remove(); render(); };
    confetti(r.kind==='gold'?50:25);
  }, 1200);
}
function startExtra(subj){
  const p=prof(view.pid); if(!p) return; ensureToday(p);
  if(!p.extraSet || p.extraSet.date!==todayKey() || p.extraSet.subj!==subj || p.extraSet.idx===0){
    p.extraSet={date:todayKey(),subj,idx:0,tries:0,res:[],problems:genDaily(p,todayKey()+'-extra-'+Date.now(),S.settings.perDay||10,subj),pts:0,wrong:[]}; save(); }
  go({name:'play',pid:p.id,practice:p.extraSet,lvlStart:level(p)});
}
function openHero(id){
  const p=prof(id); if(!p) return;
  if(p.pin && !unlocked.has(p.id)){
    pinBox(`🔒 Zadej tajný kód pro ${esc(p.name)}`, v=>{ if(v===String(p.pin)){ unlock(p.id); go({name:'hero',pid:p.id}); } else toast('Špatný kód. Zeptej se rodičů, pokud ho nevíš.'); });
  } else go({name:'hero',pid:p.id});
}
function readDraft(){ if(!draft) return; const pn=$('#c-petname'); if(pn) draft.petName=pn.value; const n=$('#c-name'), g=$('#c-grade'), pin=$('#c-pin'), r=$('#c-reward'); if(n) draft.name=n.value; if(g) draft.grade=+g.value; if(pin) draft.pin=pin.value.replace(/\D/g,''); if(r) draft.reward=r.value; }

function bind(){
  document.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>openHero(el.dataset.open));
  document.querySelectorAll('[data-act]').forEach(el=>el.onclick=e=>{ e.stopPropagation(); act(el.dataset.act); });
  document.querySelectorAll('[data-buy]').forEach(el=>el.onclick=()=>buy(el.dataset.buy));
  document.querySelectorAll('[data-eq]').forEach(el=>el.onclick=()=>equip(...el.dataset.eq.split(':')));
  document.querySelectorAll('[data-sel]').forEach(el=>el.onclick=()=>{ view.sel=+el.dataset.sel; render(); window.scrollTo({top:0,behavior:'smooth'}); });
  document.querySelectorAll('[data-chest]').forEach(el=>el.onclick=()=>showChest());
  document.querySelectorAll('[data-fight]').forEach(el=>el.onclick=()=>startBattle(+el.dataset.fight));
  document.querySelectorAll('[data-tab]').forEach(el=>el.onclick=()=>{parentTab=el.dataset.tab; render();});
  document.querySelectorAll('[data-color]').forEach(el=>el.onclick=()=>{ const p=prof(parentHero); p.color=el.dataset.color; save(); render(); });
  document.querySelectorAll('[data-gender]').forEach(el=>el.onclick=()=>{ readDraft(); draft.gender=el.dataset.gender; render(); });
  document.querySelectorAll('[data-mode]').forEach(el=>el.onclick=()=>{ readDraft(); draft.mode=el.dataset.mode; render(); });
  document.querySelectorAll('[data-species]').forEach(el=>el.onclick=()=>{ readDraft(); draft.species=el.dataset.species; render(); });
  document.querySelectorAll('[data-subjon]').forEach(el=>el.onchange=()=>{ const box=el.closest('.subjbox'); if(!box) return; const cs=[...box.querySelectorAll('[data-cat]')]; if(!el.checked) cs.forEach(x=>x.checked=false); else if(!cs.some(x=>x.checked)){ const dv=($('#p-diff')||{}).value; const d=defaultCats(+($('#p-grade')||{}).value||0,[el.dataset.subjon], halfOf({diff:dv})); cs.forEach(x=>x.checked=d.includes(x.dataset.cat)); } });
  document.querySelectorAll('.subjbox [data-cat]').forEach(el=>el.onchange=()=>{ const sb=el.closest('.subjbox').querySelector('[data-subjon]'); const any=[...el.closest('.subjbox').querySelectorAll('[data-cat]')].some(x=>x.checked); sb.checked=any; });
  document.querySelectorAll('[data-playsubj]').forEach(el=>el.onclick=()=>startExtra(el.dataset.playsubj));
  document.querySelectorAll('[data-subj]').forEach(el=>el.onclick=()=>{ readDraft(); const s=el.dataset.subj; draft.subjects=draft.subjects||['m']; if(draft.subjects.includes(s)){ if(draft.subjects.length>1) draft.subjects=draft.subjects.filter(x=>x!==s); } else draft.subjects.push(s); render(); });
  document.querySelectorAll('[data-feed]').forEach(el=>el.onclick=()=>feed(el.dataset.feed));
  document.querySelectorAll('[data-ccolor]').forEach(el=>el.onclick=()=>{ readDraft(); draft.color=el.dataset.ccolor; render(); });
  const psel=$('#p-sel'); if(psel) psel.onchange=()=>{ parentHero=psel.value; render(); };
  if(view.name==='play' || view.name==='battle' || view.name==='timed' || view.name==='duel'){
    document.querySelectorAll('[data-k]').forEach(el=>el.onclick=()=>key(el.dataset.k));
    document.querySelectorAll('[data-cmp]').forEach(el=>el.onclick=()=>submit(el.dataset.cmp));
    document.querySelectorAll('[data-choice]').forEach(el=>el.onclick=()=>{ if(el.disabled||busy) return;
      // dotykový displej + předčítání: 1. klepnutí odpověď přečte, 2. klepnutí ji zvolí (u odpovědí se slovy)
      const pr=curProblem(), txt=cleanSpeech(el.innerText);
      if(TOUCH && readOn() && /[a-zá-ž]/i.test(txt) && !(pr&&pr.lang) && !el.classList.contains('armed')){ document.querySelectorAll('.choice.armed').forEach(x=>x.classList.remove('armed')); el.classList.add('armed'); speak(txt); return; }
      lastChoice=el; submit(+el.dataset.choice); });
    document.querySelectorAll('[data-say]').forEach(el=>el.onclick=()=>{ const pr=curProblem(); if(pr) speak(sayText(pr), pr.lang); });
    // klepnutí na zadání ho přečte (hlavně pro telefony a tablety)
    document.querySelectorAll('#app .prob, #app .pic0').forEach(el=>{ el.style.cursor='pointer'; el.addEventListener('click',e=>{ if(e.target.closest('button,input')) return; const pr=curProblem(); if(pr) speak(sayText(pr), pr.lang); }); });
    { const pr=curProblem(), pp=prof(view.pid); if(pr && !pr.noAuto && ((pr.type==='choice' && pr.say && (pr.lang || (pp&&+pp.grade<=1))) || readOn()) && pr!==lastSpoken){ lastSpoken=pr; setTimeout(()=>speak(sayText(pr), pr.lang),250); } }
    document.querySelectorAll('.ans').forEach(el=>{
      el.onfocus=()=>{ document.querySelectorAll('.ans').forEach(x=>x.classList.remove('active')); el.classList.add('active'); };
      el.oninput=()=>{ el.value=el.value.replace(/[^\d]/g,''); };
      el.onkeydown=e=>{ if(e.key==='Enter'){ e.preventDefault(); key('ok'); } };
    });
    const a1=$('#a1'); if(a1 && matchMedia('(pointer:fine)').matches) a1.focus();
  }
  if(view.name==='parent' && !parentOk){ const pin=$('#pin'); if(pin){ pin.focus(); pin.onkeydown=e=>{ if(e.key==='Enter') act('pinok'); }; } }
}

let busy=false;
function curProblem(){ if(view.name==='battle') return view.b.pr; const t=view.practice || prof(view.pid).today; return t && t.problems[t.idx]; }
function key(k){
  const pr=curProblem(); if(!pr || busy) return;
  if(k==='ok'){
    if(pr.type==='rem'){ const a=$('#a1').value, b=$('#a2').value; if(a===''||b===''){ (a===''?$('#a1'):$('#a2')).focus(); return;} submit([+a,+b]); }
    else { const v=$('#a1').value; if(v==='') return; submit(+v); }
    return;
  }
  const inp=document.querySelector('.ans.active') || $('#a1'); if(!inp) return;
  if(k==='del') inp.value=inp.value.slice(0,-1);
  else if(inp.value.length < (+inp.maxLength||6)) inp.value+=k;
}
let lastChoice=null, lastSpoken=null;
function isCorrect(pr,val){ if(pr.type==='choice') return val===pr.a; return pr.type==='rem' ? (val[0]===pr.a[0] && val[1]===pr.a[1]) : val===pr.a; }
function shownAnswer(pr){ if(pr.type==='choice') return `<span class="inlinechoice">${pr.options[pr.a]}</span>`; return pr.type==='rem' ? `${pr.a[0]} zbytek ${pr.a[1]}` : pr.type==='cmp' ? pr.a : fmt(pr.a); }
function submit(val){ if(view.name==='battle') battleAnswer(val); else answer(val); }
function setFb(cls, html){ const fb=$('#fb'); if(fb){ fb.className='fb '+cls; fb.innerHTML=html; } }

/* ---- daily practice ---- */
function answer(val){
  if(busy) return;
  const p=prof(view.pid), t=view.practice || p.today, pr=t.problems[t.idx];
  const card=$('#pcard');
  if(isCorrect(pr,val)){
    const r = t.tries ? 1 : 2; t.res[t.idx]=r;
    const gain = r===2?7:3;
    p.xp=(p.xp||0)+1;
    p.points+=gain; t.pts+=gain; p.totalCorrect++;
    setFb('ok', pick(['Správně! 🎉','Výborně! ⭐','Paráda! 💪','Super! 🚀','Přesně tak! ✨']) + (gain?`  +${gain}`:''));
    card.classList.add('pop'); next(t, 650);
  } else if(!t.tries){
    t.tries=1; setFb('bad','Ještě jednou – zkus to znovu 🙂');
    if(pr.type==='choice' && lastChoice){ lastChoice.disabled=true; lastChoice.classList.add('wrong'); speak('Zkus to ještě jednou.'); }
    card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
    document.querySelectorAll('.ans').forEach(i=>i.value=''); const a1=$('#a1'); if(a1){ document.querySelectorAll('.ans').forEach(x=>x.classList.remove('active')); a1.classList.add('active'); if(matchMedia('(pointer:fine)').matches) a1.focus(); }
    save();
  } else {
    t.res[t.idx]=0; setFb('bad', `Správně je <b>${shownAnswer(pr)}</b>. Příště to dáš!`);
    (t.wrong = t.wrong||[]).push({q:pr.q, a:shownAnswer(pr), cat:pr.cat});
    next(t, 2200);
  }
}
function next(t, delay){
  busy=true; save();
  setTimeout(()=>{ busy=false; t.idx++; t.tries=0;
    if(t.idx>=t.problems.length) finish(t); else { save(); render(); } }, delay);
}
function finish(t){
  const p=prof(view.pid);
  const correct=t.res.filter(r=>r>0).length, total=t.problems.length;
  const wrong=(t.wrong||[]).map(w=>`${w.q.replace(/<u>.*?<\/u>/,'?').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ')} → ${w.a}`);
  const lvlBefore = view.lvlStart||0;
  if(view.practice){
    const base=t.pts, perfect=t.res.every(r=>r===2);
    p.points+=10; t.pts+=10;
    if(perfect){ p.chests=p.chests||[]; p.chests.push('wood'); }
    const k=todayKey(); p.history=p.history||{};
    const h=p.history[k]||{c:0,n:0,pts:0,wrongCats:[]};
    h.c+=correct; h.n+=total; h.pts+=t.pts; h.extra=(h.extra||0)+1; h.wrongCats=[...new Set([...(h.wrongCats||[]),...(t.wrong||[]).map(w=>w.cat)])];
    p.history[k]=h; p.extraSet=null; save();
    logResult(p, {c:correct, n:total, pts:t.pts, wrongCats:[...new Set((t.wrong||[]).map(w=>w.cat))]});
    confetti(perfect?40:20);
    view={name:'summary',pid:p.id,sum:{practice:true,correct,total,wrong,base,pts:t.pts,perfect,lvlUp:level(p)>lvlBefore}}; render(); return; }
  const base=t.pts; let bonus=20; const perfect=t.res.every(r=>r===2);
  if(perfect) bonus+=20;
  const k=todayKey();
  if(p.lastDone && dayDiff(p.lastDone,k)===1) p.streak++; else if(p.lastDone!==k) p.streak=1;
  p.lastDone=k;
  const streakBonus=p.streak>=3; if(streakBonus) bonus+=10;
  p.points+=bonus; t.pts+=bonus; t.done=true;
  p.chests=p.chests||[]; p.chests.push(perfect?'gold':'wood');
  p.history=p.history||{};
  p.history[k]={c:correct,n:total,pts:t.pts,wrongCats:[...new Set((t.wrong||[]).map(w=>w.cat))]};
  const hk=Object.keys(p.history).sort(); while(hk.length>90) delete p.history[hk.shift()];
  save(); logResult(p, p.history[k]); confetti(perfect?60:30);
  view={name:'summary',pid:p.id,sum:{correct,total,base,pts:t.pts,perfect,streakBonus,wrong,lvlUp:level(p)>lvlBefore}};
  render();
}

/* ---- gear ---- */
function buy(slot){
  const p=prof(view.pid); p.owned=p.owned||{}; const own=p.owned[slot]||0, sl=slotOf(p,slot);
  if(own>=sl.items.length) return;
  const c=price(slot,own+1,p); if(p.points<c) return;
  p.points-=c; p.owned[slot]=own+1; p.newItem=slot+':'+(own+1); save();
  toast(`🛍️ ${sl.items[own][0]} – koupeno! Klikni na to v seznamu a ${modeOf(p).equipWord}.`);
  render();
}
function equip(slot, tier){
  const p=prof(view.pid); tier=+tier; p.eq=p.eq||{};
  const sl=slotOf(p,slot), M=modeOf(p);
  if(p.eq[slot]===tier){ p.eq[slot]=0; toast(`${M.removed}: ${sl.items[tier-1][0]}`); }
  else { p.eq[slot]=tier; toast(`${M.equipped}: ${sl.items[tier-1][0]} ✨`); }
  if(p.newItem===slot+':'+tier) p.newItem=null;
  save(); render();
}

/* ---- battle ---- */
function startBattle(mi){
  const p=prof(view.pid); if(mi>p.beaten) return;
  const st=stats(p);
  go({name:'battle', pid:p.id, b:{mi, hp:st.hp, maxHp:st.hp, mhp:foesOf(p)[mi].hp, round:1, hits:0, miss:0, pr:battleProblem(p)}});
}
function anim(id, cls){ const el=document.getElementById(id); if(!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
function floatTxt(id, txt, cls=''){ const el=document.getElementById(id); if(!el) return; const d=document.createElement('div'); d.className='dmg '+cls; d.textContent=txt; el.appendChild(d); setTimeout(()=>d.remove(),1000); }
function updBars(){ const b=view.b, p=prof(view.pid), m=foesOf(p)[b.mi], M=modeOf(p);
  const h=$('#hhp'), mh=$('#mhp'); if(h) h.style.width=(b.hp/b.maxHp*100)+'%'; if(mh) mh.style.width=(b.mhp/m.hp*100)+'%';
  const ht=$('#hhpt'), mt=$('#mhpt'); if(ht) ht.textContent=`${M.st[2][0]} ${b.hp}/${b.maxHp}`; if(mt) mt.textContent=`${M.fst[2][0]} ${b.mhp}/${m.hp}`; }
function battleAnswer(val){
  if(busy) return; busy=true;
  const b=view.b, p=prof(view.pid), st=stats(p), m=foesOf(p)[b.mi], pr=b.pr, M=modeOf(p);
  const ok=isCorrect(pr,val);
  document.querySelectorAll('.pad button,.cmpbtns button').forEach(x=>x.disabled=true);
  if(ok){
    p.xp=(p.xp||0)+1;
    const d=Math.max(1, st.atk-m.def); b.mhp=Math.max(0,b.mhp-d); b.hits++;
    setFb('ok', pick(M.hit));
    anim('fh','lunge'); setTimeout(()=>{ anim('fm','hitme'); floatTxt('fm',(p.mode==='quest'?'−':'+')+d); updBars(); },200);
    if(b.mhp<=0){ setTimeout(()=>battleEnd(true),1200); return; }
  } else {
    b.miss++; setFb('bad', `${M.miss} Správně bylo <b>${shownAnswer(pr)}</b>.`); floatTxt('fm',M.missFloat,'miss');
  }
  setTimeout(()=>{
    const md=Math.max(1, m.atk-st.def); b.hp=Math.max(0,b.hp-md);
    anim('fm','lungeL'); setTimeout(()=>{ anim('fh','hitme'); floatTxt('fh','−'+md); updBars(); },200);
    if(b.hp<=0){ setTimeout(()=>battleEnd(false),1200); return; }
    setTimeout(()=>{ b.round++; b.pr=battleProblem(p); busy=false; render(); }, 900);
  }, ok?900:1700);
}
function battleEnd(win){
  busy=false;
  const p=prof(view.pid), b=view.b;
  const first = win && b.mi===p.beaten;
  let gold=0;
  if(first){ p.beaten++; gold=bounty(b.mi); p.points+=gold; if(b.mi===REWARD_AT) p.rewardClaimed=false; p.chests=p.chests||[]; p.chests.push(b.mi>=REWARD_AT?'gold':'wood'); if(b.mi===FOE_N-1 && !reward2Of(p)) p.chests.push('gold','gold'); }
  save();
  if(win) confetti(b.mi>=REWARD_AT?100:35);
  view={name:'bend', pid:p.id, e:{win, mi:b.mi, first, gold, hits:b.hits, miss:b.miss, mhp:b.mhp}};
  render(); window.scrollTo(0,0);
}

/* ---- actions ---- */
function act(a){
  const p = view.pid ? prof(view.pid) : null;
  switch(a){
  case 'home': draft=null; go({name:'home'}); break;
  case 'parent': parentOk=false; go({name:'parent'}); break;
  case 'lock': parentOk=false; go({name:'home'}); break;
  case 'create': draft=null; go({name:'create'}); break;
  case 'createok': {
    readDraft(); const name=(draft.name||'').trim();
    if(!name){ toast('Napiš své jméno 🙂'); $('#c-name').focus(); return; }
    if(draft.pin && !/^\d{4}$/.test(draft.pin)){ toast('Tajný kód musí mít 4 číslice (nebo nech prázdné).'); return; }
    if(draft.mode==='pet' && !(draft.petName||'').trim()){ toast('Vymysli jméno pro zvířátko 🐾'); return; }
    const np=newProfile({name, grade:draft.grade, gender:draft.gender, color:draft.color, pin:draft.pin, reward:(draft.reward||'').trim(), mode:draft.mode, species:draft.species, petName:(draft.petName||'').trim(), cats:defaultCats(draft.grade, draft.subjects||['m'], halfOf({}))});
    S.profiles.push(np); unlock(np.id); save(); draft=null;
    toast(`Vítej, ${np.name}! ${modeOf(np).icon}`); go({name:'hero',pid:np.id}); break; }
  case 'hero': case 'back': go({name:'hero',pid:view.pid}); break;
  case 'map': go({name:'map',pid:view.pid, sel: p && p.beaten<FOE_N ? p.beaten : null}); break;
  case 'flee': confirmBox(modeOf(p).flee, ()=>go({name:'map',pid:view.pid,sel:view.b.mi})); break;
  case 'play': {
    const t=ensureToday(p);
    if(t.done){ if(!p.extraSet || p.extraSet.date!==todayKey()){ p.extraSet={date:todayKey(),idx:0,tries:0,res:[],problems:genDaily(p,todayKey()+'-extra-'+Date.now(),S.settings.perDay||10),pts:0,wrong:[]}; save(); } go({name:'play',pid:p.id,practice:p.extraSet,lvlStart:level(p)}); }
    else go({name:'play',pid:p.id,lvlStart:level(p)});
    break; }
  // test tools
  case 't-pts': p.points+=500; save(); render(); break;
  case 't-lvl': p.xp=(p.xp||0)+(XP_PER_LEVEL[S.settings.length]||40); save(); render(); toast(`Úroveň ${level(p)}`); break;
  case 't-unlock': p.beaten=Math.max(p.beaten,FOE_N-1); save(); render(); toast('Odemčeno až po poslední výzvu'); break;
  case 't-all': slotsOf(p).forEach(sl=>{ p.owned[sl.id]=sl.items.length; p.eq[sl.id]=sl.items.length; }); p.xp=Math.max(p.xp||0,(MAX_LEVEL-1)*(XP_PER_LEVEL[S.settings.length]||40)); save(); render(); break;
  case 't-chest': p.chests=p.chests||[]; p.chests.push(Math.random()<.3?'gold':'wood'); save(); render(); break;
  case 't-reset': confirmBox('Začít s testovacím hrdinou znovu?', ()=>{ const o=TEST; TEST=newProfile({id:'test',name:o.name,grade:o.grade,gender:o.gender,color:'#1fb5c9',mode:o.mode,species:o.species,petName:o.petName}); saveLocal(); render(); }); break;
  case 't-new': { const g=+$('#t-grade').value, s=$('#t-gender').value, md=$('#t-mode').value, spc=$('#t-species').value; TEST=newProfile({id:'test',name:'Testovací '+(s==='f'?'hrdinka':'hrdina'),grade:g,gender:s,color:'#1fb5c9',mode:md,species:spc,petName:'Testík'}); saveLocal(); go({name:'hero',pid:'test'}); break; }
  case 't-open': go({name:'hero',pid:'test'}); break;
  // parent
  case 'pinok': { const v=$('#pin').value; if(v===String(S.settings.pin)){ parentOk=true; render(); } else { toast('Špatný PIN'); $('#pin').value=''; } break; }
  case 'savesettings':
    S.settings.reward=$('#s-reward').value.trim()||S.settings.reward; if($('#s-reward2')) S.settings.reward2=$('#s-reward2').value.trim();
    S.settings.length=$('#s-len').value;
    S.settings.perDay=Math.max(5,Math.min(40,parseInt($('#s-per').value)||20));
    { const np=$('#s-pin').value.trim(); if(np) S.settings.pin=np; }
    save(); toast('Uloženo ✓'); render(); break;
  case 'saveprofile': case 'defcats': case 'regen': {
    const h=prof(parentHero);
    h.name=$('#p-name').value.trim()||h.name;
    h.gender=$('#p-gender').value; { const dv=$('#p-diff').value; if(dv==='auto') delete h.diff; else h.diff=dv; }
    { const w=$('#p-weak'); if(w){ if(w.checked) delete h.weakOff; else h.weakOff=true; } }
    { const mx={}; document.querySelectorAll('[data-mix]').forEach(x=>{ if(+x.value!==2) mx[x.dataset.mix]=+x.value; }); if(Object.keys(mx).length) h.mix=mx; else delete h.mix; }
    if($('#p-species')) h.species=$('#p-species').value; if($('#p-petname')) h.petName=$('#p-petname').value.trim();
    const nm=$('#p-mode').value;
    if(nm!==(h.mode||'quest')){ confirmBox(`Změnit dobrodružství na „${MODES[nm].title}“? Body, věci a postup se vynulují.`, ()=>{ Object.assign(h,{mode:nm,points:0,xp:0,owned:{},eq:{},beaten:0,rewardClaimed:false,newItem:null,species:h.species||'cat',petName:h.petName||'Mazlíček'}); save(); render(); toast('Dobrodružství změněno'); }); return; }
    const pin=$('#p-pin').value.trim(); if(pin && !/^\d{4}$/.test(pin)){ toast('Kód musí mít 4 číslice'); return; } h.pin=pin;
    h.reward=$('#p-reward').value.trim();
    const g=+$('#p-grade').value;
    const subsOn=[...new Set([...document.querySelectorAll('[data-subjon]')].filter(x=>x.checked).map(x=>x.dataset.subjon).concat([...document.querySelectorAll('[data-cat]')].filter(x=>x.checked).map(x=>subjOf(x.dataset.cat))))]; if(!subsOn.length) subsOn.push('m');
    if(a==='defcats' || g!==+h.grade){ h.grade=g; h.cats=defaultCats(g, subsOn, halfOf(h)); }
    else {
      let c=[...document.querySelectorAll('[data-cat]')].filter(x=>x.checked).map(x=>x.dataset.cat);
      c=c.filter(k=>subsOn.includes(subjOf(k)));
      for(const s of subsOn){ if(!c.some(k=>subjOf(k)===s)) c=c.concat(defaultCats(h.grade,[s],halfOf(h))); }
      h.cats=c.length?c:defaultCats(h.grade,['m']);
    }
    if(a==='regen'){
      if(h.today && h.today.date===todayKey() && (h.today.done || h.today.idx>0)) toast('Dnešek už je rozpracovaný – změna platí od zítřka.');
      else { h.today=null; ensureToday(h); toast('Dnešní příklady vygenerovány znovu ✓'); }
    } else toast('Uloženo ✓');
    save(); render(); break; }
  case 'bonus': { const h=prof(parentHero); const v=parseInt($('#p-bonus').value)||0; h.points=Math.max(0,h.points+v); save(); toast(`${v>=0?'Připsáno':'Odečteno'} ${Math.abs(v)} bodů`); render(); break; }
  case 'claimed': { const h=prof(parentHero); h.rewardClaimed=true; save(); render(); break; }
  case 'newseason': { const h=prof(parentHero); confirmBox(`Začít novou výpravu pro ${esc(h.name)}? Body, výbava, úroveň i obludy se vynulují.`, ()=>{ Object.assign(h,{points:0,xp:0,owned:{},eq:{},beaten:0,rewardClaimed:false,newItem:null}); h.season=(h.season||1)+1; save(); render(); toast('Nová výprava začíná! 🚀'); }); break; }
  case 'delhero': { const h=prof(parentHero); confirmBox(`Opravdu smazat hrdinu ${esc(h.name)}? Tohle nejde vrátit.`, ()=>{ h.deleted=true; h.history={}; h.today=null; parentHero=null; save(); render(); toast('Smazáno'); }); break; }
  case 'copybk': { const v=$('#bk').value; try{ navigator.clipboard.writeText(v).then(()=>toast('Zkopírováno ✓'),()=>{ $('#bk').select(); toast('Označeno – zkopírujte Ctrl+C'); }); }catch(e){ $('#bk').select(); toast('Označeno – zkopírujte Ctrl+C'); } break; }
  case 'importbk': try{ const o=JSON.parse(decodeURIComponent(escape(atob($('#bk').value.trim())))); if(!o.profiles) throw 0; confirmBox('Načíst zálohu? Současný postup se přepíše.', ()=>{ S=o; S.profiles.forEach(migrate); save(); toast('Záloha načtena ✓'); render(); }); }catch(e){ toast('Kód se nepodařilo načíst'); } break;
  }
}

render();
setTimeout(()=>startSync(),0);
