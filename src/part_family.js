if('serviceWorker' in navigator) addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
/* ---- Příprava na placené rozšíření: zdarma soupeři 1–10, legendární 11–15 v rozšíření ----
   Zatím má rozšíření každý (PREMIUM_ON=false). Až bude platba přes Google Play, přepne se na true. */
var PREMIUM_ON = false;
function hasPremium(){ return !PREMIUM_ON || !!(S.settings && S.settings.premium) || FAMILY===(S.settings&&S.settings.legacyCode); }
function foeLockedByPlan(i){ return i>REWARD_AT && !hasPremium(); }
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
    S=emptyState(); TEST=null; lsSet('ph-test',null); saveLocal(); flush(); view={name:'home'}; render(); setTimeout(()=>{ introOpen(true); famShow(true); },300); return; } }catch(e){} }
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
};

</script>
</body>
</html>
