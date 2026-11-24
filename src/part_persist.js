const BACKEND = (window.BACKEND_URL||'').trim();
const HAS_GAS = !!BACKEND;
async function gas(fn, arg, keep){
  if(fn==='loadAll'){ const r=await fetch(BACKEND+'?t='+Date.now()); if(!r.ok) throw new Error(r.status); return r.json(); }
  const body = fn==='saveItems' ? {action:'save', items:arg} : {action:'log', result:arg};
  const bs=JSON.stringify(body); const r=await fetch(BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:bs,keepalive:!!keep&&bs.length<60000});
  if(!r.ok) throw new Error(r.status); return r.json();
}
let writing=false, pendingWrite=false, saveTimer=null, syncState=HAS_GAS?'loading':'local';
const lastSent={};
let pulledOnce=false; const shadow={};
const bodyOf=p=>{ const o=p.ts; delete p.ts; const j=JSON.stringify(p); if(o!==undefined) p.ts=o; return j; };
// časové razítko u profilu, jehož obsah se změnil – podle něj pull nepřepíše novější místní postup starší verzí ze serveru
function stampDirty(){ if(!pulledOnce) return; const now=Date.now();
  for(const p of S.profiles){ const j=bodyOf(p); if(shadow[p.id]!==j){ shadow[p.id]=j; p.ts=now; } } }
function dirtyItems(){ const items={};
  const sj=JSON.stringify(S.settings); if(lastSent.settings!==sj) items.settings=sj;
  for(const p of S.profiles){ const j=JSON.stringify(p); if(lastSent[p.id]!==j) items[p.id]=j; }
  return items; }
function save(){
  S.savedAt=Date.now();
  stampDirty();
  saveLocal();
  if(!HAS_GAS) return;
  clearTimeout(saveTimer); saveTimer=setTimeout(flush, 700);
}
async function flush(){
  if(!HAS_GAS) return;
  if(writing){ pendingWrite=true; return; }
  writing=true;
  try{
    if(!pulledOnce){ writing=false; return; } // nejdřív načíst stav ze serveru – jinak by staré zařízení přepsalo novější postup
    const items=dirtyItems();
    if(Object.keys(items).length){ const res=await gas('saveItems', items); Object.assign(lastSent, items);
      // server odmítl starší kopii hrdiny (má u sebe víc postupu) → převzít serverovou verzi
      if(res && res.rejected && res.rejected.length){ for(const k of res.rejected) delete lastSent[k]; setTimeout(()=>pull(true), 50); } }
    syncState='cloud';
  }catch(e){ syncState='offline'; setTimeout(flush, 8000); }
  writing=false;
  if(pendingWrite){ pendingWrite=false; flush(); }
  updateSyncNote();
}
// server má u hrdiny víc postupu (stejná výprava, víc bodů / správných odpovědí) → serverová verze vyhrává, i kdyby místní měla novější čas
function serverAhead(loc,o){ if(loc.deleted || o.deleted) return false; const ls=+loc.season||1, os=+o.season||1;
  if(os!==ls) return os>ls; return (+o.xp||0)>(+loc.xp||0) || (+o.totalCorrect||0)>(+loc.totalCorrect||0); }
async function pull(rerender){
  if(!HAS_GAS || writing) return;
  try{
    const r = await gas('loadAll');
    const setDirty = lastSent.settings!==undefined && JSON.stringify(S.settings)!==lastSent.settings;
    if(r && r.settings && setDirty){ /* rodič právě změnil nastavení – nepřepisovat, odešle se */ }
    else if(r && r.settings){ S.settings=JSON.parse(r.settings); lastSent.settings=r.settings; const before=S.settings.ver; migrateSettings(); if(before!==S.settings.ver) setTimeout(flush,100); }
    let keptLocal=false;
    for(const [id,j] of Object.entries((r&&r.profiles)||{})){
      const o=migrate(JSON.parse(j)); const i=S.profiles.findIndex(p=>p.id===id);
      // místní verze má neodeslané změny a je novější než serverová → nechat místní (a odeslat ji)
      if(i>=0){ const loc=S.profiles[i]; const dirty=JSON.stringify(loc)!==j;
        if(dirty && !serverAhead(loc,o) && ((loc.ts||0)>(o.ts||0) || serverAhead(o,loc))){ keptLocal=true; continue; } S.profiles[i]=o; }
      else S.profiles.push(o);
      lastSent[id]=j; shadow[id]=bodyOf(o);
    }
    pulledOnce=true;
    saveLocal(); syncState='cloud';
    if(!r || !r.settings || keptLocal || setDirty) setTimeout(flush, 50);
    if(rerender) render();
  }catch(e){ syncState='offline'; if(!pulledOnce) setTimeout(()=>pull(true), 15000); }
  updateSyncNote();
}
function logResult(p, h){
  if(!HAS_GAS || isTest(p)) return;
  gas('logResult', {date:todayKey(), name:p.name, grade:p.grade, c:h.c, n:h.n, pts:h.pts,
    wrong:(h.wrongCats||[]).map(c=>CATS[c]?CATS[c].label:c).join(', ')}).catch(()=>{});
}
// refresh while someone (parent) watches the overview
setInterval(()=>{ if(document.querySelector('.modal')) return; if(view.name==='home' || (view.name==='parent' && parentOk && parentTab==='history')) pull(true); }, 30000);
function updateSyncNote(){ const el=$('#syncnote'); if(!el) return;
  el.textContent = syncState==='cloud' ? '☁️ Uloženo online – výsledky vidí rodič odkudkoliv.' :
                   syncState==='loading' ? '⏳ Načítám postup…' :
                   syncState==='offline' ? '⚠️ Nepodařilo se spojit s úložištěm – zkusím to znovu.' :
                   '💾 Postup se ukládá v tomto prohlížeči.'; }

// při zavření / přepnutí aplikace hned odeslat neuložené změny (i když běží odpočet 700 ms)
function flushOnHide(){ if(!HAS_GAS || !pulledOnce || (typeof FAMILY!=='undefined' && !FAMILY)) return; clearTimeout(saveTimer);
  const items=dirtyItems(); if(!Object.keys(items).length) return;
  gas('saveItems', items, true).then(()=>Object.assign(lastSent, items)).catch(()=>{}); }
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='hidden') flushOnHide(); });
addEventListener('pagehide', flushOnHide);
