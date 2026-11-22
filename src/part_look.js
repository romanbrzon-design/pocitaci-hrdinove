/* ============ 🎨 Barvy oblečení – dítě si je nastaví samo ============ */
var LOOK_COLORS=['#e8435a','#ff7a45','#f2a900','#21b37a','#1fb5c9','#4f7cff','#c04cf5','#ff6fb5','#8a5a2b','#9a9aa8','#2b2b2b','#f5f0e6'];
function lookOpen(){
  const p=prof(view.pid); if(!p) return; const M=p.mode||'quest'; if(M==='pet') return;
  const parts = M==='home' ? [['top','👕 Tričko'],['bottom', p.gender==='f'?'👗 Sukně':'👖 Kalhoty']] : [['top','🧥 Tunika'],['cape','🦸 Plášť']];
  const m=document.createElement('div'); m.className='modal';
  const draw=()=>{ const l=lookOf(p);
    m.innerHTML=`<div class="card center" style="max-width:520px"><h2 style="margin:4px 0">🎨 Barvy oblečení</h2>
      <div style="max-width:170px;margin:0 auto">${M==='home'?kidSVG(p):heroImg(p)}</div>
      ${parts.map(([k,lab])=>`<div style="margin:10px 0"><b>${lab}</b><div class="swatches">${LOOK_COLORS.map(c=>`<button class="sw ${l[k]===c?'on':''}" data-part="${k}" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('')}${k!=='top'?`<button class="sw orig ${!l[k]?'on':''}" data-part="${k}" data-c="" title="Původní">↺</button>`:''}</div></div>`).join('')}
      ${M==='quest'?'<p class="muted" style="font-size:14px">Tunika je vidět, dokud nemáš rytířské brnění. Pak se barví plášť.</p>':''}
      <button class="btn gold" id="lkok">Hotovo</button></div>`;
    m.querySelectorAll('.sw').forEach(b=>b.onclick=()=>{ p.look=p.look||{}; const part=b.dataset.part, c=b.dataset.c; if(c) p.look[part]=c; else delete p.look[part]; if(part==='top' && c) p.color=c; save(); draw(); });
    m.querySelector('#lkok').onclick=()=>{ m.remove(); render(); };
  };
  draw(); document.body.appendChild(m);
}
const _actLook=act;
act=function(a){ if(a==='look') return lookOpen(); return _actLook(a); };
const _funHeroLook=funHeroHTML;
funHeroHTML=function(p){ const h=_funHeroLook(p); if(!p || p.mode==='pet') return h; return h.replace('<div class="funrow">','<div class="funrow"><button class="btn sec" data-act="look">🎨 Barvy oblečení</button>'); };
// koupená věc se rovnou použije / nasadí (je vždy lepší než ta dosavadní)
const _buyLook=buy;
buy=function(slot){ const p=prof(view.pid); const before=(p.owned||{})[slot]||0; _buyLook(slot);
  if(p && ((p.owned||{})[slot]||0)>before && ((p.eq||{})[slot]||0)<p.owned[slot]){ p.eq=p.eq||{}; p.eq[slot]=p.owned[slot]; if(p.newItem===slot+':'+p.owned[slot]) p.newItem=null; save(); render(); try{ toast(`🛍️ ${slotOf(p,slot).items[p.owned[slot]-1][0]} – koupeno a hned použito ✨`); }catch(e){} } };
// jednorázově: v domečku a u zvířátka nasadit koupené věci, které zůstaly ležet (dřív se musely nasazovat ručně)
function autoEqOnce(p){ if(!p || !p.mode || p.mode==='quest') return; const f=fx(p); if(f.autoEq) return; f.autoEq=1; p.eq=p.eq||{};
  for(const [s,n] of Object.entries(p.owned||{})) if(n>0 && !p.eq[s]) p.eq[s]=n; save(); }
const _heroAuto=funHeroHTML; funHeroHTML=function(p){ try{ autoEqOnce(p); }catch(e){} return _heroAuto(p); };
