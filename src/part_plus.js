/* ============ ⭐ Chytrolínci Plus (placené rozšíření přes Google Play) ============
   ZDARMA: matematika, úroveň hrdiny do 10, soupeři 1–10 (včetně velké odměny), výbava do 5. stupně, všechna pozadí.
   PLUS:   čeština, angličtina, přírodověda, úrovně 11–20, legendární soupeři 11–15, výbava od 6. stupně, minihry.
   Zapíná se na SERVERU (vlastnost skriptu PLUS_ON = 1). Dokud je vypnuto, má všechno každý – hra se chová jako dosud.
   Odemčení platí pro celou rodinu (rodinný kód) – server si ho pamatuje v listu „_plus“.
   Děti nikdy nepřijdou o postup: XP se sbírá dál, koupená výbava zůstává; po odemčení se vše hned projeví. */
const PLUS_SKU = 'chytrolinci_plus';
const PLUS_FREE_LEVEL = 10, PLUS_FREE_GEAR = 5, PLUS_FREE_SUBJ = ['m'];
const PLUS_PLAY_URL = 'https://play.google.com/store/apps/details?id=cz.chytrolinci.app';
var PLUS = Object.assign({on:false, active:false, why:''}, lsGet('ph-plus', {}) || {});
function savePlus(){ lsSet('ph-plus', {on:!!PLUS.on, active:!!PLUS.active, why:PLUS.why||''}); }
function plusPreview(){ return !!lsGet('ph-plus-preview', false); }          // servisní náhled zamčené verze (Záloha → Servis)
function plusOn(){ return !!PLUS.on || plusPreview(); }
function plusActive(){ return !!PLUS.active && !plusPreview(); }
function plusLocked(p){ if(p && isTest(p)) return false; return plusOn() && !plusActive(); }
// staré názvy z přípravy (part_family.js)
function hasPremium(){ return !plusLocked(); }
function foeLockedByPlan(i){ return i>REWARD_AT && plusLocked(); }
function subjLocked(s){ return plusLocked() && !PLUS_FREE_SUBJ.includes(s); }
function gearLocked(p, tier){ return tier>PLUS_FREE_GEAR && plusLocked(p); }

/* ---- zámky ve hře ---- */
const _catsOfPlus=catsOf; catsOf=function(p){ const c=_catsOfPlus(p); if(!plusLocked(p)) return c;
  const f=c.filter(x=>!subjLocked(subjOf(x))); if(f.length) return f;
  const d=(DEFAULT_CATS[p&&p.grade]||DEFAULT_CATS[2]).filter(x=>CATS[x] && !subjLocked(subjOf(x))); return d.length?d:['add20']; };
function plusRawLevel(p){ return Math.min(MAX_LEVEL, 1+Math.floor((p.xp||0)/(XP_PER_LEVEL[S.settings.length]||20))); }
const _levelPlus=level; level=function(p){ const L=_levelPlus(p); return plusLocked(p)?Math.min(PLUS_FREE_LEVEL,L):L; };
const _xpInfoPlus=xpInfo; xpInfo=function(p){ if(plusLocked(p) && plusRawLevel(p)>=PLUS_FREE_LEVEL){ const per=XP_PER_LEVEL[S.settings.length]||20; return {L:PLUS_FREE_LEVEL, cur:per, per, max:true, plusCap:true}; } return _xpInfoPlus(p); };
const _statsHTMLPlus=statsHTML; statsHTML=function(p){ const h=_statsHTMLPlus(p); if(!(plusLocked(p) && plusRawLevel(p)>=PLUS_FREE_LEVEL)) return h;
  return h.replace('Maximální úroveň!', `Úroveň ${PLUS_FREE_LEVEL} je nejvyšší zdarma – <button class="btn small gold plusbtn" data-plus="level">⭐ Další úrovně v Plus</button>`); };
const _startBattlePlus=startBattle; startBattle=function(mi){ const p=prof(view.pid); if(p && mi>REWARD_AT && plusLocked(p)){ plusPaywall('foe'); return; } return _startBattlePlus(mi); };
const _buyPlus=buy; buy=function(slot){ const p=prof(view.pid); const own=((p&&p.owned)||{})[slot]||0; if(p && gearLocked(p, own+1)){ plusPaywall('gear'); return; } return _buyPlus(slot); };
const _actPlus=act; act=function(a){
  if(a==='mini' && plusLocked(prof(view.pid))){ plusPaywall('mini'); return; }
  if(a==='plus-buy') return plusBuy();
  if(a==='plus-restore') return plusRestore(true);
  if(a==='plus-parent'){ document.querySelectorAll('.modal.plusm').forEach(m=>m.remove()); parentTab='plus'; parentOk=false; go({name:'parent'}); return; }
  if(a==='plus-preview'){ lsSet('ph-plus-preview', !plusPreview()); render(); toast(plusPreview()?'Náhled: hra se chová jako bez Plus':'Náhled vypnut'); return; }
  return _actPlus(a); };

/* ---- okno „Tohle je v Plus“ (pro dítě – nákup je jen u rodičů) ---- */
const PLUS_WHY = { foe:'🐉 Legendární soupeři 11–15', gear:'🛡️ Lepší výbava od 6. stupně', mini:'🧩 Zvídavé minihry', level:'⭐ Úrovně 11–20', subj:'📖 Čeština, 🇬🇧 angličtina a 🌿 přírodověda' };
function plusListHTML(){ return `<ul class="pluslist"><li>📖 Čeština, 🇬🇧 angličtina a 🌿 přírodověda</li><li>⭐ Úrovně hrdiny 11–20</li><li>🐉 Legendární soupeři 11–15</li><li>🛡️ Výbava od 6. stupně (rytířská, zlatá, dračí, hvězdná…)</li><li>🧩 Zvídavé minihry (pexeso, bludiště, ptáci…)</li></ul>`; }
function plusPaywall(what){
  document.querySelectorAll('.modal.plusm').forEach(m=>m.remove());
  const m=document.createElement('div'); m.className='modal plusm';
  m.innerHTML=`<div class="card center" style="max-width:440px"><div style="font-size:46px">⭐</div><h3>${PLUS_WHY[what]||'Tohle'} ${what==='subj'?'patří':'patří'} do Chytrolínců Plus</h3>
    <p style="font-size:17px">Matematika je zdarma napořád. Plus odemkne celé rodině:</p>${plusListHTML()}
    <p class="muted" style="font-size:15px">Odemknout může jen rodič v rodičovské sekci.</p>
    <div class="row" style="justify-content:center"><button class="btn gold" id="plp">👨‍👩‍👦 Pro rodiče</button><button class="btn sec" id="plx">Zavřít</button></div></div>`;
  document.body.appendChild(m);
  m.querySelector('#plx').onclick=()=>m.remove();
  m.querySelector('#plp').onclick=()=>act('plus-parent');
  try{ speak(cleanSpeech((PLUS_WHY[what]||'')+' patří do Chytrolínců Plus. Odemknout ho můžou rodiče.')); }catch(e){}
}

/* ---- úpravy obrazovek po vykreslení (zámky, odznaky) ---- */
const _renderPlus=render; render=function(){
  _renderPlus.apply(this, arguments);
  try{ plusDecorate(); }catch(e){ console.warn('plus', e); }
};
function plusBadge(){ return '<span class="plustag">⭐ Plus</span>'; }
function plusDecorate(){
  document.querySelectorAll('[data-plus]').forEach(b=>b.onclick=ev=>{ ev.preventDefault(); ev.stopPropagation(); plusPaywall(b.dataset.plus); });
  if(!plusOn()) return;
  const p=view.pid?prof(view.pid):null;
  if(view.name==='hero' && p && plusLocked(p)){
    document.querySelectorAll('[data-buy]').forEach(b=>{ const own=((p.owned||{})[b.dataset.buy])||0; if(gearLocked(p, own+1)){
      const nb=document.createElement('button'); nb.className='btn small gold plusbtn'; nb.innerHTML='⭐ Plus'; nb.onclick=()=>plusPaywall('gear'); b.replaceWith(nb); } });
    const lockedS=['cj','en','pr'].filter(subjLocked);
    const sub=[...document.querySelectorAll('#app .sub.center')].find(x=>/^Předměty:/.test(x.textContent));
    if(sub && lockedS.length && !sub.querySelector('.plusbtn')) sub.insertAdjacentHTML('beforeend', ` <button class="btn small sec plusbtn" data-plus="subj" style="margin-left:6px">🔒 ${lockedS.map(s=>SUBJECTS[s].icon).join(' ')} ⭐ Plus</button>`);
    document.querySelectorAll('[data-act="mini"]').forEach(b=>{ b.innerHTML='🧩 Minihry ⭐ Plus'; b.classList.remove('gold'); b.classList.add('sec'); });
    document.querySelectorAll('[data-plus]').forEach(b=>b.onclick=ev=>{ ev.preventDefault(); ev.stopPropagation(); plusPaywall(b.dataset.plus); });
  }
  if(view.name==='map' && p && plusLocked(p)){
    document.querySelectorAll('.mcard').forEach(c=>{ const n=parseInt((c.querySelector('.num')||{}).textContent,10); if(!(n-1>REWARD_AT)) return;
      c.classList.add('locked','pluslock'); c.removeAttribute('data-sel'); const bd=c.querySelector('.badge'); if(bd) bd.textContent='⭐'; else c.insertAdjacentHTML('afterbegin','<span class="badge">⭐</span>');
      c.onclick=ev=>{ ev.stopPropagation(); plusPaywall('foe'); }; });
    document.querySelectorAll('[data-fight]').forEach(b=>{ if(+b.dataset.fight>REWARD_AT){ b.innerHTML='⭐ Odemknout v Plus'; b.onclick=ev=>{ ev.stopPropagation(); plusPaywall('foe'); }; } });
  }
  if(view.name==='create' && plusLocked()){
    document.querySelectorAll('[data-subj]').forEach(b=>{ if(subjLocked(b.dataset.subj) && !b.querySelector('.plustag')) b.insertAdjacentHTML('beforeend',' '+plusBadge()); });
  }
  if(view.name==='parent' && parentOk && plusLocked()){
    document.querySelectorAll('[data-subjon]').forEach(c=>{ if(subjLocked(c.dataset.subjon)){ const l=c.closest('label'); if(l && !l.querySelector('.plustag')) l.insertAdjacentHTML('beforeend',' '+plusBadge()); } });
  }
}

/* ---- rodičovská sekce: záložka ⭐ Plus ---- */
const _parentViewPlus=parentView; parentView=function(){
  const tab=parentTab; if(tab==='plus' && parentOk) parentTab='__plus';
  let h=_parentViewPlus(); parentTab=tab;
  if(!parentOk) return h;
  if(plusOn()) h=h.replace('<div class="tabs">', `<div class="tabs"><button class="${tab==='plus'?'on':''}" data-tab="plus">⭐ Plus</button>`);
  else if(tab==='plus'){ parentTab='settings'; return _parentViewPlus(); }
  if(tab==='plus'){ const i=h.lastIndexOf('<div class="card">'); if(i>=0) h=h.slice(0,i)+`<div class="card">${plusParentHTML()}</div>`; }
  if(tab==='backup' && typeof serviceOk!=='undefined' && serviceOk){ h=h.replace('<h3 style="margin:10px 0 6px">🔧 Servisní záloha</h3>', `<div class="row" style="margin:8px 0"><button class="btn small sec" data-act="plus-preview">${plusPreview()?'✅':'⬜'} Náhled: hra jako bez Plus (jen toto zařízení)</button></div><h3 style="margin:10px 0 6px">🔧 Servisní záloha</h3>`); }
  return h;
};
let plusBusy=false;
function plusParentHTML(){
  const fam=typeof FAMILY!=='undefined'?FAMILY:'';
  if(!plusOn()) return `<h3>⭐ Chytrolínci Plus</h3><p>Zatím je <b>všechno zdarma</b> – Plus ještě není spuštěné. Až bude, odemkne celé rodině:</p>${plusListHTML()}<p class="muted">Matematika, úrovně do 10, prvních 10 soupeřů, výbava do 5. stupně a všechna pozadí zůstanou zdarma.</p>`;
  if(plusActive()) return `<h3>⭐ Chytrolínci Plus</h3><p style="font-size:19px">✅ <b>Plus je odemčené</b> pro celou rodinu${fam?` (rodinný kód <b>${esc(fam)}</b>)`:''}.</p><p class="muted">Platí na všech zařízeních, kde je zadaný stejný rodinný kód. Děkujeme, že podporujete Chytrolínce! 💛</p>`;
  const tw=plusCanPay();
  return `<h3>⭐ Chytrolínci Plus</h3>
    <p>Matematika je zdarma napořád. Plus odemkne <b>všem dětem v rodině</b> na všech jejich zařízeních:</p>${plusListHTML()}
    <p class="muted">Jednorázová platba přes Google Play, žádné předplatné. Postup dětí se neztratí – úrovně a body, které už nasbíraly, se po odemčení hned projeví.</p>
    ${!fam?`<p><b>Nejdřív je potřeba rodinný kód</b> (Rodič → Nastavení), aby se Plus odemklo pro celou rodinu.</p>`:''}
    ${tw?`<div class="row"><button class="btn gold" data-act="plus-buy" ${plusBusy||!fam?'disabled':''}>⭐ Odemknout Plus${PLUS.price?' – '+esc(PLUS.price):''}</button><button class="btn sec small" data-act="plus-restore" ${plusBusy||!fam?'disabled':''}>Obnovit nákup</button></div>`
        :`<p>Koupit lze v aplikaci <b>Chytrolínci z Google Play</b> (Android): Rodič → ⭐ Plus. Po zakoupení se Plus odemkne i tady – stačí stejný rodinný kód.</p><a class="btn sec small" href="${PLUS_PLAY_URL}" target="_blank" rel="noopener">▶️ Chytrolínci na Google Play</a>`}
    ${plusBusy?'<p class="muted">Chvilku strpení…</p>':''}`;
}

/* ---- Google Play Billing (jen v aplikaci z Google Play – Trusted Web Activity) ---- */
function plusCanPay(){ return 'getDigitalGoodsService' in window && !!window.PaymentRequest; }
let plusSvc=null;
async function plusService(){ if(plusSvc) return plusSvc; if(!plusCanPay()) return null;
  try{ plusSvc=await window.getDigitalGoodsService('https://play.google.com/billing'); }catch(e){ plusSvc=null; } return plusSvc; }
async function plusLoadPrice(){ try{ const s=await plusService(); if(!s) return; const d=await s.getDetails([PLUS_SKU]); const it=d&&d[0];
  if(it && it.price){ PLUS.price=new Intl.NumberFormat('cs-CZ',{style:'currency',currency:it.price.currency}).format(+it.price.value); if(view.name==='parent') render(); } }catch(e){} }
async function plusSend(token, restore){ try{ return await gas('plusBuy',{token, sku:PLUS_SKU, restore:restore?1:0}); }catch(e){ return null; } }
async function plusBuy(){
  if(plusBusy) return; if(!FAMILY){ toast('Nejdřív nastavte rodinný kód.'); return; }
  const s=await plusService(); if(!s){ toast('Platba funguje jen v aplikaci z Google Play.'); return; }
  let response;
  try{ const req=new PaymentRequest([{supportedMethods:'https://play.google.com/billing', data:{sku:PLUS_SKU}}], {total:{label:'Chytrolínci Plus', amount:{currency:'CZK', value:'0'}}});
    response=await req.show(); }catch(e){ if(e && e.name!=='AbortError') toast('Platbu se nepodařilo spustit.'); return; }
  plusBusy=true; render();
  const r=await plusSend(response.details && response.details.purchaseToken, false);
  plusBusy=false;
  if(r && r.active){ PLUS.active=true; PLUS.why='koupě'; savePlus(); try{ await response.complete('success'); }catch(e){} render(); toast('⭐ Děkujeme! Chytrolínci Plus jsou odemčení pro celou rodinu.'); try{ confetti(60); }catch(e){} }
  else { try{ await response.complete('fail'); }catch(e){} render(); toast('Platbu se nepodařilo ověřit. Zkuste „Obnovit nákup“, případně napište na chytrolinci@email.cz.'); }
}
async function plusRestore(loud){
  if(!FAMILY) return; const s=await plusService(); if(!s){ if(loud) toast('Obnovit nákup jde jen v aplikaci z Google Play.'); return; }
  if(loud){ plusBusy=true; render(); }
  let found=false;
  try{ const list=await s.listPurchases(); for(const it of list||[]){ if(it.itemId===PLUS_SKU){ found=true; const r=await plusSend(it.purchaseToken, true); if(r && r.active){ PLUS.active=true; PLUS.why='koupě'; savePlus(); } } } }catch(e){}
  if(loud){ plusBusy=false; render(); toast(PLUS.active?'⭐ Nákup obnoven – Plus je odemčené.':found?'Nákup se nepodařilo ověřit, zkuste to prosím později.':'Na tomto účtu Google jsme nákup Plus nenašli.'); }
  else if(PLUS.active) render();
}

/* ---- stav ze serveru: zapnuto? má rodina Plus? ---- */
async function plusRefresh(){
  if(!HAS_GAS) return;
  let r=null; try{ r=await gas('plusStatus',{}); }catch(e){ return; }
  if(!r || !r.plus) return;                       // starší server bez Plus → nic neměnit
  const before=JSON.stringify([PLUS.on,PLUS.active]);
  PLUS.on=!!r.on; PLUS.active=!!r.active; PLUS.why=r.why||''; savePlus();
  if(PLUS.on && !PLUS.active && FAMILY) await plusRestore(false);   // nová instalace: obnovit nákup z účtu Google
  if(PLUS.on) plusLoadPrice();
  if(JSON.stringify([PLUS.on,PLUS.active])!==before) render();
}
const _pullPlus=pull; pull=async function(rr){ const x=await _pullPlus(rr); plusRefresh(); return x; };
setTimeout(plusRefresh, 1500);
</script>
</body>
</html>
