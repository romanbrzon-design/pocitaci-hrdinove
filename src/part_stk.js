
/* ============ Naučné nálepky: kartičky se zajímavostmi, skládačky obrázků, kvízy ============ */
// [emoji, název, zajímavost]; poslední dvě v sadě jsou vzácné
var STK_DATA = {
 vs:{name:'Vesmír', icon:'🪐', items:[
  ['☀️','Slunce','Slunce je hvězda. Je tak obrovské, že by se do něj vešlo přes milion planet velkých jako Země.'],
  ['🌍','Země','Země je třetí planeta od Slunce. Jednou za den se otočí kolem své osy – proto máme den a noc. Slunce oběhne jednou za rok.'],
  ['🌙','Měsíc','Měsíc obíhá kolem Země. Nefouká tam vítr ani neprší, takže stopy astronautů tam vydrží hodně dlouho.'],
  ['🔴','Mars','Mars je rudá planeta. Červenou barvu mu dává rezavý prach. Jezdí po něm roboti, kteří ho zkoumají.'],
  ['🪐','Saturn','Saturn má krásné prstence z ledu a kamínků. Je tak lehký, že by ve velikánské vaně s vodou plaval.'],
  ['🟠','Jupiter','Jupiter je největší planeta Sluneční soustavy. Má obří bouři zvanou Velká rudá skvrna – je větší než celá Země.'],
  ['⭐','Hvězdy','Hvězdy jsou obrovská slunce, která jsou tak daleko, že vypadají jako malé tečky. Nejbližší hvězda je naše Slunce.'],
  ['☄️','Kometa','Kometa je obří koule ledu a prachu. Když se přiblíží ke Slunci, naroste jí dlouhý zářící ohon.'],
  ['🚀','Raketa','Raketa musí letět hodně rychle, aby unikla zemské přitažlivosti. Prvním člověkem ve vesmíru byl Jurij Gagarin v roce 1961.'],
  ['👩‍🚀','Astronautka','Na vesmírné stanici se astronauti vznášejí. Spí připoutaní ve spacáku, aby jim neodplavali.'],
  ['🌌','Mléčná dráha','Naše Slunce je jen jedna z miliard hvězd v galaxii Mléčná dráha. Za tmavé noci ji uvidíš jako světlý pruh na obloze.'],
  ['🛰️','Družice','Družice obíhají kolem Země. Pomáhají předpovídat počasí, ukazují cestu v navigaci a přenášejí televizi.'],
 ], quiz:[['Která planeta je největší?','Jupiter',['Mars','Země','Měsíc']],['Co je Slunce?','hvězda',['planeta','kometa','měsíc']],['Kdo byl první člověk ve vesmíru?','Jurij Gagarin',['Karel IV.','Eiffel','Kolumbus']],['Proč máme den a noc?','Země se otáčí kolem své osy',['Slunce zhasíná','Měsíc zakrývá Slunce','mraky']]]},
 dn:{name:'Dinosauři', icon:'🦖', items:[
  ['🦖','Tyranosaurus','Tyranosaurus rex byl jeden z největších masožravců. Měl zuby velké jako banány, ale úplně krátké přední tlapky.'],
  ['🦕','Brachiosaurus','Brachiosaurus měl dlouhý krk jako žirafa a okusoval listy z vysokých stromů. Byl to býložravec.'],
  ['🥚','Dinosauří vejce','Dinosauři se líhli z vajec. Některá vejce byla velká jako meloun.'],
  ['🦴','Zkameněliny','O dinosaurech víme díky zkamenělinám – kostem a otiskům, které se miliony let zachovaly v kameni.'],
  ['🦎','Ještěrky','Ještěrky nejsou dinosauři, jsou to jen jejich vzdálení příbuzní. Dinosauři žili před více než 66 miliony let.'],
  ['🐊','Krokodýl','Krokodýli žili už v době dinosaurů a přežili až dodnes. Je to taková živá zkamenělina.'],
  ['🐦','Ptáci','Vědci zjistili, že ptáci jsou potomci dinosaurů. Až uvidíš vrabce, vzpomeň si, že je to malý dinosaurus!'],
  ['🌋','Sopky','V době dinosaurů soptilo hodně sopek a na Zemi bylo tepleji než dnes. Zpočátku byly všechny pevniny spojené v jeden obří světadíl.'],
  ['☄️','Asteroid','Dinosauři vyhynuli, když na Zemi dopadl obrovský asteroid. Prach zakryl Slunce a velká zvířata to nepřežila.'],
  ['🌿','Kapradiny','Dinosauři jedli rostliny jako kapradiny a přesličky. Tráva tehdy skoro ještě nerostla.'],
  ['🔍','Paleontolog','Vědec, který hledá a zkoumá zkameněliny dinosaurů, se jmenuje paleontolog.'],
  ['🐘','Obr mezi dinosaury','Argentinosaurus byl možná nejtěžší dinosaurus vůbec – vážil víc než deset slonů.'],
 ], quiz:[['Čí potomci jsou ptáci?','dinosaurů',['ryb','koček','žab']],['Jak se jmenuje vědec, který zkoumá zkameněliny?','paleontolog',['astronaut','kuchař','lékař']],['Co jedl Brachiosaurus?','listy ze stromů',['maso','ryby','trávu z louky']],['Z čeho se dinosauři líhli?','z vajec',['z pupenů','z kamenů','nelíhli se']]]},
 ls:{name:'Zvířata našich lesů', icon:'🦊', items:[
  ['🦊','Liška','Liška má výborný sluch – slyší i myš, která šustí pod sněhem. Bydlí v noře.'],
  ['🦌','Jelen','Jelenovi každý rok na konci zimy opadnou parohy. Pak mu narostou nové, často ještě větší.'],
  ['🐗','Divočák','Divoké prase rozrývá rypákem zem a hledá kořínky a žaludy. Jeho mláďata se jmenují selata a mají pruhy.'],
  ['🦔','Ježek','Ježek má na zádech tisíce bodlin. V zimě spí zimním spánkem v hromádce listí.'],
  ['🐿️','Veverka','Veverka si na podzim schovává oříšky. Na některé zapomene – a z nich pak vyrostou nové stromy.'],
  ['🦉','Sova','Sova výborně vidí ve tmě a hlavu otočí skoro dozadu. Létá úplně potichu.'],
  ['🍄','Houby','Houby nejsou rostliny ani zvířata. Nikdy nejez houbu, kterou nezná dospělý – některé jsou jedovaté!'],
  ['🐸','Žába','Žába klade vajíčka do vody. Vylíhnou se z nich pulci, kteří mají ocásek a dýchají žábrami jako ryby.'],
  ['🐦','Datel','Datel buší zobákem do stromů a hledá v kůře brouky. Jeho klepání je slyšet daleko.'],
  ['🐞','Beruška','Beruška je malý brouk, který sní spoustu mšic. Proto ji mají zahrádkáři rádi.'],
  ['🐺','Vlk','Vlci se do našich hor vrátili. Žijí ve smečkách a dorozumívají se vytím.'],
  ['🐻','Medvěd','Medvěd hnědý občas přijde do Beskyd ze Slovenska. V zimě spí v brlohu a jí skoro všechno – i med a borůvky.'],
 ], quiz:[['Jak se jmenují mláďata divokého prasete?','selata',['koťata','štěňata','telata']],['Co dělá ježek v zimě?','spí zimním spánkem',['létá na jih','staví hnízdo','plave v rybníce']],['Co se jelenovi stane každý rok?','opadnou mu parohy',['změní barvu','naroste mu ocas','začne létat']],['Kdo se vylíhne z žabích vajíček?','pulci',['kuřátka','housenky','rybičky']]]},
 tl:{name:'Lidské tělo', icon:'❤️', items:[
  ['❤️','Srdce','Srdce je sval velký asi jako tvoje pěst. Pumpuje krev do celého těla a nikdy neodpočívá.'],
  ['🧠','Mozek','Mozek řídí celé tělo. Přemýšlí, pamatuje si a pracuje i ve spánku.'],
  ['🦴','Kosti','Dospělý člověk má kolem 206 kostí. Nejmenší kůstka je v uchu a je menší než zrnko rýže.'],
  ['👁️','Oko','Oko funguje jako fotoaparát. Mrkáme asi patnáctkrát za minutu, aby se oči nevysušily.'],
  ['👂','Ucho','Uši nám pomáhají slyšet a udržet rovnováhu. Proto se ti po točení na kolotoči motá hlava.'],
  ['👃','Nos','Nos rozezná tisíce různých vůní. Chloupky v nose zachytávají prach.'],
  ['🦷','Zuby','Mléčné zuby ti vypadají a místo nich vyrostou stálé. Ty už ti musí vydržet celý život – tak si je čisti!'],
  ['💪','Svaly','V těle máme přes 600 svalů. Když se usměješ, pracuje jich v obličeji hned několik.'],
  ['🌬️','Plíce','Plícemi dýcháme. Vdechujeme kyslík, který tělo potřebuje, a vydechujeme oxid uhličitý.'],
  ['🩸','Krev','Krev rozváží po těle kyslík a živiny. Když se škrábneš, krev se sama srazí a vznikne strupík.'],
  ['🧬','DNA','V každé buňce je návod, jak tě postavit. Jmenuje se DNA a díky ní se trochu podobáš rodičům.'],
  ['🥦','Vitamíny','Ovoce a zelenina obsahují vitamíny, které tě chrání před nemocemi a dávají ti sílu.'],
 ], quiz:[['Jak velké je srdce?','asi jako tvoje pěst',['jako meloun','jako hrášek','jako celá hlava']],['Čím dýcháme?','plícemi',['srdcem','žaludkem','ušima']],['Kolik kostí má dospělý člověk?','asi 206',['asi 20','asi 2000','přesně 10']],['Které zuby ti vypadají?','mléčné',['stálé','zlaté','všechny najednou']]]},
 cz:{name:'Česko', icon:'🏰', items:[
  ['🏰','Karlštejn','Hrad Karlštejn nechal postavit král a císař Karel IV. Schovávaly se v něm korunovační klenoty a vzácné poklady.'],
  ['👑','Klenoty','České korunovační klenoty jsou uložené na Pražském hradě. Svatováclavská koruna je zdobená drahokamy.'],
  ['🌉','Karlův most','Karlův most v Praze vede přes Vltavu a je starý přes 600 let. Stojí na něm třicet soch.'],
  ['🏞️','Vltava','Vltava je nejdelší česká řeka. Pramení na Šumavě, protéká Prahou a u Mělníka se vlévá do Labe.'],
  ['⛰️','Sněžka','Sněžka je nejvyšší hora Česka. Měří 1 603 metrů a leží v Krkonoších.'],
  ['🕰️','Orloj','Pražský orloj je starý přes 600 let. Přes den se každou celou hodinu v okénkách ukážou apoštolové.'],
  ['🎵','Hymna','Česká hymna se jmenuje Kde domov můj. Zpívá se při slavnostech i sportovních zápasech.'],
  ['🇨🇿','Vlajka','Česká vlajka je bílo-červená s modrým klínem.'],
  ['🦁','Lev ve znaku','Ve státním znaku Česka je dvouocasý lev. Je symbolem odvahy a síly.'],
  ['🌲','Šumava','Šumava jsou velké lesy na jihozápadě Čech. Žijí tam rysi a pramení tam Vltava.'],
  ['⛪','Brno','Brno je druhé největší město Česka. Zvony na katedrále na Petrově odbíjejí poledne už v jedenáct hodin.'],
  ['🐟','Kapr','Na Vánoce se u nás tradičně jí kapr. Chovají se v rybnících – nejvíc jich je v jižních Čechách.'],
 ], quiz:[['Která hora je nejvyšší v Česku?','Sněžka',['Říp','Petřín','Mount Everest']],['Kdo nechal postavit Karlštejn?','Karel IV.',['Jurij Gagarin','Eiffel','paleontolog']],['Jak se jmenuje česká hymna?','Kde domov můj',['Ach synku, synku','Skákal pes','Holka modrooká']],['Která řeka je nejdelší v Česku?','Vltava',['Nil','Dunaj','Svitava']]]},
 sv:{name:'Svět', icon:'🌍', items:[
  ['🗺️','Světadíly','Na Zemi je sedm světadílů: Evropa, Asie, Afrika, Severní a Jižní Amerika, Austrálie a Antarktida.'],
  ['🌊','Oceány','Oceány pokrývají skoro tři čtvrtiny Země. Největší je Tichý oceán.'],
  ['🐧','Tučňák','Tučňáci žijí na jižní polokouli, nejvíc kolem Antarktidy. Neumí létat, ale skvěle plavou.'],
  ['🐻‍❄️','Lední medvěd','Lední medvěd žije u severního pólu. Pod bílou srstí má černou kůži, která chytá teplo ze slunce.'],
  ['🦘','Klokan','Klokan žije v Austrálii. Své mládě nosí v kapse na bříšku.'],
  ['🐘','Slon','Slon je největší suchozemské zvíře. Chobotem pije, troubí i se s ním objímá.'],
  ['🗽','Socha Svobody','Socha Svobody stojí v New Yorku v Americe. Lidé ji dostali darem z Francie.'],
  ['🥖','Francie','Francie je známá křupavými bagetami. V jejím hlavním městě Paříži stojí slavná Eiffelova věž – je ze železa a měří asi 330 metrů.'],
  ['🐼','Panda','Panda velká žije v horách Číny. Skoro celý den jí bambus.'],
  ['🏜️','Poušť','Největší horká poušť je Sahara v Africe. Prší tam jen málokdy a velbloudi tam vydrží dlouho bez vody.'],
  ['🏔️','Mount Everest','Mount Everest je nejvyšší hora světa. Měří přes 8 800 metrů a leží v Asii v Himálaji.'],
  ['🦒','Žirafa','Žirafa je nejvyšší zvíře na světě. Má tmavě modrý jazyk dlouhý skoro půl metru.'],
 ], quiz:[['Kde žije klokan?','v Austrálii',['v Česku','v Antarktidě','na Měsíci']],['Která hora je nejvyšší na světě?','Mount Everest',['Sněžka','Říp','Eiffelova věž']],['Kolik je na Zemi světadílů?','sedm',['tři','deset','dva']],['Co jí panda?','bambus',['ryby','maso','zmrzlinu']]]},
};
var STK_ORDER=['vs','dn','ls','tl','cz','sv'];
var STICKER_SETS = STK_ORDER.map(id=>({id, name:STK_DATA[id].name, icon:STK_DATA[id].icon, e:STK_DATA[id].items.map(x=>x[0])}));
var ALL_STICKERS = STK_ORDER.flatMap(id=>STK_DATA[id].items.map((x,i)=>({id:id+i, e:x[0], name:x[1], fact:x[2], set:id, rare:i>=10})));
var STK_TOTAL = ALL_STICKERS.length;
var stkById = id => ALL_STICKERS.find(s=>s.id===id);
var RANKS=[[0,'🔎 Zvídálek'],[10,'🧭 Průzkumník'],[25,'🔬 Badatel'],[45,'🧪 Vědec'],[65,'🎓 Profesor']];
function rankOf(p){ const n=Object.keys(fx(p).read||{}).length; let r=RANKS[0]; for(const x of RANKS) if(n>=x[0]) r=x; const nx=RANKS.find(x=>x[0]>n); return {name:r[1], n, next:nx}; }

// převod nálepek ze staré verze (5 sad) na nové – stejná pozice, nic se neztratí
function migrateStickers(p){
  const f=p.fx; if(!f || f.stkV===2) return; f.stkV=2;
  const old=['zv','jd','vs','sp','kz'], ns={};
  for(const [id,n] of Object.entries(f.stk||{})){ const m=id.match(/^([a-z]+)(\d+)$/); if(!m) continue; const oi=old.indexOf(m[1]); if(oi<0){ ns[id]=(ns[id]||0)+n; continue; }
    const t=ALL_STICKERS[oi*12 + (+m[2])]; if(t) ns[t.id]=(ns[t.id]||0)+n; }
  f.stk=ns; const done={}; for(const s of STICKER_SETS) if(s.e.every((_,i)=>ns[s.id+i])) done[s.id]=1; f.setDone=done; f.read=f.read||{};
}
var _fx0=fx;
fx=function(p){ const f=_fx0(p); if(f.stkV!==2) migrateStickers(p); f.read=f.read||{}; f.quiz=f.quiz||{}; return f; };

dropSticker=function(p, quiet){
  const f=fx(p); const rare=Math.random()<0.15;
  // přednost mají nálepky, které ještě nemá (2 ze 3 případů)
  let pool=ALL_STICKERS.filter(s=>s.rare===rare); const fresh=pool.filter(s=>!f.stk[s.id]); if(fresh.length && Math.random()<0.67) pool=fresh;
  const s=pool[Math.floor(Math.random()*pool.length)];
  const dup=!!f.stk[s.id]; f.stk[s.id]=(f.stk[s.id]||0)+1;
  let extra=''; if(dup){ p.points+=3; extra='Tuhle už máš – dostáváš +3 ⭐.'; }
  const set=STICKER_SETS.find(x=>x.id===s.set);
  if(!f.setDone[set.id] && set.e.every((_,i)=>f.stk[set.id+i])){ f.setDone[set.id]=1; p.points+=50; p.chests=p.chests||[]; p.chests.push('gold'); extra+=` Obrázek „${set.name}“ je složený! +50 ⭐ a zlatá truhla. V albu tě čeká kvíz.`; setTimeout(()=>confetti(70),400); }
  if(!quiet) stickerPop(s, extra, p);
  return {s, extra};
};
// během hraní jen malé upozornění, jinak rovnou kartička
stickerPop=function(s, extra, p){
  if(['play','battle','timed','duel'].includes(view.name)){
    const d=document.createElement('div'); d.className='stkpop'+(s.rare?' rare':''); d.innerHTML=`<div class="e">${s.e}</div><div>${s.rare?'✨ Vzácná nálepka!':'Nová nálepka!'}</div><small>Přečti si ji v albu 📒</small>`;
    document.body.appendChild(d); setTimeout(()=>d.classList.add('out'),2000); setTimeout(()=>d.remove(),2600); return;
  }
  stickerCard(s, p||prof(view.pid), extra, true);
};
function stickerCard(s, p, extra, isNew){
  if(p){ const f=fx(p); if(!f.read[s.id]){ f.read[s.id]=1; save(); } }
  const set=STK_DATA[s.set]; const m=document.createElement('div'); m.className='modal';
  m.innerHTML=`<div class="card center stkcard ${s.rare?'rare':''}"><button class="say" id="scs" style="float:right">🔊</button>
    <div class="muted" style="font-weight:800">${set.icon} ${set.name}${s.rare?' · ✨ vzácná':''}${isNew?' · NOVÁ!':''}</div>
    <div class="bige">${s.e}</div><h2 style="margin:4px 0">${s.name}</h2><p class="fact">${s.fact}</p>${extra?`<p class="muted">${extra}</p>`:''}
    <button class="btn gold" id="scok">Super!</button></div>`;
  document.body.appendChild(m);
  const sayIt=()=>speak(cleanSpeech(s.name+'. '+s.fact)); m.querySelector('#scs').onclick=sayIt; if(readOn()) setTimeout(sayIt,250);
  m.querySelector('#scok').onclick=()=>{ m.remove(); try{speechSynthesis.cancel();}catch(e){} if(view.name==='album') render(); };
}
// obrázek sady složený z 12 dílků (4×3); dokud obrázek není, ukáže se barevné pozadí
var SET_BG={vs:'linear-gradient(135deg,#1b1f4b,#4b2a7a)',dn:'linear-gradient(135deg,#6db36a,#d8a45a)',ls:'linear-gradient(135deg,#2f7d3a,#9ccf6a)',tl:'linear-gradient(135deg,#ff9a9e,#fad0c4)',cz:'linear-gradient(135deg,#d7263d,#2e5aac)',sv:'linear-gradient(135deg,#3aa0e8,#f5d36b)'};
albumView=function(){
  const p=prof(view.pid); const f=fx(p), rk=rankOf(p);
  const sets=STICKER_SETS.map(set=>{ const have=set.e.filter((_,i)=>f.stk[set.id+i]).length, done=have===12;
    const pieces=set.e.map((e,i)=>{ const id=set.id+i, n=f.stk[id], c=i%4, r=Math.floor(i/4); const unread=n&&!f.read[id];
      return `<button class="pc ${n?'got':''} ${i>=10?'rare':''}" ${n?`data-stk="${id}"`:''} style="background-position:${c*100/3}% ${r*50}%">${n?`<span class="pe">${e}</span>${unread?'<i class="nw">NOVÁ</i>':''}${n>1?`<small>×${n}</small>`:''}`:`<span class="q">?</span>`}</button>`; }).join('');
    const qz=f.quiz[set.id];
    return `<div class="card albset ${done?'done':''}"><h3 style="margin:0 0 8px">${STK_DATA[set.id].icon} ${set.name} <span class="muted" style="font-size:15px">${have}/12 ${done?'✅':''}</span></h3>
      <div class="puzzle" style="--bg:url(${A_}stkset_${set.id}.webp), ${SET_BG[set.id]}">${pieces}</div>
      ${done?(qz?`<div class="muted" style="margin-top:6px">🧠 Kvíz splněn: ${qz}/3</div>`:`<button class="btn ok small" data-quiz="${set.id}" style="margin-top:8px">🧠 Kvíz o sadě (až +15 ⭐)</button>`):''}</div>`; }).join('');
  return `<div class="top"><button class="btn sec small" data-act="hero">← ${esc(p.name)}</button><h1>📒 Album nálepek</h1><span class="pill">${stickerCount(p)}/${STK_TOTAL}</span></div>
    <div class="card"><b style="font-size:19px">${rk.name}</b> · přečteno ${rk.n} kartiček${rk.next?` · do hodnosti ${rk.next[1]} zbývá ${rk.next[0]-rk.n}`:' · nejvyšší hodnost!'}
    <div class="muted">Klikni na nálepku a dozvíš se zajímavost. Každá nálepka odkryje kousek obrázku – složíš celý? Za hotový obrázek ⭐ 50, zlatá truhla a kvíz.</div></div>
    <div class="albgrid">${sets}</div>`;
};
function quizOpen(setId){
  const p=prof(view.pid), set=STK_DATA[setId]; if(!p||fx(p).quiz[setId]) return;
  const qs=shuffle(set.quiz.slice()).slice(0,3); let i=0, ok=0; const m=document.createElement('div'); m.className='modal';
  const draw=()=>{ const q=qs[i], opts=shuffle([q[1],...q[2]]);
    m.innerHTML=`<div class="card center" style="max-width:480px"><button class="say" id="qsay" style="float:right">🔊</button><div class="muted">${set.icon} Kvíz: ${set.name} · otázka ${i+1}/3</div><h2>${q[0]}</h2>
      <div class="choices">${opts.map(o=>`<button class="choice" data-o="${esc(o)}"><span class="ctext">${o}</span></button>`).join('')}</div><p id="qfb" style="min-height:26px;font-weight:800"></p></div>`;
    const sayIt=()=>speak(cleanSpeech(q[0]+' '+opts.join(', '))); m.querySelector('#qsay').onclick=sayIt; if(readOn()) setTimeout(sayIt,200);
    m.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{ const good=b.dataset.o===q[1]; if(good) ok++; m.querySelectorAll('[data-o]').forEach(x=>x.disabled=true);
      b.classList.add(good?'right':'wrong'); m.querySelector('#qfb').innerHTML=good?'✅ Správně!':`❌ Správně je: ${q[1]}`;
      setTimeout(()=>{ i++; if(i<3) draw(); else finishQ(); }, good?900:1800); });
  };
  const finishQ=()=>{ fx(p).quiz[setId]=ok; p.points+=ok*5; save(); if(ok===3) confetti(50);
    m.innerHTML=`<div class="card center"><div style="font-size:60px">${ok===3?'🏆':'🧠'}</div><h2>${ok} ze 3 správně</h2><p style="font-size:18px">+${ok*10} ⭐</p><button class="btn gold" id="qok">Hotovo</button></div>`;
    m.querySelector('#qok').onclick=()=>{ m.remove(); render(); }; };
  draw(); document.body.appendChild(m);
}
// testovací nástroje pro nálepky
const _actStk=act;
act=function(a){ const p=prof(view.pid);
  if(p && isTest(p)){
    if(a==='t-stk5'){ for(let i=0;i<5;i++) dropSticker(p,true); save(); toast('📒 +5 nálepek'); render(); return; }
    if(a==='t-stkall'){ const f=fx(p); ALL_STICKERS.forEach(s=>{ f.stk[s.id]=f.stk[s.id]||1; }); STICKER_SETS.forEach(s=>f.setDone[s.id]=1); f.quiz={}; save(); toast('📒 Všechny nálepky odemčené'); render(); return; }
    if(a==='t-wheel'){ fx(p).wheel=''; if(p.today) p.today.done=true; save(); render(); return; }
  }
  return _actStk(a);
};
// kliky v albu a ve shrnutí
var _bindStk=bind;
bind=function(){ _bindStk();
  document.querySelectorAll('[data-stk]').forEach(el=>el.onclick=()=>{ const s=stkById(el.dataset.stk); if(s) stickerCard(s, prof(view.pid)); });
  document.querySelectorAll('[data-quiz]').forEach(el=>el.onclick=()=>quizOpen(el.dataset.quiz));
};
// ve shrnutí dne: nové nálepky jako klikací kartičky
funSummaryHTML=function(p,s){
  if(!p||!s) return '';
  const ids=(s.stkIds||[]);
  return `${ids.length?`<p style="font-size:19px">📒 ${ids.length>1?'Nové nálepky':'Nová nálepka'} – klikni a dozvíš se zajímavost:</p><div class="row" style="justify-content:center">${ids.map(id=>{ const x=stkById(id); return `<button class="stkbtn" data-stk="${id}">${x.e}<small>${x.name}</small></button>`; }).join('')}</div>`:''}${canSpin(p)?`<div style="margin:8px 0"><button class="btn gold pulse" data-act="wheel" style="font-size:20px">🎡 Zatoč si kolem štěstí!</button></div>`:''}`;
};
var _finishStk=finish;
finish=function(t){ const p=prof(view.pid), practice=!!view.practice, perfect=t.res.every(r=>r===2);
  const before=Object.assign({}, fx(p).stk); _finishStk(t);
  try{ if(view.sum){ const got=[]; for(const [k,n] of Object.entries(fx(p).stk)) if((before[k]||0)<n) got.push(k); view.sum.stkIds=got; render(); } }catch(e){}
};

