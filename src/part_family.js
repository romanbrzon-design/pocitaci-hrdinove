if('serviceWorker' in navigator) addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
/* ============ Rodinný kód – každá rodina vidí jen svá data ============ */
function emptyState(){ const s=defaultState(); s.profiles=[]; s.settings.reward='Odměna podle domluvy s rodiči'; return s; }
var FAMILY = lsGet('ph-family') || '';
function setFamily(c){ FAMILY=c; lsSet('ph-family', c); }
gas = async function(fn, arg){
  if(fn==='loadAll'){ const r=await fetch(BACKEND+'?f='+encodeURIComponent(FAMILY)+'&t='+Date.now()); if(!r.ok) throw new Error(r.status); const j=await r.json(); if(j && j.error) throw new Error(j.error); return j; }
  const body = fn==='saveItems' ? {action:'save', items:arg} : fn==='logResult' ? {action:'log', result:arg} : Object.assign({action:fn}, arg||{});
  body.family=FAMILY;
  const r=await fetch(BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)});
  if(!r.ok) throw new Error(r.status); return r.json();
};
const _flushF=flush; flush=async function(){ if(HAS_GAS && !FAMILY) return; return _flushF(); };
const _pullF=pull; pull=async function(rr){ if(HAS_GAS && !FAMILY) return; return _pullF(rr); };
function newFamilyCode(){ const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s=''; const a=crypto.getRandomValues(new Uint32Array(6)); for(const x of a) s+=A[x%A.length]; return s; }
async function startSync(){
  if(!HAS_GAS){ render(); return; }
  if(!FAMILY){
    // zařízení ze starší verze: přihlásit k rodině podle známého hrdiny
    const ps=S.profiles.filter(p=>!isTest(p) && ((p.xp||0)>0 || (p.totalCorrect||0)>0));
    for(const p of ps.slice(0,3)){ try{ const j=await fetch(BACKEND+'?claim='+encodeURIComponent(p.id)+'&n='+encodeURIComponent(p.name)).then(r=>r.json()); if(j && j.code){ setFamily(j.code); break; } }catch(e){} }
  }
  if(!FAMILY){ view={name:'family'}; render(); return; }
  pull(true);
}
function familyView(){
  const st=view.fst||'';
  return `<div class="top"><h1>🧠 Chytrolínci</h1></div>
   <div class="card center" style="max-width:560px;margin:0 auto">
    <div style="font-size:64px">👨‍👩‍👧‍👦</div><h2>Vítejte!</h2>
    <p style="font-size:18px">Chytrolínci jsou hra, ve které děti každý den procvičují matematiku, češtinu, angličtinu a přírodovědu – a za to sbírají body, výbavu a nálepky.</p>
    <p>Postup dětí se ukládá pod <b>rodinným kódem</b>. Díky němu uvidíte výsledky na všech vašich zařízeních – a nikdo jiný je neuvidí.</p>
    <div class="row" style="justify-content:center;margin:14px 0"><button class="btn gold" data-act="fam-new" style="font-size:19px">✨ Jsme tu poprvé</button></div>
    <div class="field" style="max-width:320px;margin:10px auto"><label>Už máme rodinný kód (z jiného zařízení):</label>
      <input type="text" id="famcode" maxlength="12" placeholder="např. K7MPQ2" style="text-transform:uppercase;text-align:center;font-size:22px;letter-spacing:3px"></div>
    <button class="btn" data-act="fam-join">🔑 Připojit se k rodině</button>
    ${st?`<p style="margin-top:12px;font-weight:800">${st}</p>`:''}
    <p class="muted" style="font-size:13px;margin-top:18px">Ukládáme jen přezdívku dítěte, třídu a herní postup – žádné jméno, e-mail ani fotky. <a href="soukromi.html" target="_blank">Zásady ochrany soukromí</a></p>
   </div>`;
}
async function famNew(){
  view.fst='⏳ Zakládám rodinu…'; render();
  for(let i=0;i<5;i++){ const c=newFamilyCode(); try{ FAMILY=c; const j=await gas('create',{}); if(j && j.ok){ setFamily(c);
    S=emptyState(); TEST=null; lsSet('ph-test',null); pulledOnce=true; saveLocal(); flush(); view={name:'home'}; render(); setTimeout(()=>{ introOpen(true); famShow(true); },300); return; } }catch(e){} }
  FAMILY=''; view.fst='⚠️ Nepodařilo se spojit se serverem. Zkuste to prosím znovu.'; render();
}
async function famJoin(){
  const c=fam_c(($('#famcode')||{}).value); if(c.length<6){ view.fst='Rodinný kód má 6 znaků.'; render(); return; }
  view.fst='⏳ Hledám rodinu…'; render();
  try{ const r=await fetch(BACKEND+'?f='+c+'&t='+Date.now()).then(r=>r.json());
    if(r && !r.error){ setFamily(c); S=emptyState(); saveLocal(); view={name:'home'}; await pull(true); toast('✅ Připojeno k rodině'); return; }
    view.fst='❌ Rodina s tímto kódem neexistuje. Zkontrolujte kód.'; }catch(e){ view.fst='⚠️ Nepodařilo se spojit se serverem.'; }
  render();
}
function fam_c(v){ return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,12); }
function famShow(first){
  const m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="card center" style="max-width:460px"><h2>🔑 Váš rodinný kód</h2>
    <div style="font:900 40px Nunito,sans-serif;letter-spacing:6px;background:#fff7e6;border:3px dashed #e8c06a;border-radius:16px;padding:10px;margin:8px 0">${FAMILY}</div>
    <p>${first?'Rodina je založená! ':''}Tento kód zadejte na <b>každém dalším zařízení</b> (počítač, tablet, telefon dítěte). Najdete ho kdykoli v sekci Rodič → Nastavení.</p>
    <button class="btn gold" id="fsok">Rozumím</button></div>`;
  document.body.appendChild(m); m.querySelector('#fsok').onclick=()=>m.remove();
}
const _actF=act;
act=function(a){
  if(a==='fam-new') return famNew();
  if(a==='fam-join') return famJoin();
  if(a==='fam-show') return famShow(false);
  if(a==='fam-leave') return confirmBox('Odhlásit toto zařízení od rodiny? Data zůstanou uložená online, zpět se připojíte zadáním rodinného kódu.', ()=>{ setFamily(''); S=emptyState(); saveLocal(); view={name:'family'}; render(); });
  if(a==='fam-delete') return confirmBox('Opravdu SMAZAT všechna data vaší rodiny (všechny hrdiny i výsledky) ze serveru? Tohle nejde vrátit.', async ()=>{ try{ await gas('deleteFamily',{}); }catch(e){} setFamily(''); S=emptyState(); TEST=null; saveLocal(); view={name:'family'}; render(); toast('Data rodiny byla smazána.'); });
  return _actF(a);
};
const _renderF=render;
render=function(){
  if(view.name==='family'){ $('#app').innerHTML=familyView(); bind(); try{ addReaders(); }catch(e){} const i=$('#famcode'); if(i) i.onkeydown=e=>{ if(e.key==='Enter') famJoin(); }; return; }
  _renderF();
  if(view.name==='parent' && parentOk && parentTab==='settings' && HAS_GAS && FAMILY){
    const c=document.querySelector('#app .card:last-of-type') || document.querySelector('#app .card');
    const box=document.createElement('div'); box.className='card'; box.style.marginTop='14px';
    box.innerHTML=`<h3 style="margin:0 0 6px">🔑 Rodinný kód: <span style="letter-spacing:3px">${FAMILY}</span></h3>
      <p class="muted" style="margin:0 0 8px">Zadejte ho na dalších zařízeních, aby na nich děti hrály se stejnými hrdiny.</p>
      <div class="row"><button class="btn small sec" data-act="fam-show">Zobrazit velký</button><button class="btn small sec" data-act="fam-leave">Odhlásit toto zařízení</button><button class="btn small red" data-act="fam-delete">Smazat všechna data rodiny</button>
      <a class="btn small sec" href="soukromi.html" target="_blank">Ochrana soukromí</a></div>`;
    (c&&c.parentNode||$('#app')).appendChild(box); bind();
  }
  if(view.name==='parent' && parentOk && parentTab==='backup' && HAS_GAS && FAMILY){
    const c=document.querySelector('#app .card'); const box=document.createElement('div'); box.style.marginTop='18px';
    box.innerHTML=`<h3 style="margin:0 0 6px">☁️ Zálohy na serveru</h3>
      <p class="muted" style="margin:0 0 8px">Server si u každého hrdiny pamatuje starší stavy (průběžně a vždy, když nějaké zařízení poslalo starší kopii). Pokud hrdina přišel o postup, vyberte ho a obnovte.</p>
      <div class="row"><select id="bk-hero">${heroes().map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><button class="btn small sec" id="bk-load">Zobrazit zálohy</button></div>
      <div id="bk-list" style="margin-top:8px"></div>`;
    (c||$('#app')).appendChild(box);
    box.querySelector('#bk-load').onclick=()=>bkLoad(box.querySelector('#bk-hero').value);
  }
};
async function bkLoad(id){ const el=$('#bk-list'); if(!el) return; el.innerHTML='⏳ Načítám…';
  try{ const r=await gas('backups',{id}); const L=(r&&r.list)||[];
    el.innerHTML = L.length ? `<table class="hist"><tr><th>Kdy</th><th>Jméno</th><th>Body</th><th>Správně</th><th></th></tr>${L.map(b=>`<tr><td>${esc(b.when)}<div class="muted" style="font-size:12px">${esc(b.why)}</div></td><td>${esc(b.name)}</td><td>${b.xp}</td><td>${b.tc}</td><td><button class="btn small" data-bkrow="${b.row}">Obnovit</button></td></tr>`).join('')}</table>` : '<p class="muted">Pro tohoto hrdinu zatím žádné zálohy nejsou.</p>';
    el.querySelectorAll('[data-bkrow]').forEach(b=>b.onclick=()=>confirmBox('Obnovit hrdinu z této zálohy? Současný stav se předtím také zazálohuje.', ()=>bkRestore(id,+b.dataset.bkrow)));
  }catch(e){ el.innerHTML='⚠️ Nepodařilo se spojit se serverem.'; } }
async function bkRestore(id,row){
  try{ const r=await gas('restore',{id,row}); if(!r||!r.ok||!r.profile) throw 0;
    const o=migrate(JSON.parse(r.profile)), i=S.profiles.findIndex(p=>p.id===id); if(i>=0) S.profiles[i]=o; else S.profiles.push(o);
    lastSent[id]=r.profile; shadow[id]=bodyOf(o); saveLocal(); toast('✅ Hrdina obnoven ze zálohy'); render();
  }catch(e){ toast('⚠️ Obnovení se nepovedlo'); } }


/* ---- týdenní zpráva e-mailem (volitelné) ----
   Aplikace po každém dokončeném dni pošle na server aktuální podobu zprávy; server ji v nastavený den večer odešle e-mailem. */
function repCfg(){ return (S.settings && S.settings.rep) || {}; }
function emailReportHTML(){
  const ws=weekStart(), pws=addDays(ws,-7), fmtD=k=>k.split('-').reverse().slice(0,2).map(x=>+x).join('. ')+'.';
  const E=x=>String(x==null?'':x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const bar=(pc,col)=>`<span style="display:inline-block;width:120px;height:10px;background:#eee3cc;border-radius:5px;vertical-align:middle"><span style="display:block;width:${pc*1.2}px;height:10px;border-radius:5px;background:${col}"></span></span>`;
  const heroes_=realHeroes();
  let h=`<div style="font-family:Arial,Helvetica,sans-serif;color:#3b2a14;max-width:620px">
    <h2 style="margin:0 0 4px">🧠 Chytrolínci – týdenní zpráva</h2>
    <div style="color:#7a6448;margin-bottom:14px">Týden ${fmtD(ws)} – ${fmtD(addDays(ws,6))} (stav k ${new Date().toLocaleString('cs-CZ',{weekday:'long',day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'})})</div>`;
  if(!heroes_.length) h+='<p>Zatím žádní hrdinové.</p>';
  for(const p of heroes_){
    const s=weekStats(p,ws), o=weekStats(p,pws), pc=s.n?Math.round(s.c/s.n*100):0, opc=o.n?Math.round(o.c/o.n*100):0;
    const weak=weakCats(p,1).map(c=>CATS[c].label);
    const subj=Object.entries(s.subj).map(([k,v])=>`${SUBJECTS[k]?SUBJECTS[k].icon+' '+SUBJECTS[k].name:k}: <b>${Math.round(v[0]/v[1]*100)} %</b> (${v[0]}/${v[1]})`).join(' &nbsp;·&nbsp; ');
    const rows=Object.entries(p.cst||{}).filter(([c,r])=>CATS[c]&&r[1]>=3).sort((a,b)=>a[1][0]/a[1][1]-b[1][0]/b[1][1]);
    h+=`<div style="border:2px solid #e3cf9f;border-radius:12px;padding:12px 14px;margin:0 0 14px;background:#fffaf0">
      <h3 style="margin:0 0 6px">${E(p.name)} <span style="font-weight:normal;color:#7a6448;font-size:14px">· ${gl(p.grade)}</span></h3>
      <div>📅 <b>${s.days}</b> ${plural(s.days,'den','dny','dní')} s úkolem${o.days!==s.days?` (minulý týden ${o.days})`:''}</div>
      <div>✅ <b>${s.c}</b> správně z ${s.n} – úspěšnost <b>${pc} %</b>${o.n?` (minulý týden ${opc} %)`:''}</div>
      <div>🔥 série ${streakAlive(p)?p.streak:0} ${plural(streakAlive(p)?p.streak:0,'den','dny','dní')} · ${modeOf(p).icon} ${p.beaten}/${FOE_N}</div>
      ${subj?`<div style="margin-top:4px">${subj}</div>`:''}
      <div style="margin-top:6px">${weak.length?`⚠️ <b>Potřebuje procvičit:</b> ${weak.map(E).join(', ')}`:(s.n?'👍 Žádné téma pod 75 %.':'')}</div>
      ${s.n?'':`<div style="margin-top:6px;color:#a8322a">Tento týden zatím ${p.gender==='f'?'nehrála':'nehrál'}.</div>`}
      ${rows.length?`<table style="border-collapse:collapse;margin-top:8px;font-size:14px">${rows.map(([c,r])=>{ const q=Math.round(r[0]/r[1]*100), col=q<75?'#e0614a':q>=90?'#3aa864':'#f0b429';
        return `<tr><td style="padding:2px 8px 2px 0">${(SUBJECTS[subjOf(c)]||{}).icon||''} ${E(CATS[c].label)}</td><td style="padding:2px 6px">${bar(q,col)}</td><td style="padding:2px 0"><b>${q} %</b> <span style="color:#8a7656">z ${r[1]}</span></td></tr>`; }).join('')}</table>`:''}
    </div>`;
  }
  h+=`<p style="color:#7a6448;font-size:13px">Podrobnosti najdete ve hře v Rodičovské sekci → Týdenní zpráva: <a href="${location.origin+location.pathname}">${location.host}${location.pathname}</a>.<br>Zprávy vypnete tamtéž v Nastavení.</p></div>`;
  return h;
}
let _repPushed=0;
async function pushReport(now, force){
  const r=repCfg(); if(!HAS_GAS || !FAMILY) return null;
  if(!r.on || !r.email){ if(force) try{ await gas('report',{email:''}); }catch(e){} return null; }
  if(!now && !force && Date.now()-_repPushed<120000) return null; _repPushed=Date.now();
  try{ return await gas('report', {email:r.email, day:r.day||6, html:emailReportHTML(), week:weekStart(), now:!!now}); }catch(e){ return null; }
}

/* ============ Kniha přání – nápady rodičů přijdou e-mailem na chytrolinci@email.cz ============ */
const WISH_MAIL='chytrolinci@email.cz';
const WISH_KINDS=[['idea','💡 Nápad na vylepšení'],['learn','📚 Chybí mi učivo'],['bug','🐞 Chyba v otázce nebo ve hře'],['praise','⭐ Pochvala'],['other','✉️ Jiné']];
let wishDraft={kind:'idea', text:'', email:''}, wishBusy=false;
const wishSent=()=>{ const l=lsGet('ph-wishes',[]); return Array.isArray(l)?l:[]; };
function wishInfo(){ const hs=heroes(); return `dětí ${hs.length}; třídy ${hs.map(p=>p.grade).join(',')||'-'}; ${(()=>{const u=navigator.userAgent||''; return /Android/i.test(u)?'Android':/iPhone|iPad/i.test(u)?'iOS':/Windows/i.test(u)?'Windows':/Mac/i.test(u)?'Mac':'jiné';})()}${matchMedia('(display-mode: standalone)').matches?' (aplikace)':' (prohlížeč)'}`; }
function wishHTML(){
  const em = wishDraft.email || repCfg().email || '';
  const L=wishSent().slice(-5).reverse();
  return `<h3 style="margin:0 0 6px">💡 Kniha přání</h3>
    <p style="margin:0 0 10px">Co byste ve hře rádi doplnili nebo vylepšili? Chybí vám nějaké učivo, našli jste chybu v otázce, nebo máte nápad na novou hru? Napište nám – každé přání si přečteme a podle vašich nápadů budeme Chytrolínky vylepšovat.</p>
    <div class="field"><label>O co jde?</label><select id="w-kind">${WISH_KINDS.map(([k,l])=>`<option value="${k}" ${wishDraft.kind===k?'selected':''}>${l}</option>`).join('')}</select></div>
    <div class="field"><label>Vaše přání</label><textarea id="w-text" maxlength="3000" rows="6" placeholder="Např.: Do 3. třídy bych přidal(a) převody jednotek času… / V otázce o … je chyba…" style="width:100%;font:inherit;font-size:16px;border:2px solid var(--line);border-radius:12px;padding:10px;box-sizing:border-box">${esc(wishDraft.text)}</textarea></div>
    <div class="field"><label>Váš e-mail pro odpověď (nepovinné)</label><input type="email" id="w-email" placeholder="vas@email.cz" value="${esc(em)}"></div>
    <button class="btn ok" data-act="wish-send" ${wishBusy?'disabled':''}>${wishBusy?'⏳ Odesílám…':'📨 Odeslat přání'}</button>
    <p class="muted" style="font-size:13px;margin-top:8px">Přání se pošle autorovi hry na ${WISH_MAIL} spolu s rodinným kódem a ročníky dětí (bez jmen dětí). Když nejste online, můžete napsat i přímo e-mailem: <a href="${wishMailto()}">${WISH_MAIL}</a>.</p>
    ${L.length?`<h4 style="margin:14px 0 4px">Vaše odeslaná přání</h4>${L.map(w=>`<div class="muted" style="font-size:14px;border-top:1px solid var(--line);padding:6px 0"><b>${esc(w.d)}</b> · ${esc((WISH_KINDS.find(k=>k[0]===w.k)||['','✉️ Jiné'])[1])}<br>${esc(w.t.length>160?w.t.slice(0,160)+'…':w.t)}</div>`).join('')}`:''}`;
}
function wishMailto(){
  const k=(WISH_KINDS.find(x=>x[0]===wishDraft.kind)||WISH_KINDS[0])[1].replace(/^\S+\s/,'');
  return 'mailto:'+WISH_MAIL+'?subject='+encodeURIComponent('Chytrolínci – kniha přání: '+k)+'&body='+encodeURIComponent((wishDraft.text||'')+(FAMILY?'\n\n(Rodina '+FAMILY+')':''));
}
function wishRead(){ const k=$('#w-kind'), t=$('#w-text'), e=$('#w-email'); if(k) wishDraft.kind=k.value; if(t) wishDraft.text=t.value; if(e) wishDraft.email=e.value.trim(); }
async function wishSend(){
  if(wishBusy) return; wishRead();
  const text=wishDraft.text.trim();
  if(text.length<3){ toast('Napište prosím, co byste si přáli 🙂'); return; }
  if(wishDraft.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(wishDraft.email)){ toast('E-mail nevypadá správně'); return; }
  const fallback=msg=>{ confirmBox(msg+' Chcete přání poslat přes svou e-mailovou aplikaci?', ()=>{ location.href=wishMailto(); }); };
  if(!HAS_GAS || !FAMILY){ fallback('Odeslání ze hry funguje jen s online ukládáním (rodinný kód).'); return; }
  wishBusy=true; render();
  let r=null; try{ r=await gas('wish',{kind:wishDraft.kind, text, email:wishDraft.email, info:wishInfo()}); }catch(e){}
  wishBusy=false;
  if(r && r.wish){
    const l=wishSent(); l.push({d:new Date().toLocaleDateString('cs-CZ'), k:wishDraft.kind, t:text}); lsSet('ph-wishes', l.slice(-30));
    wishDraft.text=''; const ta=$('#w-text'); if(ta) ta.value=''; render(); toast('💛 Děkujeme! Přání jsme dostali.');
  } else if(r && r.error==='limit'){ render(); toast('Dnes už jste poslali hodně přání – zkuste to prosím zítra.'); }
  else { render(); fallback('Přání se teď nepodařilo odeslat.'); }
}
const _actW=act; act=function(a){ if(a==='wish-send') return wishSend(); return _actW(a); };
const _renderW=render; render=function(){ if(view.name==='parent' && parentOk && parentTab==='wish' && $('#w-text')) wishRead(); _renderW(); };
const _finishRep=finish; finish=function(t){ const x=_finishRep(t); setTimeout(()=>pushReport(),1500); return x; };
