
/* ==== 🧩 Zvídavé minihry – jen pro radost, bez bodů; obtížnost podle ročníku ====
   Rekordy: fx(p).mini[hra+úroveň]. Rodič může nastavit, že se otevřou až po splnění dnešního úkolu (S.settings.miniAfter, výchozí zapnuto). */
const MINI = [
  {id:'pex',  icon:'🃏', name:'Pexeso',            rec:'low',  unit:'tahů'},
  {id:'diff', icon:'🔍', name:'Najdi rozdíly',     rec:'low',  unit:'s'},
  {id:'bird', icon:'🐦', name:'Kdo to zpívá?',     rec:'high', unit:'z 8', soon:true},
  {id:'maze', icon:'🌀', name:'Bludiště',          rec:'low',  unit:'s'},
  {id:'puz',  icon:'🧩', name:'Skládačka',         rec:'low',  unit:'tahů'},
  {id:'mel',  icon:'🎵', name:'Zopakuj melodii',   rec:'high', unit:'tónů'},
  {id:'dots', icon:'✏️', name:'Spoj tečky',        rec:'low',  unit:'s'},
  {id:'col',  icon:'🎨', name:'Omalovánky'},
];
function miniLevel(p){ return Math.max(0, Math.min(3, +((p&&p.grade)||0))); }
function miniLocked(p){ if(!p || isTest(p) || (S.settings && S.settings.miniAfter===false)) return false; return !(p.today && p.today.date===todayKey() && p.today.done); }
function miniRec(p, id){ const m=fx(p).mini||{}; return m[id+miniLevel(p)]; }
function miniView(){
  const p=prof(view.pid); if(!p){ view={name:'home'}; return homeView(); }
  const g=view.g && MINI.find(x=>x.id===view.g);
  if(g) return `<div class="top"><button class="btn sec small" data-act="mini">← Minihry</button><h1>${g.icon} ${g.name}</h1></div><div class="card mgcard" id="mg"></div>`;
  const lock=miniLocked(p);
  return `<div class="top"><button class="btn sec small" data-act="hero">← Zpět</button><h1>🧩 Zvídavé minihry</h1></div>
    ${lock?`<div class="card center" style="font-size:19px">🔒 Minihry se otevřou, až splníš dnešní úkol.<div style="margin-top:10px"><button class="btn ok" data-act="play">🧮 Jdu na úkol</button></div></div>`:''}
    <div class="minigrid">${MINI.map(m=>{ const r=m.rec&&miniRec(p,m.id);
      return `<button class="mtile ${m.soon?'soon':''}" data-mini="${m.id}" ${lock||m.soon?'disabled':''}><span class="mti">${m.icon}</span><b>${m.name}</b><small>${m.soon?'už brzy':r!=null?`rekord ${r} ${m.unit}`:'&nbsp;'}</small></button>`; }).join('')}</div>`;
}
const _renderMini=render;
render=function(){
  if(view.name==='mini'){ $('#app').innerHTML=miniView(); bind(); updateSyncNote(); addReaders();
    document.querySelectorAll('[data-mini]').forEach(b=>b.onclick=()=>{ view={name:'mini',pid:view.pid,g:b.dataset.mini}; render(); window.scrollTo(0,0); });
    if(view.g){ const el=$('#mg'); try{ MINI_GAMES[view.g](el, prof(view.pid)); }catch(e){ el.textContent='Hru se nepodařilo spustit.'; } }
    return; }
  return _renderMini.apply(this, arguments);
};
const _actMini=act; act=function(a){ if(a==='mini'){ go({name:'mini',pid:view.pid}); return; } return _actMini(a); };
const _funHeroMini=funHeroHTML; funHeroHTML=function(p){ const h=_funHeroMini(p); if(!p) return h; return h.replace('<div class="funrow">',`<div class="funrow"><button class="btn ${miniLocked(p)?'sec':'gold'}" data-act="mini">🧩 Minihry${miniLocked(p)?' 🔒':''}</button>`); };

// ---- společné ----
function mk(tag, cls, html){ const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
function miniWin(el, p, id, score, msg){
  const g=MINI.find(x=>x.id===id), f=fx(p); f.mini=f.mini||{}; const k=id+miniLevel(p), old=f.mini[k];
  const better = old==null || (g.rec==='low' ? score<old : score>old); if(better){ f.mini[k]=score; save(); }
  try{ sfx('fanfare', better); confetti(better?50:25); }catch(e){}
  const box=mk('div','mgwin',`<div style="font-size:24px;font-weight:900">${msg||'🎉 Hotovo!'}</div><div style="margin:6px 0">${score} ${g.unit}${better?' – 🏆 nový rekord!':` (rekord ${old} ${g.unit})`}</div>`);
  const row=mk('div','row'); row.style.justifyContent='center';
  const again=mk('button','btn ok','🔁 Hrát znovu'); again.onclick=()=>render(); const back=mk('button','btn sec','← Minihry'); back.onclick=()=>go({name:'mini',pid:p.id});
  row.append(again, back); box.append(row); el.append(box); box.scrollIntoView({behavior:'smooth', block:'center'});
  if(readOn()) speak((msg||'Hotovo!').replace(/[^\p{L}\p{N}\s!.,]/gu,''));
}
const timer=()=>{ const t0=Date.now(); return ()=>Math.round((Date.now()-t0)/1000); };
const PEX_EMO=['🐶','🐱','🐰','🦊','🐼','🐸','🐵','🦁','🐯','🐮','🐷','🐔','🦄','🐙','🐢','🦋','🍎','🍌','🍓','🍉','⚽','🚗','🚀','🌈','⭐','🎈','🍦','🌻'];

const MINI_GAMES = {
  // 🃏 PEXESO
  pex(el, p){
    const L=miniLevel(p), n=[6,8,8,10][L];
    let mode='emo'; if(L>=2) mode=pick(L===2?['emo','sum','en']:['mul','en','sum']);
    const pairs=[];
    if(mode==='emo'){ for(const e of pickN(PEX_EMO,n)) pairs.push([`<span class="pxe">${e}</span>`,`<span class="pxe">${e}</span>`]); }
    else if(mode==='en'){ const pool=EN_PIC.filter(x=>x[3]<=L+1 && !x[1].startsWith('img:') && x[0].length<=8); const used=new Set();
      for(const w of shuffle(pool)){ if(pairs.length>=n) break; if(used.has(w[1])) continue; used.add(w[1]); pairs.push([`<span class="pxe">${w[1]}</span>`,`<span class="pxw">${w[0]}</span>`]); } }
    else { const used=new Set(); let g=0; while(pairs.length<n && g++<500){ let a,b,r; if(mode==='sum'){ a=ri(2,12); b=ri(1,20-a); r=a+b; } else { a=ri(2,9); b=ri(2,9); r=a*b; }
        if(used.has(r)) continue; used.add(r); pairs.push([`<span class="pxw">${a} ${mode==='sum'?'+':'·'} ${b}</span>`,`<span class="pxe pxn">${r}</span>`]); } }
    const cards=shuffle(pairs.flatMap((pr,i)=>[{i,h:pr[0]},{i,h:pr[1]}]));
    const info=mk('div','mginfo',`Najdi dvojice${mode==='sum'?' – příklad a jeho výsledek':mode==='mul'?' – příklad a jeho výsledek':mode==='en'?' – obrázek a anglické slovo':''}. Tahy: <b id="pxm">0</b>`);
    const grid=mk('div','pxgrid'); grid.style.gridTemplateColumns=`repeat(${cards.length>16?5:4},1fr)`;
    let open=[], moves=0, done=0, lock=false;
    cards.forEach(c=>{ const b=mk('button','pxc','<span class="pxb">❓</span><span class="pxf">'+c.h+'</span>'); c.b=b;
      b.onclick=()=>{ if(lock || b.classList.contains('open')) return; b.classList.add('open'); open.push(c);
        if(open.length<2) return; moves++; $('#pxm').textContent=moves; const [x,y]=open; open=[];
        if(x.i===y.i){ x.b.classList.add('ok'); y.b.classList.add('ok'); sfx('ok',Math.min(done,6)); done++; if(done===pairs.length) setTimeout(()=>miniWin(el,p,'pex',moves,'🎉 Všechny dvojice!'),500); }
        else { lock=true; setTimeout(()=>{ x.b.classList.remove('open'); y.b.classList.remove('open'); lock=false; },950); } };
      grid.append(b); });
    el.append(info, grid);
  },

  // 🔍 NAJDI ROZDÍLY
  diff(el, p){
    const L=miniLevel(p), O=[9,11,13,15][L], K=[3,5,6,7][L];
    const COLORFUL=['🌷','🌻','🐶','🐱','🦋','🐦','🍄','🚗','🎈','⚽','🐞','🍎','🐟','🌸','🦊','🐸','🍓','🚲','🪁','🐝'], OTHER=['🌳','🌲','🏠','☁️','☀️','🐌','⛵','🐰'];
    const cells=shuffle([...Array(20)].map((_,i)=>i)).slice(0,O), objs=cells.map(c=>{ const cx=c%5, cy=Math.floor(c/5);
      return {e:pick(COLORFUL.concat(OTHER)), x:10+cx*20+ri(-4,4), y:14+cy*24+ri(-4,4), s:.8+R()*.5, f:''}; });
    const right=objs.map(o=>Object.assign({},o)), types=L===0?['gone','swap']:['gone','swap','size','color'], diffs=[];
    for(const i of shuffle(objs.map((_,i)=>i)).slice(0,K)){ const o=right[i]; let t=pick(types); if(t==='color' && !COLORFUL.includes(o.e)) t='swap';
      if(t==='gone') o.gone=true; else if(t==='swap'){ o.e=pick(COLORFUL.concat(OTHER).filter(x=>x!==o.e && !objs.some(q=>q.e===x))); } else if(t==='size') o.s=o.s>1.05?o.s*.55:o.s*1.6; else o.f='hue-rotate(170deg) saturate(1.6)';
      diffs.push({i, x:o.x, y:o.y, found:false}); }
    const panel=(arr)=>{ const d=mk('div','sdp'); arr.forEach(o=>{ if(o.gone) return; const s=mk('span','sdo',o.e); s.style.cssText=`left:${o.x}%;top:${o.y}%;font-size:${9*o.s}cqw;${o.f?'filter:'+o.f:''}`; d.append(s); }); return d; };
    const A=panel(objs), B=panel(right), t=timer(); let found=0, miss=0;
    const info=mk('div','mginfo',`Najdi <b>${K}</b> rozdílů a klepni na ně. Nalezeno: <b id="dfn">0</b>/${K}`);
    const mark=(d)=>{ for(const pn of [A,B]){ const c=mk('span','sdmark'); c.style.cssText=`left:${d.x}%;top:${d.y}%`; pn.append(c); } };
    const tap=(pn)=>(ev)=>{ const r=pn.getBoundingClientRect(), x=(ev.clientX-r.left)/r.width*100, y=(ev.clientY-r.top)/r.height*100;
      const d=diffs.find(d=>!d.found && Math.abs(d.x-x)<10 && Math.abs(d.y-y)<13);
      if(d){ d.found=true; found++; mark(d); sfx('ok',found); $('#dfn').textContent=found; if(found===K) setTimeout(()=>miniWin(el,p,'diff',t(),'🎉 Všechny rozdíly nalezeny!'),400); }
      else { miss++; sfx('tap'); pn.classList.remove('shake'); void pn.offsetWidth; pn.classList.add('shake'); } };
    A.onclick=tap(A); B.onclick=tap(B);
    const hint=mk('button','btn sec small','💡 Nápověda'); hint.onclick=()=>{ const d=diffs.find(d=>!d.found); if(!d) return; for(const pn of [A,B]){ const c=mk('span','sdhint'); c.style.cssText=`left:${d.x}%;top:${d.y}%`; pn.append(c); setTimeout(()=>c.remove(),1400); } };
    const wrap=mk('div','sdwrap'); wrap.append(A,B); el.append(info, wrap, hint);
  },

  // 🐦 KDO TO ZPÍVÁ? – poslech nahrávky, výběr zvířete; 8 kol, body za správnou odpověď napoprvé
  bird(el, p){
    const L=miniLevel(p), pool=BIRDS.filter(b=>L===0?b.lvl===0:L===3?b.lvl>0:b.lvl<=L), sn=b=>b.snd||('z_'+b.id), nOpt=L<2?3:4, ROUNDS=8;
    const c=SND.init(); let src=null, alive=true;
    const info=mk('div','mginfo','Načítám zvuky…'); el.append(info);
    const need=pool.map(sn); need.forEach(n=>SND.load(n));
    const stop=()=>{ try{ if(src) src.stop(); }catch(e){} src=null; };
    const play=b=>{ stop(); const buf=SND.buf[sn(b)]; if(!c||!buf) return; if(c.state==='suspended') c.resume().catch(()=>{});
      src=c.createBufferSource(); src.buffer=buf; const g=c.createGain(); g.gain.value=1; src.connect(g); g.connect(SND.out); src.start(); };
    const obs=new MutationObserver(()=>{ if(!document.body.contains(el)){ stop(); alive=false; obs.disconnect(); } }); obs.observe(document.body,{childList:true,subtree:true});
    let tries=0; const wait=()=>{ if(!alive) return; const ok=pool.filter(b=>SND.buf[sn(b)]); const pending=need.some(n=>SND.buf[n]===null);
      if(pending && tries++<40) return setTimeout(wait,150);
      if(ok.length<nOpt){ info.textContent='Zvuky se ještě připravují – zkus to prosím později. 🙂'; return; }
      start(ok); };
    const pic=b=>b.img?`<img class="brdimg" src="${A_}bird/${b.id}.webp" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'brdemo',textContent:'${b.emo}'}))">`:`<span class="brdemo">${b.emo}</span>`;
    const start=ok=>{
      let round=0, score=0, last=null; info.textContent='Poslechni si zvuk a klepni, kdo to je.';
      const head=mk('div','mglvl center',''); const btn=mk('button','btn ok brdplay','🔊 Pustit znovu'); const opts=mk('div','brdopts'); const fact=mk('div','brdfact','');
      el.append(head, btn, opts, fact);
      const next=()=>{ if(round>=ROUNDS){ stop(); btn.remove(); opts.remove(); return miniWin(el,p,'bird',score, score>=ROUNDS-1?'🎉 Výborné ucho!':score>=ROUNDS/2?'👏 Pěkně jsi poslouchal'+(p.gender==='f'?'a':'')+'!':'🙂 Příště to půjde ještě líp!'); }
        round++; let first=true; fact.textContent=''; head.textContent=`Kolo ${round} z ${ROUNDS} · ⭐ ${score}`;
        const cand=ok.filter(b=>b!==last); const ans=pick(cand); last=ans;
        const others=shuffle(ok.filter(b=>b!==ans)).slice(0,nOpt-1), list=shuffle([ans,...others]);
        opts.innerHTML=''; btn.onclick=()=>play(ans); play(ans);
        list.forEach(b=>{ const o=mk('button','brdopt',`${pic(b)}<b>${b.name}</b>`); o.onclick=()=>{ if(o.disabled) return;
          if(b===ans){ stop(); sfx('ok'); if(first) score++; o.classList.add('good'); opts.querySelectorAll('.brdopt').forEach(x=>x.disabled=true);
            fact.innerHTML=`${ans.emo} ${ans.fact}`; if(readOn()) speak(ans.fact.replace(/[^\p{L}\p{N}\s!.,–-]/gu,''));
            const go=mk('button','btn ok',round>=ROUNDS?'🏁 Hotovo':'➡️ Další'); go.onclick=()=>{ go.remove(); next(); }; fact.append(document.createElement('br'), go); }
          else { first=false; sfx('bad'); o.classList.add('bad'); o.disabled=true; } };
          opts.append(o); }); };
      next(); };
    setTimeout(wait,100);
  },

  // 🌀 BLUDIŠTĚ
  maze(el, p){
    const L=miniLevel(p), N=[5,7,9,11][L], W=[...Array(N*N)].map(()=>({t:1,r:1,b:1,l:1})), seen=new Set([0]), st=[0];
    while(st.length){ const c=st[st.length-1], x=c%N, y=Math.floor(c/N), nb=[];
      if(y>0&&!seen.has(c-N)) nb.push([c-N,'t','b']); if(x<N-1&&!seen.has(c+1)) nb.push([c+1,'r','l']); if(y<N-1&&!seen.has(c+N)) nb.push([c+N,'b','t']); if(x>0&&!seen.has(c-1)) nb.push([c-1,'l','r']);
      if(!nb.length){ st.pop(); continue; } const [n,a,b]=pick(nb); W[c][a]=0; W[n][b]=0; seen.add(n); st.push(n); }
    const hero = p.mode==='pet' ? ({cat:'🐱',dog:'🐶',bunny:'🐰',pony:'🐴',rat:'🐀',hamster:'🐹',fox:'🦊',panda:'🐼',owl:'🦉',dragon:'🐲'}[p.species]||'🐾') : (p.gender==='f'?'👧':'👦');
    const grid=mk('div','mzgrid'); grid.style.gridTemplateColumns=`repeat(${N},1fr)`; const cells=W.map((w,i)=>{ const d=mk('div','mzc'); d.style.cssText=`border-top-width:${w.t?3:0}px;border-right-width:${w.r?3:0}px;border-bottom-width:${w.b?3:0}px;border-left-width:${w.l?3:0}px`; grid.append(d); return d; });
    let pos=0; const goal=N*N-1, t=timer(); let won=false; cells[goal].innerHTML='<span class="mzg">🎁</span>';
    const path=[0]; // prošlá cesta (bez slepých odboček – návratem se stopa maže)
    const draw=()=>{ const on=new Set(path); cells.forEach((c,i)=>{ c.classList.toggle('trail', on.has(i)); const h=c.querySelector('.mzh'); if(h) h.remove(); }); cells[pos].append(mk('span','mzh',hero)); };
    const win=()=>{ if(pos===goal && !won){ won=true; setTimeout(()=>miniWin(el,p,'maze',t(),'🎉 Došel jsi k pokladu!'.replace('Došel jsi', p.gender==='f'?'Došla jsi':'Došel jsi')),300); } };
    const step=(dir)=>{ if(won) return false; const w=W[pos], x=pos%N; const m={t:[-N,w.t],r:[1,w.r||x===N-1],b:[N,w.b],l:[-1,w.l||x===0]}[dir]; if(m[1]) return false; pos+=m[0];
      if(path.length>1 && path[path.length-2]===pos) path.pop(); else path.push(pos); return true; };
    const move=(dir, run)=>{ let k=0; while(step(dir)){ k++; if(!run) break; const w=W[pos], open=['t','r','b','l'].filter(d=>!w[d]).length; if(open!==2 || pos===goal) break; const opp={t:'b',b:'t',l:'r',r:'l'}[dir]; if(w[dir]){ dir=['t','r','b','l'].find(d=>!w[d]&&d!==opp); } }
      if(k){ sfx('tick'); draw(); win(); } else sfx('tap'); };
    // ✍️ kreslení cesty prstem: začít na hrdinovi nebo na už prošlé cestě a táhnout chodbami
    const cellAt=e=>{ const r=grid.getBoundingClientRect(), x=Math.floor((e.clientX-r.left)/r.width*N), y=Math.floor((e.clientY-r.top)/r.height*N); return x<0||y<0||x>=N||y>=N ? -1 : y*N+x; };
    const toward=c=>{ let k=0; for(let g=0; g<2*N && pos!==c && !won; g++){ const dx=c%N-pos%N, dy=Math.floor(c/N)-Math.floor(pos/N);
        const ds=[Math.abs(dx)>=Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'b':'t'), Math.abs(dx)>=Math.abs(dy)?(dy>0?'b':dy<0?'t':null):(dx>0?'r':dx<0?'l':null)].filter(Boolean);
        if(!ds.some(d=>step(d))) break; k++; }
      if(k){ sfx('tick'); draw(); win(); } };
    let drag=false;
    grid.addEventListener('pointerdown',e=>{ if(won) return; const c=cellAt(e); if(c<0) return; const i=path.indexOf(c);
      if(i<0 && !(Math.abs(c%N-pos%N)+Math.abs(Math.floor(c/N)-Math.floor(pos/N))===1)){ const h=cells[pos].querySelector('.mzh'); if(h){ h.classList.remove('dtbad'); void h.offsetWidth; h.classList.add('dtbad'); } sfx('tap'); return; }
      drag=true; try{ grid.setPointerCapture(e.pointerId); }catch(_){}
      if(i>=0 && c!==pos){ path.length=i+1; pos=c; sfx('tick'); draw(); } else toward(c); e.preventDefault(); });
    grid.addEventListener('pointermove',e=>{ if(!drag) return; const c=cellAt(e); if(c>=0 && c!==pos) toward(c); });
    const end=()=>{ drag=false; }; grid.addEventListener('pointerup',end); grid.addEventListener('pointercancel',end);
    grid.style.touchAction='none';
    const pad=mk('div','mzpad'); [['t','⬆️'],['l','⬅️'],['r','➡️'],['b','⬇️']].forEach(([d,i])=>{ const b=mk('button','btn sec mzb mz'+d,i); b.onclick=()=>move(d,false); pad.append(b); });
    const kd=e=>{ if(view.g!=='maze'){ removeEventListener('keydown',kd); return; } const d={ArrowUp:'t',ArrowDown:'b',ArrowLeft:'l',ArrowRight:'r'}[e.key]; if(d){ e.preventDefault(); move(d,false); } }; addEventListener('keydown',kd);
    el.append(mk('div','mginfo',`Doveď ${hero} k dárku 🎁. Táhni prstem od ${hero} chodbami, nebo použij šipky.`), grid, pad); draw();
  },

  // 🧩 SKLÁDAČKA (prohazování dílků)
  puz(el, p){
    const L=miniLevel(p), G=[2,3,3,4][L], img=A_+pick(['stkset_cz','stkset_dn','stkset_ls','stkset_sv','stkset_tl','stkset_vs'])+'.webp';
    let order=[...Array(G*G)].map((_,i)=>i); do{ order=shuffle(order); }while(order.every((v,i)=>v===i));
    const grid=mk('div','pzgrid'); grid.style.gridTemplateColumns=`repeat(${G},1fr)`; let sel=null, moves=0;
    const draw=()=>{ grid.innerHTML=''; order.forEach((v,i)=>{ const b=mk('button','pzp'+(v===i?' ok':'')+(sel===i?' sel':'')); b.style.backgroundImage=`url(${img})`; b.style.backgroundSize=`${G*100}% ${G*100}%`;
      b.style.backgroundPosition=`${(v%G)/(G-1)*100}% ${Math.floor(v/G)/(G-1)*100}%`; b.onclick=()=>{ if(sel===null){ sel=i; sfx('tap'); } else if(sel===i) sel=null; else { [order[sel],order[i]]=[order[i],order[sel]]; moves++; const ok=order[sel]===sel||order[i]===i; sel=null; sfx(ok?'pop':'tap');
        if(order.every((v,k)=>v===k)){ draw(); setTimeout(()=>miniWin(el,p,'puz',moves,'🎉 Obrázek je složený!'),300); return; } } draw(); }; grid.append(b); }); };
    const prev=mk('div','pzprev',`<img src="${img}" alt="">`);
    el.append(mk('div','mginfo','Klepni na dva dílky a prohodí se. Zelený rámeček = dílek už sedí.'), grid, mk('div','muted center','Předloha:'), prev); draw();
  },

  // 🎵 ZOPAKUJ MELODII
  mel(el, p){
    const L=miniLevel(p), PADS=[['#e8323c','🐞',60],['#2f6fe0','🐳',64],['#f7d02c','🐤',67],['#2fae4f','🐸',72]].slice(0,L===0?3:4), sp=[750,620,520,440][L];
    let seq=[], inp=0, busyM=true; const info=mk('div','mginfo','Poslouchej a pak klepni na zvířátka ve stejném pořadí.'), lvl=mk('div','center mglvl','Délka: 0');
    const grid=mk('div','mlgrid'); const btns=PADS.map((pd,i)=>{ const b=mk('button','mlp',pd[1]); b.style.background=pd[0]; b.onclick=()=>press(i); grid.append(b); return b; });
    const flash=(i)=>{ const b=btns[i]; b.classList.add('lit'); setTimeout(()=>b.classList.remove('lit'),sp*.6); try{ const c=SND.init(); if(c && SND.on()) SND.tone(N(PADS[i][2]),c.currentTime,sp/1000*.7,{type:'triangle',vol:.3}); }catch(e){} };
    const play=()=>{ busyM=true; seq.push(ri(0,PADS.length-1)); lvl.textContent='Délka: '+seq.length; inp=0; seq.forEach((v,k)=>setTimeout(()=>flash(v),600+k*sp)); setTimeout(()=>{ busyM=false; },600+seq.length*sp); };
    const press=(i)=>{ if(busyM) return; flash(i);
      if(i!==seq[inp]){ busyM=true; sfx('bad'); setTimeout(()=>miniWin(el,p,'mel',seq.length-1,seq.length-1>0?`👏 Zapamatoval${p.gender==='f'?'a':''} sis ${seq.length-1} ${plural(seq.length-1,'tón','tóny','tónů')}!`:'Zkus to znovu 🙂'),500); return; }
      inp++; if(inp===seq.length){ busyM=true; setTimeout(()=>{ sfx('ok',Math.min(seq.length,8)); setTimeout(play,500); },400); } };
    const start=mk('button','btn ok','▶️ Začít'); start.onclick=()=>{ start.remove(); play(); };
    el.append(info, lvl, grid, start);
  },

  // ✏️ SPOJ TEČKY
  dots(el, p){
    const L=miniLevel(p), SH=DOT_SHAPES.filter(s=>L>0 || s.pts.length<=10), s=pick(SH), target=[s.pts.length,14,20,26][L];
    // doplnit body na hranách, aby jich bylo kolem `target` (rohy zůstanou)
    let pts=s.pts.map(q=>q.slice()); while(pts.length<target){ let bi=0, bl=0; for(let i=0;i<pts.length;i++){ const a=pts[i], b=pts[(i+1)%pts.length], l=Math.hypot(a[0]-b[0],a[1]-b[1]); if(l>bl){ bl=l; bi=i; } }
      const a=pts[bi], b=pts[(bi+1)%pts.length], j=(Math.random()-.5)*Math.min(5,bl*.25), nx=-(b[1]-a[1])/(bl||1), ny=(b[0]-a[0])/(bl||1); pts.splice(bi+1,0,[(a[0]+b[0])/2+nx*j,(a[1]+b[1])/2+ny*j].map(v=>Math.round(v*10)/10)); }
    const stepN=L>=3?pick([1,2,5]):L===2?pick([1,2]):1, lab=i=>(i+1)*stepN;
    const NS='http://www.w3.org/2000/svg', svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox','-4 -4 108 108'); svg.classList.add('dtsvg');
    const fill=document.createElementNS(NS,'polygon'); fill.setAttribute('points',pts.map(q=>q.join(',')).join(' ')); fill.setAttribute('fill','transparent'); svg.append(fill);
    const line=document.createElementNS(NS,'polyline'); line.setAttribute('fill','none'); line.setAttribute('stroke','#2b2340'); line.setAttribute('stroke-width','1.4'); line.setAttribute('stroke-linejoin','round'); svg.append(line);
    // falešné tečky bez čísel – aby obrys nebyl vidět předem (dál od skutečných teček i čar obrazce)
    const segD=(c,a,b)=>{ const dx=b[0]-a[0], dy=b[1]-a[1], l2=dx*dx+dy*dy||1, u=Math.max(0,Math.min(1,((c[0]-a[0])*dx+(c[1]-a[1])*dy)/l2)); return Math.hypot(c[0]-a[0]-u*dx, c[1]-a[1]-u*dy); };
    const fakeN=[14,20,26,32][L], fakes=[];
    for(let k=0;k<4000 && fakes.length<fakeN;k++){ const c=[4+Math.random()*92, 4+Math.random()*92].map(v=>Math.round(v*10)/10);
      if(pts.some(q=>Math.hypot(q[0]-c[0],q[1]-c[1])<10)) continue;
      if(pts.some((a,i)=>segD(c,a,pts[(i+1)%pts.length])<4.5)) continue;
      if(fakes.some(q=>Math.hypot(q[0]-c[0],q[1]-c[1])<9)) continue;
      fakes.push(c); }
    const fakeEls=fakes.map(q=>{ const g=document.createElementNS(NS,'g'); g.innerHTML=`<circle class="dtd" cx="${q[0]}" cy="${q[1]}" r="1.9"/>`; g._hit=()=>{ sfx('tap'); g.classList.remove('dtbad'); void g.getBBox(); g.classList.add('dtbad'); }; svg.append(g); return g; });
    let next=0; const t=timer(), drawn=[];
    const dots=pts.map((q,i)=>{ const g=document.createElementNS(NS,'g'); g.innerHTML=`<circle class="dtd" cx="${q[0]}" cy="${q[1]}" r="1.9"/><text x="${q[0]+2.4}" y="${q[1]-2.2}" font-size="${pts.length>20?3.6:4.4}" font-weight="800" fill="#6b4a1f">${lab(i)}</text>`;
      g.style.cursor='pointer'; g._hit=()=>{ if(next>=pts.length) return; if(i!==next){ sfx('tap'); g.classList.remove('dtbad'); void g.getBBox(); g.classList.add('dtbad'); return; }
        drawn.push(q); next++; g.classList.add('dtok'); sfx('tick');
        if(next===pts.length){ drawn.push(pts[0]); line.setAttribute('points',drawn.map(q=>q.join(',')).join(' ')); fill.setAttribute('fill',s.color); fill.style.transition='fill .6s'; fakeEls.forEach(g=>{ g.style.transition='opacity .6s'; g.style.opacity='0'; g.style.pointerEvents='none'; });
          const e=document.createElementNS(NS,'text'); e.setAttribute('x','50'); e.setAttribute('y','58'); e.setAttribute('text-anchor','middle'); e.setAttribute('font-size','22'); e.textContent=s.emo; svg.append(e);
          setTimeout(()=>miniWin(el,p,'dots',t(),`🎉 Je to ${s.name}!`),600); return; }
        line.setAttribute('points',drawn.map(q=>q.join(',')).join(' ')); };
      svg.append(g); return g; });
    // klepnutí patří vždy NEJBLIŽŠÍ tečce (skutečné i falešné) – husté tečky se navzájem nepřekrývají
    const allP=[...pts.map((q,i)=>[q,dots[i]]), ...fakes.map((q,i)=>[q,fakeEls[i]])];
    svg.addEventListener('click',ev=>{ const m=svg.getScreenCTM(); if(!m) return; const pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; const c=pt.matrixTransform(m.inverse());
      let best=null, bd=8; allP.forEach(([q,g])=>{ const d=Math.hypot(q[0]-c.x,q[1]-c.y); if(d<bd && g.style.pointerEvents!=='none'){ bd=d; best=g; } }); if(best) best._hit(); });
    el.append(mk('div','mginfo',`Spoj tečky od ${lab(0)} ${stepN>1?`(počítej po ${stepN}) `:''}až do ${lab(pts.length-1)}. Co se objeví?`), svg);
  },

  // 🎨 OMALOVÁNKY
  col(el, p){
    const f=fx(p); f.om=f.om||{}; let pic=view.pic||0, cur='#e8323c';
    const COLS=['#e8323c','#ff8c1a','#f7d02c','#7cc24f','#2fae4f','#5aa9e6','#2f6fe0','#9b4dd6','#ff8fc8','#8a5a2b','#9e9e9e','#2b2b2b','#ffffff'];
    const chooser=mk('div','omch'); OMAL.forEach((o,i)=>{ const b=mk('button','btn small '+(i===pic?'':'sec'),o.icon+' '+o.name); b.onclick=()=>{ view.pic=i; render(); }; chooser.append(b); });
    const holder=mk('div','omsvg'); holder.innerHTML=OMAL[pic].svg; const svg=holder.querySelector('svg');
    const saved=f.om[pic]||{}; svg.querySelectorAll('.rg').forEach((r,i)=>{ r.dataset.i=i; r.setAttribute('fill',saved[i]||'#ffffff'); r.onclick=()=>{ r.setAttribute('fill',cur); saved[i]=cur; f.om[pic]=saved; sfx('pop'); clearTimeout(f._omT); f._omT=setTimeout(()=>{ delete f._omT; save(); },800); }; });
    const pal=mk('div','ompal'); COLS.forEach(c=>{ const b=mk('button','omc'+(c===cur?' on':'')); b.style.background=c; b.onclick=()=>{ cur=c; pal.querySelectorAll('.omc').forEach(x=>x.classList.toggle('on',x===b)); sfx('tap'); }; pal.append(b); });
    const clr=mk('button','btn sec small','🧽 Vymazat obrázek'); clr.onclick=()=>{ f.om[pic]={}; save(); render(); };
    el.append(chooser, mk('div','mginfo','Vyber barvu a klepni do obrázku.'), pal, holder, clr);
  },
};
// „Kdo to zpívá?“ – nahrávky assets/snd/z_<id>.mp3 (zdroje v ZDROJE.txt), obrázek assets/bird/<id>.webp (když img:true), jinak emoji
// lvl 0 = dvorek (od nejmenších), 1 = známí ptáci, 2 = těžší ptáci (od 2. ročníku)
const BIRDS = [
  {id:'krava',   name:'kráva',   emo:'🐄', lvl:0, fact:'Kráva dává mléko – vyrábí se z něj sýr, máslo i jogurt.'},
  {id:'kohout',  name:'kohout',  emo:'🐓', lvl:0, fact:'Kohout kokrhá hlavně brzy ráno. Slepice snášejí vajíčka.'},
  {id:'ovce',    name:'ovce',    emo:'🐑', lvl:0, fact:'Z ovčí vlny se pletou teplé svetry a čepice.'},
  {id:'koza',    name:'koza',    emo:'🐐', lvl:0, fact:'Kozy výborně šplhají. Z kozího mléka se dělá sýr.'},
  {id:'kachna',  name:'kachna',  emo:'🦆', lvl:0, fact:'Kachna má mezi prsty blány, a proto dobře plave.'},
  {id:'prase',   name:'prasátko',emo:'🐖', lvl:0, fact:'Prasata se válejí v bahně, aby se v horku ochladila.'},
  {id:'pes',     name:'pejsek',  emo:'🐕', lvl:0, fact:'Pes má výborný čich – pozná, kudy šel člověk.', snd:'dog1'},
  {id:'kocka',   name:'kočka',   emo:'🐈', lvl:0, fact:'Kočka vidí i v šeru a ráda si přede.', snd:'cat1'},
  {id:'kukacka', name:'kukačka', emo:'🐦', img:true, lvl:1, fact:'Kukačka klade vajíčka do hnízd jiných ptáků.'},
  {id:'sova',    name:'sova (puštík)', emo:'🦉', img:true, lvl:1, fact:'Puštík loví v noci. Skvěle slyší i myš pod listím.'},
  {id:'holub',   name:'holub',   emo:'🕊️', img:true, lvl:1, fact:'Holubi vrkají. Poštovní holub najde cestu domů i zdaleka.'},
  {id:'vrana',   name:'vrána',   emo:'🐦‍⬛', img:true, lvl:1, fact:'Vrány patří k nejchytřejším ptákům.'},
  {id:'kos',     name:'kos',     emo:'🐦', img:true, lvl:2, fact:'Sameček kosa je černý se žlutým zobákem a zpívá často už za úsvitu.'},
  {id:'sykora',  name:'sýkora koňadra', emo:'🐦', img:true, lvl:2, fact:'Sýkora koňadra volá „ci-ci-bé“ a v zimě ráda chodí ke krmítku.'},
  {id:'vrabec',  name:'vrabec',  emo:'🐦', img:true, lvl:2, fact:'Vrabci žijí v hejnech blízko lidí a hlasitě čimčarají.'},
  {id:'datel',   name:'datel',   emo:'🐦', img:true, lvl:2, fact:'Datel bubnuje zobákem do stromu – tak si označuje své území.'},
  {id:'cap',     name:'čáp',     emo:'🐦', img:true, lvl:2, fact:'Čáp bílý skoro nezpívá – klape zobákem. Na zimu odlétá do Afriky.'},
];
// tvary pro spojování teček (souřadnice 0–100, po směru hodinových ručiček)
const DOT_SHAPES = [
  {name:'domeček', emo:'🏠', color:'#ffd6a5', pts:[[20,92],[20,48],[50,14],[80,48],[80,92]]},
  {name:'kosočtverec', emo:'💎', color:'#a5d8ff', pts:[[50,6],[86,50],[50,94],[14,50]]},
  {name:'hvězda', emo:'⭐', color:'#fff3a3', pts:[...Array(10)].map((_,i)=>{ const a=-Math.PI/2+i*Math.PI/5, r=i%2?20:46; return [50+r*Math.cos(a), 53+r*Math.sin(a)].map(v=>Math.round(v*10)/10); })},
  {name:'raketa', emo:'🚀', color:'#ffc9de', pts:[[50,4],[64,26],[64,66],[80,90],[60,82],[40,82],[20,90],[36,66],[36,26]]},
  {name:'ryba', emo:'🐟', color:'#b5f0c8', pts:[[8,50],[26,30],[52,24],[72,36],[94,20],[94,80],[72,64],[52,76],[26,70]]},
  {name:'stromeček', emo:'🎄', color:'#9be59b', pts:[[50,4],[70,30],[60,30],[78,56],[62,56],[84,82],[56,82],[56,96],[44,96],[44,82],[16,82],[38,56],[22,56],[40,30],[30,30]]},
  {name:'srdíčko', emo:'❤️', color:'#ffb3b3', pts:[...Array(16)].map((_,i)=>{ const t=Math.PI/2 - i*2*Math.PI/16; const x=16*Math.sin(t)**3, y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t); return [Math.round((50+x*2.7)*10)/10, Math.round((46-y*2.7)*10)/10]; })},
  {name:'kočička', emo:'🐱', color:'#ffe0b2', pts:[[18,92],[12,50],[16,8],[38,30],[62,30],[84,8],[88,50],[82,92]]},
];
// omalovánky – každý vybarvitelný díl má třídu rg
const OMS = (body)=>`<svg viewBox="0 0 200 160" stroke="#2b2340" stroke-width="2" stroke-linejoin="round">${body}</svg>`;
const OMAL = [
  {name:'Domeček', icon:'🏠', svg:OMS(`<rect class="rg" x="0" y="0" width="200" height="110"/><rect class="rg" x="0" y="110" width="200" height="50"/><circle class="rg" cx="165" cy="30" r="17"/>
    <ellipse class="rg" cx="45" cy="28" rx="24" ry="11"/><rect class="rg" x="50" y="70" width="80" height="62"/><polygon class="rg" points="42,72 90,32 138,72"/><rect class="rg" x="80" y="96" width="20" height="36"/>
    <rect class="rg" x="58" y="82" width="16" height="16"/><rect class="rg" x="106" y="82" width="16" height="16"/><rect class="rg" x="160" y="88" width="10" height="34"/><circle class="rg" cx="165" cy="78" r="18"/>`)},
  {name:'Rybička', icon:'🐟', svg:OMS(`<rect class="rg" x="0" y="0" width="200" height="160"/><ellipse class="rg" cx="95" cy="80" rx="50" ry="30"/><polygon class="rg" points="140,80 180,52 180,108"/><polygon class="rg" points="85,52 105,30 115,55"/>
    <polygon class="rg" points="80,106 100,124 108,104"/><circle class="rg" cx="68" cy="74" r="8"/><circle fill="#2b2340" cx="66" cy="74" r="3"/><path class="rg" d="M100,58 Q110,80 100,102"/><circle class="rg" cx="40" cy="40" r="6"/><circle class="rg" cx="30" cy="22" r="4"/>
    <path class="rg" d="M20,160 Q10,130 24,110 Q34,130 30,160 Z"/><path class="rg" d="M170,160 Q160,136 174,120 Q184,138 180,160 Z"/>`)},
  {name:'Kytička', icon:'🌸', svg:OMS(`<rect class="rg" x="0" y="0" width="200" height="160"/><rect class="rg" x="96" y="70" width="8" height="58"/><ellipse class="rg" cx="80" cy="104" rx="16" ry="7" transform="rotate(-30 80 104)"/><ellipse class="rg" cx="120" cy="98" rx="16" ry="7" transform="rotate(30 120 98)"/>
    ${[...Array(6)].map((_,i)=>{ const a=i*Math.PI/3; return `<circle class="rg" cx="${100+22*Math.cos(a)}" cy="${48+22*Math.sin(a)}" r="14"/>`; }).join('')}<circle class="rg" cx="100" cy="48" r="13"/><polygon class="rg" points="72,124 128,124 120,156 80,156"/>`)},
  {name:'Auto', icon:'🚗', svg:OMS(`<rect class="rg" x="0" y="0" width="200" height="120"/><rect class="rg" x="0" y="120" width="200" height="40"/><rect class="rg" x="30" y="74" width="140" height="34" rx="8"/><polygon class="rg" points="60,74 76,46 130,46 146,74"/>
    <polygon class="rg" points="72,72 82,52 100,52 100,72"/><polygon class="rg" points="106,72 106,52 126,52 136,72"/><circle class="rg" cx="64" cy="110" r="15"/><circle class="rg" cx="64" cy="110" r="6"/><circle class="rg" cx="138" cy="110" r="15"/><circle class="rg" cx="138" cy="110" r="6"/>
    <rect class="rg" x="160" y="82" width="10" height="8"/><circle class="rg" cx="170" cy="26" r="14"/>`)},
  {name:'Motýl', icon:'🦋', svg:OMS(`<rect class="rg" x="0" y="0" width="200" height="160"/><ellipse class="rg" cx="68" cy="58" rx="34" ry="28" transform="rotate(-20 68 58)"/><ellipse class="rg" cx="132" cy="58" rx="34" ry="28" transform="rotate(20 132 58)"/>
    <ellipse class="rg" cx="74" cy="108" rx="24" ry="20" transform="rotate(20 74 108)"/><ellipse class="rg" cx="126" cy="108" rx="24" ry="20" transform="rotate(-20 126 108)"/><circle class="rg" cx="64" cy="56" r="10"/><circle class="rg" cx="136" cy="56" r="10"/>
    <circle class="rg" cx="76" cy="108" r="7"/><circle class="rg" cx="124" cy="108" r="7"/><ellipse class="rg" cx="100" cy="84" rx="8" ry="40"/><path fill="none" d="M96,46 Q86,22 76,18 M104,46 Q114,22 124,18"/>`)},
  {name:'Raketa', icon:'🚀', svg:OMS(`<rect class="rg" x="0" y="0" width="200" height="160"/><polygon class="rg" points="100,8 124,44 124,112 76,112 76,44"/><polygon class="rg" points="76,80 54,118 76,108"/><polygon class="rg" points="124,80 146,118 124,108"/>
    <circle class="rg" cx="100" cy="64" r="12"/><polygon class="rg" points="84,112 116,112 108,140 100,128 92,140"/><polygon class="rg" points="30,30 34,40 44,40 36,46 40,56 30,50 20,56 24,46 16,40 26,40"/><circle class="rg" cx="160" cy="38" r="16"/><circle class="rg" cx="170" cy="120" r="6"/>`)},
];
