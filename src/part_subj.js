
/* ============ Další předměty: angličtina, přírodověda, čeština ============ */
const SUBJECTS = {
  m:  {name:'Matematika', icon:'🧮'},
  en: {name:'Angličtina', icon:'🇬🇧'},
  pr: {name:'Přírodověda', icon:'🌿'},
  cj: {name:'Čeština',    icon:'📖'},
};
function subjOf(cat){ return (CATS[cat]&&CATS[cat].subj)||'m'; }
const txt = s => `<span class="ctext">${s}</span>`;

/* ---- Angličtina: slovní zásoba ---- */
const EN_PIC = [ // [english, emoji, czech, min grade]
  ['cat','🐱','kočka',0],['dog','🐶','pes',0],['fish','🐟','ryba',0],['bird','🐦','pták',0],['horse','🐴','kůň',0],['cow','🐮','kráva',0],['pig','🐷','prase',0],['duck','🦆','kachna',0],
  ['apple','🍎','jablko',0],['banana','🍌','banán',0],['ball','⚽','míč',0],['car','🚗','auto',0],['house','🏠','dům',0],['sun','☀️','slunce',0],['tree','🌳','strom',0],['flower','🌸','květina',0],
  ['rabbit','🐰','králík',1],['mouse','🐭','myš',1],['frog','🐸','žába',1],['lion','🦁','lev',1],['elephant','🐘','slon',1],['monkey','🐵','opice',1],['bear','🐻','medvěd',1],['sheep','🐑','ovce',1],
  ['orange','🍊','pomeranč',1],['strawberry','🍓','jahoda',1],['bread','🍞','chléb',1],['milk','🥛','mléko',1],['egg','🥚','vejce',1],['cake','🎂','dort',1],['book','📖','kniha',1],['bus','🚌','autobus',1],
  ['train','🚂','vlak',1],['moon','🌙','měsíc',1],['star','⭐','hvězda',1],['bike','🚲','kolo',2],['plane','✈️','letadlo',2],['boat','⛵','loď',2],['chair','🪑','židle',2],['bed','🛏️','postel',2],
  ['cheese','🧀','sýr',2],['carrot','🥕','mrkev',2],['tomato','🍅','rajče',2],['grapes','🍇','hroznové víno',2],['ice cream','🍦','zmrzlina',2],['pizza','🍕','pizza',2],['snake','🐍','had',2],['tiger','🐯','tygr',2],
  ['chicken','🐔','slepice',2],['hat','🎩','klobouk',2],['shoe','👟','bota',2],['cup','☕','hrnek',2],['eye','👁️','oko',3],['ear','👂','ucho',3],['nose','👃','nos',3],['hand','✋','ruka',3],
  ['clock','⏰','hodiny',3],['key','🔑','klíč',3],['umbrella','☂️','deštník',3],['pencil','✏️','tužka',3],['school','🏫','škola',3],['rainbow','🌈','duha',3],['snowman','⛄','sněhulák',3],['rocket','🚀','raketa',3],
  ['butterfly','🦋','motýl',4],['spider','🕷️','pavouk',4],['mushroom','🍄','houba',4],['candle','🕯️','svíčka',4],['scissors','✂️','nůžky',4],['computer','💻','počítač',4],['guitar','🎸','kytara',4],['castle','🏰','hrad',4],
];
const EN_COLORS = [['red','#e8323c','červená'],['blue','#2f6fe0','modrá'],['green','#2fae4f','zelená'],['yellow','#f7d02c','žlutá'],['orange','#ff8c1a','oranžová'],['purple','#9b4dd6','fialová'],['pink','#ff8fc8','růžová'],['brown','#8a5a2b','hnědá'],['black','#2b2b2b','černá'],['white','#ffffff','bílá'],['grey','#9a9aa8','šedá']];
const EN_WORDS = [ // reading: [english, czech, grade]
  ['mother','maminka',2],['father','tatínek',2],['sister','sestra',2],['brother','bratr',2],['friend','kamarád',2],['teacher','učitel',2],['big','velký',2],['small','malý',2],['happy','veselý',2],['sad','smutný',2],
  ['hot','horký',3],['cold','studený',3],['run','běhat',3],['swim','plavat',3],['jump','skákat',3],['eat','jíst',3],['sleep','spát',3],['read','číst',3],['write','psát',3],['sing','zpívat',3],['play','hrát si',3],['water','voda',3],
  ['Monday','pondělí',4],['Tuesday','úterý',4],['Wednesday','středa',4],['Thursday','čtvrtek',4],['Friday','pátek',4],['Saturday','sobota',4],['Sunday','neděle',4],['winter','zima',4],['summer','léto',4],['spring','jaro',4],['autumn','podzim',4],
  ['January','leden',5],['March','březen',5],['July','červenec',5],['December','prosinec',5],['beautiful','krásný',5],['strong','silný',5],['quick','rychlý',5],['slow','pomalý',5],['always','vždycky',5],['never','nikdy',5],['weather','počasí',5],['holiday','prázdniny',5],
];
const EN_PHRASES = [ // [english, czech, grade]
  ['Hello!','Ahoj!',2],['Goodbye!','Na shledanou!',2],['Thank you.','Děkuji.',2],['Please.','Prosím.',2],['Good morning!','Dobré ráno!',2],['Good night!','Dobrou noc!',2],
  ['How are you?','Jak se máš?',3],['I am fine.','Mám se dobře.',3],['What is your name?','Jak se jmenuješ?',3],['My name is Tom.','Jmenuji se Tom.',3],['Sit down, please.','Posaď se, prosím.',3],['Stand up.','Postav se.',3],
  ['Open the door.','Otevři dveře.',4],['Close the window.','Zavři okno.',4],['I am hungry.','Mám hlad.',4],['I like pizza.','Mám rád pizzu.',4],['How old are you?','Kolik je ti let?',4],['I am nine.','Je mi devět.',4],
  ['Where do you live?','Kde bydlíš?',5],['I live in Brno.','Bydlím v Brně.',5],['Can I go to the toilet?','Můžu jít na záchod?',5],['What time is it?','Kolik je hodin?',5],['I have got a dog.','Mám psa.',5],['It is raining.','Prší.',5],
];
const EN_NUM = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
const EN_TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function enNum(n){ if(n<=20) return EN_NUM[n]; if(n===100) return 'one hundred'; const t=Math.floor(n/10), u=n%10; return EN_TENS[t]+(u?'-'+EN_NUM[u]:''); }
let CUR_GRADE = 2;
const byGrade = (arr, gi) => { const g=CUR_GRADE; const a=arr.filter(x=>x[gi]<=g); const near=a.filter(x=>x[gi]>=g-1); return (near.length>=6 && R()<.6) ? near : (a.length?a:arr); };
function misspell(w){
  const v='aeiouy'; const tries=[
    ()=>w.length>3? w.slice(0,1)+w[2]+w[1]+w.slice(3) : w+'e',
    ()=>{ const i=[...w].findIndex((c,k)=>k>0&&v.includes(c)); if(i<0) return w+'h'; const nv=pick([...v].filter(c=>c!==w[i])); return w.slice(0,i)+nv+w.slice(i+1); },
    ()=>{ const i=ri(1,Math.max(1,w.length-1)); return w.slice(0,i)+w[i-1]+w.slice(i); },
    ()=>w.length>4? w.slice(0,-1) : w+w.slice(-1),
  ];
  return pick(tries)();
}
Object.assign(CATS, {
  en_listen: {grade:0, subj:'en', label:'Poslech – najdi obrázek', gen(){
    const pool=byGrade(EN_PIC,3); const n=CUR_GRADE===0?3:4; const opts=pickN(pool,n); const t=opts[ri(0,n-1)];
    return Object.assign(choice(`🎧 Poslouchej a najdi obrázek`, t[0], opts.map(o=>em(o[1],52)), opts.indexOf(t), '', 'enl|'+t[0]+'|'+opts.map(o=>o[0]).join()), {lang:'en-GB'});
  }},
  en_colors: {grade:0, subj:'en', label:'Poslech – barvy', gen(){
    const opts=pickN(EN_COLORS.slice(0,CUR_GRADE<=1?8:11), CUR_GRADE===0?3:4); const t=opts[ri(0,opts.length-1)];
    return Object.assign(choice(`🎧 Jakou barvu slyšíš?`, t[0], opts.map(o=>blob(o[1])), opts.indexOf(t), '', 'enc|'+t[0]+'|'+opts.map(o=>o[0]).join()), {lang:'en-GB'});
  }},
  en_numbers: {grade:0, subj:'en', label:'Poslech – čísla', gen(){
    const max=[5,10,20,50,100,100][Math.min(5,CUR_GRADE)]; const n=ri(1,max);
    const set=new Set([n]); while(set.size<4){ const d=ri(1,max); set.add(d); } if(max>20 && n>20){ set.delete([...set].pop()); const sw=(n%10)*10+Math.floor(n/10); if(sw!==n&&sw>0&&sw<=100) set.add(sw); while(set.size<4) set.add(ri(1,max)); }
    const opts=shuffle([...set]);
    return Object.assign(choice(`🎧 Jaké číslo slyšíš?`, enNum(n), opts.map(x=>`<span class="num0">${x}</span>`), opts.indexOf(n), '', 'enn|'+n+'|'+opts.join()), {lang:'en-GB'});
  }},
  en_read: {grade:2, subj:'en', label:'Čtení – co slovo znamená', gen(){
    const pool=[...EN_WORDS, ...EN_PIC.filter(x=>x[3]>=1).map(x=>[x[0],x[2],x[3]+1])]; const p2=byGrade(pool,2);
    const t=pick(p2); const others=pickN(pool.filter(x=>x[1]!==t[1]),3); const opts=shuffle([t,...others]);
    return Object.assign(choice(`Co znamená <b>${t[0]}</b>?`, t[0], opts.map(o=>txt(o[1])), opts.indexOf(t), '', 'enr|'+t[0]), {lang:'en-GB', sayOnly:true});
  }},
  en_write: {grade:3, subj:'en', label:'Psaní – správně napsané slovo', gen(){
    const pool=byGrade(EN_PIC.filter(x=>x[0].length>=3 && !x[0].includes(' ')),3); const t=pick(pool);
    const set=new Set([t[0]]); let g=0; while(set.size<4 && g++<30) set.add(misspell(t[0]));
    const opts=shuffle([...set]);
    return Object.assign(choice(`Jak se anglicky napíše <b>${t[2]}</b>?`, '', opts.map(o=>txt(o)), opts.indexOf(t[0]), em(t[1],64), 'enw|'+t[0]), {lang:'en-GB', noAuto:true});
  }},
  en_phrase: {grade:2, subj:'en', label:'Fráze – co to znamená', gen(){
    const pool=byGrade(EN_PHRASES,2); const t=pick(pool); const others=pickN(EN_PHRASES.filter(x=>x!==t),3); const opts=shuffle([t,...others]);
    return Object.assign(choice(`🎧 <b>${t[0]}</b> – co to znamená?`, t[0], opts.map(o=>txt(o[1])), opts.indexOf(t), '', 'enp|'+t[0]), {lang:'en-GB'});
  }},
});

/* ---- Přírodověda: [od třídy, do třídy, otázka, správně, [špatně], obrázek] ---- */
const PR_BANK = [
  [0,2,'Jak se jmenuje mládě krávy?','tele',['kotě','štěně','hříbě'],'🐮'],[0,2,'Jak se jmenuje mládě kočky?','kotě',['tele','kuře','jehně'],'🐱'],
  [0,2,'Jak se jmenuje mládě psa?','štěně',['kotě','sele','kůzle'],'🐶'],[0,2,'Jak se jmenuje mládě slepice?','kuře',['jehně','tele','štěně'],'🐔'],
  [0,2,'Jak se jmenuje mládě koně?','hříbě',['tele','sele','kotě'],'🐴'],[0,2,'Jak se jmenuje mládě ovce?','jehně',['kůzle','kuře','sele'],'🐑'],
  [1,2,'Jak se jmenuje mládě prasete?','sele',['jehně','tele','štěně'],'🐷'],[1,2,'Jak se jmenuje mládě kozy?','kůzle',['sele','hříbě','kotě'],'🐐'],
  [0,1,'Kdy padá sníh?','v zimě',['v létě','na jaře','na podzim'],'❄️'],[0,1,'Kdy padá listí ze stromů?','na podzim',['v zimě','na jaře','v létě'],'🍂'],
  [0,1,'Kdy se chodíme koupat k vodě?','v létě',['v zimě','na podzim','v únoru'],'🏖️'],[0,1,'Kdy kvetou první kytičky?','na jaře',['v zimě','na podzim','v prosinci'],'🌷'],
  [0,2,'Kde žije ryba?','ve vodě',['v hnízdě','v úlu','v noře'],'🐟'],[0,2,'Kde bydlí včely?','v úlu',['v hnízdě','ve vodě','v doupěti'],'🐝'],
  [0,2,'Kde žije krtek?','pod zemí',['na stromě','ve vodě','v úlu'],'🕳️'],[0,2,'Kde má pták mláďata?','v hnízdě',['v úlu','v noře','ve vodě'],'🐦'],
  [0,2,'Co rád jí králík?','mrkev',['maso','ryby','kosti'],'🐰'],[0,2,'Co jí kráva?','trávu',['maso','ryby','med'],'🐮'],
  [0,2,'Které zvíře je divoké?','liška',['kráva','pes','slepice'],'🌲'],[0,2,'Které zvíře je domácí?','koza',['vlk','liška','jelen'],'🏡'],
  [1,3,'Kolik dní má týden?','7',['5','10','12'],'📅'],[1,3,'Kolik měsíců má rok?','12',['10','7','4'],'📆'],[1,3,'Kolik ročních období máme?','4',['2','3','12'],'🌍'],
  [2,3,'Čím vidíme?','očima',['ušima','nosem','jazykem'],'👀'],[2,3,'Čím slyšíme?','ušima',['očima','nosem','rukama'],'👂'],[2,3,'Čím cítíme vůni?','nosem',['ušima','očima','kolenem'],'👃'],
  [2,4,'Který smysl máme v jazyku?','chuť',['zrak','sluch','čich'],'👅'],[2,4,'Který strom je jehličnatý?','smrk',['dub','buk','lípa'],'🌲'],
  [2,4,'Který strom je listnatý?','dub',['smrk','borovice','jedle'],'🌳'],[2,4,'Co je ovoce?','hruška',['mrkev','brambora','cibule'],'🍐'],
  [2,4,'Co je zelenina?','mrkev',['jablko','třešně','banán'],'🥕'],[2,4,'Jaká část rostliny je pod zemí?','kořen',['květ','list','plod'],'🌱'],
  [2,4,'Co se stane s vodou v mrazu?','zmrzne na led',['vypaří se','zezelená','zmizí'],'🧊'],[2,4,'Kolik nohou má hmyz?','6',['4','8','10'],'🐞'],
  [2,4,'Kolik nohou má pavouk?','8',['6','4','10'],'🕷️'],[2,4,'Kolikrát denně si máme čistit zuby?','2×',['1× za týden','nikdy','10×'],'🪥'],
  [3,5,'Které zvíře je savec?','delfín',['žralok','kapr','pstruh'],'🐬'],[3,5,'Které zvíře je pták?','tučňák',['netopýr','motýl','delfín'],'🐧'],
  [3,5,'Netopýr je…','savec',['pták','hmyz','ryba'],'🦇'],[3,5,'Velryba je…','savec',['ryba','obojživelník','plaz'],'🐋'],
  [3,5,'Žába je…','obojživelník',['plaz','savec','pták'],'🐸'],[3,5,'Had je…','plaz',['obojživelník','savec','hmyz'],'🐍'],
  [3,5,'Která houba je jedovatá?','muchomůrka zelená',['hřib smrkový','bedla vysoká','liška obecná'],'🍄'],[3,5,'Při kolika °C mrzne voda?','0 °C',['100 °C','10 °C','−50 °C'],'🌡️'],
  [3,5,'Při kolika °C vře voda?','100 °C',['0 °C','50 °C','30 °C'],'♨️'],[3,5,'Do kterého kontejneru patří plastová lahev?','do žlutého',['do modrého','do zeleného','do hnědého'],'♻️'],
  [3,5,'Do kterého kontejneru patří papír?','do modrého',['do žlutého','do zeleného','do černého'],'📰'],[3,5,'Do kterého kontejneru patří skleněná lahev?','do zeleného',['do modrého','do žlutého','do hnědého'],'🍾'],
  [3,5,'Co rostliny potřebují k životu?','světlo a vodu',['jen tmu','jen sůl','plast'],'🌻'],[4,5,'Který orgán pumpuje krev?','srdce',['plíce','žaludek','mozek'],'❤️'],
  [4,5,'Čím dýcháme?','plícemi',['srdcem','žaludkem','játry'],'🫁'],[4,5,'Co tvoří oporu těla?','kostra',['kůže','krev','vlasy'],'🦴'],
  [4,5,'Kolikátá planeta od Slunce je Země?','třetí',['první','pátá','desátá'],'🌍'],[4,5,'Která planeta je největší?','Jupiter',['Země','Mars','Merkur'],'🪐'],
  [4,5,'Slunce je…','hvězda',['planeta','měsíc','kometa'],'☀️'],[4,5,'Kolem čeho obíhá Měsíc?','kolem Země',['kolem Marsu','kolem Jupiteru','kolem ničeho'],'🌙'],
  [4,5,'Nejvyšší hora Česka je…','Sněžka',['Praděd','Lysá hora','Říp'],'⛰️'],[4,5,'Nejdelší řeka v Česku je…','Vltava',['Labe','Morava','Dyje'],'🏞️'],
  [4,5,'Co jí sova?','myši',['trávu','ovoce','listí'],'🦉'],[4,5,'Kdo je na začátku potravního řetězce?','rostliny',['lišky','sovy','vlci'],'🌾'],
  [4,5,'Které zvíře v zimě spí zimním spánkem?','ježek',['zajíc','srnka','vrabec'],'🦔'],[4,5,'Který pták na zimu odlétá do teplých krajin?','vlaštovka',['vrabec','sýkora','kos'],'🐦'],
];
CATS.pr_quiz = {grade:0, subj:'pr', label:'Přírodověda – otázky podle ročníku', gen(){
  const g=CUR_GRADE; let pool=PR_BANK.filter(q=>q[0]<=g && q[1]>=g); if(pool.length<6) pool=PR_BANK.filter(q=>q[0]<=g); if(!pool.length) pool=PR_BANK.filter(q=>q[0]===0);
  const q=pick(pool); const opts=shuffle([q[3], ...q[4]]);
  return choice(q[2], q[2], opts.map(o=>txt(o)), opts.indexOf(q[3]), q[5]?em(q[5],60):'', 'pr|'+q[2]);
}};

/* ---- Čeština ---- */
const CJ_SYL = [['ko-lo',2],['má-ma',2],['au-to',2],['pes',1],['vlak',1],['hra',1],['ban-án',2],['jab-lko',2],['ko-čka',2],['slun-ce',2],['mo-týl',2],['zmrz-li-na',3],['au-to-bus',3],['te-le-vi-ze',4],['čo-ko-lá-da',4],['pa-pou-šek',3],['ko-lo-běž-ka',4],['be-ru-ška',3],['ok-no',2],['dům',1]];
const CJ_OPP = [['velký','malý'],['den','noc'],['horký','studený'],['vysoký','nízký'],['rychlý','pomalý'],['veselý','smutný'],['starý','mladý'],['nahoře','dole'],['otevřít','zavřít'],['plný','prázdný'],['dlouhý','krátký'],['těžký','lehký'],['mokrý','suchý'],['světlo','tma'],['tlustý','tenký'],['začátek','konec']];
const CJ_OPP_GRP = [['velký','malý','vysoký','nízký','dlouhý','krátký','tlustý','tenký','těžký','lehký'],['den','noc','světlo','tma','začátek','konec'],['horký','studený','mokrý','suchý'],['starý','mladý','rychlý','pomalý']];
const CJ_IY_HARD = [['r_ba','y'],['k_tka','y'],['ch_ba','y'],['t_gr','y'],['kr_sa','y'],['t_ché','i'],['r_chle','y'],['ch_tat','y'],['n_tka','i'],['d_vadlo','i']];
const CJ_IY_SOFT = [['č_stý','i'],['ž_rafa','i'],['š_pka','i'],['ř_dič','i'],['c_bule','i'],['j_tro','i'],['ž_vot','i'],['ž_dle','i'],['š_mpanz','i'],['c_tron','i']];
const CJ_VYJ = [['b_dlet','y'],['l_st','i'],['m_š','y'],['p_vo','i'],['s_n','y'],['v_dra','y'],['z_ma','i'],['jaz_k','y'],['m_lý','i'],['p_tel','y'],['s_lný','i'],['v_dět','i'],['pl_š','y'],['l_ška','i'],['p_tlík','y'],['b_cykl','i'],['ob_čej','y'],['s_rový','y'],['m_slet','y'],['f_alka','i'],['hm_z','y'],['net_pýr','o'],['l_že','y'],['m_nce','i'],['kob_la','y'],['v_soký','y'],['b_tva','i'],['zv_k','y'],['p_kat','y'],['z_vat','í']];
const CJ_END = [['hra_','d','t'],['plo_','t','d'],['le_','d','t'],['du_','b','p'],['zu_','b','p'],['vů_','z','s'],['nů_','ž','š'],['le_','v','f'],['mrá_','z','s'],['chlé_','b','p'],['sní_','h','ch'],['ha_','d','t'],['klu_','k','g'],['ko_','s','z'],['ry_','b','p']];
const CJ_POS = [['běhat','sloveso',3],['stůl','podstatné jméno',3],['zelený','přídavné jméno',3],['kočka','podstatné jméno',3],['skákat','sloveso',3],['veselý','přídavné jméno',3],['zpívá','sloveso',3],['město','podstatné jméno',3],['velký','přídavné jméno',3],
  ['pět','číslovka',4],['já','zájmeno',4],['na','předložka',4],['a','spojka',4],['rychle','příslovce',4],['jé','citoslovce',4],['kéž','částice',5],['třetí','číslovka',4],['oni','zájmeno',4],['pod','předložka',4],['ale','spojka',4],['dnes','příslovce',4]];
const CJ_GEN = [['stůl','mužský'],['židle','ženský'],['okno','střední'],['pes','mužský'],['kočka','ženský'],['kuře','střední'],['hrad','mužský'],['moře','střední'],['růže','ženský'],['město','střední'],['strom','mužský'],['kost','ženský'],['srdce','střední'],['kůň','mužský'],['píseň','ženský']];
const ABC = 'A B C Č D Ď E F G H CH I J K L M N Ň O P Q R Ř S Š T Ť U V W X Y Z Ž'.split(' ');
// u D/Ď, N/Ň, T/Ť se učebnice liší (některé háčková písmena v abecedě neuvádějí) – na ta se neptáme
const ABC_SKIP = new Set(['D','Ď','N','Ň','T','Ť']);
Object.assign(CATS, {
  cj_abc: {grade:1, subj:'cj', label:'Abeceda a slabiky', gen(){
    if(R()<.5){ let i; do{ i=ri(0,ABC.length-2); }while(ABC_SKIP.has(ABC[i])||ABC_SKIP.has(ABC[i+1])); const right=ABC[i+1]; const opts=shuffle([right,...pickN(ABC.filter(x=>x!==right && x!==ABC[i] && !ABC_SKIP.has(x)),3)]);
      return choice(`Které písmeno je v abecedě po <b>${ABC[i]}</b>?`, `Které písmeno je v abecedě po ${ABC[i]}?`, opts.map(o=>`<span class="num0">${o}</span>`), opts.indexOf(right), '', 'abc|'+ABC[i]); }
    const w=pick(CJ_SYL); const opts=[1,2,3,4];
    return choice(`Kolik slabik má slovo <b>${w[0].replace(/-/g,'')}</b>?`, `Kolik slabik má slovo ${w[0].replace(/-/g,'')}?`, opts.map(o=>`<span class="num0">${o}</span>`), w[1]-1, '', 'syl|'+w[0]);
  }},
  cj_opp: {grade:1, subj:'cj', label:'Slova opačného významu', gen(){
    const p=pick(CJ_OPP), rev=R()<.5, a=rev?p[1]:p[0], b=rev?p[0]:p[1];
    const grp=w=>CJ_OPP_GRP.findIndex(g=>g.includes(w)); const gp=grp(p[0]); const others=pickN(CJ_OPP.filter(x=>x!==p && (gp<0 || grp(x[0])!==gp)).map(x=>x[R()<.5?0:1]),3); const opts=shuffle([b,...others]);
    return choice(`Co je opak slova <b>${a}</b>?`, `Co je opak slova ${a}?`, opts.map(o=>txt(o)), opts.indexOf(b), '', 'opp|'+a);
  }},
  cj_iy: {grade:2, subj:'cj', label:'I nebo Y po tvrdých a měkkých', gen(){
    const w=pick(R()<.5?CJ_IY_HARD:CJ_IY_SOFT); const opts=['i','y'];
    return choice(`Doplň: <b>${w[0].replace('_','<u>&nbsp;?&nbsp;</u>')}</b>`, '', opts.map(o=>`<span class="num0">${o}</span>`), opts.indexOf(w[1]), '', 'iy|'+w[0]);
  }},
  cj_vyj: {grade:3, subj:'cj', label:'Vyjmenovaná slova (i / y)', gen(){
    const all=CJ_VYJ.filter(w=>w[1]==='i'||w[1]==='y'); const w=pick(all); const opts=['i','y'];
    return choice(`Doplň: <b>${w[0].replace('_','<u>&nbsp;?&nbsp;</u>')}</b>`, '', opts.map(o=>`<span class="num0">${o}</span>`), opts.indexOf(w[1]), '', 'vyj|'+w[0]);
  }},
  cj_end: {grade:2, subj:'cj', label:'Párové souhlásky na konci slova', gen(){
    const w=pick(CJ_END); const opts=shuffle([w[1],w[2]]);
    return choice(`Doplň: <b>${w[0].replace('_','<u>&nbsp;?&nbsp;</u>')}</b>`, '', opts.map(o=>`<span class="num0">${o}</span>`), opts.indexOf(w[1]), '', 'end|'+w[0]);
  }},
  cj_pos: {grade:3, subj:'cj', label:'Slovní druhy', gen(){
    const pool=CJ_POS.filter(x=>x[2]<=Math.max(3,CUR_GRADE)); const w=pick(pool);
    const kinds=[...new Set(pool.map(x=>x[1]))]; const opts=shuffle([w[1],...pickN(kinds.filter(k=>k!==w[1]),Math.min(3,kinds.length-1))]);
    return choice(`Jaký slovní druh je <b>${w[0]}</b>?`, `Jaký slovní druh je ${w[0]}?`, opts.map(o=>txt(o)), opts.indexOf(w[1]), '', 'pos|'+w[0]);
  }},
  cj_gen: {grade:3, subj:'cj', label:'Rod podstatných jmen', gen(){
    const w=pick(CJ_GEN); const opts=['mužský','ženský','střední'];
    return choice(`Jakého rodu je <b>${w[0]}</b>?`, `Jakého rodu je ${w[0]}?`, opts.map(o=>txt(o)), opts.indexOf(w[1]), '', 'gen|'+w[0]);
  }},
});
// výchozí kategorie podle předmětu a ročníku
const SUBJ_DEFAULTS = {
  en: {0:['en_listen','en_colors','en_numbers'],1:['en_listen','en_colors','en_numbers'],2:['en_listen','en_numbers','en_read','en_phrase'],3:['en_listen','en_numbers','en_read','en_write','en_phrase'],4:['en_listen','en_numbers','en_read','en_write','en_phrase'],5:['en_listen','en_numbers','en_read','en_write','en_phrase']},
  pr: {0:['pr_quiz'],1:['pr_quiz'],2:['pr_quiz'],3:['pr_quiz'],4:['pr_quiz'],5:['pr_quiz']},
  cj: {0:['cj_opp'],1:['cj_abc','cj_opp'],2:['cj_abc','cj_opp','cj_iy','cj_end'],3:['cj_iy','cj_vyj','cj_end','cj_pos','cj_gen'],4:['cj_vyj','cj_end','cj_pos','cj_gen'],5:['cj_vyj','cj_end','cj_pos','cj_gen']},
};
function defaultCats(grade, subjects){ let c=[]; for(const s of subjects){ if(s==='m') c=c.concat(DEFAULT_CATS[grade]||DEFAULT_CATS[2]); else c=c.concat((SUBJ_DEFAULTS[s]||{})[grade]||[]); } return [...new Set(c)]; }
function subjectsOf(p){ const s=new Set(catsOf(p).map(subjOf)); return ['m','en','pr','cj'].filter(x=>s.has(x)); }
