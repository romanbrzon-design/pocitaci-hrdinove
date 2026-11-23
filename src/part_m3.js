
/* ---- Matematika – další okruhy 1.–3. třídy (podle tematických plánů učebnic) ---- */
const numOpts = (right, cands) => { const s=new Set([right]); for(const c of shuffle(cands)) if(s.size<4 && c>=0 && !s.has(c)) s.add(c); return shuffle([...s]); };
const hodinW = h => h===1?'hodina':h<=4?'hodiny':'hodin';
function clockLabel(h, m){ const n=h%12+1;
  if(m===0) return `${h} ${hodinW(h)}`; if(m===30) return `půl ${n}`; if(m===15) return `čtvrt na ${n}`; return `tři čtvrtě na ${n}`; }
function clockSvg(h, m){
  const ha=((h%12)+m/60)*30, ma=m*6, tick=[...Array(12)].map((_,i)=>{ const a=i*30*Math.PI/180, r1=i%3?40:36; return `<line x1="${50+r1*Math.sin(a)}" y1="${50-r1*Math.cos(a)}" x2="${50+44*Math.sin(a)}" y2="${50-44*Math.cos(a)}" stroke="#3b2412" stroke-width="${i%3?1.5:3}"/>`; }).join('');
  const num=[12,3,6,9].map((n,i)=>{ const a=i*90*Math.PI/180; return `<text x="${50+29*Math.sin(a)}" y="${50-29*Math.cos(a)+5}" text-anchor="middle" font-size="13" font-weight="800" fill="#3b2412">${n}</text>`; }).join('');
  return `<svg viewBox="0 0 100 100" width="170" height="170"><circle cx="50" cy="50" r="47" fill="#fffaf0" stroke="#8a5a2b" stroke-width="4"/>${tick}${num}
    <line x1="50" y1="50" x2="${50+24*Math.sin(ha*Math.PI/180)}" y2="${50-24*Math.cos(ha*Math.PI/180)}" stroke="#2b2340" stroke-width="5" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="${50+37*Math.sin(ma*Math.PI/180)}" y2="${50-37*Math.cos(ma*Math.PI/180)}" stroke="#e0614a" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="3.5" fill="#2b2340"/></svg>`;
}
function axisSvg(start, step, v){
  const n=10, x=i=>12+i*27.6, ticks=[...Array(n+1)].map((_,i)=>{ const val=start+i*step, big=val%(step*5)===0;
    return `<line x1="${x(i)}" y1="${big?30:34}" x2="${x(i)}" y2="46" stroke="#3b2412" stroke-width="${big?2.5:1.5}"/>${big?`<text x="${x(i)}" y="64" text-anchor="middle" font-size="13" font-weight="800" fill="#3b2412">${val}</text>`:''}`; }).join('');
  const ax=x((v-start)/step);
  return `<svg viewBox="0 0 300 72" width="320" height="78"><line x1="6" y1="40" x2="294" y2="40" stroke="#3b2412" stroke-width="2.5"/>${ticks}<path d="M${ax} 26 l-7 -12 h14 z" fill="#e0614a"/></svg>`;
}
function rulerSvg(len){
  const s=24, x=i=>10+i*s, ticks=[...Array(11)].map((_,i)=>`<line x1="${x(i)}" y1="34" x2="${x(i)}" y2="50" stroke="#3b2412" stroke-width="1.5"/><text x="${x(i)}" y="64" text-anchor="middle" font-size="11" font-weight="700" fill="#3b2412">${i}</text>`).join('')
    + [...Array(10)].map((_,i)=>`<line x1="${x(i)+s/2}" y1="34" x2="${x(i)+s/2}" y2="42" stroke="#3b2412" stroke-width="1"/>`).join('');
  return `<svg viewBox="0 0 260 70" width="300" height="80"><rect x="2" y="32" width="256" height="36" rx="4" fill="#ffe9a8" stroke="#c9a24a"/>${ticks}
    <line x1="${x(0)}" y1="16" x2="${x(len)}" y2="16" stroke="#2f6fe0" stroke-width="6" stroke-linecap="round"/><circle cx="${x(0)}" cy="16" r="4" fill="#2b2340"/><circle cx="${x(len)}" cy="16" r="4" fill="#2b2340"/></svg>`;
}
const PLACE_W = (n,one,few,many)=>n===1?one:n>=2&&n<=4?few:many;

Object.assign(CATS, {
  m_next: {grade:1, label:'Sousedé čísel (hned před, hned za)', gen(){
    const max=CUR_GRADE<=1?(EASY?10:20):CUR_GRADE===2?100:1000, n=ri(1,max-1), za=R()<.5;
    return {q:`Které číslo je hned ${za?'za':'před'} ${n}?`, a:za?n+1:n-1, small:true, key:'next|'+za+'|'+n};
  }},
  m_order: {grade:1, label:'Pořadí – kolikátý je v řadě', gen(){
    const ord=['první','druhé','třetí','čtvrté','páté','šesté'], n=EASY?5:6, row=pickN(['🍎','🐶','🚗','⚽','🌸','🐱','🍌','⭐','🎈','🐟'],n), i=ri(0,n-1);
    const opts=numOpts(i, [0,1,2,3,4,5].slice(0,n)).map(k=>ord[k]);
    return choice(`Kolikáté je ${row[i]} zleva?`, `Kolikáté je zleva?`, opts.map(o=>txt(o)), opts.indexOf(ord[i]), `<div style="font-size:min(40px,9vw);letter-spacing:2px;white-space:nowrap">${row.join('')}</div>`, 'order|'+row.join('')+'|'+i);
  }},
  m_split: {grade:1, label:'Rozklad čísel', gen(){
    const n=ri(EASY?4:6, EASY?10:20), a=ri(1,n-1), right=`${a} a ${n-a}`, s=new Set([right]);
    while(s.size<4){ const x=ri(1,n-1), y=ri(1,n); if(x+y!==n) s.add(`${x} a ${y}`); }
    const opts=shuffle([...s]);
    return choice(`Na které dvě části rozložíš číslo <b>${n}</b>?`, `Na které dvě části rozložíš číslo ${n}?`, opts.map(o=>txt(o)), opts.indexOf(right), '', 'split|'+n+'|'+opts.join(','));
  }},
  m_clock: {grade:2, label:'Hodiny – celá, půl, čtvrt, tři čtvrtě', gen(){
    const ms=EASY?[0,30]:[0,15,30,45], h=ri(1,12), m=pick(ms), right=clockLabel(h,m), s=new Set([right]);
    let guard=0; while(s.size<4 && guard++<50){ const hh=pick([h, h%12+1, (h+10)%12+1, ri(1,12)]), mm=pick(ms.length>1?ms:[0,30]); s.add(clockLabel(hh,mm)); }
    const opts=shuffle([...s]);
    return choice('Kolik je hodin?', 'Kolik je hodin?', opts.map(o=>txt(o)), opts.indexOf(right), clockSvg(h,m), 'clock|'+h+'|'+m);
  }},
  m_axis: {grade:2, label:'Číselná osa', gen(){
    const step=CUR_GRADE<=1?1:(R()<.5?1:10), start=step===1?pick([0,10,20,30,40,50,60,70,80,90].filter(x=>CUR_GRADE>1||x<=10)):0, v=start+ri(1,9)*step;
    const opts=numOpts(v,[v-step,v+step,v-2*step,v+2*step,v+5*step]);
    return choice('Které číslo ukazuje šipka?', 'Které číslo ukazuje šipka?', opts.map(o=>`<span class="num0">${o}</span>`), opts.indexOf(v), axisSvg(start,step,v), 'axis|'+start+'|'+step+'|'+v);
  }},
  m_geom: {grade:2, label:'Geometrie – tvary, strany, měření v cm', gen(){
    const k=ri(0,2);
    if(k===0){ const names=['kruh','čtverec','trojúhelník','obdélník'], t=pick(names), opts=shuffle(names);
      return choice('Jak se jmenuje tento tvar?', 'Jak se jmenuje tento tvar?', opts.map(o=>txt(o)), opts.indexOf(t), shapeSvg(t,pick(['#ffd84d','#5aa9e6','#ff8fb3','#7cc24f'])).replace('width="62" height="62"','width="110" height="110"'), 'geom|'+t); }
    if(k===1){ const f=pick([['trojúhelník',3,'stran'],['čtverec',4,'stran'],['obdélník',4,'stran'],['trojúhelník',3,'vrcholů'],['čtverec',4,'vrcholů']]), opts=numOpts(f[1],[2,3,4,5,6]);
      return choice(`Kolik ${f[2]} má ${f[0]}?`, `Kolik ${f[2]} má ${f[0]}?`, opts.map(o=>`<span class="num0">${o}</span>`), opts.indexOf(f[1]), shapeSvg(f[0],'#c9a0e8'), 'geomn|'+f[0]+'|'+f[2]); }
    const len=ri(2,10), opts=numOpts(len,[len-1,len+1,len-2,len+2]);
    return choice('Jak dlouhá je modrá úsečka?', 'Jak dlouhá je modrá úsečka?', opts.map(o=>`<span class="num0">${o} cm</span>`), opts.indexOf(len), rulerSvg(len), 'ruler|'+len);
  }},
  m_1000: {grade:3, label:'Čísla do 1000 (stovky, desítky, jednotky)', gen(){
    const s=ri(1,9), d=ri(0,9), j=ri(0,9), n=s*100+d*10+j;
    if(R()<.5){ const what=pick([['stovek',s],['desítek',d],['jednotek',j]]);
      return {q:`Jaká číslice je v čísle ${n} na místě ${what[0]}?`, a:what[1], small:true, key:'pl|'+what[0]+'|'+n}; }
    const perms=[...new Set([n, s*100+j*10+d, d*100+s*10+j, j*100+d*10+s, d*100+j*10+s, j*100+s*10+d].filter(x=>x>=100))];
    if(perms.length<4){ perms.push(n+10, n+1, n+100); }
    const opts=numOpts(n, perms.slice(1).concat([n+100,n+10])).filter(x=>x<=1099);
    const q=`Které číslo má ${s} ${PLACE_W(s,'stovku','stovky','stovek')}, ${d} ${PLACE_W(d,'desítku','desítky','desítek')} a ${j} ${PLACE_W(j,'jednotku','jednotky','jednotek')}?`;
    return choice(q, q, opts.map(o=>`<span class="num0">${o}</span>`), opts.indexOf(n), '', 'pl2|'+n);
  }},
  m_written: {grade:3, label:'Písemné sčítání a odčítání', gen(){
    let a, b, plus=R()<.5;
    if(plus){ a=ri(100,699); b=ri(100,999-a); } else { a=ri(300,999); b=ri(100,a-50); }
    const r=plus?a+b:a-b;
    return {q:`<span class="pis" data-e="${a}${plus?'+':'-'}${b}"><span>${a}</span><span>${plus?'+':'−'} ${b}</span></span>`, a:r, small:true, key:'pis|'+a+(plus?'+':'-')+b};
  }},
  m_mul69: {grade:3, label:'Násobilka 6, 7, 8, 9 a dělení', gen(){
    const m=pick([6,7,8,9]), n=ri(1,10);
    return R()<.65 ? (R()<.5?{q:`${m} · ${n}`, a:m*n}:{q:`${n} · ${m}`, a:m*n}) : {q:`${m*n} : ${m}`, a:n};
  }},
  m_perim: {grade:3, label:'Obvod čtverce a obdélníku', gen(){
    if(R()<.5){ const a=ri(2,12); return {q:`Obvod čtverce se stranou ${a} cm je ? cm`, a:4*a, small:true, key:'po|'+a}; }
    const a=ri(3,12), b=ri(2,a-1); return {q:`Obvod obdélníku se stranami ${a} cm a ${b} cm je ? cm`, a:2*(a+b), small:true, key:'po|'+a+'|'+b};
  }},
});
DEFAULT_CATS[1] = DEFAULT_CATS[1].concat(['m_next','m_order','m_split']);
DEFAULT_CATS[2] = DEFAULT_CATS[2].concat(['m_next','m_clock','m_axis','m_geom']);
DEFAULT_CATS[3] = DEFAULT_CATS[3].concat(['m_1000','m_written','m_mul69','m_clock','m_perim','m_geom']);
Object.assign(HALF1_SKIP, {1:HALF1_SKIP[1].concat(['m_split']), 2:HALF1_SKIP[2].concat(['m_clock','m_geom']), 3:HALF1_SKIP[3].concat(['m_written','m_perim'])});
