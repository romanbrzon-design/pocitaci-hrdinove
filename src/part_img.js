
/* ============ Obrázky z Gemini (styl 3) ============ */
const A_ = 'assets/';
function heroStage(p){ const e=p.eq||{}; const s=(Math.min(7,e.weapon||0)/7+Math.min(5,e.shield||0)/5+Math.min(5,e.armor||0)/5+Math.min(5,e.head||0)/5)/4; return Math.max(0,Math.min(5,Math.round(s*5))); }
// koupený plášť (za zády) a boty (na nohou) se kreslí přes obrázek hrdiny; [šířka obrázku, střed chodidel, šířka chodidel, levý a pravý okraj trupu] (zlomky šířky)
const HERO_OV={m0:[234,.6,.585,.124,.85],m1:[250,.544,.552,.092,.952],m2:[230,.476,.613,.143,.965],m3:[226,.5,.611,.159,.987],m4:[205,.576,.615,.239,.917],m5:[269,.582,.509,.097,.944],f0:[220,.611,.605,.027,.845],f1:[250,.544,.552,.092,.948],f2:[233,.481,.609,0,.966],f3:[228,.526,.579,.092,.917],f4:[206,.575,.617,.087,.917],f5:[267,.581,.517,.064,.933]};
function accImg(name, col, style, cfg){ return col ? tintImg(name,cfg||'__all',{all:col},`class="hacc" style="${style}"`) : `<img class="hacc" src="${A_}${name}.webp" alt="" style="${style}">`; }
// hrdina z vrstev: postava podle brnění (body_g0–5) + plášť, boty, zbraň, štít a helma zvlášť
// [šířka, výška, levá pěst x,y, pravá pěst x,y, střed a šířka chodidel, levý a pravý okraj trupu, obočí y, šířka hlavy]
const BODY={m0:[148,316,.09,.698,.889,.69,.493,.676,.115,.865],m1:[148,316,.097,.685,.889,.691,.49,.682,.115,.872],m2:[148,316,.097,.685,.889,.685,.49,.682,.115,.865],m3:[149,316,.083,.688,.896,.688,.49,.671,.087,.893],m4:[148,316,.084,.688,.903,.687,.49,.682,.041,.939],m5:[150,317,.083,.685,.897,.686,.493,.68,.047,.933],
m6:[148,316,.09,.684,.903,.689,.493,.676,.074,.912],m7:[149,316,.097,.682,.89,.684,.493,.678,.067,.919],
  f6:[155,323,.083,.703,.833,.706,.461,.587,.12,.8],f7:[154,323,.083,.701,.826,.701,.458,.591,.12,.8],
  f0:[152,323,.083,.703,.825,.703,.457,.599,.14,.8],f1:[151,323,.083,.7,.824,.703,.454,.603,.14,.8],f2:[153,323,.083,.703,.825,.703,.454,.595,.14,.8],f3:[154,323,.083,.695,.833,.699,.458,.591,.12,.8],f4:[152,323,.083,.692,.831,.693,.461,.592,.1,.82],f5:[155,323,.083,.703,.833,.695,.465,.594,.11,.82]};
const HEAD_GEO={m:[.235,.9],f:[.255,.86]}; // obočí (zlomek výšky), šířka pokrývky hlavy (zlomek šířky)
const USE_LAYERS=true;
const WGRIP={1:[.417,.842],2:[.48,.82],3:[.49,.829],4:[.492,.836],5:[.49,.836],6:[.51,.842],7:[.492,.805],8:[.487,.808],9:[.504,.751]};
const BOOT_COL={1:'#7a4a22',2:'#8f99a6',3:'#e6edf7',4:'#c8321e',5:'#7fbfff'}; // kožené, rytířské (ocel), okřídlené (stříbrné), dračí, hvězdné
// [šířka × šířka hlavy, posun spodní hrany nad obočí (zlomek výšky postavy)] – koruny jsou menší a sedí na vlasech
// [šířka × šířka hlavy, posun spodní hrany nad obočí] – ploché koruny sedí pásem na vlasech nad čelem
const HEAD_FIT={4:[1.08,0],5:[1.0,.03],7:[1.0,.03]};
function heroFigLayers(p, cls){
  const g=p.gender==='f'?'f':'m', e=p.eq||{}, l=lookOf(p), ar=Math.max(0,Math.min(7,e.armor||0)), k=g+ar;
  const [W,H,lx,ly,rx,ry,fc,fw,t0,t1]=BODY[k], [brow,hw]=HEAD_GEO[g], cx=fc;
  let back='', front='';
  if(e.cape){ const cw=1.06; back+=accImg('i_cape'+e.cape, l.cape, `left:${(fc-cw/2)*100}%;top:36%;width:${cw*100}%;z-index:0`); }
  // boty: obarví se vlastní obuv postavy podle druhu bot (nic se nepřekrývá)
  const lb=Object.assign({}, l); if(e.boots) lb.boots=l.boots||BOOT_COL[e.boots]; else delete lb.boots;
  // zbraň: svislá verze hwN, rukojeť [x,y] přesně v levé pěsti; zbraň je ZA tělem, takže pěst překrývá rukojeť
  // zbraň PŘED tělem a přes rukojeť znovu pěst postavy (fist_*) → prsty obepínají rukojeť, čepel nad pěstí, hlavice pod ní
  if(e.weapon){ const [gx,gy]=WGRIP[e.weapon]||[.5,.83], wh=.5; front+=accImg('hw'+e.weapon, l.weapon, `left:${lx*100}%;top:${(ly-wh*gy)*100}%;height:${wh*100}%;width:auto;transform:translateX(${-gx*100}%) rotate(-10deg);transform-origin:${gx*100}% ${gy*100}%;z-index:3`, '__allg')+`<img class="hacc" src="${A_}fist_${k}.webp" alt="" style="left:0;top:0;width:100%;height:100%;z-index:3">`; }
  if(e.shield){ front+=accImg('i_shield'+e.shield, l.shield, `left:${rx*100}%;top:${ry*100}%;width:62%;transform:translate(-42%,-58%);z-index:4`, '__allg'); }
  if(e.head){ const [hs,up]=HEAD_FIT[e.head]||[1,0], w=hw*hs; front+=accImg('hd'+e.head, l.head, `left:${cx*100}%;bottom:${(1-brow+up)*100}%;width:${w*100}%;transform:translateX(-50%);z-index:5`, '__allg'); }
  return `<span class="hfig ${cls}" style="aspect-ratio:${W}/${H}">${back}${tintImg('body_'+k, 'body_'+g, lb, 'class="hb"')}${front}</span>`;
}
function heroFig(p, cls){ if(USE_LAYERS) return heroFigLayers(p, cls);
  const g=p.gender==='f'?'f':'m', st=heroStage(p), k=g+st, [W,fc,fw,t0,t1]=HERO_OV[k]||HERO_OV.m0, e=p.eq||{}, l=lookOf(p), H=420;
  let pre='', post='';
  if(e.cape){ const cw=(t1-t0)*1.15; pre=accImg('i_cape'+e.cape, l.cape, `left:${((t0+t1)/2-cw/2)*100}%;top:30%;width:${cw*100}%;z-index:0`); }
  if(e.boots){ const w=fw*1.08; post=accImg('i_boots'+e.boots, l.boots, `left:${(fc-w/2)*100}%;bottom:-.7%;width:${w*100}%;z-index:2`, '__allg'); }
  return `<span class="hfig ${cls}" style="aspect-ratio:${W}/${H}">${pre}${tintImg('hero_'+k, 'hero_'+g, l, 'class="hb"')}${post}</span>`;
}
function heroImg(p, opts={}){
  const g=p.gender==='f'?'f':'m', comp=(p.eq||{}).pet;
  return `<div class="av ${opts.glow?'glow':''}">${heroFig(p,'main')}${comp?`<img class="comp" src="${A_}i_pet${comp}.webp" alt="">`:''}</div>`;
}
const _monsterSVG_old = monsterSVG, _sceneSVG_old = sceneSVG;
monsterSVG = function(i){ return `<img class="monimg" src="${A_}mon${i}.webp" alt="${MONSTERS[i].name}" loading="lazy">`; };
sceneSVG = function(i){ return `<img class="scene" src="${A_}bg${i}.webp" alt="" loading="lazy">`; };
chestSVG = function(kind, open){ return `<img src="${A_}ui_chest_${kind==='gold'?'gold':'wood'}.webp" alt="" style="width:100%;${open?'filter:drop-shadow(0 0 16px #ffe066) brightness(1.12)':''}">`; };
const ITEM_ICON = {weapon:9, shield:7, armor:7, head:7, boots:5, cape:5, pet:5, horse:4};
function itemIcon(p, slot, tier){
  if(((p&&p.mode)||'quest')==='quest' && ITEM_ICON[slot] && tier) return `<img src="${A_}i_${slot}${tier}.webp" alt="">`;
  if(p && p.mode==='pet' && PET_ACC_IMG[slot] && tier) return `<img src="${A_}pa_${slot}${tier}.webp" alt="">`;
  if(p && p.mode==='home' && HOME_IMG[slot] && tier) return `<img src="${A_}h_${slot}${tier}.webp" alt="">`;
  return '';
}
// accessory images for pets / furniture for home — filled in once generated
const PET_ACC_IMG = {toy:1,pbed:1,collar:1,phat:1,shoes:1,outfit:1,friend:1}, HOME_IMG = {bed:1,rug:1,wall:1,lamp:1,curtain:1,plant:1,hpet:1};
const _petSVG_old = petSVG;
const USE_PET_IMG = true; // zapne se, až budou doplňky zvířátek z Gemini
// kotevní body zvířátek (zlomky šířky/výšky obrázku): x hlavy, temeno, šířka hlavy, krk, šířka krku, nohy y, nohy x, šířka nohou
const PET_ANCH = {
 cat_0:[.45,.10,.75,0.57,.45,.95,.42,.45], cat_1:[.42,.08,.60,0.45,.40,.95,.42,.40], dog_0:[.50,.08,.80,0.55,.45,.95,.48,.45], dog_1:[.45,.05,.70,0.45,.42,.95,.45,.45],
 bunny_0:[.50,.30,.80,.62,.50,.95,.50,.50], bunny_1:[.47,.30,.70,.58,.45,.96,.47,.48], pony_0:[.45,.12,.55,0.6,.35,.92,.45,.45], pony_1:[.45,.07,.50,0.5,.30,.95,.45,.45],
 rat_0:[.47,.12,.55,0.52,.35,.86,.45,.40], rat_1:[.42,.10,.50,0.48,.35,.86,.42,.40], hamster_0:[.50,.08,.85,.52,.70,.95,.50,.55], hamster_1:[.50,.07,.85,.48,.70,.95,.50,.55],
 fox_0:[.45,.10,.70,.55,.40,.95,.42,.42], fox_1:[.42,.08,.60,.45,.35,.96,.40,.40], panda_0:[.50,.08,.75,0.52,.60,.90,.50,.60], panda_1:[.50,.06,.70,0.46,.55,.90,.50,.60],
 owl_0:[.50,.05,.80,0.48,.60,.95,.50,.50], owl_1:[.50,.05,.70,0.43,.60,.95,.50,.50], dragon_0:[.50,.10,.55,0.5,.35,.95,.50,.45], dragon_1:[.50,.10,.50,.42,.30,.90,.50,.45]};
// přední tlapky a tělo zvířátek: [střed levé, střed pravé, šířka tlapky, spodek tlapek, levý a pravý okraj těla v 70 %] – ověřeno na zvětšených výřezech
const PET_PAW={"cat_0":[.315,.563,.17,.997,.131,.757],"dog_0":[.338,.649,.17,.997,.191,.947],"bunny_0":[.371,.613,.17,.997,.183,.812],"pony_0":[.302,.517,.14,.997,.177,.65],"rat_0":[.22,.69,.17,.91,.144,.796],"hamster_0":[.18,.82,.17,.997,.036,.976],"fox_0":[.326,.553,.13,.997,.198,.687],"panda_0":[.17,.83,.16,.997,.139,.861],"owl_0":[.3,.68,.17,.994,.016,.98],"dragon_0":[.37,.61,.16,.997,.287,.707],
 "cat_1":[.3,.57,.17,.935,.1,.78],"dog_1":[.252,.575,.17,.998,.066,.77],"bunny_1":[.349,.593,.18,.998,.128,.826],"pony_1":[.297,.523,.145,.998,.113,.709],"rat_1":[.16,.69,.16,.9,.031,.779],"hamster_1":[.17,.81,.165,.998,.011,.986],"fox_1":[.3,.523,.13,.995,.135,.69],"panda_1":[.184,.808,.17,.998,.09,.906],"owl_1":[.29,.69,.18,.998,.04,.955],"dragon_1":[.365,.6,.16,.91,.188,.791]};
const PET_SHOE_DIM={1:[111,159,1],2:[110,159,1],3:[158,158,.66],4:[112,160,1],5:[113,163,1]}; // [šířka, výška, podíl samotné boty na šířce] jedné botičky pshN
const PET_DIM = {cat_0:[251,360],cat_1:[230,420],dog_0:[283,360],dog_1:[274,420],bunny_0:[186,360],bunny_1:[195,420],pony_0:[260,360],pony_1:[265,420],rat_0:[250,360],rat_1:[258,420],hamster_0:[248,360],hamster_1:[279,420],fox_0:[262,360],fox_1:[260,420],panda_0:[280,360],panda_1:[299,420],owl_0:[246,360],owl_1:[247,420],dragon_0:[300,360],dragon_1:[282,420]};
const ov=(src,l,t,w,z,extra='')=>`<img class="ov" src="${A_}${src}.webp" alt="" style="left:${(l*100).toFixed(1)}%;top:${(t*100).toFixed(1)}%;width:${(w*100).toFixed(1)}%;z-index:${z};${extra}">`;
const ovb=(src,l,b,w,z,extra='')=>`<img class="ov" src="${A_}${src}.webp" alt="" style="left:${(l*100).toFixed(1)}%;bottom:${(b*100).toFixed(1)}%;width:${(w*100).toFixed(1)}%;z-index:${z};${extra}">`;
const ovc=(col,src,l,t,w,z,extra='')=>col?tintImg(src,'__all',{all:col},`class="ov" style="left:${(l*100).toFixed(1)}%;top:${(t*100).toFixed(1)}%;width:${(w*100).toFixed(1)}%;z-index:${z};${extra}"`):ov(src,l,t,w,z,extra);
const ovbc=(col,src,l,b,w,z,extra='')=>col?tintImg(src,'__all',{all:col},`class="ov" style="left:${(l*100).toFixed(1)}%;bottom:${(b*100).toFixed(1)}%;width:${(w*100).toFixed(1)}%;z-index:${z};${extra}"`):ovb(src,l,b,w,z,extra);
if(USE_PET_IMG) petSVG = function(p, opts={}){ const pl=p.look||{};
  const sp=p.species||'cat', st = opts.stage!==undefined ? opts.stage : petStage(p), k=sp+'_'+(st>=2?1:0);
  const [hx,ht,hw,ny,nw,fy,fx,fw]=PET_ANCH[k]||PET_ANCH.cat_0, [W,H]=PET_DIM[k]||[250,360];
  const e=p.eq||{}, sc=[0.62,0.76,0.86,0.98][st];
  const ar=W/H; // poměr obrázku
  let wrap=`<img class="main" src="${A_}pet_${k}.webp" alt="" style="z-index:3">`;
  // vše v % šířky (left,width) a výšky (top) obalu zvířátka
  // pláštíky (hrdinský i královský) vlají za zády a vykukují po obou stranách
  { const pp=PET_PAW[k], half=pp?Math.min(hx-pp[4],pp[5]-hx):hw*.55;
    if(e.outfit===3){ const w=half*2*1.62; wrap+=ovc(pl.p_outfit,'pa_outfit3', hx-w/2, ny-.07, w, 1); }
    if(e.outfit===5){ const w=half*2*1.62; wrap+=ovc(pl.p_outfit,'pa_outfit5', hx-w/2, ny-.07, w, 1); } }
  if(e.outfit===2||e.outfit===4){ const w=nw*1.7; wrap+=ovc(pl.p_outfit,'pa_outfit'+e.outfit, hx-w/2, ny-.03, w, 4); }
  if(e.collar && e.outfit!==1){ const w=Math.min(.6,nw*1.05); wrap+=ovc(pl.p_collar,'pa_collarf'+e.collar, hx-w/2, ny-.035, w, 5); }
  if(e.outfit===1){ const w=Math.min(.6,nw*1.15); wrap+=ovc(pl.p_outfit,'pa_outfit1', hx-w/2, ny-w*ar*1.19*.15, w, 5); }
  const pw=PET_PAW[k];
  if(e.shoes && pw && PET_SHOE_DIM[e.shoes]){ const [sw,sh,bf]=PET_SHOE_DIM[e.shoes], w=pw[2]*1.3/bf, h=w*ar*sh/sw;
    for(const [cxp,flip] of [[pw[0],1],[pw[1],0]]) wrap+=ovc(pl.p_shoes,'psh'+e.shoes, cxp-w/2, pw[3]-h*.97, w, 6, flip?'transform:scaleX(-1)':''); }
  else if(e.shoes){ const w=fw*.85; wrap+=ovc(pl.p_shoes,'pa_shoes'+e.shoes, fx-w/2, fy-w*ar*.9*.8, w, 6); }
  if(e.phat){ const w=hw*.5; wrap+=ovc(pl.p_phat,'pa_phat'+e.phat, hx-w/2, ht-w*ar*.78*.72, w, 6); }
  let out='';
  if(e.pbed) out+=ovbc(pl.p_pbed,'pa_pbed'+e.pbed, .12, 0, .76, 0);
  if(e.toy) out+=ovbc(pl.p_toy,'pa_toy'+e.toy, opts.flip?.02:.74, .02, .2, 4);
  if(e.friend) out+=ov('pa_friend'+e.friend, opts.flip?.72:.04, .04, .2, 4, 'animation:flut 2.6s ease-in-out infinite');
  const h=(sc*(e.pbed?.84:.94)*100).toFixed(1);
  return `<div class="av petav ${opts.glow?'glow':''}">${out}<div class="petwrap" style="height:${h}%;aspect-ratio:${W}/${H};bottom:${e.pbed?10:3}%;${opts.flip?'transform:translateX(-50%) scaleX(-1)':''}">${wrap}</div></div>`;
};

/* ---- Domeček ---- */
roomSVG = function(p, opts={}){
  const e=p.eq||{};
  let s=`<img class="roombg" src="${A_}room${e.wall||0}.webp" alt="">`;
  if(e.curtain) s+=ov('h_curtain'+e.curtain, .30, .13, .40, 2);
  if(e.lamp>=4 && !opts.scene) s+=ov('h_lamp'+e.lamp, .14, -.01, .13, 3);
  if(!opts.scene){
    if(e.rug) s+=ovb('h_rug'+e.rug, .17, .01, .42, 2);
    if(e.bed) s+=ovb('h_bed'+e.bed, .57, .03, .41, 3);
    if(e.plant) s+=ovb('h_plant'+e.plant, .01, .06, .14, 3);
    if(e.lamp && e.lamp<4) s+=ovb('h_lamp'+e.lamp, .16, .06, [0,.08,.1,.11][e.lamp], 3);
    s+=tintImg('kid_'+(p.gender==='f'?'f':'m'), 'kid_'+(p.gender==='f'?'f':'m'), lookOf(p), 'class="ov" style="left:30%;bottom:4%;width:14%;z-index:5"');
    if(e.hpet) s+=ovb('h_hpet'+e.hpet, .46, .02, .13, 6);
  }
  return `<div class="room ${opts.scene?'scene':''}">${s}</div>`;
};
kidSVG = function(p){ const g=p.gender==='f'?'f':'m'; return `<div class="av">${tintImg('kid_'+g,'kid_'+g,lookOf(p),'class="main"')}</div>`; };

/* ---- návštěvy a pozadí soutěží (Gemini) ---- */
guestSVG = function(i){ return `<div class="av"><img class="main" src="${A_}guest${i}.webp" alt=""></div>`; };
contestScene = function(i){ return `<img class="scene" src="${A_}cbg${i}.webp" alt="">`; };

/* ---- přebarvení oblečení (tričko / kalhoty-sukně / tunika) ---- */
var TINT_CFG={
 kid_m:{top:{h:[190,240],s:.25,y:[.36,.72]},bottom:{grey:1,v:[.35,.95],y:[.655,.935],x:[.15,.85]}},
 kid_f:{top:{h:[35,70],s:.14,y:[.33,.56],x:[.2,.8]},bottom:{h:[315,360],h2:[0,10],s:.12,y:[.50,.74]}},
 hero_m:{top:{h:[190,235],s:.2,y:[.30,.95]}},
 hero_f:{top:{h:[318,360],h2:[0,12],s:.15,y:[.46,.95]}},
 // vyšší stupně: tunika není vidět (jinak by se přebarvilo brnění) – barví se plášť
 hero_m3:{top:null,cape:{h:[345,360],h2:[0,15],s:.55,y:[.41,1]}}, hero_f3:{top:null,cape:{h:[345,360],h2:[0,15],s:.55,y:[.41,1]}},
 hero_m4:{top:null,cape:{h:[200,235],s:.35,y:[.3,1],ex:[.6,1,.3,.82]}}, hero_f4:{top:null,cape:{h:[200,235],s:.35,y:[.3,1],ex:[.6,1,.3,.82]}},
 hero_m5:{top:null,cape:{h:[255,300],s:.25,y:[.25,1]}}, hero_f5:{top:null,cape:{h:[255,300],s:.25,y:[.25,1]}},
};
TINT_CFG.__all={all:{h:[0,360],s:.18,y:[0,1]}};
TINT_CFG.body_m={top:{h:[190,235],s:.25,y:[.42,.76]},boots:{h:[0,360],s:0,y:[.86,1]}}; TINT_CFG.body_f={top:{h:[318,360],h2:[0,12],s:.15,y:[.44,.76],ex:[.74,1,.36,.64]},boots:{h:[0,360],s:0,y:[.86,1]}};
for(const g of 'mf') for(let i=2;i<8;i++) TINT_CFG['body_'+g+i]={top:null}; TINT_CFG.__allg={all:{h:[0,360],s:0,y:[0,1]}};
var _tintCache={}, _tintPend={};
function lookOf(p){ const l=Object.assign({}, p&&p.look||{}); if(!l.top && p && p.color) l.top=p.color; return l; }
function tintImg(name, cfgKey, look, attrs){
  const k=name+'|'+(look.top||'')+'|'+(look.bottom||'')+'|'+(look.cape||'')+'|'+(look.all||'')+'|'+(look.boots||''); const done=_tintCache[k];
  if(!done && !_tintPend[k] && (look.top||look.bottom||look.cape||look.all||look.boots)){ _tintPend[k]=1; const im=new Image();
    im.onload=()=>{ try{ _tintCache[k]=doTint(im, Object.assign({}, TINT_CFG[cfgKey], TINT_CFG[name]), look); document.querySelectorAll('img[data-tint]').forEach(e=>{ if(e.dataset.tint===k) e.src=_tintCache[k]; }); }catch(e){ _tintCache[k]=A_+name+'.webp'; } };
    im.src=A_+name+'.webp'; }
  return `<img ${attrs||''} data-tint="${k}" src="${done||A_+name+'.webp'}" alt="">`;
}
function doTint(im, cfg, look){
  const W=im.naturalWidth, H=im.naturalHeight, c=document.createElement('canvas'); c.width=W; c.height=H;
  const x=c.getContext('2d'); x.drawImage(im,0,0); const d=x.getImageData(0,0,W,H), a=d.data;
  for(const part of ['top','bottom','cape','all','boots']){ const col=look[part], g=cfg&&cfg[part]; if(!col||!g) continue;
    const t=[1,3,5].map(i=>parseInt(col.substr(i,2),16)/255); const idx=[], vs=[];
    const y0=g.y[0]*H, y1=g.y[1]*H, x0=g.x?g.x[0]*W:0, x1=g.x?g.x[1]*W:W;
    for(let yy=Math.floor(y0); yy<Math.min(H,y1); yy++) for(let xx=Math.floor(x0); xx<Math.min(W,x1); xx++){ const i=(yy*W+xx)*4; if(a[i+3]<=60) continue; if(g.ex && xx>=g.ex[0]*W && xx<g.ex[1]*W && yy>=g.ex[2]*H && yy<g.ex[3]*H) continue;
      const r=a[i]/255, gg=a[i+1]/255, b=a[i+2]/255, mx=Math.max(r,gg,b), mn=Math.min(r,gg,b), s=mx>0?(mx-mn)/mx:0, dd=Math.max(mx-mn,1e-6);
      let ok;
      if(g.grey) ok = s<.14 && mx>=g.v[0] && mx<=g.v[1];
      else { let h=mx===r?((gg-b)/dd)%6:mx===gg?(b-r)/dd+2:(r-gg)/dd+4; h*=60; if(h<0) h+=360;
        ok = s>=g.s && mx>.25 && ((h>=g.h[0]&&h<=g.h[1]) || (g.h2 && h>=g.h2[0]&&h<=g.h2[1])); }
      if(ok){ idx.push(i); vs.push(mx); } }
    if(!idx.length) continue; const sv=vs.slice().sort((p,q)=>p-q), ref=sv[Math.floor(sv.length*.75)]||1;
    for(let j=0;j<idx.length;j++){ const i=idx[j], f=Math.min(1.25, vs[j]/ref), ex=f>1?(f-1)*.8:0;
      a[i]=Math.min(255,(t[0]*f+ex)*255); a[i+1]=Math.min(255,(t[1]*f+ex)*255); a[i+2]=Math.min(255,(t[2]*f+ex)*255); } }
  x.putImageData(d,0,0); return c.toDataURL('image/png');
}
