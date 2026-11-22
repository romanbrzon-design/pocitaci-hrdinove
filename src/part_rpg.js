/* ============ RPG data ============ */
// item: [name, attack, defense, hp, base price]
const SLOTS = [
  {id:'weapon', name:'Zbraň',  items:[['Klacek',2,0,0,30],['Dřevěný meč',4,0,0,80],['Železný meč',7,0,0,180],['Ocelový meč',11,0,0,320],['Rytířský meč',16,0,0,520],['Zlatý meč',22,0,0,800],['Dračí čepel',30,0,0,1200]]},
  {id:'shield', name:'Štít',   items:[['Dřevěný štít',0,2,0,40],['Okovaný štít',0,4,0,120],['Železný štít',0,7,0,250],['Rytířský štít',0,11,0,420],['Zlatý štít',0,16,0,700]]},
  {id:'armor',  name:'Brnění', items:[['Kožená vesta',0,2,5,50],['Kroužková zbroj',0,5,8,140],['Plátová zbroj',0,9,12,280],['Rytířské brnění',0,14,16,460],['Zlaté brnění',0,20,22,750]]},
  {id:'head',   name:'Hlava',  items:[['Čepice',0,0,4,30],['Kožená helma',0,1,6,100],['Železná helma',0,3,8,220],['Rytířská helma',0,5,10,380],['Zlatá koruna',0,8,14,650]]},
  {id:'boots',  name:'Boty',   items:[['Kožené boty',0,0,4,60],['Rytířské boty',0,1,6,200],['Okřídlené boty',2,3,8,450]]},
  {id:'cape',   name:'Plášť',  items:[['Krátký plášť',0,0,4,80],['Hrdinský plášť',0,1,6,220],['Královský plášť',0,3,10,450]]},
  {id:'pet',    name:'Kamarád',items:[['Kuřátko',1,0,0,100],['Pejsek',3,0,0,250],['Dráček',6,0,0,500]]},
];
const SLOTMAP = Object.fromEntries(SLOTS.map(s=>[s.id,s]));
const MONSTERS = [
  {name:'Kostlivec',     hp:29,  atk:5,  def:0,  gold:20,  where:'Stará krypta',        tip:'Dřevěný meč a štít'},
  {name:'Goblin',        hp:35,  atk:8,  def:2,  gold:40,  where:'Temný les',           tip:'Železný meč, kožená vesta a čepice'},
  {name:'Obří pavouk',   hp:29,  atk:13, def:4,  gold:60,  where:'Pavoučí jeskyně',     tip:'Okovaný štít a kožená helma'},
  {name:'Vlkodlak',      hp:53,  atk:18, def:6,  gold:90,  where:'Úplňková mýtina',     tip:'Ocelový meč a kroužková zbroj'},
  {name:'Bažinný troll', hp:41,  atk:25, def:9,  gold:120, where:'Smradlavá bažina',    tip:'Železný štít a železná helma'},
  {name:'Ork náčelník',  hp:71,  atk:32, def:12, gold:150, where:'Orčí tábor',          tip:'Rytířský meč a plátová zbroj'},
  {name:'Mumie',         hp:59,  atk:39, def:15, gold:190, where:'Pouštní pyramida',    tip:'Rytířský štít a rytířská helma'},
  {name:'Kamenný golem', hp:89,  atk:48, def:19, gold:230, where:'Hora bouří',          tip:'Zlatý meč a rytířské brnění'},
  {name:'Temný rytíř',   hp:89,  atk:60, def:23, gold:280, where:'Černý hrad',          tip:'Zlatý štít, zlatá koruna a královský plášť'},
  {name:'Drak',          hp:113, atk:67, def:28, gold:0,   where:'Dračí sopka',         tip:'Dračí čepel a zlaté brnění'},
];
const LEN_MULT = {short:0.3, mid:0.5, long:0.8};
const XP_PER_LEVEL = {short:15, mid:20, long:30};
const MAX_LEVEL = 20;
function mult(){ return LEN_MULT[S.settings.length]||0.5; }
function price(slot,tier,p){ const sl=(p&&slotOf(p,slot))||SLOTMAP[slot]; return Math.max(5, Math.round(sl.items[tier-1][4]*mult()/5)*5); }
function bounty(mi){ return Math.round(MONSTERS[mi].gold*mult()/5)*5; }
function level(p){ return Math.min(MAX_LEVEL, 1+Math.floor((p.xp||0)/(XP_PER_LEVEL[S.settings.length]||20))); }
function xpInfo(p){ const per=XP_PER_LEVEL[S.settings.length]||20, L=level(p); if(L>=MAX_LEVEL) return {L, cur:per, per, max:true}; return {L, cur:(p.xp||0)-(L-1)*per, per}; }
function stats(p){
  const L=level(p); let atk=1+Math.floor((L-1)/2), def=0, hp=20+3*(L-1);
  for(const sl of slotsOf(p)){ const t=(p.eq||{})[sl.id]||0; if(t){ const it=sl.items[t-1]; atk+=it[1]; def+=it[2]; hp+=it[3]; } }
  return {L, atk, def, hp};
}
function analyze(p, mi){
  const st=stats(p), m=foesOf(p)[mi];
  const myDmg=Math.max(1, st.atk-m.def), monDmg=Math.max(1, m.atk-st.def);
  const hits=Math.ceil(m.hp/myDmg), rounds=Math.ceil(st.hp/monDmg);
  return {st, m, myDmg, monDmg, hits, rounds, spare:rounds-hits};
}
function itemStatText(it,p){ const ic=modeOf(p).st; const a=[]; if(it[1]) a.push(`${ic[0][0]}+${it[1]}`); if(it[2]) a.push(`${ic[1][0]}+${it[2]}`); if(it[3]) a.push(`${ic[2][0]}+${it[3]}`); return a.join(' '); }
const G = (p, m, f) => p.gender==='f' ? f : m;

/* ============ Drawing: hero / heroine ============ */
const TUNICS = ['#4f7cff','#ff7a45','#21b37a','#c04cf5','#e8435a','#1fb5c9','#f2a900','#ff6fb5'];
function heroBase(p, opts={}){
  const e=p.eq||{}, tunic=p.color||'#4f7cff', girl=p.gender==='f';
  const W=e.weapon||0, S_=e.shield||0, A=e.armor||0, H=e.head||0, B=e.boots||0, C=e.cape||0, P=e.pet||0;
  const uid='h'+Math.random().toString(36).slice(2,7);
  const hair = p.hair || (girl?'#a0522d':'#6b4226');
  let s=`<svg viewBox="0 0 240 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${girl?'Hrdinka':'Hrdina'}">`;
  s+=`<defs><radialGradient id="g${uid}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6b0" stop-opacity=".9"/><stop offset="1" stop-color="#fff6b0" stop-opacity="0"/></radialGradient><radialGradient id="r${uid}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff9a8a" stop-opacity=".9"/><stop offset="1" stop-color="#ff9a8a" stop-opacity="0"/></radialGradient></defs>`;
  if(opts.glow) s+=`<circle cx="105" cy="130" r="115" fill="url(#g${uid})"/>`;
  s+=`<ellipse cx="105" cy="236" rx="70" ry="9" fill="#000" opacity=".1"/>`;
  const XT = heroExtras(opts.x);
  s+=`<g class="hb">`+XT.back;
  // cape behind
  if(C){ const col=['','#c0392b','#8e1b2b','#5b2a86'][C], len=[0,170,205,222][C];
    s+=`<g class="hc"><path d="M72 100 Q105 92 138 100 L${150+C*4} ${len} Q105 ${len+10} ${60-C*4} ${len} Z" fill="${col}"/><path d="M90 108 Q86 ${len-40} ${76-C*2} ${len-2} M120 108 Q124 ${len-40} ${134+C*2} ${len-2} M105 106 V${len+4}" stroke="#000" stroke-opacity=".2" stroke-width="3" fill="none"/>`;
    if(C===3) s+=`<path d="M48 218 Q105 232 162 218" stroke="#fff" stroke-width="7" fill="none"/><path d="M60 222 l0 .1 M80 226 l0 .1 M100 228 l0 .1 M120 227 l0 .1 M140 224 l0 .1" stroke="#222" stroke-width="3" stroke-linecap="round"/>`;
    s+=`</g>`; }
  // long hair behind (girl)
  if(girl && H!==3 && H!==4) s+=`<path d="M76 62 Q74 108 84 122 L126 122 Q136 108 134 62 Z" fill="${hair}"/>`;
  // legs
  s+=`<rect x="84" y="162" width="15" height="52" rx="6" fill="#3d3a55"/><rect x="111" y="162" width="15" height="52" rx="6" fill="#3d3a55"/>`;
  const bootCol=['#7a5230','#8a5a2b','#2e2e3a','#e2b100'][B];
  s+=`<path d="M80 ${B?200:208} h22 v20 h-28 q0-8 6-8z" fill="${bootCol}"/><path d="M108 ${B?200:208} h22 v12 q8 0 8 8 h-30z" fill="${bootCol}"/>`;
  s+=`<rect x="72" y="219" width="31" height="6" rx="3" fill="#3a2a1a"/><rect x="107" y="219" width="32" height="6" rx="3" fill="#3a2a1a"/>`;
  if(B>=1) s+=`<path d="M80 ${B?204:212} h22 M108 ${B?204:212} h22" stroke="${B===3?'#fff3a0':'#000'}" stroke-opacity="${B===3?1:.25}" stroke-width="3"/>`;
  if(B===3) s+=`<path d="M78 204 q-16-8-22 4 q10-1 22 3z M132 204 q16-8 22 4 q-10-1-22 3z" fill="#ffffff"/><path d="M62 204 l10 2 M148 204 l-10 2" stroke="#c9d3e6" stroke-width="1.5"/>`;
  // body (girl: tunic flares into a skirt)
  if(girl) s+=`<path d="M76 100 Q105 90 134 100 L136 150 L146 182 Q105 192 64 182 L74 150 Z" fill="${tunic}"/>`;
  else s+=`<path d="M74 100 Q105 90 136 100 L134 168 Q105 174 76 168 Z" fill="${tunic}"/>`;
  s+=`<rect x="76" y="148" width="58" height="8" fill="#5a3b1f" opacity=".85"/><rect x="100" y="147" width="10" height="10" rx="2" fill="#e8c34a"/><rect x="118" y="151" width="12" height="13" rx="3" fill="#8a5a2b"/><path d="M118 155 h12" stroke="#5e3517" stroke-width="1.5"/>`;
  // armor
  const armCol = [tunic,'#a0693a','#9aa3b5','#aab3c3','#2f5bd3','#f2c230'][A];
  if(A===1) s+=`<path d="M80 104 Q105 97 130 104 L128 146 L82 146 Z" fill="#a0693a"/><path d="M105 102 V146" stroke="#6e4422" stroke-width="3"/><circle cx="98" cy="118" r="2" fill="#e8c34a"/><circle cx="98" cy="132" r="2" fill="#e8c34a"/><path d="M84 108 V144 M126 108 V144" stroke="#e8d2b0" stroke-width="1.3" stroke-dasharray="3 3"/><path d="M101 112 l8 6 -8 6 8 6 -8 6" stroke="#3d2a17" stroke-width="1.5" fill="none"/>`;
  if(A===2){ s+=`<path d="M78 102 Q105 94 132 102 L131 148 L79 148 Z" fill="#9aa3b5"/>`; for(let y=106;y<146;y+=7) for(let x=82;x<130;x+=7) s+=`<circle cx="${x+(y%14?3:0)}" cy="${y}" r="2.6" fill="none" stroke="#6c7488" stroke-width="1.2"/>`; }
  if(A===3) s+=`<path d="M77 101 Q105 92 133 101 L131 148 L79 148 Z" fill="#aab3c3" stroke="#5f6a80" stroke-width="2"/><path d="M80 118 H130 M80 133 H130" stroke="#5f6a80" stroke-width="2"/><path d="M105 101 V147" stroke="#5f6a80" stroke-width="1.5"/><path d="M86 106 Q92 104 96 116" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none"/><circle cx="88" cy="110" r="2" fill="#5f6a80"/><circle cx="122" cy="110" r="2" fill="#5f6a80"/>`;
  if(A===4) s+=`<path d="M77 101 Q105 92 133 101 L131 148 L79 148 Z" fill="#2f5bd3" stroke="#c9d3e6" stroke-width="3"/><path d="M105 100 V148 M80 122 H130" stroke="#c9d3e6" stroke-width="3"/><circle cx="105" cy="122" r="6" fill="#f2c230"/>`;
  if(A===5) s+=`<path d="M77 101 Q105 92 133 101 L131 148 L79 148 Z" fill="#f2c230" stroke="#b88a00" stroke-width="2"/><path d="M88 110 Q105 104 122 110 L120 140 Q105 146 90 140 Z" fill="#ffd95a" stroke="#c99a10" stroke-width="2"/><path d="M105 115 l4 9 h9 l-7 6 3 9 -9-6 -9 6 3-9 -7-6 h9z" fill="#fff4b8"/>`;
  // arms
  s+=`<rect x="58" y="104" width="16" height="48" rx="8" fill="${A>=2?armCol:tunic}"/><rect x="136" y="104" width="16" height="48" rx="8" fill="${A>=2?armCol:tunic}"/>`;
  if(A>=3){ const pc=A===3?'#b5bdcc':A===4?'#3a64e0':'#f2c230', rim=A===4?'#d6deea':A===5?'#b88a00':'#6b7385';
    s+=`<path d="M52 110 Q54 94 72 96 Q80 98 80 108 Q66 104 52 110Z" fill="${pc}"/><path d="M158 110 Q156 94 138 96 Q130 98 130 108 Q144 104 158 110Z" fill="${pc}"/><path d="M56 106 Q66 100 78 104 M154 106 Q144 100 132 104" stroke="${rim}" stroke-width="2.5" fill="none"/>`;
    if(A===5) s+=`<path d="M60 98 l-6 -12 10 8z M150 98 l6 -12 -10 8z" fill="#fff2a6"/><circle cx="66" cy="102" r="3" fill="#e84393"/><circle cx="144" cy="102" r="3" fill="#e84393"/>`; }
  // weapon (right hand)
  if(W===1) s+=`<rect x="141" y="62" width="7" height="88" rx="3" fill="#a87443"/><circle cx="144.5" cy="70" r="4" fill="#8a5a2b"/>`;
  if(W>=2){ const spec={2:[70,'#d9b380','#9c7444','#7a5230'],3:[80,'#c9ced6','#7d8696','#5a3b1f'],4:[88,'#e6eef7','#7f93ad','#2f5bd3'],5:[96,'#eef3fa','#8a95a8','#d4a106'],6:[100,'#ffe066','#d4a106','#d4a106'],7:[108,'#ff6b6b','#a4161a','#3a0d0d']}[W];
    const [len,fill,stroke,guard]=spec, tip=132-len;
    if(W===6) s+=`<circle cx="145" cy="${tip+40}" r="34" fill="url(#g${uid})"/>`;
    if(W===7) s+=`<circle cx="145" cy="${tip+40}" r="38" fill="url(#r${uid})"/>`;
    s+=`<path d="M140.5 132 L140.5 ${tip+12} L144.5 ${tip} L148.5 ${tip+12} L148.5 132 Z" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
    if(W>=3) s+=`<path d="M144.5 ${tip+14} V128" stroke="${stroke}" stroke-width="1.4" opacity=".7"/><path d="M141.8 ${tip+16} V126" stroke="#fff" stroke-width="1.2" opacity=".75"/>`;
    s+=`<rect x="${W>=5?128:131}" y="128" width="${W>=5?33:27}" height="7" rx="3" fill="${guard}"/><rect x="141" y="135" width="7" height="16" fill="${W===7?'#1a0505':'#3d2a17'}"/>`;
    if(W>=5) s+=`<circle cx="144.5" cy="131.5" r="3.5" fill="${W===7?'#ffcc00':'#e84393'}"/>`;
    s+=`<circle cx="144.5" cy="163" r="4.5" fill="${W>=5?'#e8c34a':'#7d8696'}"/>`; }
  // hands
  s+=`<circle cx="66" cy="153" r="8" fill="#f6c9a0"/><circle cx="144" cy="153" r="8" fill="#f6c9a0"/>`;
  // shield (left)
  if(S_===1) s+=`<circle cx="58" cy="138" r="23" fill="#b27a45" stroke="#7a5230" stroke-width="4"/><path d="M41 130 h34 M41 146 h34" stroke="#8c5b31" stroke-width="2"/>`;
  if(S_===2) s+=`<circle cx="58" cy="138" r="25" fill="#b27a45" stroke="#7d8696" stroke-width="5"/><path d="M58 113 v50 M33 138 h50" stroke="#7d8696" stroke-width="3"/><circle cx="58" cy="138" r="7" fill="#cfd5df" stroke="#7d8696" stroke-width="2"/>`;
  if(S_===3) s+=`<path d="M34 112 h48 v24 q0 26 -24 38 q-24 -12 -24 -38 z" fill="#aab3c3" stroke="#5f6a80" stroke-width="4"/><path d="M58 114 v58 M36 130 h44" stroke="#5f6a80" stroke-width="3"/>`;
  if(S_===4) s+=`<path d="M32 110 h52 v26 q0 28 -26 40 q-26 -12 -26 -40 z" fill="#2f5bd3" stroke="#c9d3e6" stroke-width="5"/><path d="M58 122 l6 13 h14 l-11 9 4 14 -13-8 -13 8 4-14 -11-9 h14z" fill="#ffd84d"/>`;
  if(S_===5) s+=`<circle cx="58" cy="140" r="36" fill="url(#g${uid})"/><path d="M32 110 h52 v26 q0 28 -26 40 q-26 -12 -26 -40 z" fill="#f2c230" stroke="#b88a00" stroke-width="5"/><path d="M58 122 l6 13 h14 l-11 9 4 14 -13-8 -13 8 4-14 -11-9 h14z" fill="#fff4b8"/><circle cx="58" cy="140" r="4" fill="#e84393"/>`;
  // neck + head
  s+=`<rect x="98" y="86" width="14" height="12" fill="#f0bd92"/><ellipse cx="78" cy="70" rx="5" ry="7" fill="#f6c9a0"/><ellipse cx="132" cy="70" rx="5" ry="7" fill="#f6c9a0"/><circle cx="105" cy="66" r="28" fill="#f6c9a0"/>`;
  const hideHair = H>=2 && H<=4;
  if(!hideHair){
    if(girl) s+=`<path d="M77 66 Q76 34 105 34 Q134 34 133 66 Q126 50 112 48 Q100 56 84 54 Q79 58 77 66Z" fill="${hair}"/><path d="M134 60 q14 6 10 30 q-2 10 -8 14 q4-16 -6-28z" fill="${hair}"/><circle cx="137" cy="60" r="5" fill="#ff6fb5"/>`;
    else s+=`<path d="M78 62 Q80 36 105 36 Q131 36 132 60 Q122 50 108 52 Q96 46 86 56 Q80 58 78 62Z" fill="${hair}"/><path d="M84 52 q2 -10 12 -12 M100 44 q6 -6 16 -2 M118 46 q8 2 10 10" stroke="#000" stroke-opacity=".22" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
  // face
  const iris=p.eyes||(girl?'#3f7fbf':'#6b4a2a');
  s+=`<ellipse cx="95" cy="68" rx="4.8" ry="5.6" fill="#ffffff"/><ellipse cx="115" cy="68" rx="4.8" ry="5.6" fill="#ffffff"/><circle cx="95.6" cy="69" r="3.3" fill="${iris}" stroke="none"/><circle cx="115.6" cy="69" r="3.3" fill="${iris}" stroke="none"/><circle cx="95.8" cy="69.2" r="1.7" fill="#1a1222"/><circle cx="115.8" cy="69.2" r="1.7" fill="#1a1222"/><circle cx="97" cy="67.2" r="1.2" fill="#fff"/><circle cx="117" cy="67.2" r="1.2" fill="#fff"/>`;
  s+=`<path d="M89 ${girl?59:58} q6 -3.5 11 0 M110 ${girl?59:58} q5 -3.5 11 0" stroke="${shade(hair,-.35)}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M105 72 q2.5 3 -1 4.5" stroke="#c98a66" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  if(girl) s+=`<path d="M90 63 l-3 -3 M93 62 l-1 -3.5 M120 63 l3 -3 M117 62 l1 -3.5" stroke="#2b2340" stroke-width="1.6" stroke-linecap="round"/>`;
  s+=`<circle cx="88" cy="78" r="5" fill="#ff9a9a" opacity=".5"/><circle cx="122" cy="78" r="5" fill="#ff9a9a" opacity=".5"/>`;
  s+=`<path d="M96 80 Q105 88 114 80" stroke="#2b2340" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  // headgear
  if(H===1) s+=`<path d="M77 58 Q78 30 105 30 Q132 30 133 58 Z" fill="#e8435a"/><rect x="75" y="52" width="60" height="10" rx="5" fill="#fff"/><circle cx="105" cy="26" r="8" fill="#fff"/>`;
  if(H===2) s+=`<path d="M76 62 Q75 32 105 32 Q135 32 134 62 Z" fill="#8a5a2b"/><rect x="74" y="56" width="62" height="8" rx="4" fill="#6e4422"/><path d="M105 32 V56" stroke="#6e4422" stroke-width="3"/>`;
  if(H===3||H===4){ const c=H===3?'#aab3c3':'#2f5bd3', st=H===3?'#5f6a80':'#c9d3e6';
    s+=`<path d="M75 66 Q74 32 105 32 Q136 32 135 66 L128 66 L128 58 L82 58 L82 66Z" fill="${c}" stroke="${st}" stroke-width="2.5"/><path d="M105 32 V58" stroke="${st}" stroke-width="2.5"/>`;
    if(H===4) s+=`<path d="M105 30 q4-16 20-18 q-6 8-12 20z" fill="#e8435a"/><path d="M108 28 q8-14 22-12 q-8 6-14 16z" fill="#ff7a8c"/>`;
    if(girl) s+=`<path d="M128 62 q14 8 8 34 q-2 6 -6 8 q2-14 -6-26z" fill="${hair}"/>`; }
  if(H===5) s+=`<path d="M80 50 L84 26 L94 40 L105 20 L116 40 L126 26 L130 50 Z" fill="#f5c400" stroke="#c99a10" stroke-width="2"/><circle cx="105" cy="38" r="4" fill="#e84393"/><circle cx="90" cy="44" r="3" fill="#2fb5ff"/><circle cx="120" cy="44" r="3" fill="#2fb5ff"/>`;
  s+=XT.front;
  s+=`</g>`;
  s+=`<g class="pet">`;
  // pet
  if(P===1) s+=`<g transform="translate(192 210)"><ellipse cx="0" cy="8" rx="15" ry="13" fill="#ffd84d"/><circle cx="0" cy="-8" r="10" fill="#ffd84d"/><circle cx="3" cy="-9" r="2" fill="#2b2340"/><path d="M9 -7 l7 2 -7 2z" fill="#ff8c1a"/><path d="M-3 -18 q3-6 6 0" stroke="#ffb700" stroke-width="2" fill="none"/></g>`;
  if(P===2) s+=`<g transform="translate(190 206)"><ellipse cx="0" cy="12" rx="22" ry="13" fill="#c98b4f"/><circle cx="16" cy="-4" r="13" fill="#c98b4f"/><ellipse cx="8" cy="-12" rx="6" ry="10" fill="#8a5a2b" transform="rotate(-25 8 -12)"/><circle cx="20" cy="-6" r="2.2" fill="#2b2340"/><circle cx="28" cy="-1" r="3" fill="#2b2340"/><path d="M-22 6 q-10 -10 -4 -16" stroke="#c98b4f" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="-14" y="20" width="6" height="8" rx="2" fill="#a8703c"/><rect x="8" y="20" width="6" height="8" rx="2" fill="#a8703c"/></g>`;
  if(P===3) s+=`<g transform="translate(188 196)"><path d="M-6 0 q-26 -24 -14 -36 q6 14 18 18z" fill="#7be0a8" stroke="#2c9c62" stroke-width="2"/><ellipse cx="0" cy="18" rx="22" ry="17" fill="#3cc47c"/><ellipse cx="2" cy="22" rx="12" ry="10" fill="#bff2d2"/><circle cx="18" cy="-2" r="14" fill="#3cc47c"/><path d="M12 -14 l-2 -10 6 7z M22 -15 l2 -10 3 9z" fill="#ffd84d"/><circle cx="22" cy="-4" r="2.6" fill="#2b2340"/><path d="M30 2 q8 -2 10 -8 q2 8 -6 10z" fill="#ff8c1a" opacity=".9"/><path d="M-20 26 q-16 4 -18 -8" stroke="#3cc47c" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
  s+=`</g></svg>`;
  return s;
}

/* ============ Drawing: monsters ============ */
function monsterBase(i){
  const sh=`<ellipse cx="100" cy="190" rx="60" ry="7" fill="#000" opacity=".1"/>`;
  const W = inner => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${MONSTERS[i].name}">${sh}${inner}</svg>`;
  const bone='#efe9da';
  switch(i){
  case 0: { let r=''; for(let y=86;y<=122;y+=9) r+=`<path d="M100 ${y} Q80 ${y-3} 78 ${y+6} M100 ${y} Q120 ${y-3} 122 ${y+6}" stroke="${bone}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    return W(`<path d="M150 112 L176 44" stroke="#8a6a4a" stroke-width="6" stroke-linecap="round"/><path d="M170 52 l10 4" stroke="#8a6a4a" stroke-width="3"/><path d="M144 118 l12 -4" stroke="#5a3b1f" stroke-width="6"/>
      <path d="M88 140 L84 182 M112 140 L116 182" stroke="${bone}" stroke-width="7" stroke-linecap="round"/><ellipse cx="80" cy="184" rx="10" ry="5" fill="${bone}"/><ellipse cx="120" cy="184" rx="10" ry="5" fill="${bone}"/>
      <path d="M84 132 Q100 146 116 132 L112 144 Q100 152 88 144Z" fill="${bone}"/><rect x="96" y="74" width="8" height="62" rx="3" fill="${bone}"/>${r}
      <path d="M80 80 L62 112 L72 140" stroke="${bone}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M120 80 L140 104 L150 112" stroke="${bone}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M78 78 Q100 70 122 78" stroke="${bone}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="100" cy="46" r="27" fill="#f7f3e8"/><rect x="86" y="62" width="28" height="14" rx="5" fill="#f7f3e8"/>
      <ellipse cx="90" cy="46" rx="8" ry="9" fill="#2b2340"/><ellipse cx="110" cy="46" rx="8" ry="9" fill="#2b2340"/><circle cx="90" cy="47" r="3" fill="#ff4d4d"/><circle cx="110" cy="47" r="3" fill="#ff4d4d"/>
      <path d="M97 58 l3 -6 3 6z" fill="#2b2340"/><path d="M90 68 V75 M95 68 V75 M100 68 V75 M105 68 V75 M110 68 V75" stroke="#c9c2b0" stroke-width="1.5"/>`); }
  case 1: return W(`<path d="M150 120 L172 92" stroke="#9aa3b5" stroke-width="6" stroke-linecap="round"/><path d="M146 126 l10 -10" stroke="#5a3b1f" stroke-width="7" stroke-linecap="round"/>
      <rect x="82" y="150" width="13" height="34" rx="5" fill="#5f9c3a"/><rect x="106" y="150" width="13" height="34" rx="5" fill="#5f9c3a"/><ellipse cx="86" cy="185" rx="11" ry="5" fill="#4a3220"/><ellipse cx="114" cy="185" rx="11" ry="5" fill="#4a3220"/>
      <ellipse cx="100" cy="128" rx="34" ry="32" fill="#6fb543"/><path d="M70 140 Q100 166 130 140 L128 158 Q100 170 72 158Z" fill="#7a4a24"/>
      <path d="M68 118 Q52 132 58 150" stroke="#6fb543" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M132 118 Q148 120 150 124" stroke="#6fb543" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M62 60 L22 38 L58 78Z M138 60 L178 38 L142 78Z" fill="#6fb543"/><path d="M58 64 L34 48 L58 74Z M142 64 L166 48 L142 74Z" fill="#e38d8d"/>
      <ellipse cx="100" cy="72" rx="42" ry="36" fill="#7cc24f"/>
      <ellipse cx="84" cy="66" rx="10" ry="8" fill="#ffe14d"/><ellipse cx="116" cy="66" rx="10" ry="8" fill="#ffe14d"/><circle cx="86" cy="67" r="4" fill="#2b2340"/><circle cx="114" cy="67" r="4" fill="#2b2340"/>
      <path d="M74 56 l18 4 M126 56 l-18 4" stroke="#3d6b22" stroke-width="4" stroke-linecap="round"/><ellipse cx="100" cy="80" rx="6" ry="5" fill="#5a9c34"/>
      <path d="M80 92 Q100 106 120 92" stroke="#2b2340" stroke-width="3" fill="#7a2b2b"/><path d="M88 94 l3 6 3 -5 M106 95 l3 6 3 -6" fill="#fff"/>`);
  case 2: { let legs=''; [[-1,0],[1,0]].forEach(([d])=>{ [[-30,-18],[-20,-4],[-10,10],[0,22]].forEach(([dy,k],j)=>{ const x1=100+d*26, y1=110+j*8, mx=100+d*(70+j*4), my=70+j*18, ex=100+d*(86-j*6), ey=170+j*4; legs+=`<path d="M${x1} ${y1} Q${mx} ${my} ${ex} ${ey}" stroke="#2a1f33" stroke-width="7" fill="none" stroke-linecap="round"/>`; }); });
    return W(`${legs}<ellipse cx="100" cy="88" rx="44" ry="38" fill="#3a2b48"/><path d="M100 64 l12 14 -12 14 -12 -14z" fill="#e8435a"/><path d="M100 96 l8 10 -8 10 -8 -10z" fill="#e8435a"/>
      <ellipse cx="100" cy="132" rx="30" ry="24" fill="#2a1f33"/>
      <circle cx="88" cy="128" r="6" fill="#ff3b3b"/><circle cx="112" cy="128" r="6" fill="#ff3b3b"/><circle cx="96" cy="120" r="4" fill="#ff3b3b"/><circle cx="104" cy="120" r="4" fill="#ff3b3b"/><circle cx="80" cy="120" r="3" fill="#ff3b3b"/><circle cx="120" cy="120" r="3" fill="#ff3b3b"/>
      <path d="M92 148 q-2 10 4 14 M108 148 q2 10 -4 14" stroke="#c9c2b0" stroke-width="4" fill="none" stroke-linecap="round"/>`); }
  case 3: return W(`<path d="M72 150 L64 184 M128 150 L136 184" stroke="#6d6f7a" stroke-width="16" stroke-linecap="round"/><path d="M54 186 h22 M124 186 h22" stroke="#4a4c56" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="100" cy="122" rx="40" ry="42" fill="#7d808c"/><ellipse cx="100" cy="128" rx="24" ry="28" fill="#a9acb6"/>
      <path d="M62 100 Q40 128 48 156" stroke="#7d808c" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M138 100 Q160 128 152 156" stroke="#7d808c" stroke-width="15" fill="none" stroke-linecap="round"/>
      <path d="M42 156 l-4 10 M48 158 l0 11 M54 156 l4 10 M146 156 l-4 10 M152 158 l0 11 M158 156 l4 10" stroke="#f2f2f2" stroke-width="3" stroke-linecap="round"/>
      <path d="M66 46 L60 14 L84 36Z M134 46 L140 14 L116 36Z" fill="#6d6f7a"/><path d="M68 40 L65 24 L78 36Z M132 40 L135 24 L122 36Z" fill="#e3a4a4"/>
      <ellipse cx="100" cy="56" rx="38" ry="32" fill="#7d808c"/><path d="M80 66 Q100 58 120 66 L116 92 Q100 102 84 92Z" fill="#a9acb6"/>
      <ellipse cx="100" cy="70" rx="9" ry="6" fill="#2b2340"/><ellipse cx="84" cy="50" rx="7" ry="6" fill="#ffd21f"/><ellipse cx="116" cy="50" rx="7" ry="6" fill="#ffd21f"/><ellipse cx="84" cy="50" rx="2.5" ry="5" fill="#2b2340"/><ellipse cx="116" cy="50" rx="2.5" ry="5" fill="#2b2340"/>
      <path d="M72 42 l18 6 M128 42 l-18 6" stroke="#4a4c56" stroke-width="4" stroke-linecap="round"/>
      <path d="M86 86 Q100 96 114 86" stroke="#2b2340" stroke-width="3" fill="#8b2c2c"/><path d="M90 87 l3 7 3 -6 M104 88 l3 6 3 -7" fill="#fff"/>`);
  case 4: return W(`<path d="M154 140 L176 52" stroke="#7a5230" stroke-width="10" stroke-linecap="round"/><ellipse cx="176" cy="54" rx="13" ry="20" fill="#8a5a2b" transform="rotate(14 176 54)"/><circle cx="170" cy="46" r="2.5" fill="#bbb"/><circle cx="180" cy="60" r="2.5" fill="#bbb"/>
      <rect x="66" y="150" width="24" height="36" rx="10" fill="#5d7348"/><rect x="110" y="150" width="24" height="36" rx="10" fill="#5d7348"/>
      <ellipse cx="100" cy="118" rx="58" ry="50" fill="#6f8a56"/><ellipse cx="100" cy="128" rx="34" ry="30" fill="#93ad78"/><path d="M60 150 Q100 170 140 150 L136 162 Q100 176 64 162Z" fill="#5a4a2a"/>
      <path d="M46 104 Q22 130 34 160" stroke="#6f8a56" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M154 104 Q166 120 158 140" stroke="#6f8a56" stroke-width="20" fill="none" stroke-linecap="round"/>
      <ellipse cx="100" cy="66" rx="30" ry="24" fill="#6f8a56"/><circle cx="90" cy="62" r="5" fill="#fff9c4"/><circle cx="110" cy="62" r="5" fill="#fff9c4"/><circle cx="90" cy="63" r="2.5" fill="#2b2340"/><circle cx="110" cy="63" r="2.5" fill="#2b2340"/>
      <path d="M88 78 Q100 84 112 78" stroke="#2b2340" stroke-width="3" fill="none"/><path d="M90 79 l-3 -10 5 6z M110 79 l3 -10 -5 6z" fill="#fffbe6"/><path d="M80 52 q20 -10 40 0" stroke="#4c6136" stroke-width="4" fill="none"/>
      <path d="M70 100 q6 -6 12 0 M118 96 q6 -6 12 0" stroke="#4c6136" stroke-width="3" fill="none"/>`);
  case 5: return W(`<path d="M152 160 L170 48" stroke="#5a3b1f" stroke-width="7" stroke-linecap="round"/><path d="M166 54 Q196 50 192 84 Q178 72 162 76Z" fill="#9aa3b5" stroke="#5f6a80" stroke-width="2"/>
      <rect x="72" y="146" width="20" height="40" rx="8" fill="#3f5a2c"/><rect x="108" y="146" width="20" height="40" rx="8" fill="#3f5a2c"/><path d="M66 186 h28 M106 186 h28" stroke="#2b2b2b" stroke-width="8" stroke-linecap="round"/>
      <path d="M58 90 Q100 76 142 90 L136 152 Q100 162 64 152Z" fill="#4f7a35"/><path d="M58 90 L142 152 M142 90 L58 152" stroke="#5a3b1f" stroke-width="7"/><circle cx="100" cy="121" r="8" fill="#9aa3b5"/>
      <path d="M58 96 Q36 120 44 150" stroke="#4f7a35" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M142 96 Q160 110 156 152" stroke="#4f7a35" stroke-width="18" fill="none" stroke-linecap="round"/>
      <ellipse cx="100" cy="64" rx="30" ry="28" fill="#5b8a3c"/><path d="M70 54 Q100 24 130 54 L130 58 L70 58Z" fill="#6d6f7a"/><path d="M72 50 Q52 40 50 20 Q64 36 78 42Z M128 50 Q148 40 150 20 Q136 36 122 42Z" fill="#efe9da"/>
      <path d="M82 66 l10 4 M118 66 l-10 4" stroke="#2b2340" stroke-width="4" stroke-linecap="round"/><circle cx="88" cy="72" r="3.5" fill="#ff3b3b"/><circle cx="112" cy="72" r="3.5" fill="#ff3b3b"/>
      <path d="M84 84 h32" stroke="#2b2340" stroke-width="4" stroke-linecap="round"/><path d="M88 84 l-2 -12 6 8z M112 84 l2 -12 -6 8z" fill="#fffbe6"/>`);
  case 6: { let b=''; for(let y=86;y<180;y+=11) b+=`<path d="M64 ${y} Q100 ${y+6} 136 ${y-2}" stroke="#c7b48e" stroke-width="3" fill="none"/>`;
    return W(`<rect x="76" y="140" width="18" height="44" rx="6" fill="#e6d7b5"/><rect x="106" y="140" width="18" height="44" rx="6" fill="#e6d7b5"/>
      <path d="M66 82 Q100 72 134 82 L130 150 Q100 158 70 150Z" fill="#e6d7b5"/>${b}
      <path d="M68 94 Q40 96 26 92" stroke="#e6d7b5" stroke-width="16" stroke-linecap="round"/><path d="M132 94 Q160 96 174 92" stroke="#e6d7b5" stroke-width="16" stroke-linecap="round"/>
      <path d="M30 86 l-12 -6 M170 86 l12 -6" stroke="#c7b48e" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="100" cy="52" rx="28" ry="30" fill="#e6d7b5"/><path d="M74 40 Q100 46 126 36 M72 56 Q100 62 128 52 M76 70 Q100 74 124 68" stroke="#c7b48e" stroke-width="3" fill="none"/>
      <rect x="80" y="44" width="40" height="12" rx="6" fill="#2b2340"/><circle cx="90" cy="50" r="4.5" fill="#6dff8a"/><circle cx="110" cy="50" r="4.5" fill="#6dff8a"/><circle cx="90" cy="50" r="9" fill="#6dff8a" opacity=".25"/><circle cx="110" cy="50" r="9" fill="#6dff8a" opacity=".25"/>
      <path d="M130 120 q16 8 12 24" stroke="#e6d7b5" stroke-width="4" fill="none"/>`); }
  case 7: return W(`<rect x="62" y="144" width="30" height="42" rx="6" fill="#8b8e98"/><rect x="108" y="144" width="30" height="42" rx="6" fill="#8b8e98"/>
      <path d="M50 80 L150 80 L144 152 L56 152Z" fill="#9a9da8" stroke="#6b6e78" stroke-width="3"/><path d="M60 100 L90 96 L86 124 L62 128Z M110 96 L140 100 L138 128 L114 124Z M88 128 L112 128 L108 148 L92 148Z" fill="#8b8e98" stroke="#6b6e78" stroke-width="2"/>
      <path d="M100 98 v24 M92 110 h16" stroke="#3ff0ff" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="110" r="14" fill="#3ff0ff" opacity=".15"/>
      <rect x="20" y="82" width="30" height="62" rx="10" fill="#9a9da8" stroke="#6b6e78" stroke-width="3"/><rect x="150" y="82" width="30" height="62" rx="10" fill="#9a9da8" stroke="#6b6e78" stroke-width="3"/>
      <rect x="16" y="140" width="38" height="26" rx="8" fill="#8b8e98" stroke="#6b6e78" stroke-width="3"/><rect x="146" y="140" width="38" height="26" rx="8" fill="#8b8e98" stroke="#6b6e78" stroke-width="3"/>
      <path d="M72 30 L128 30 L132 76 L68 76Z" fill="#a7aab4" stroke="#6b6e78" stroke-width="3"/><rect x="80" y="46" width="14" height="8" rx="2" fill="#3ff0ff"/><rect x="106" y="46" width="14" height="8" rx="2" fill="#3ff0ff"/>
      <path d="M86 66 h28" stroke="#6b6e78" stroke-width="4"/><path d="M60 92 l6 6 M140 92 l-6 6 M80 140 l4 -6" stroke="#6b6e78" stroke-width="2"/>`);
  case 8: return W(`<path d="M50 70 Q30 130 40 186 L160 186 Q170 130 150 70Z" fill="#4b2370"/>
      <path d="M152 150 L182 34" stroke="#2b2b35" stroke-width="7" stroke-linecap="round"/><path d="M178 40 L186 18 L184 44Z" fill="#2b2b35"/><path d="M146 156 l16 -2" stroke="#7a1a1a" stroke-width="6" stroke-linecap="round"/><path d="M181 30 V110" stroke="#9b59d0" stroke-width="2" opacity=".5"/>
      <rect x="74" y="146" width="20" height="40" rx="6" fill="#23232c"/><rect x="106" y="146" width="20" height="40" rx="6" fill="#23232c"/>
      <path d="M62 84 Q100 74 138 84 L134 150 Q100 158 66 150Z" fill="#2f2f3a" stroke="#555566" stroke-width="2"/><path d="M100 82 V150 M68 116 H132" stroke="#555566" stroke-width="2"/><path d="M92 104 l8 -10 8 10 -8 10z" fill="#b3122a"/>
      <circle cx="62" cy="88" r="14" fill="#3a3a48"/><circle cx="138" cy="88" r="14" fill="#3a3a48"/>
      <path d="M58 100 Q48 126 56 150" stroke="#2f2f3a" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M142 100 Q152 128 150 152" stroke="#2f2f3a" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M72 70 Q70 28 100 26 Q130 28 128 70 Q100 80 72 70Z" fill="#2f2f3a" stroke="#555566" stroke-width="2"/><rect x="78" y="48" width="44" height="8" rx="3" fill="#ff2a2a"/><rect x="78" y="48" width="44" height="8" rx="3" fill="#ff2a2a" opacity=".4" transform="scale(1 1)"/>
      <path d="M100 26 Q104 6 122 4 Q112 14 108 28Z" fill="#7a1a1a"/><path d="M80 34 L64 16 L84 28Z M120 34 L136 16 L116 28Z" fill="#2f2f3a"/>`);
  case 9: return W(`<path d="M70 96 Q20 40 6 70 Q24 74 22 92 Q36 88 42 104 Q54 98 70 112Z" fill="#a8231c"/><path d="M130 96 Q180 40 194 70 Q176 74 178 92 Q164 88 158 104 Q146 98 130 112Z" fill="#a8231c"/>
      <path d="M70 96 Q20 40 6 70 M130 96 Q180 40 194 70" stroke="#6e130e" stroke-width="3" fill="none"/>
      <path d="M140 160 Q186 168 190 136 Q178 150 150 146" fill="#c42e24"/><path d="M186 140 l10 -8 -2 12z" fill="#6e130e"/>
      <rect x="68" y="150" width="22" height="36" rx="8" fill="#b02a20"/><rect x="110" y="150" width="22" height="36" rx="8" fill="#b02a20"/><path d="M64 186 l6 -6 6 6 6 -6 6 6 M106 186 l6 -6 6 6 6 -6 6 6" stroke="#f2f2f2" stroke-width="2" fill="none"/>
      <ellipse cx="100" cy="128" rx="44" ry="38" fill="#c42e24"/><ellipse cx="100" cy="136" rx="26" ry="26" fill="#ffcf7a"/><path d="M80 124 h40 M78 136 h44 M80 148 h40" stroke="#e8a945" stroke-width="2"/>
      <path d="M96 94 Q92 70 98 54" stroke="#c42e24" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path d="M70 46 Q72 22 100 22 Q126 22 128 44 L140 52 Q144 64 130 66 L102 70 Q74 70 70 46Z" fill="#c42e24"/>
      <path d="M80 28 L66 6 L88 22Z M100 22 L96 0 L110 20Z" fill="#f5e6c8"/><circle cx="90" cy="40" r="6" fill="#ffe14d"/><ellipse cx="90" cy="40" rx="2" ry="5" fill="#2b2340"/>
      <circle cx="132" cy="56" r="2.5" fill="#6e130e"/><path d="M106 64 l4 6 4 -6 4 6 4 -6" stroke="#fff" stroke-width="2" fill="none"/>
      <path d="M142 58 Q170 50 196 58 Q172 64 196 74 Q166 72 142 64Z" fill="#ff9a1f" opacity=".95"/><path d="M144 60 Q164 56 180 60 Q166 64 180 68 Q160 66 144 63Z" fill="#ffe14d"/>`);
  }
  return W('');
}

/* ============ Chests ============ */
function chestSVG(kind, open){
  const gold=kind==='gold', body=gold?'#f2c230':'#9a5b2c', band=gold?'#b88a00':'#5e3517', lock=gold?'#e84393':'#e8c34a';
  const lid = open ? `<path d="M30 70 L170 70 L160 30 Q100 10 40 30Z" fill="${body}" stroke="${band}" stroke-width="4" transform="rotate(-18 30 70)"/>` :
    `<path d="M30 80 Q30 40 100 40 Q170 40 170 80Z" fill="${body}" stroke="${band}" stroke-width="4"/><path d="M60 46 V80 M140 46 V80" stroke="${band}" stroke-width="8"/>`;
  return `<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">${open?`<circle cx="100" cy="80" r="70" fill="#fff3a0" opacity=".7"/><path d="M100 10 l6 30 M60 25 l14 26 M140 25 l-14 26 M30 55 l26 14 M170 55 l-26 14" stroke="#ffd84d" stroke-width="5" stroke-linecap="round"/>`:''}<ellipse cx="100" cy="168" rx="80" ry="8" fill="#000" opacity=".1"/><rect x="30" y="78" width="140" height="84" rx="8" fill="${body}" stroke="${band}" stroke-width="4"/><path d="M60 78 V162 M140 78 V162" stroke="${band}" stroke-width="8"/>${open?'':`<rect x="88" y="70" width="24" height="28" rx="4" fill="${lock}" stroke="${band}" stroke-width="3"/><circle cx="100" cy="84" r="4" fill="${band}"/>`}${lid}</svg>`;
}
function openChestFor(p){
  if(!p.chests || !p.chests.length) return null;
  const kind=p.chests.shift();
  p.owned=p.owned||{};
  const cands = slotsOf(p).filter(sl=>(p.owned[sl.id]||0) < sl.items.length);
  const itemChance = kind==='gold' ? 1 : 0.45;
  if(cands.length && Math.random()<itemChance){
    // cheapest next item out of 3 random slots – drops stay useful for the current stage
    const pool=cands.slice(), sample=[];
    for(let i=0;i<3&&pool.length;i++) sample.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    sample.sort((a,b)=>a.items[p.owned[a.id]||0][4]-b.items[p.owned[b.id]||0][4]);
    const sl=sample[0], t=(p.owned[sl.id]||0)+1; p.owned[sl.id]=t; p.newItem=sl.id+':'+t;
    return {kind, item:sl.items[t-1], slot:sl.name};
  }
  const pts=(kind==='gold'?60:20)+Math.floor(Math.random()*5)*10;
  p.points+=pts; return {kind, points:pts};
}
