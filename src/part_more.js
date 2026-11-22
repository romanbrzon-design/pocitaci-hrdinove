/* ============ Delší hra: 5 dalších výzev, nová výbava, kůň, parťák pro zvířátko ============ */
var FOE_N = 15, REWARD_AT = 9;
// nové předměty: [jméno, útok, obrana, životy, cena]
(function(){
  const add={weapon:[['Mithrilový meč',38,0,0,1600],['Hvězdný meč',48,0,0,2100]],
    shield:[['Dračí štít',0,21,0,950],['Hvězdný štít',0,27,0,1250]],
    armor:[['Dračí brnění',0,25,28,1000],['Hvězdné brnění',0,31,35,1350]],
    head:[['Dračí helma',0,10,17,880],['Hvězdná koruna',0,13,21,1150]],
    boots:[['Dračí boty',3,4,10,650],['Hvězdné boty',4,6,13,900]],
    cape:[['Dračí plášť',0,5,13,650],['Hvězdný plášť',0,7,17,900]],
    pet:[['Jednorožec',9,0,0,750],['Fénix',13,0,0,1050]]};
  for(const sl of SLOTS) if(add[sl.id]) sl.items.push(...add[sl.id]);
  SLOTS.push({id:'horse', name:'Kůň', items:[['Poník',1,1,6,300],['Hnědák',3,2,10,600],['Rytířský kůň',5,4,15,1000],['Pegas',8,6,22,1500]]});
  SLOTMAP.horse=SLOTS[7];
  const hn={bed:['Patrová postel se skluzavkou','Pirátská postel'],rug:['Koberec s mapou světa','Létající koberec'],wall:['Srdíčkové tapety','Duhové tapety'],lamp:['Duhový lustr','Hvězdný lustr'],curtain:['Divadelní závěsy','Hvězdné závěsy'],plant:['Kvetoucí stromek','Kouzelná kytka'],hpet:['Štěňátko v pelíšku','Dráček na polštáři']};
  const pn={toy:['Hvězdný míček','Papírový drak'],pbed:['Pelíšek obláček','Zlatý trůnek'],collar:['Duhový obojek','Diamantový obojek'],phat:['Čarodějný klobouček','Duhová korunka'],shoes:['Duhové botičky','Zlaté botičky'],outfit:['Hvězdný svetříček','Královský plášť'],friend:['Jednorožčík','Fénix']};
  HOME_SLOTS.forEach((sl,si)=>{ const src=SLOTS[si]; hn[sl.id].forEach((nm,k)=>{ const it=src.items[sl.items.length]; sl.items.push([nm,it[1],it[2],it[3],it[4]]); }); });
  PET_SLOTS.forEach((sl,si)=>{ const src=SLOTS[si]; pn[sl.id].forEach((nm,k)=>{ const it=src.items[sl.items.length]; sl.items.push([nm,it[1],it[2],it[3],it[4]]); }); });
  const hz=SLOTS[7].items;
  HOME_SLOTS.push({id:'treat', name:'Dobroty', items:[['Sušenky',...hz[0].slice(1)],['Ovocný talíř',...hz[1].slice(1)],['Čajový servis',...hz[2].slice(1)],['Slavnostní dort',...hz[3].slice(1)]]});
  PET_SLOTS.push({id:'buddy', name:'Parťák', items:[['Mládě parťáka',...hz[0].slice(1)],['Malý parťák',...hz[1].slice(1)],['Velký parťák',...hz[2].slice(1)],['Dospělý parťák',...hz[3].slice(1)]]});
  // 5 silnějších soupeřů
  const NEW=[
    {name:'Ledový obr',  hp:125, atk:72,  def:34, gold:320, where:'Zamrzlé jezero',  tip:'Mithrilový meč a dračí štít'},
    {name:'Gryf',        hp:135, atk:81,  def:40, gold:360, where:'Orlí štít',       tip:'Dračí brnění, dračí helma a poník nebo hnědák'},
    {name:'Kraken',      hp:148, atk:89,  def:47, gold:400, where:'Bouřlivé pobřeží', tip:'Hvězdný meč, dračí boty a jednorožec'},
    {name:'Lávový golem',hp:158, atk:96,  def:54, gold:450, where:'Lávová jeskyně',  tip:'Hvězdný štít, hvězdné brnění a rytířský kůň'},
    {name:'Dračí král',  hp:168, atk:104, def:62, gold:500, where:'Zlatá trůnní síň', tip:'Všechno hvězdné, fénix a pegas'},
  ];
  MONSTERS.push(...NEW);
  const G2=[{name:'Pirát',where:'Připlul na lodi'},{name:'Astronautka',where:'Přiletěla z vesmíru'},{name:'Superhrdinka',where:'Přiletěla na pomoc'},{name:'Ledová královna',where:'Přijela na saních'},{name:'Král',where:'Největší návštěva ze všech'}];
  const C2=[{name:'Zimní olympiáda',where:'Soupeř: sovička Sněhulka',opp:'owl'},{name:'Vodní slalom',where:'Soupeř: liška Vlnka',opp:'fox'},{name:'Hvězdná show',where:'Soupeř: koťátko Hvězdička',opp:'cat'},{name:'Kouzelný turnaj',where:'Soupeř: poník Kouzelník',opp:'pony'},{name:'Světový šampionát',where:'Soupeř: dráček Plamínek',opp:'dragon'}];
  NEW.forEach((m,k)=>{ GUESTS.push(Object.assign({},m,G2[k])); CONTESTS.push(Object.assign({},m,C2[k])); });
  TIPSPEC.push([[0,8],[1,6]],[[2,6],[3,6],[7,1]],[[0,9],[4,4],[6,4]],[[1,7],[2,7],[7,3]],[[0,9],[1,7],[2,7],[6,5],[7,4]]);
  Object.assign(PET_ACC_IMG,{buddy:0}); Object.assign(HOME_IMG,{});
})();
// název odměny za legendární výpravu (volitelné, nastavují rodiče)
function reward2Of(p){ return (p&&p.reward2)||(S.settings&&S.settings.reward2)||''; }
const _itemIcon0=itemIcon;
itemIcon=function(p,slot,tier){
  if(slot==='treat'&&tier) return `<span style="font-size:52px;line-height:1">${['🍪','🍓','🫖','🎂'][tier-1]}</span>`;
  if(slot==='buddy'&&tier&&p.buddy) return `<img src="${A_}pet_${p.buddy}_${tier>=3?1:0}.webp" alt="">`;
  return _itemIcon0(p,slot,tier);
};
// kůň – stojí vedle hrdiny (hrdina vpravo, kůň vlevo hledí k němu)
const _heroImg0=heroImg;
heroImg=function(p,opts={}){
  const hz=(p.eq||{}).horse; if(!hz) return _heroImg0(p,opts);
  const g=p.gender==='f'?'f':'m', comp=(p.eq||{}).pet;
  return `<div class="av rider ${opts.glow?'glow':''}"><img class="horse" src="${A_}horse${hz}.webp" alt="">${tintImg('hero_'+g+heroStage(p),'hero_'+g,lookOf(p),'class="riderimg"')}${comp?`<img class="comp" src="${A_}i_pet${comp}.webp" alt="">`:''}</div>`;
};
// parťák u zvířátka
const _petSVG1=petSVG;
petSVG=function(p,opts={}){
  const h=_petSVG1(p,opts), b=(p.eq||{}).buddy; if(!b||!p.buddy||opts.flip) return h;
  const w=[0,24,30,36,40][b];
  return h.replace(/<\/div>$/, `<img class="ov buddy" src="${A_}pet_${p.buddy}_${b>=3?1:0}.webp" alt="" style="left:-4%;bottom:2%;width:${w}%;z-index:3"></div>`);
};
// koupě parťáka: jen u dospělého zvířátka, nejdřív výběr druhu
const _buyMore=buy;
buy=function(slot){
  const p=prof(view.pid);
  if(slot==='buddy' && p){
    if(petStage(p)<3){ toast('Parťáka si můžeš pořídit, až bude tvoje zvířátko dospělé 🐾'); return; }
    if(!p.buddy){ buddyPick(p, ()=>_buyMore(slot)); return; }
  }
  return _buyMore(slot);
};
function buddyPick(p, done){
  const m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="card center" style="max-width:560px"><h2>🐾 Vyber si parťáka</h2><p>Tvoje zvířátko je dospělé – teď může mít kamaráda! Kdo to bude?</p>
    <div class="spgrid">${SPECIES.filter(s=>s.id!==p.species).map(s=>`<button class="spbtn" data-sp="${s.id}"><img src="${A_}pet_${s.id}_0.webp" alt="" style="height:80px"><br>${s.name}</button>`).join('')}</div>
    <button class="btn sec" id="bdx" style="margin-top:10px">Zatím ne</button></div>`;
  document.body.appendChild(m);
  m.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>{ p.buddy=b.dataset.sp; save(); m.remove(); done(); });
  m.querySelector('#bdx').onclick=()=>m.remove();
}
