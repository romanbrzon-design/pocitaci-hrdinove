const BACKEND = (window.BACKEND_URL||'').trim();
const HAS_GAS = !!BACKEND;
async function gas(fn, arg){
  if(fn==='loadAll'){ const r=await fetch(BACKEND+'?t='+Date.now()); if(!r.ok) throw new Error(r.status); return r.json(); }
  const body = fn==='saveItems' ? {action:'save', items:arg} : {action:'log', result:arg};
  const r=await fetch(BACKEND,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)});
  if(!r.ok) throw new Error(r.status); return r.json();
}
let writing=false, pendingWrite=false, saveTimer=null, syncState=HAS_GAS?'loading':'local';
const lastSent={};
function save(){
  S.savedAt=Date.now();
  saveLocal();
  if(!HAS_GAS) return;
  clearTimeout(saveTimer); saveTimer=setTimeout(flush, 700);
}
async function flush(){
  if(!HAS_GAS) return;
  if(writing){ pendingWrite=true; return; }
  writing=true;
  try{
    const items={};
    const sj=JSON.stringify(S.settings); if(lastSent.settings!==sj) items.settings=sj;
    for(const p of S.profiles){ const j=JSON.stringify(p); if(lastSent[p.id]!==j) items[p.id]=j; }
    if(Object.keys(items).length){ await gas('saveItems', items); Object.assign(lastSent, items); }
    syncState='cloud';
  }catch(e){ syncState='offline'; setTimeout(flush, 8000); }
  writing=false;
  if(pendingWrite){ pendingWrite=false; flush(); }
  updateSyncNote();
}
async function pull(rerender){
  if(!HAS_GAS || writing) return;
  try{
    const r = await gas('loadAll');
    if(r && r.settings){ S.settings=JSON.parse(r.settings); lastSent.settings=r.settings; const before=S.settings.ver; migrateSettings(); if(before!==S.settings.ver) setTimeout(flush,100); }
    for(const [id,j] of Object.entries((r&&r.profiles)||{})){
      const o=migrate(JSON.parse(j)); const i=S.profiles.findIndex(p=>p.id===id);
      if(i>=0) S.profiles[i]=o; else S.profiles.push(o);
      lastSent[id]=j;
    }
    saveLocal(); syncState='cloud';
    if(!r || !r.settings) flush();
    if(rerender) render();
  }catch(e){ syncState='offline'; }
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

