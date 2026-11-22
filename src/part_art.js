
/* ============ Art: shading, outlines, scenes ============ */
function shade(hex, amt){
  let c=String(hex).replace('#',''); if(c.length===3) c=c.split('').map(x=>x+x).join('');
  const n=parseInt(c,16); if(isNaN(n)) return hex;
  let r=n>>16, g=n>>8&255, b=n&255; const t=amt<0?0:255, p=Math.abs(amt);
  r=Math.round((t-r)*p+r); g=Math.round((t-g)*p+g); b=Math.round((t-b)*p+b);
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}
let _uid=0;
// Turns flat drawings into shaded, outlined cartoon art:
// every flat fill gets a light→dark gradient, shapes get a dark outline,
// tiny dots, glows and see-through shapes stay without outline.
function stylize(svg, opts={}){
  const U='s'+(++_uid).toString(36);
  const m=svg.match(/^(<svg[^>]*>)([\s\S]*)<\/svg>$/); if(!m) return svg;
  let head=m[1], body=m[2];
  const cols={}; let k=0;
  body = body.replace(/fill="(#[0-9a-fA-F]{3,6})"/g, (all,c)=>{
    const lc=c.toLowerCase(); if(lc==='#000'||lc==='#000000') return all;
    if(!cols[lc]) cols[lc]=U+'g'+(k++);
    return `fill="url(#${cols[lc]})"`;
  });
  // no outline on glows, transparent bits and tiny dots
  body = body.replace(/<(circle|ellipse|path|rect)([^>]*?)(\/?)>/g, (all,tag,attrs,close)=>{
    if(/\sstroke=/.test(attrs)) return all;
    let none = /opacity=/.test(attrs) || /fill="url\(#[gr]h/.test(attrs) || /fill="#000/.test(attrs);
    const rm = attrs.match(/\sr="([\d.]+)"/); if(tag==='circle' && rm && +rm[1] < 2.6) none=true;
    if(/fill="url\(#(g|r)[a-z0-9]{5}\)"/.test(attrs)) none=true;
    return none ? `<${tag}${attrs} stroke="none"${close}>` : all;
  });
  const grads = Object.entries(cols).map(([c,id])=>`<linearGradient id="${id}" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="${shade(c,.28)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${shade(c,-.22)}"/></linearGradient>`).join('');
  const sw = opts.sw || 2.2;
  return `${head}<defs>${grads}</defs><g stroke="#2b2340" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
}
function heroSVG(p, opts={}){ return stylize(heroBase(p, opts), {sw:2.2}); }
function monsterSVG(i){
  let s=monsterBase(i);
  s=s.replace(/^(<svg[^>]*>)(<ellipse[^>]*\/>)/, '$1$2<g class="mb">').replace(/<\/svg>$/,'</g></svg>');
  return stylize(s,{sw:2.6});
}

/* ---- Pozadí lokací ---- */
function sceneSVG(i){
  const V=inner=>`<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" class="scene">${inner}</svg>`;
  const sky=(id,a,b)=>`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="220" fill="url(#${id})"/>`;
  const id='sc'+i+'_'+(++_uid);
  const torch=x=>`<rect x="${x-3}" y="70" width="6" height="26" fill="#5a3b1f"/><path d="M${x} 50 q10 12 0 22 q-10 -10 0 -22z" fill="#ffb02e"/><path d="M${x} 58 q5 7 0 13 q-5 -6 0 -13z" fill="#fff1a0"/><circle cx="${x}" cy="62" r="26" fill="#ffb02e" opacity=".18"/>`;
  const tree=(x,y,s,c)=>`<path d="M${x} ${y} l${-18*s} ${40*s} h${36*s}z M${x} ${y+20*s} l${-22*s} ${44*s} h${44*s}z" fill="${c}"/><rect x="${x-3*s}" y="${y+64*s}" width="${6*s}" height="${14*s}" fill="#3b2a1d"/>`;
  switch(i){
  case 0: { let bricks=''; for(let y=0;y<150;y+=22) for(let x=(y/22%2)*25-25;x<400;x+=50) bricks+=`<rect x="${x}" y="${y}" width="48" height="20" rx="2" fill="#4a4558" stroke="#3a3547" stroke-width="2"/>`;
    return V(`<rect width="400" height="220" fill="#3a3547"/>${bricks}<rect y="150" width="400" height="70" fill="#2a2633"/><path d="M0 150 H400" stroke="#1e1b26" stroke-width="4"/>${torch(60)}${torch(340)}<path d="M150 150 q50 -70 100 0z" fill="#1e1b26"/>`); }
  case 1: return V(`${sky(id,'#3d4f6b','#8fa58a')}<circle cx="320" cy="50" r="22" fill="#fff6d0" opacity=".8"/>${tree(40,40,1.4,'#1f3b2a')}${tree(110,70,1,'#244a33')}${tree(300,60,1.2,'#1f3b2a')}${tree(370,40,1.5,'#183022')}<rect y="165" width="400" height="55" fill="#2e5a34"/><circle cx="200" cy="175" r="6" fill="#e8435a"/><rect x="198" y="178" width="4" height="8" fill="#fff"/><circle cx="240" cy="182" r="4" fill="#e8435a"/>`);
  case 2: { let st=''; for(let x=10;x<400;x+=38) st+=`<path d="M${x} 0 l12 ${30+((x*7)%40)} l12 ${-30-((x*7)%40)}z" fill="#5a4a70"/>`;
    return V(`${sky(id,'#7a6a96','#b5a6c9')}<ellipse cx="200" cy="110" rx="150" ry="80" fill="#d8cce6" opacity=".5"/>${st}<rect y="160" width="400" height="60" fill="#5a4a70"/><path d="M300 20 l60 60 M330 10 l0 90 M300 50 h60 M310 30 l40 40 M350 30 l-40 40" stroke="#e8e8f0" stroke-opacity=".5" stroke-width="1.5"/><circle cx="330" cy="50" r="22" fill="none" stroke="#e8e8f0" stroke-opacity=".5"/><circle cx="330" cy="50" r="12" fill="none" stroke="#e8e8f0" stroke-opacity=".5"/>`); }
  case 3: { let stars=''; for(let n=0;n<30;n++) stars+=`<circle cx="${(n*137)%400}" cy="${(n*53)%120}" r="${n%3?1:1.6}" fill="#fff"/>`;
    return V(`${sky(id,'#0f1c3d','#2c4a7a')}${stars}<circle cx="300" cy="60" r="34" fill="#fffbe0"/><circle cx="300" cy="60" r="60" fill="#fffbe0" opacity=".12"/>${tree(40,70,1.2,'#0c1a2a')}${tree(370,60,1.3,'#0c1a2a')}<rect y="165" width="400" height="55" fill="#1d3a2e"/>`); }
  case 4: return V(`${sky(id,'#6f7d5a','#a8b38a')}<rect y="150" width="400" height="70" fill="#4d5e3a"/><ellipse cx="200" cy="185" rx="170" ry="22" fill="#3f5a4c"/><ellipse cx="160" cy="182" rx="60" ry="6" fill="#6f8f7e" opacity=".6"/>${[30,60,340,370].map(x=>`<path d="M${x} 170 q-4 -40 2 -60 M${x+6} 170 q2 -30 10 -44" stroke="#3b4a2a" stroke-width="4" fill="none"/><ellipse cx="${x+1}" cy="112" rx="4" ry="12" fill="#6b4a2a"/>`).join('')}<rect y="120" width="400" height="40" fill="#e8f0e0" opacity=".25"/>`);
  case 5: return V(`${sky(id,'#f39a4a','#f6d28a')}<circle cx="70" cy="60" r="28" fill="#ffe08a"/><rect y="160" width="400" height="60" fill="#8a6a3a"/>${[0,24,48,72,96].map(x=>`<path d="M${x} 160 v-50 l12 -12 l12 12 v50z" fill="#6b4a2a"/>`).join('')}<path d="M250 160 l40 -60 l40 60z" fill="#a0522d"/><path d="M290 100 v60" stroke="#5e3517" stroke-width="3"/><path d="M330 160 l30 -44 l30 44z" fill="#8b3d1f"/><path d="M180 178 l12 -26 l12 26z" fill="#ff8c1a"/><path d="M186 178 l6 -14 l6 14z" fill="#ffe14d"/>`);
  case 6: return V(`${sky(id,'#7ec8f0','#fde9b0')}<circle cx="340" cy="50" r="26" fill="#fff3a0"/><path d="M120 160 L220 40 L320 160Z" fill="#e2b66a"/><path d="M220 40 L320 160 L260 160Z" fill="#c8964a"/>${[70,90,110,130].map(y=>`<path d="M${220-(y-40)*0.83} ${y} H${220+(y-40)*0.83}" stroke="#b9883f" stroke-width="2"/>`).join('')}<rect y="155" width="400" height="65" fill="#f0d08a"/><path d="M0 170 q100 -14 200 0 t200 0 V220 H0z" fill="#e6c27a"/>`);
  case 7: return V(`${sky(id,'#4b5566','#8f99aa')}<path d="M0 160 L70 60 L120 120 L190 30 L260 110 L320 50 L400 140 V220 H0z" fill="#5d6472"/><path d="M190 30 l-15 25 l15 -6 l12 8z" fill="#f2f4f8"/><path d="M320 50 l-12 20 l12 -4 l10 6z" fill="#f2f4f8"/><path d="M90 20 l-14 30 h12 l-10 26 l26 -36 h-12 l10 -20z" fill="#ffe14d"/><ellipse cx="80" cy="20" rx="60" ry="16" fill="#3d4452"/><ellipse cx="300" cy="14" rx="80" ry="18" fill="#3d4452"/><rect y="170" width="400" height="50" fill="#4a505c"/>`);
  case 8: { let stars=''; for(let n=0;n<20;n++) stars+=`<circle cx="${(n*97)%400}" cy="${(n*41)%90}" r="1.2" fill="#fff"/>`;
    return V(`${sky(id,'#2a1a4a','#7a4a8e')}${stars}<circle cx="130" cy="80" r="52" fill="#f4e8ff" opacity=".9"/><circle cx="130" cy="80" r="80" fill="#f4e8ff" opacity=".15"/><path d="M230 160 V70 h14 v-12 h10 v12 h12 v-12 h10 v12 h14 V160z M200 160 V40 h12 v-10 h8 v10 h12 V160z M330 160 V60 h12 v-10 h8 v10 h12 V160z" fill="#120a1c"/><rect x="214" y="70" width="6" height="12" fill="#ff3b3b"/><rect x="262" y="100" width="6" height="12" fill="#ff3b3b"/><rect x="346" y="90" width="6" height="12" fill="#ff3b3b"/><rect y="160" width="400" height="60" fill="#22152e"/>`); }
  case 9: return V(`${sky(id,'#3a0d0d','#c2410c')}<path d="M120 170 L200 50 L240 50 L320 170Z" fill="#3b2a2a"/><path d="M200 50 q20 -10 40 0 l-6 12 q-14 -6 -28 0z" fill="#ff6b1a"/><path d="M214 58 q-10 50 -30 110 M226 58 q14 50 26 110" stroke="#ff8c1a" stroke-width="6" fill="none"/><ellipse cx="220" cy="30" rx="50" ry="16" fill="#555" opacity=".6"/><ellipse cx="250" cy="12" rx="40" ry="12" fill="#555" opacity=".5"/><rect y="168" width="400" height="52" fill="#2a1a1a"/><path d="M0 190 q60 -10 120 4 t140 -4 t140 6" stroke="#ff6b1a" stroke-width="5" fill="none"/>`);
  }
  return V('');
}
