
/* ============ Dobrodružství: Domeček a Zvířátko ============ */
// Stejná čísla jako výprava (vyváženo), jen jiné věci a jména.
function mkSlots(defs){ return defs.map((d,si)=>({id:d.id, name:d.name, items:d.names.map((nm,ti)=>{ const it=SLOTS[si].items[ti]; return [nm,it[1],it[2],it[3],it[4]]; })})); }
const HOME_SLOTS = mkSlots([
  {id:'bed',    name:'Postel',   names:['Matrace','Dřevěná postýlka','Postel s peřinou','Postel se srdíčkem','Postel s nebesy','Zámecká postel','Kouzelná zlatá postel']},
  {id:'rug',    name:'Koberec',  names:['Rohožka','Kulatý koberec','Pruhovaný koberec','Chlupatý koberec','Královský koberec']},
  {id:'wall',   name:'Tapety',   names:['Sluníčkové tapety','Puntíkaté tapety','Květinové tapety','Hvězdné tapety','Zlaté tapety']},
  {id:'lamp',   name:'Světlo',   names:['Svíčka','Stolní lampička','Lampa s motýlky','Lustr','Křišťálový lustr']},
  {id:'curtain',name:'Okno',     names:['Záclonka','Krajkové závěsy','Kouzelné závěsy']},
  {id:'plant',  name:'Kytky',    names:['Kaktus','Kytka v květináči','Velká palma']},
  {id:'hpet',   name:'Mazlíček', names:['Rybička v akváriu','Koťátko v košíku','Papoušek']},
]);
const PET_SLOTS = mkSlots([
  {id:'toy',    name:'Hračka',   names:['Klubíčko','Míček','Pískací kačenka','Létající talíř','Duhová kostka','Kouzelný míček','Zlatý míček']},
  {id:'pbed',   name:'Pelíšek',  names:['Krabice','Polštářek','Proutěný košík','Měkký pelíšek','Královský pelíšek']},
  {id:'collar', name:'Obojek',   names:['Provázek','Kožený obojek','Obojek se zvonečkem','Obojek s kamínky','Zlatý obojek']},
  {id:'phat',   name:'Na hlavu', names:['Mašlička','Kšiltovka','Kloboučík','Věneček z kytiček','Korunka']},
  {id:'shoes',  name:'Botičky',  names:['Ponožky','Botičky','Okřídlené botičky']},
  {id:'outfit', name:'Oblečení', names:['Šátek','Svetříček','Superhrdinský plášť']},
  {id:'friend', name:'Kamarád',  names:['Motýlek','Ptáček','Duhový motýl']},
]);
const GUESTS = MONSTERS.map((m,i)=>Object.assign({}, m, [
  {name:'Kamarádka Ája', where:'Přišla si hrát',            look:{gender:'f',color:'#21b37a',hair:'#e0b040'}},
  {name:'Babička',       where:'Přišla na čaj',             look:{gender:'f',color:'#8e44ad',hair:'#d8d8d8',x:{glasses:1}}},
  {name:'Dědeček',       where:'Přišel na návštěvu',        look:{gender:'m',color:'#7a5230',hair:'#e6e6e6',x:{glasses:1,beard:'#f0f0f0'}}},
  {name:'Paní učitelka', where:'Přišla se podívat',         look:{gender:'f',color:'#1fb5c9',hair:'#5b3a1e',x:{glasses:1}}},
  {name:'Pan kuchař',    where:'Chce ochutnat dort',        look:{gender:'m',color:'#f2f2f2',hair:'#3b2a1d',x:{chef:1}}},
  {name:'Víla',          where:'Přiletěla z lesa',          look:{gender:'f',color:'#ff9de0',hair:'#ffd84d',x:{wings:1,wand:1}}},
  {name:'Kouzelník',     where:'Přišel s kouzly',           look:{gender:'m',color:'#3b2a8a',hair:'#cccccc',x:{wizard:1,beard:'#e0e0e0',wand:1}}},
  {name:'Rytíř',         where:'Přijel na koni',            look:{gender:'m',color:'#4f7cff',hair:'#6b4226',eq:{weapon:5,shield:4,armor:4,head:4,cape:2}}},
  {name:'Princezna',     where:'Přijela kočárem',           look:{gender:'f',color:'#ff6fb5',hair:'#ffd84d',eq:{head:5,cape:2}}},
  {name:'Královna',      where:'Velká královská návštěva',  look:{gender:'f',color:'#8e1b2b',hair:'#3b2a1d',eq:{head:5,cape:3,armor:5}}},
][i]));
const SPECIES = [
  {id:'cat',    name:'Koťátko',   color:'#f4a259'},
  {id:'dog',    name:'Štěňátko',  color:'#c98b4f'},
  {id:'bunny',  name:'Králíček',  color:'#e9e4f0'},
  {id:'pony',   name:'Poník',     color:'#c9a0e8'},
  {id:'rat',    name:'Potkan',    color:'#a3a3b2'},
  {id:'hamster',name:'Křeček',    color:'#e8b36a'},
  {id:'fox',    name:'Liška',     color:'#f07c2a'},
  {id:'panda',  name:'Pandička',  color:'#f6f6f6'},
  {id:'owl',    name:'Sovička',   color:'#a0703a'},
  {id:'dragon', name:'Dráček',    color:'#5ccf8a'},
];
const SPMAP = Object.fromEntries(SPECIES.map(s=>[s.id,s]));
const CONTESTS = MONSTERS.map((m,i)=>Object.assign({}, m, [
  {name:'Skákání přes klacík', where:'Soupeř: králíček Fíbí',     opp:'bunny'},
  {name:'Hledání pokladu',     where:'Soupeř: štěňátko Bertík',   opp:'dog'},
  {name:'Závod na louce',      where:'Soupeř: křeček Pepík',      opp:'hamster'},
  {name:'Aport',               where:'Soupeř: potkan Rumcajs',    opp:'rat'},
  {name:'Přehlídka krásy',     where:'Soupeř: koťátko Mína',      opp:'cat'},
  {name:'Překážková dráha',    where:'Soupeř: poník Blesk',       opp:'pony'},
  {name:'Noční hlídka',        where:'Soupeř: sovička Hůhů',      opp:'owl'},
  {name:'Lesní maraton',       where:'Soupeř: liška Zrzka',       opp:'fox'},
  {name:'Bambusová výzva',     where:'Soupeř: pandička Bambi',    opp:'panda'},
  {name:'Velké finále',        where:'Soupeř: dráček Ohnivák',    opp:'dragon'},
][i]));
const FOODS = [ {id:'f1', name:'Mňamka', icon:'🥣', price:15, grow:5}, {id:'f2', name:'Pamlsek', icon:'🦴', price:35, grow:13}, {id:'f3', name:'Dortík', icon:'🎂', price:70, grow:28} ];
const PET_STAGES = ['Mládě','Malé','Dospívající','Dospělé'];
function petStage(p){ const L=level(p); return L<=3?0:L<=8?1:L<=14?2:3; }

const MODES = {
  quest: { key:'quest', title:'Výprava za drakem', icon:'⚔️', desc:'Kup si meč, štít a brnění a poraz draka a pak i legendární obludy.',
    slots:SLOTS, foes:MONSTERS, st:[['⚔️','Útok'],['🛡️','Obrana'],['❤️','Životy']], fst:[['⚔️','Útok'],['🛡️','Obrana'],['❤️','Životy']],
    mapTitle:'🗺️ Výprava', gearTitle:'🎒 Výbava a obchod', wearing:'Na sobě', equipWord:'nasaď si ho', equipped:'Nasazeno', removed:'Sundáno',
    foeW:['obluda','obludy','oblud'], fightBtn:'⚔️ Do boje!', finalName:'draka', finalIcon:'🐉',
    line:(d,md)=>`Správně = úder za ${d} · Chyba = netrefíš · Obluda útočí za ${md}`,
    explain:(d,md)=>`Každá správná odpověď = úder za <b>${d}</b>. Obluda ti každé kolo ubere <b>${md}</b> ❤️ – špatná odpověď znamená, že netrefíš, ale obluda útočí dál.`,
    hit:['Zásah! ⚔️','Přesně! 💥','Bum! 💪','Trefa! ✨'], miss:'Vedle!', missFloat:'vedle',
    roundsW:['ránu','rány','ran'], weakW:['slabý','slabá'],
    winTitle:last=>last?'🐉 DRAK JE PORAŽEN!':'Vítězství!', winText:(p,f)=>`${G(p,'Porazil','Porazila')} jsi: ${f.name}!`, loseText:(p,f)=>`${f.name} tě porazil. 😓`,
    goal:'Poraz 10 oblud – desátý je drak a za něj odměna od rodičů! Pak tě čeká 5 legendárních soupeřů až po Dračího krále.', flee:'Opravdu utéct z boje? Obluda zůstane neporažená.', doneShort:'🏆 Drak poražen!', progW:'Poražených oblud' },
  home: { key:'home', title:'Můj domeček', icon:'🏡', desc:'Zařiď si pokojíček krásnými věcmi a přivítej návštěvy až po krále.',
    slots:HOME_SLOTS, foes:GUESTS, st:[['✨','Útulnost'],['🛋️','Pohodlí'],['⏳','Čas']], fst:[['😤','Náročnost'],['🧐','Vybíravost'],['💖','Přání']],
    mapTitle:'🚪 Návštěvy', gearTitle:'🛍️ Obchod a zařizování pokoje', wearing:'V pokoji', equipWord:'dej si ho do pokoje', equipped:'Dáno do pokoje', removed:'Uklizeno',
    foeW:['návštěva','návštěvy','návštěv'], fightBtn:'🫖 Pozvat dál!', finalName:'královnu', finalIcon:'👑',
    line:(d,md)=>`Správně = návštěvu potěšíš o ${d} 💖 · Chyba = nepovede se · Každé kolo ubyde ⏳ ${md}`,
    explain:(d,md)=>`Každá správná odpověď návštěvu potěší o <b>${d}</b> 💖. Každé kolo ti ubyde <b>${md}</b> ⏳ času – při chybě se pohoštění nepovede.`,
    hit:['Mňam! 🍰','Paráda! 💖','Návštěva se usmívá 😊','Krása! ✨'], miss:'Nepovedlo se!', missFloat:'ups',
    roundsW:['kolo','kola','kol'], weakW:['připravený','připravená'],
    winTitle:last=>last?'👑 KRÁLOVNA JE NADŠENÁ!':'Návštěva je nadšená!', winText:(p,f)=>`${f.name} se u tebe ${/a$|ka$/.test(f.name)?'měla':'měl'} moc krásně!`, loseText:(p,f)=>`${f.name} musel${/a$|ka$/.test(f.name)?'a':''} odejít dřív. 😕`,
    goal:'Přivítej 10 návštěv – desátá je královna a za ni odměna od rodičů! Pak přijede 5 legendárních hostů až po krále.', flee:'Opravdu ukončit návštěvu? Bude potřeba ji pozvat znovu.', doneShort:'👑 Královna nadšená!', progW:'Spokojených návštěv' },
  pet: { key:'pet', title:'Moje zvířátko', icon:'🐾', desc:'Starej se o mládě, krm ho, ať roste, a vyhrajte spolu soutěže až po šampionát.',
    slots:PET_SLOTS, foes:CONTESTS, st:[['🎯','Šikovnost'],['🧘','Klid'],['⚡','Energie']], fst:[['💨','Tempo'],['🧱','Obtížnost'],['🏅','Body soupeře']],
    mapTitle:'🏆 Soutěže', gearTitle:'🛍️ Obchod a doplňky', wearing:'Má na sobě', equipWord:'dej ho zvířátku', equipped:'Nasazeno', removed:'Sundáno',
    foeW:['soutěž','soutěže','soutěží'], fightBtn:'🏁 Soutěžit!', finalName:'velké finále', finalIcon:'🏆',
    line:(d,md)=>`Správně = získáte ${d} 🏅 · Chyba = nepovede se · Každé kolo ubyde ⚡ ${md}`,
    explain:(d,md)=>`Každá správná odpověď = <b>${d}</b> 🏅 bodů. Každé kolo ubyde <b>${md}</b> ⚡ energie – při chybě se cvik nepovede.`,
    hit:['Hop! 🐾','Paráda! 🏅','Výborně! ✨','Jupí! 🎉'], miss:'Nepovedlo se!', missFloat:'ups',
    roundsW:['kolo','kola','kol'], weakW:['připravený','připravená'],
    winTitle:last=>last?'🏆 VYHRÁLI JSTE VELKÉ FINÁLE!':'Vyhráli jste!', winText:(p,f)=>`Vyhráli jste soutěž: ${f.name}!`, loseText:(p,f)=>`Tentokrát vyhrál soupeř. 😕`,
    goal:'Vyhrajte 10 soutěží – desátá je velké finále a za něj odměna od rodičů! Pak čeká 5 legendárních soutěží až po světový šampionát.', flee:'Opravdu odstoupit ze soutěže?', doneShort:'🏆 Finále vyhráno!', progW:'Vyhraných soutěží' },
};
const modeOf = p => MODES[(p&&p.mode)||'quest'] || MODES.quest;
const slotsOf = p => modeOf(p).slots;
const slotOf = (p,id) => slotsOf(p).find(s=>s.id===id);
const foesOf = p => modeOf(p).foes;

/* ---- Kreslení: hlavní obrázek podle dobrodružství ---- */
function avatarSVG(p, opts={}){
  const m=(p&&p.mode)||'quest';
  if(m==='home') return roomSVG(p, opts);
  if(m==='pet') return petSVG(p, Object.assign({mood: p.fedDate===todayKey()?'happy':'sad'}, opts));
  return heroImg(p, opts);
}
function kidSVG(p){ return heroSVG({gender:p.gender, color:p.color, eq:{}}); }
function guestSVG(i){ const g=GUESTS[i].look; return heroSVG({gender:g.gender, color:g.color, hair:g.hair, eq:g.eq||{}}, {x:g.x||{}}); }
function foeSVG(p, i){
  const m=(p&&p.mode)||'quest';
  if(m==='home') return guestSVG(i);
  if(m==='pet'){ const c=CONTESTS[i]; const t=Math.min(5,1+Math.floor(i/2)); return petSVG({species:c.opp, xp:9999, eq:{collar:Math.min(5,t), phat:i>=3?Math.min(5,t):0, outfit:i>=6?Math.min(3,t-2):0}}, {flip:true, stage:Math.min(3,1+Math.floor(i/3))}); }
  return monsterSVG(i);
}
function foeScene(p, i){
  const m=(p&&p.mode)||'quest';
  if(m==='home') return roomSVG(p, {scene:true});
  if(m==='pet') return contestScene(i);
  return sceneSVG(i);
}

/* ---- Pokojíček ---- */
function roomSVG(p, opts={}){
  const e=p.eq||{}; const BD=e.bed||0, RG=e.rug||0, WL=e.wall||0, LM=e.lamp||0, CU=e.curtain||0, PL=e.plant||0, HP=e.hpet||0;
  const uid='r'+(++_uid);
  let s=`<svg viewBox="0 0 400 260" ${opts.scene?'preserveAspectRatio="xMidYMid slice" class="scene"':''} xmlns="http://www.w3.org/2000/svg">`;
  const wallCol=['#f3e9d6','#fde9a6','#ffd6e3','#e3f4d8','#28356b','#f5d98a'][WL];
  s+=`<rect width="400" height="190" fill="${wallCol}"/>`;
  if(WL===1) for(let x=0;x<400;x+=40) s+=`<rect x="${x}" width="20" height="190" fill="#fff3c4" opacity=".7"/>`;
  if(WL===2) for(let y=15;y<190;y+=30) for(let x=(y%60?20:0);x<400;x+=40) s+=`<circle cx="${x}" cy="${y}" r="6" fill="#ff8fb3" opacity=".7"/>`;
  if(WL===3) for(let y=20;y<190;y+=40) for(let x=(y%80?30:10);x<400;x+=60) s+=`<g opacity=".8"><circle cx="${x}" cy="${y}" r="5" fill="#ffd84d"/><circle cx="${x-7}" cy="${y}" r="5" fill="#ff8fb3"/><circle cx="${x+7}" cy="${y}" r="5" fill="#ff8fb3"/><circle cx="${x}" cy="${y-7}" r="5" fill="#ff8fb3"/><circle cx="${x}" cy="${y+7}" r="5" fill="#ff8fb3"/></g>`;
  if(WL===4) for(let n=0;n<40;n++) s+=`<path d="M${(n*97)%400} ${(n*53)%180+6} l2 5 5 0 -4 3 2 5 -5 -3 -5 3 2 -5 -4 -3 5 0z" fill="#ffe14d"/>`;
  if(WL===5) for(let y=20;y<190;y+=36) for(let x=(y%72?30:12);x<400;x+=44) s+=`<path d="M${x} ${y-9} q8 9 0 18 q-8 -9 0 -18z" fill="#c99a10" opacity=".55"/>`;
  s+=`<rect y="180" width="400" height="10" fill="#e8d3b0"/><rect y="190" width="400" height="70" fill="#c89a63"/>`;
  for(let x=0;x<400;x+=50) s+=`<path d="M${x} 190 V260" stroke="#a87b48" stroke-width="2"/>`;
  // window
  s+=`<rect x="30" y="30" width="100" height="90" rx="6" fill="#bfe6ff"/><circle cx="105" cy="55" r="12" fill="#fff3a0"/><path d="M30 100 q25 -16 50 0 t50 0 V120 H30z" fill="#8fd48a"/><path d="M80 30 V120 M30 75 H130" stroke="#fff" stroke-width="5"/><rect x="30" y="30" width="100" height="90" rx="6" fill="none" stroke="#fff" stroke-width="6"/>`;
  if(CU){ const cc=['','#ffffff','#ffc2d6','#8e6bd8'][CU];
    s+=`<path d="M22 24 Q40 70 30 126 L52 126 Q48 70 58 24Z" fill="${cc}" ${CU===1?'opacity=".85"':''}/><path d="M138 24 Q120 70 130 126 L108 126 Q112 70 102 24Z" fill="${cc}" ${CU===1?'opacity=".85"':''}/><rect x="18" y="20" width="124" height="7" rx="3" fill="#8a5a2b"/>`;
    if(CU===3) s+=`<path d="M36 50 l2 4 4 0 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 0z M120 80 l2 4 4 0 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 0z" fill="#ffe14d"/>`;
    if(CU===2) s+=`<path d="M24 126 q8 6 14 0 q8 6 14 0 M108 126 q8 6 14 0 q8 6 14 0" stroke="#fff" stroke-width="2" fill="none"/>`; }
  // picture on wall
  s+=`<rect x="296" y="44" width="56" height="42" rx="3" fill="#fff" /><path d="M302 80 l13 -17 9 11 8 -8 14 14z" fill="#7cc24f"/><circle cx="338" cy="55" r="5" fill="#ffd84d"/>`;
  if(!opts.scene){
  // rug
  if(RG===1) s+=`<rect x="140" y="222" width="110" height="22" rx="3" fill="#a8703c"/><path d="M146 228 h98 M146 238 h98" stroke="#7a4b26" stroke-width="2"/>`;
  if(RG===2) s+=`<ellipse cx="195" cy="232" rx="80" ry="18" fill="#5aa9e6"/><ellipse cx="195" cy="232" rx="55" ry="11" fill="#bfe1fb"/>`;
  if(RG===3) { s+=`<ellipse cx="195" cy="232" rx="90" ry="20" fill="#ff8fb3"/>`; for(let k=0;k<4;k++) s+=`<ellipse cx="195" cy="232" rx="${80-k*18}" ry="${17-k*4}" fill="${['#ffd84d','#7cc24f','#5aa9e6','#fff'][k]}"/>`; }
  if(RG===4) s+=`<path d="M105 232 q10 -22 30 -18 q15 -10 30 -4 q15 -10 30 -2 q16 -8 30 0 q16 -4 26 8 q12 10 -4 22 q-10 10 -30 6 q-14 6 -30 2 q-16 6 -32 0 q-16 6 -32 -2 q-24 2 -18 -12z" fill="#f4f0ff"/>`;
  if(RG===5) s+=`<rect x="110" y="214" width="170" height="38" rx="6" fill="#b3122a"/><rect x="118" y="220" width="154" height="26" rx="4" fill="none" stroke="#f2c230" stroke-width="3"/><path d="M195 224 l4 6 7 0 -5 4 2 6 -8 -4 -8 4 2 -6 -5 -4 7 0z" fill="#f2c230"/>`;
  // plant
  if(PL===1) s+=`<rect x="20" y="214" width="26" height="22" rx="3" fill="#c0603a"/><path d="M33 214 v-30 M33 196 h-8 v-10 M33 200 h8 v-12" stroke="#4c9a3a" stroke-width="8" stroke-linecap="round"/>`;
  if(PL===2) s+=`<rect x="18" y="212" width="30" height="24" rx="4" fill="#5aa9e6"/><path d="M33 212 v-24" stroke="#3d7a2a" stroke-width="3"/><circle cx="33" cy="184" r="9" fill="#ff6f91"/><circle cx="33" cy="184" r="4" fill="#ffd84d"/><circle cx="22" cy="196" r="6" fill="#ffb3c6"/><circle cx="44" cy="194" r="6" fill="#ffb3c6"/>`;
  if(PL===3) s+=`<rect x="14" y="206" width="38" height="32" rx="5" fill="#a0522d"/><path d="M33 206 V140" stroke="#7a5230" stroke-width="6"/><path d="M33 142 q-30 -10 -34 14 M33 142 q30 -12 36 12 M33 142 q-16 -24 -38 -18 M33 142 q16 -24 40 -16 M33 142 q0 -24 2 -30" stroke="#3d9a4a" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  // nightstand + lamp
  s+=`<rect x="232" y="176" width="34" height="46" rx="3" fill="#a8703c"/><rect x="236" y="194" width="26" height="10" rx="2" fill="#8a5a2b"/>`;
  if(LM===1) s+=`<rect x="244" y="160" width="8" height="16" fill="#fff8e8"/><path d="M248 150 q6 6 0 10 q-6 -4 0 -10z" fill="#ffb02e"/><circle cx="248" cy="158" r="16" fill="#ffe08a" opacity=".35"/>`;
  if(LM===2) s+=`<rect x="246" y="156" width="4" height="20" fill="#5f6a80"/><path d="M236 156 l8 -18 h10 l8 18z" fill="#5aa9e6"/><circle cx="249" cy="166" r="22" fill="#ffe08a" opacity=".3"/>`;
  if(LM===3) s+=`<rect x="246" y="156" width="4" height="20" fill="#5f6a80"/><path d="M234 156 l8 -20 h14 l8 20z" fill="#ffd6e3"/><path d="M242 146 q-4 -4 0 -6 q4 2 2 6 M256 148 q4 -4 6 0 q-2 4 -6 0" fill="#c04cf5"/><circle cx="249" cy="166" r="24" fill="#ffe08a" opacity=".35"/>`;
  if(LM>=4){ const cr=LM===5; s+=`<path d="M200 0 V30" stroke="#8a5a2b" stroke-width="3"/><path d="M170 40 q30 14 60 0" stroke="${cr?'#cfe8ff':'#c99a10'}" stroke-width="5" fill="none"/><circle cx="170" cy="38" r="5" fill="#fff3a0"/><circle cx="200" cy="46" r="5" fill="#fff3a0"/><circle cx="230" cy="38" r="5" fill="#fff3a0"/><circle cx="200" cy="40" r="50" fill="#fff3a0" opacity=".25"/>`; if(cr) s+=`<path d="M175 46 l-3 10 6 0z M200 54 l-3 10 6 0z M225 46 l-3 10 6 0z" fill="#d9f0ff"/>`; }
  }
  // bed
  if(BD===1) s+=`<rect x="280" y="200" width="110" height="24" rx="8" fill="#e8e3ef"/><rect x="290" y="192" width="30" height="14" rx="6" fill="#fff"/>`;
  if(BD>=2){ const frame=['', '', '#a8703c','#c98b4f','#ff8fb3','#e8e3ef','#8a6ad8','#f2c230'][BD], cover=['', '', '#5aa9e6','#7cc24f','#ffd6e3','#ffb3c6','#5b2a86','#fff2a6'][BD];
    if(BD>=5) s+=`<path d="M278 120 h114 l-6 -14 h-102z" fill="${BD===7?'#f2c230':'#ffb3c6'}"/><path d="M282 120 v96 M388 120 v96" stroke="${frame}" stroke-width="5"/><path d="M284 122 q10 40 0 80 M386 122 q-10 40 0 80" fill="none" stroke="${BD===6?'#c9b3ff':'#ffffff'}" stroke-width="8" opacity=".8"/>`;
    if(BD===6) s+=`<path d="M276 112 v-16 h8 v6 h6 v-6 h8 v16z M372 112 v-16 h8 v6 h6 v-6 h8 v16z" fill="#8a6ad8"/>`;
    s+=`<rect x="280" y="150" width="14" height="80" rx="3" fill="${frame}"/>${BD===4?'<path d="M287 162 q-8 -10 0 -14 q8 4 0 14z" fill="#ff4d7d"/>':''}<rect x="294" y="186" width="96" height="30" rx="6" fill="${cover}"/><rect x="296" y="178" width="28" height="14" rx="6" fill="#fff"/><rect x="280" y="214" width="112" height="10" rx="3" fill="${frame}"/>`;
    if(BD===7) s+=`<circle cx="335" cy="190" r="60" fill="#fff3a0" opacity=".25"/><path d="M340 194 l3 6 6 0 -5 4 2 6 -6 -4 -6 4 2 -6 -5 -4 6 0z" fill="#f2c230"/>`; }
  // pet
  if(!opts.scene){
  if(HP===1) s+=`<path d="M242 176 q-2 -22 7 -26 q9 4 7 26z" fill="#bfe6ff" opacity=".85"/><path d="M246 162 q4 -4 8 0 q-4 4 -8 0z M254 162 l4 -3 v6z" fill="#ff8c1a"/>`;
  if(HP===2) s+=`<g transform="translate(40 0)"><ellipse cx="150" cy="236" rx="26" ry="10" fill="#c98b4f"/><path d="M126 232 q24 -10 48 0" stroke="#a8703c" stroke-width="5" fill="none"/><circle cx="150" cy="222" r="12" fill="#f4a259"/><path d="M140 214 l2 -10 6 7z M160 214 l-2 -10 -6 7z" fill="#f4a259"/><circle cx="146" cy="222" r="1.8" fill="#2b2340"/><circle cx="154" cy="222" r="1.8" fill="#2b2340"/></g>`;
  if(HP===3) s+=`<g transform="translate(40 0)"><path d="M150 236 V170 M138 172 h24" stroke="#7a5230" stroke-width="4"/><ellipse cx="150" cy="156" rx="11" ry="15" fill="#3cc47c"/><circle cx="150" cy="144" r="9" fill="#e8435a"/><path d="M157 144 l7 2 -7 3z" fill="#ffd84d"/><circle cx="152" cy="142" r="1.8" fill="#2b2340"/><path d="M146 168 q-4 10 -2 18" stroke="#5aa9e6" stroke-width="5" fill="none"/></g>`;
  }
  if(!opts.scene && opts.kid!==false) s+=`<g transform="translate(56 98) scale(.62)">${heroBase({gender:p.gender,color:p.color,eq:{}}).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</g>`;
  s+=`</svg>`;
  return stylize(s,{sw:1.8});
}

/* ---- Zvířátka ---- */
function petSVG(p, opts={}){
  const sp=p.species||'cat', S0=SPMAP[sp]||SPECIES[0], col=p.petColor||S0.color, e=p.eq||{};
  const stage = opts.stage!==undefined ? opts.stage : petStage(p);
  const sc=[0.62,0.74,0.87,1][stage];
  const dark=shade(col,-.3), light=shade(col,.45);
  const TY=e.toy||0, PB=e.pbed||0, CO=e.collar||0, PH=e.phat||0, SH=e.shoes||0, OU=e.outfit||0, FR=e.friend||0;
  const happy = opts.mood!=='sad';
  let s=`<svg viewBox="0 0 240 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${S0.name}">`;
  s+=`<ellipse cx="120" cy="238" rx="${60*sc+10}" ry="8" fill="#000" opacity=".1"/>`;
  // bed (full size, behind)
  if(PB===1) s+=`<path d="M48 236 v-34 h144 v34z" fill="#c89a63"/><path d="M48 202 l-10 -14 h164 l-10 14" fill="#d9b080"/>`;
  if(PB===2) s+=`<ellipse cx="120" cy="230" rx="78" ry="14" fill="#5aa9e6"/>`;
  if(PB===3) s+=`<path d="M40 214 q80 40 160 0 v6 q-80 30 -160 0z" fill="#c98b4f"/><ellipse cx="120" cy="226" rx="78" ry="14" fill="#a8703c"/>`;
  if(PB===4) s+=`<ellipse cx="120" cy="226" rx="86" ry="20" fill="#ff8fb3"/><ellipse cx="120" cy="228" rx="64" ry="12" fill="#ffd6e3"/>`;
  if(PB===5) s+=`<ellipse cx="120" cy="226" rx="90" ry="22" fill="#b3122a"/><ellipse cx="120" cy="228" rx="68" ry="13" fill="#e8435a"/><path d="M32 224 q88 24 176 0" stroke="#f2c230" stroke-width="4" fill="none"/>`;
  // toy (beside, full size)
  const toy = [
    '', `<circle cx="206" cy="226" r="11" fill="#e8435a"/><path d="M197 222 q9 6 18 0 M198 230 q8 -6 16 0" stroke="#fff" stroke-width="1.5" fill="none"/>`,
    `<circle cx="206" cy="224" r="12" fill="#ffffff"/><path d="M194 224 h24" stroke="#e8435a" stroke-width="6"/>`,
    `<ellipse cx="206" cy="228" rx="13" ry="9" fill="#ffd84d"/><circle cx="214" cy="216" r="7" fill="#ffd84d"/><path d="M220 216 l6 2 -6 2z" fill="#ff8c1a"/>`,
    `<ellipse cx="206" cy="230" rx="17" ry="6" fill="#5aa9e6"/><ellipse cx="206" cy="228" rx="9" ry="3" fill="#bfe1fb"/>`,
    `<rect x="194" y="212" width="22" height="22" rx="3" fill="#ff6f91"/><path d="M194 219 h22 M194 226 h22 M201 212 v22 M208 212 v22" stroke="#fff" stroke-width="2"/><rect x="194" y="212" width="7" height="7" fill="#ffd84d"/><rect x="208" y="226" width="8" height="8" fill="#5aa9e6"/>`,
    `<circle cx="206" cy="222" r="18" fill="#c04cf5" opacity=".25"/><circle cx="206" cy="224" r="11" fill="#8e44ad"/><path d="M202 220 l3 -4 3 4z" fill="#fff"/>`,
    `<circle cx="206" cy="222" r="20" fill="#fff3a0" opacity=".5"/><circle cx="206" cy="224" r="12" fill="#f2c230"/><path d="M200 220 q6 -5 12 0" stroke="#fff" stroke-width="2" fill="none"/>`][TY];
  s+=toy;
  // friend floating
  if(FR) s+=`<g class="pet">${['',`<path d="M200 64 q-14 -12 -16 4 q2 8 16 0z M200 64 q14 -12 16 4 q-2 8 -16 0z" fill="#ffb02e"/><path d="M200 58 v12" stroke="#2b2340" stroke-width="2"/>`,
    `<ellipse cx="204" cy="66" rx="12" ry="9" fill="#5aa9e6"/><circle cx="212" cy="60" r="6" fill="#5aa9e6"/><path d="M217 60 l5 1 -5 2z" fill="#ffb02e"/><path d="M198 64 q-6 -8 2 -10" stroke="#3a7fc4" stroke-width="3" fill="none"/>`,
    `<path d="M200 64 q-16 -16 -20 4 q2 10 20 0z" fill="#ff6f91"/><path d="M200 64 q16 -16 20 4 q-2 10 -20 0z" fill="#5aa9e6"/><path d="M200 66 q-12 8 -10 14 q6 0 10 -12z" fill="#ffd84d"/><path d="M200 66 q12 8 10 14 q-6 0 -10 -12z" fill="#7cc24f"/><path d="M200 58 v14" stroke="#2b2340" stroke-width="2"/>`][FR]}</g>`;
  // pet body group (scaled by growth)
  s+=`<g class="hb"><g transform="translate(120 236) scale(${opts.flip?-sc:sc} ${sc}) translate(-120 -236)">`;
  // cape behind
  if(OU===3) s+=`<path d="M86 160 Q120 150 154 160 L176 226 Q120 236 64 226Z" fill="#e8435a"/>`;
  // species back parts (tails, back ears)
  const T = {
    cat:`<path d="M162 206 q34 -6 30 -40 q-2 -14 -12 -12 q8 16 -4 34 q-8 10 -18 8z" fill="${col}"/>`,
    dog:`<path d="M164 196 q18 -10 18 -28" stroke="${col}" stroke-width="10" fill="none" stroke-linecap="round"/>`,
    bunny:`<circle cx="166" cy="206" r="12" fill="#ffffff"/>`,
    pony:`<path d="M164 190 q30 6 26 40 q-10 -6 -14 -2 q2 -22 -14 -30z" fill="#ff8fc8"/>`,
    rat:`<path d="M162 214 q40 8 52 -18 q6 -14 -4 -20" stroke="#ffb3c6" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    hamster:'',
    fox:`<path d="M160 208 q44 4 40 -40 q-2 -18 -18 -16 q10 24 -6 40 q-8 8 -16 6z" fill="${col}"/><path d="M196 172 q-2 -18 -14 -16 q8 6 6 20z" fill="#ffffff"/>`,
    panda:`<circle cx="164" cy="210" r="8" fill="#2b2340"/>`,
    owl:'',
    dragon:`<path d="M160 212 q40 8 50 -20" stroke="${col}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M206 186 l14 -8 -4 16z" fill="#c04cf5"/>`,
  }[sp]||'';
  s+=T;
  if(sp==='dragon') s+=`<path d="M82 170 q-30 -30 -40 -6 q12 0 14 10 q10 -4 26 6z M158 170 q30 -30 40 -6 q-12 0 -14 10 q-10 -4 -26 6z" fill="#c04cf5"/>`;
  if(sp==='owl') s+=`<path d="M74 170 q-14 30 6 52 q10 -24 4 -52z M166 170 q14 30 -6 52 q-10 -24 -4 -52z" fill="${dark}"/>`;
  // body
  const bodyCol = sp==='panda' ? '#2b2340' : col;
  s+=`<ellipse cx="120" cy="196" rx="${sp==='owl'?50:46}" ry="${sp==='owl'?44:36}" fill="${sp==='panda'?'#f6f6f6':col}"/>`;
  if(sp==='panda') s+=`<path d="M78 180 q42 -22 84 0 q-6 14 -12 16 q-30 -12 -60 0 q-6 -2 -12 -16z" fill="#2b2340"/>`;
  s+=`<ellipse cx="120" cy="206" rx="${sp==='owl'?30:26}" ry="${sp==='owl'?26:20}" fill="${sp==='panda'?'#ffffff':sp==='owl'?'#e8d2b0':light}"/>`;
  if(sp==='owl') s+=`<path d="M108 196 l4 4 4 -4 M120 196 l4 4 4 -4 M114 208 l4 4 4 -4 M126 208 l4 4 4 -4" stroke="${dark}" stroke-width="2" fill="none"/>`;
  if(sp==='dragon') s+=`<path d="M106 192 h28 M104 202 h32 M106 212 h28" stroke="#f2c230" stroke-width="3"/>`;
  // sweater
  if(OU===2) s+=`<path d="M78 186 Q120 164 162 186 L160 214 Q120 226 80 214Z" fill="#7cc24f"/><path d="M84 194 h72 M82 204 h76" stroke="#fff" stroke-width="3" stroke-dasharray="6 4"/>`;
  // feet
  const footCol = sp==='panda' ? '#2b2340' : sp==='owl' ? '#ffb02e' : col;
  s+=`<ellipse cx="98" cy="228" rx="15" ry="9" fill="${footCol}"/><ellipse cx="142" cy="228" rx="15" ry="9" fill="${footCol}"/>`;
  if(SH) { const sc2=['','#ff8fb3','#5aa9e6','#f2c230'][SH]; s+=`<path d="M84 226 q14 -12 28 0 v8 h-28z M128 226 q14 -12 28 0 v8 h-28z" fill="${sc2}"/>`; if(SH===1) s+=`<path d="M86 230 h24 M130 230 h24" stroke="#fff" stroke-width="2"/>`; if(SH===3) s+=`<path d="M84 224 q-12 -8 -16 2 q8 0 16 4z M156 224 q12 -8 16 2 q-8 0 -16 4z" fill="#ffffff"/>`; }
  // ears behind head
  const E = {
    cat:`<path d="M84 96 L80 52 L112 80Z M156 96 L160 52 L128 80Z" fill="${col}"/><path d="M88 88 L86 64 L104 80Z M152 88 L154 64 L136 80Z" fill="#ffb3c6"/>`,
    dog:'',
    bunny:`<ellipse cx="100" cy="52" rx="13" ry="38" fill="${col}"/><ellipse cx="140" cy="52" rx="13" ry="38" fill="${col}"/><ellipse cx="100" cy="54" rx="6" ry="28" fill="#ffb3c6"/><ellipse cx="140" cy="54" rx="6" ry="28" fill="#ffb3c6"/>`,
    pony:`<path d="M90 90 L88 58 L108 80Z M150 90 L152 58 L132 80Z" fill="${col}"/>`,
    rat:`<circle cx="82" cy="82" r="20" fill="${col}"/><circle cx="158" cy="82" r="20" fill="${col}"/><circle cx="82" cy="82" r="12" fill="#ffc2d6"/><circle cx="158" cy="82" r="12" fill="#ffc2d6"/>`,
    hamster:`<circle cx="88" cy="84" r="11" fill="${col}"/><circle cx="152" cy="84" r="11" fill="${col}"/><circle cx="88" cy="84" r="6" fill="#ffc2d6"/><circle cx="152" cy="84" r="6" fill="#ffc2d6"/>`,
    fox:`<path d="M80 100 L74 48 L114 80Z M160 100 L166 48 L126 80Z" fill="${col}"/><path d="M74 48 L78 66 L88 60Z M166 48 L162 66 L152 60Z" fill="#2b2340"/>`,
    panda:`<circle cx="86" cy="80" r="15" fill="#2b2340"/><circle cx="154" cy="80" r="15" fill="#2b2340"/>`,
    owl:`<path d="M84 90 L80 62 L104 82Z M156 90 L160 62 L136 82Z" fill="${dark}"/>`,
    dragon:`<path d="M92 84 L84 52 L106 78Z M148 84 L156 52 L134 78Z" fill="#f5e6c8"/>`,
  }[sp]||'';
  s+=E;
  // head
  s+=`<circle cx="120" cy="118" r="${sp==='owl'?0:44}" fill="${col}"/>`;
  if(sp==='owl') s+=`<ellipse cx="120" cy="124" rx="50" ry="44" fill="${col}"/>`;
  if(sp==='pony') s+=`<path d="M80 96 q10 -34 50 -30 q-4 8 6 12 q-28 -6 -40 14 q-8 6 -16 4z" fill="#ff8fc8"/>`;
  if(sp==='cat') s+=`<path d="M112 78 l3 12 M120 76 v12 M128 78 l-3 12" stroke="${dark}" stroke-width="3"/>`;
  if(sp==='dog') s+=`<ellipse cx="78" cy="122" rx="14" ry="26" fill="${dark}" transform="rotate(16 78 122)"/><ellipse cx="162" cy="122" rx="14" ry="26" fill="${dark}" transform="rotate(-16 162 122)"/>`;
  if(sp==='fox') s+=`<ellipse cx="98" cy="138" rx="17" ry="13" fill="#fff4e8"/><ellipse cx="142" cy="138" rx="17" ry="13" fill="#fff4e8"/>`;
  if(sp==='hamster') s+=`<ellipse cx="90" cy="134" rx="16" ry="13" fill="#fff5e6"/><ellipse cx="150" cy="134" rx="16" ry="13" fill="#fff5e6"/>`;
  if(sp==='panda') s+=`<ellipse cx="102" cy="118" rx="13" ry="16" fill="#2b2340" transform="rotate(-20 102 118)"/><ellipse cx="138" cy="118" rx="13" ry="16" fill="#2b2340" transform="rotate(20 138 118)"/>`;
  if(sp==='dragon') s+=`<path d="M108 76 l4 -10 4 10z M120 74 l4 -12 4 12z" fill="#c04cf5"/>`;
  if(sp==='owl') s+=`<circle cx="100" cy="116" r="18" fill="#fff8e8"/><circle cx="140" cy="116" r="18" fill="#fff8e8"/>`;
  // muzzle
  if(sp==='dog'||sp==='pony'||sp==='rat') s+=`<ellipse cx="120" cy="${sp==='pony'?142:138}" rx="${sp==='pony'?26:20}" ry="${sp==='pony'?17:14}" fill="${sp==='rat'?light:'#fff5e6'}"/>`;
  // eyes
  const er = sp==='owl'?10:8.5, ex=sp==='owl'?100:102, ex2=sp==='owl'?140:138, ey=sp==='owl'?116:116;
  const irisC = sp==='owl'?'#ffb02e':sp==='dragon'?'#c04cf5':'#3a2a1d';
  s+=`<circle cx="${ex}" cy="${ey}" r="${er}" fill="#ffffff"/><circle cx="${ex2}" cy="${ey}" r="${er}" fill="#ffffff"/><circle cx="${ex+1}" cy="${ey+1}" r="${er*0.72}" fill="${irisC}" stroke="none"/><circle cx="${ex2+1}" cy="${ey+1}" r="${er*0.72}" fill="${irisC}" stroke="none"/><circle cx="${ex+1}" cy="${ey+1.5}" r="${er*0.38}" fill="#1a1222"/><circle cx="${ex2+1}" cy="${ey+1.5}" r="${er*0.38}" fill="#1a1222"/><circle cx="${ex+3.5}" cy="${ey-2.5}" r="2.4" fill="#fff"/><circle cx="${ex2+3.5}" cy="${ey-2.5}" r="2.4" fill="#fff"/>`;
  // nose & mouth
  if(sp==='owl') s+=`<path d="M114 132 h12 l-6 12z" fill="#ffb02e"/>`;
  else if(sp==='pony') s+=`<ellipse cx="111" cy="140" rx="3" ry="2.4" fill="#2b2340"/><ellipse cx="129" cy="140" rx="3" ry="2.4" fill="#2b2340"/>`;
  else s+=`<path d="M114 ${sp==='dog'||sp==='rat'?130:132} q6 6 12 0z" fill="${sp==='cat'||sp==='bunny'||sp==='rat'||sp==='hamster'?'#ff7fa3':'#2b2340'}"/>`;
  if(sp!=='owl') s+=`<path d="M110 ${sp==='pony'?150:142} q5 ${happy?6:2} 10 0 q5 ${happy?6:2} 10 0" stroke="#2b2340" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if(sp==='dog') s+=`<path d="M116 146 q4 10 8 0z" fill="#ff7fa3"/>`;
  if(sp==='bunny'||sp==='rat') s+=`<rect x="116" y="143" width="8" height="7" rx="1" fill="#ffffff"/>`;
  if(sp==='cat'||sp==='rat'||sp==='hamster'||sp==='fox') s+=`<path d="M100 136 l-20 -4 M100 140 l-20 2 M140 136 l20 -4 M140 140 l20 2" stroke="#2b2340" stroke-width="1.4" opacity=".6"/>`;
  s+=`<circle cx="96" cy="134" r="6" fill="#ff9a9a" opacity=".45"/><circle cx="144" cy="134" r="6" fill="#ff9a9a" opacity=".45"/>`;
  // collar / scarf
  if(CO){ const cc=['','#c9a26a','#8a5a2b','#e8435a','#5aa9e6','#f2c230'][CO]; s+=`<path d="M88 158 q32 14 64 0 v8 q-32 14 -64 0z" fill="${cc}"/>`; if(CO===3) s+=`<circle cx="120" cy="176" r="6" fill="#f2c230"/>`; if(CO===4) s+=`<circle cx="104" cy="168" r="3" fill="#ff6f91"/><circle cx="120" cy="171" r="3.5" fill="#ffffff"/><circle cx="136" cy="168" r="3" fill="#7cc24f"/>`; if(CO===5) s+=`<path d="M120 170 l5 8 -5 6 -5 -6z" fill="#e84393"/>`; }
  if(OU===1) s+=`<path d="M90 156 q30 14 60 0 l-26 30 h-8z" fill="#5aa9e6"/><circle cx="104" cy="164" r="2" fill="#fff"/><circle cx="130" cy="166" r="2" fill="#fff"/>`;
  // hat
  if(PH===1) s+=`<path d="M146 82 l-14 -10 v20z M146 82 l14 -10 v20z" fill="#ff6f91"/><circle cx="146" cy="82" r="5" fill="#e8435a"/>`;
  if(PH===2) s+=`<path d="M86 86 q34 -40 68 0z" fill="#5aa9e6"/><path d="M150 86 h30 q-6 8 -30 6z" fill="#3a7fc4"/>`;
  if(PH===3) s+=`<ellipse cx="120" cy="80" rx="40" ry="8" fill="#8e44ad"/><path d="M98 80 q2 -30 22 -30 q20 0 22 30z" fill="#8e44ad"/><path d="M98 72 h44" stroke="#ff6f91" stroke-width="5"/>`;
  if(PH===4) { for(let k=0;k<7;k++){ const a=Math.PI*(0.15+k*0.115); const x=120-Math.cos(a)*44, y=96-Math.sin(a)*26; s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${['#ff6f91','#ffd84d','#ffffff','#c04cf5'][k%4]}"/>`; } }
  if(PH===5) s+=`<path d="M98 82 L100 60 L110 72 L120 54 L130 72 L140 60 L142 82Z" fill="#f5c400"/><circle cx="120" cy="70" r="3.5" fill="#e84393"/>`;
  s+=`</g></g></svg>`;
  return stylize(s,{sw:2.2});
}

function contestScene(i){
  const V=inner=>`<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" class="scene">${inner}</svg>`;
  const skyC=[['#9fd8ff','#e8f7ff'],['#a8e0ff','#fff6e0'],['#8fd0ff','#e6f8ff'],['#b4e4ff','#f2fbff'],['#ffd6e3','#fff0f6'],['#9fd8ff','#e8f7ff'],['#0f1c3d','#2c4a7a'],['#5f8f6a','#cfe8c8'],['#bfe6c8','#effaf0'],['#2a1a4a','#7a4a8e']][i];
  const id='cs'+i+'_'+(++_uid);
  let s=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyC[0]}"/><stop offset="1" stop-color="${skyC[1]}"/></linearGradient></defs><rect width="400" height="220" fill="url(#${id})"/>`;
  const grass=i===6?'#1d3a2e':i===9?'#3a2a5a':'#8fd48a';
  if(i===6){ for(let n=0;n<30;n++) s+=`<circle cx="${(n*137)%400}" cy="${(n*53)%120}" r="1.3" fill="#fff"/>`; s+=`<circle cx="320" cy="50" r="24" fill="#fffbe0"/>`; }
  else if(i!==9 && i!==4) s+=`<circle cx="60" cy="40" r="22" fill="#fff3a0"/><ellipse cx="260" cy="40" rx="40" ry="12" fill="#ffffff" opacity=".9"/><ellipse cx="300" cy="34" rx="26" ry="10" fill="#ffffff" opacity=".9"/>`;
  if(i===4) s+=`<rect width="400" height="160" fill="#b3122a"/><path d="M0 0 q40 80 0 160 M400 0 q-40 80 0 160" fill="#8e1b2b"/>${[...Array(8)].map((_,k)=>`<circle cx="${30+k*48}" cy="14" r="8" fill="#ffe14d"/>`).join('')}`;
  if(i===9) { s+=[...Array(9)].map((_,k)=>`<path d="M${20+k*45} 0 l-30 140" stroke="#fff3a0" stroke-width="10" opacity=".15"/>`).join(''); s+=`<path d="M0 120 h400 v40 h-400z" fill="#5b2a86"/>${[...Array(20)].map((_,k)=>`<circle cx="${10+k*20}" cy="${128+(k%2)*10}" r="6" fill="${['#ff6f91','#ffd84d','#5aa9e6','#7cc24f'][k%4]}"/>`).join('')}`; }
  s+=`<rect y="160" width="400" height="60" fill="${i===4?'#e8d3b0':grass}"/>`;
  if(i===0) s+=`<rect x="250" y="168" width="60" height="6" rx="3" fill="#8a5a2b"/>`;
  if(i===1) s+=`<path d="M300 170 q10 -12 22 0z" fill="#8a5a2b"/><rect x="306" y="150" width="14" height="12" fill="#f2c230"/>`;
  if(i===2||i===5) s+=[...Array(6)].map((_,k)=>`<path d="M${30+k*70} 160 v-40" stroke="#7a5230" stroke-width="3"/><path d="M${30+k*70} 120 l18 6 -18 6z" fill="${['#e8435a','#5aa9e6','#ffd84d'][k%3]}"/>`).join('');
  if(i===5) s+=`<path d="M260 170 v-22 h40 v22 M268 148 v22 M292 148 v22" stroke="#ffffff" stroke-width="5" fill="none"/>`;
  if(i===7) s+=[...Array(7)].map((_,k)=>`<path d="M${k*64} 160 l30 -80 l30 80z" fill="#2e6a3e"/>`).join('');
  if(i===8) s+=[...Array(12)].map((_,k)=>`<rect x="${k*34+6}" y="20" width="9" height="150" fill="#7cc24f"/><path d="M${k*34+6} ${60+(k%3)*30} h9" stroke="#3d7a2a" stroke-width="2"/>`).join('');
  if(i===3) s+=`<path d="M320 160 q-10 -60 30 -80 q40 20 30 80z" fill="#3d9a4a"/><rect x="342" y="140" width="10" height="24" fill="#7a5230"/>`;
  return V(s);
}

/* ---- Doplňky postav návštěv (brýle, vousy, čepice, křídla, hůlka) ---- */
function heroExtras(x){
  let back='', front='';
  if(!x) return {back,front};
  if(x.wings) back+=`<path d="M78 112 q-50 -40 -60 10 q20 20 60 0z M132 112 q50 -40 60 10 q-20 20 -60 0z" fill="#dff4ff" opacity=".85"/>`;
  if(x.glasses) front+=`<circle cx="95" cy="68" r="8" fill="none" stroke="#2b2340" stroke-width="2.2"/><circle cx="115" cy="68" r="8" fill="none" stroke="#2b2340" stroke-width="2.2"/><path d="M103 68 h4" stroke="#2b2340" stroke-width="2.2"/>`;
  if(x.beard) front+=`<path d="M82 74 q4 40 23 44 q19 -4 23 -44 q-10 14 -23 12 q-13 2 -23 -12z" fill="${x.beard}"/>`;
  if(x.chef) front+=`<rect x="84" y="36" width="42" height="16" fill="#ffffff"/><circle cx="90" cy="30" r="12" fill="#ffffff"/><circle cx="105" cy="24" r="14" fill="#ffffff"/><circle cx="120" cy="30" r="12" fill="#ffffff"/>`;
  if(x.wizard) front+=`<path d="M74 48 h62 l-26 -46z" fill="#3b2a8a"/><ellipse cx="105" cy="48" rx="36" ry="7" fill="#3b2a8a"/><path d="M100 26 l2 4 4 0 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 0z" fill="#ffd84d"/>`;
  if(x.wand) front+=`<path d="M144 150 L168 100" stroke="#5a3b1f" stroke-width="4"/><path d="M168 92 l3 6 6 1 -5 4 1 6 -5 -3 -5 3 1 -6 -5 -4 6 -1z" fill="#ffd84d"/><circle cx="168" cy="98" r="14" fill="#fff3a0" opacity=".4"/>`;
  return {back,front};
}

/* ---- Tipy, krmení, info o zvířátku ---- */
const TIPSPEC=[[[0,2],[1,1]],[[0,3],[2,1],[3,1]],[[1,2],[3,2]],[[0,4],[2,2]],[[1,3],[3,3]],[[0,5],[2,3]],[[1,4],[3,4]],[[0,6],[2,4]],[[1,5],[3,5],[5,3]],[[0,7],[2,5]]];
function tipFor(p, mi){
  if(((p&&p.mode)||'quest')==='quest') return MONSTERS[mi].tip;
  const sl=slotsOf(p); const names=TIPSPEC[mi].map(([si,t])=>sl[si].items[t-1][0]);
  const s = names.length>1 ? names.slice(0,-1).join(', ')+' a '+names[names.length-1].toLowerCase() : names[0];
  return s;
}
function fedToday(p){ return p.fedDate===todayKey(); }
function petInfoHTML(p){
  const sp=SPMAP[p.species]||SPECIES[0], st=petStage(p);
  return `<div class="center" style="margin-top:6px;font-size:17px">🐾 <b>${esc(p.petName||sp.name)}</b> · ${sp.name} · ${PET_STAGES[st]}</div>
    <div class="center sub">${fedToday(p)?'😋 Dnes je najedené a spokojené':'🥺 Má hlad – nakrm ho!'}</div>`;
}
function feedHTML(p){
  return `<h3>🍽️ Nakrmit zvířátko</h3><div class="card"><div class="sub" style="margin-bottom:8px">Jídlo dává zvířátku zkušenosti – roste a sílí. Za každý den, kdy ho nakrmíš, je spokojené.</div>
    <div class="row">${FOODS.map(f=>{ const c=Math.max(5,Math.round(f.price*mult()*2/5)*5), can=p.points>=c; return `<button class="btn small ${can?'gold':'sec'}" data-feed="${f.id}" ${can?'':'disabled'}>${f.icon} ${f.name} · ⭐ ${c} <span style="opacity:.75">(+${f.grow} růst)</span></button>`; }).join('')}</div></div>`;
}
function feed(fid){
  const p=prof(view.pid), f=FOODS.find(x=>x.id===fid); if(!p||!f) return;
  const c=Math.max(5,Math.round(f.price*mult()*2/5)*5); if(p.points<c) return;
  const before=petStage(p);
  p.points-=c; p.xp=(p.xp||0)+f.grow; p.fedDate=todayKey(); save();
  const after=petStage(p);
  toast(after>before ? `🎉 ${p.petName||'Zvířátko'} vyrostlo! Teď je: ${PET_STAGES[after]}` : `${f.icon} Mňam! ${p.petName||'Zvířátko'} si pochutnalo.`);
  if(after>before) confetti(40);
  render();
  const st=document.querySelector('.stage'); if(st){ st.classList.remove('pop'); void st.offsetWidth; st.classList.add('pop'); }
}
