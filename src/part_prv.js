
/* ---- Prvouka po tématech (1.–3. třída podle tematických plánů učebnic) ----
   Řádek: [od ročníku, do ročníku, otázka, správná odpověď, [špatné odpovědi], obrázek]
   Ke každému tématu se přidají i související otázky z původní banky PR_BANK (podle `old`). */
const PR_TOPICS = {
  pr_cas: {label:'Čas – dny, měsíce, roční období, hodiny', grade:1, icon:'📅', old:/sníh|listí|koupat|kytičk|dní má týden|měsíců|ročních období/, bank:[
    [0,2,'Které roční období je po zimě?','jaro',['léto','podzim','Vánoce'],'🌷'],[0,2,'Které roční období je po létě?','podzim',['jaro','zima','prázdniny'],'🍂'],
    [1,3,'Který den je po pondělí?','úterý',['středa','neděle','pátek'],'📅'],[1,3,'Který den je před pátkem?','čtvrtek',['středa','sobota','pondělí'],'📅'],
    [1,3,'Který den je po neděli?','pondělí',['sobota','úterý','středa'],'📅'],[1,3,'Které dny jsou víkend?','sobota a neděle',['pondělí a úterý','středa a čtvrtek','úterý a pátek'],'🛝'],
    [1,3,'Dnes je úterý. Jaký den byl včera?','pondělí',['středa','neděle','čtvrtek'],'📅'],[1,3,'Dnes je pátek. Jaký den bude zítra?','sobota',['čtvrtek','neděle','pondělí'],'📅'],
    [1,3,'Který měsíc je v roce první?','leden',['prosinec','březen','září'],'🗓️'],[1,3,'Který měsíc je v roce poslední?','prosinec',['leden','listopad','říjen'],'🗓️'],
    [1,3,'Ve kterém měsíci jsou Vánoce?','v prosinci',['v listopadu','v lednu','v březnu'],'🎄'],[1,3,'Ve kterém měsíci začíná škola?','v září',['v srpnu','v lednu','v červnu'],'🏫'],
    [1,3,'Který měsíc je po lednu?','únor',['březen','prosinec','duben'],'🗓️'],[2,3,'Který měsíc je před květnem?','duben',['červen','březen','srpen'],'🗓️'],
    [2,3,'Který měsíc je nejkratší?','únor',['leden','srpen','prosinec'],'🗓️'],[1,3,'Ve kterých měsících jsou letní prázdniny?','v červenci a srpnu',['v prosinci a lednu','v září a říjnu','v březnu a dubnu'],'☀️'],
    [1,3,'Kdy obvykle snídáme?','ráno',['večer','v noci','odpoledne'],'🥣'],[1,3,'Co je po odpoledni?','večer',['ráno','dopoledne','poledne'],'🌇'],
    [2,3,'Kolik hodin má celý den i s nocí?','24',['12','10','60'],'🕛'],[2,3,'Kolik minut má jedna hodina?','60',['100','24','30'],'⏰'],
    [2,3,'Co ukazuje na hodinách malá ručička?','hodiny',['minuty','dny','měsíce'],'🕒'],[3,3,'Kolik dní má rok, který není přestupný?','365',['100','300','52'],'🗓️'],
    [1,3,'Kdy dozrávají jablka a padá listí?','na podzim',['na jaře','v zimě','v létě'],'🍎'],[1,3,'Kdy je nejtepleji a jezdíme k vodě?','v létě',['v zimě','na podzim','na jaře'],'🏖️'],
  ]},
  pr_telo: {label:'Lidské tělo a smysly', grade:1, icon:'🧍', old:/Čím vidíme|Čím slyšíme|vůni|smysl máme|pumpuje krev|Čím dýcháme|oporu těla/, bank:[
    [0,2,'Čím ochutnáváme jídlo?','jazykem',['ušima','kolenem','očima'],'👅'],[0,2,'Čím čicháme?','nosem',['ušima','očima','loktem'],'👃'],
    [1,3,'Čím poznáme, jestli je věc teplá, nebo studená?','kůží (hmatem)',['ušima','nosem','vlasy'],'✋'],[1,3,'Kolik smyslů má člověk?','5',['3','8','10'],'🧠'],
    [0,2,'Kolik prstů máme na jedné ruce?','5',['4','6','10'],'🖐️'],[1,3,'Kde máme loket?','na ruce',['na noze','na hlavě','na zádech'],'💪'],
    [1,3,'Kde máme koleno?','na noze',['na ruce','na hlavě','na krku'],'🦵'],[1,3,'Kde máme obočí?','nad očima',['pod nosem','na bradě','na krku'],'🙂'],
    [1,3,'Co spojuje hlavu s tělem?','krk',['loket','koleno','pata'],'🧍'],[1,3,'Jak se jmenuje vnitřní strana ruky?','dlaň',['chodidlo','pata','loket'],'✋'],
    [1,3,'Na které části nohy stojíme?','na chodidle',['na dlani','na lokti','na rameni'],'🦶'],[2,3,'Kolik mléčných zubů mají malé děti?','20',['32','10','5'],'🦷'],
    [3,3,'Kolik zubů má dospělý člověk?','32',['20','10','50'],'🦷'],[2,3,'Kde se tráví jídlo?','v žaludku',['v plicích','v srdci','v mozku'],'🍽️'],
    [2,3,'Čím přemýšlíme?','mozkem',['žaludkem','loktem','plícemi'],'🧠'],[2,3,'Co pohybuje našimi kostmi?','svaly',['vlasy','nehty','zuby'],'💪'],
    [2,3,'Kde máme plíce?','v hrudníku',['v hlavě','v noze','v ruce'],'🫁'],[1,3,'Co nám chrání mozek?','lebka',['koleno','loket','žaludek'],'🧠'],
  ]},
  pr_zdravi: {label:'Zdraví a bezpečí (doprava, tísňová čísla)', grade:1, icon:'🚑', old:/čistit zuby/, bank:[
    [1,3,'Jaké telefonní číslo má záchranná služba?','155',['150','158','100'],'🚑'],[1,3,'Jaké telefonní číslo mají hasiči?','150',['155','158','123'],'🚒'],
    [1,3,'Jaké telefonní číslo má policie?','158',['150','155','100'],'🚓'],[2,3,'Které číslo tísňového volání platí v celé Evropě?','112',['158','150','911'],'☎️'],
    [0,2,'Na jakou barvu semaforu smí chodec přejít?','na zelenou',['na červenou','na oranžovou','na modrou'],'🚦'],[0,2,'Co udělá chodec, když svítí červená?','stojí a čeká',['běží přes silnici','tancuje','jde pomalu přes silnici'],'🚦'],
    [1,3,'Kde nejbezpečněji přejdeme silnici?','na přechodu pro chodce',['za zatáčkou','mezi zaparkovanými auty','kde se nám líbí'],'🚸'],
    [1,3,'Kam se podíváme, než přejdeme silnici?','vlevo, vpravo a znovu vlevo',['jen nahoru','nikam','jen za sebe'],'👀'],
    [1,3,'Co si nasadíme, když jedeme na kole?','přilbu',['kšiltovku','sluchátka','nic'],'🚲'],[1,3,'Co nás na silnici zviditelní ve tmě?','reflexní prvky',['černé oblečení','sluneční brýle','deštník'],'🌙'],
    [0,2,'Kdy si myjeme ruce?','před jídlem a po záchodě',['jen v neděli','jen když je horko','nikdy'],'🧼'],
    [1,3,'Neznámý člověk tě láká do auta. Co uděláš?','odmítnu a řeknu to rodičům',['nasednu','půjdu s ním pro bonbony','nikomu nic neřeknu'],'🙅'],
    [2,3,'Kam se při bouřce venku NEschováváme?','pod osamělý strom',['do budovy','do auta','do domu'],'⛈️'],
    [0,2,'Co je zdravá svačina?','jablko',['bonbony','chipsy','limonáda'],'🍎'],[1,3,'Co je nejlepší pít, když máme žízeň?','vodu',['kolu','limonádu','sirup bez vody'],'💧'],
    [1,3,'Kde čekáme na autobus?','na zastávce',['uprostřed silnice','na přechodu','na křižovatce'],'🚌'],
    [1,3,'Proč je důležité dost spát?','tělo i mozek si odpočinou',['abychom zapomněli úkoly','aby rostly vlasy','abychom měli hlad'],'😴'],
    [2,3,'Co uděláme, když se spálíme o horký hrnec?','dáme ruku pod studenou vodu',['namažeme ji máslem','nic','dáme ji na topení'],'🚰'],
  ]},
  pr_rodina: {label:'Rodina a domov', grade:1, icon:'👨‍👩‍👧', bank:[
    [0,2,'Maminka mé maminky je moje…','babička',['teta','sestra','sestřenice'],'👵'],[0,2,'Tatínek mého tatínka je můj…','dědeček',['strýc','bratr','bratranec'],'👴'],
    [1,3,'Bratr mé maminky je můj…','strýc',['dědeček','bratranec','synovec'],'👨'],[1,3,'Sestra mého tatínka je moje…','teta',['babička','sestřenice','neteř'],'👩'],
    [1,3,'Syn mého strýce je můj…','bratranec',['bratr','synovec','dědeček'],'👦'],[1,3,'Dcera mé tety je moje…','sestřenice',['sestra','neteř','babička'],'👧'],
    [1,3,'Jak se jmenují děti stejných rodičů?','sourozenci',['bratranci','sousedé','prarodiče'],'👫'],[1,3,'Babička a dědeček se dohromady nazývají…','prarodiče',['sourozenci','vnoučata','sousedé'],'👵'],
    [1,3,'Kým jsem pro svou babičku?','vnuk nebo vnučka',['syn nebo dcera','strýc nebo teta','bratranec nebo sestřenice'],'👵'],[0,2,'Maminka a tatínek jsou moji…','rodiče',['prarodiče','sourozenci','sousedé'],'👨‍👩‍👧'],
    [3,3,'Syn mého bratra je můj…','synovec',['bratranec','strýc','vnuk'],'👦'],[0,2,'Ve které místnosti se vaří?','v kuchyni',['v ložnici','v koupelně','v předsíni'],'🍳'],
    [0,2,'Kde se doma myjeme?','v koupelně',['v kuchyni','v ložnici','na půdě'],'🛁'],[0,2,'Kde doma spíme?','v ložnici',['v koupelně','ve sklepě','v předsíni'],'🛏️'],
    [1,3,'Co patří do adresy?','ulice a číslo domu',['barva očí','oblíbené jídlo','jméno psa'],'🏠'],[1,3,'Jak můžeme doma pomáhat?','uklidit si hračky',['rozházet věci','křičet','nic'],'🧸'],
  ]},
  pr_zvirata: {label:'Zvířata a jejich mláďata', grade:0, icon:'🐾', old:/mládě|Kde žije ryba|včely|krtek|pták mláďata|králík|Co jí kráva|divoké|domácí|nohou má|savec|pták\?|Netopýr|Velryba|Žába je|Had je|sova|zimním spánkem|odlétá/, bank:[
    [0,2,'Jak se jmenuje mládě kozy?','kůzle',['sele','kuře','tele'],'🐐'],[0,2,'Jak se jmenuje mládě kachny?','káčátko',['kuře','jehně','sele'],'🦆'],
    [1,3,'Jak se jmenuje mládě husy?','house',['kuře','tele','hříbě'],'🪿'],[1,3,'Jak se jmenuje mládě medvěda?','medvídě',['kotě','štěně','hříbě'],'🐻'],
    [0,2,'Které zvíře nám dává vlnu?','ovce',['kráva','slepice','prase'],'🐑'],[0,2,'Které zvíře snáší vejce?','slepice',['kráva','koza','kůň'],'🐔'],
    [0,2,'Které zvíře nám dává nejvíc mléka?','kráva',['slepice','kachna','králík'],'🐄'],[0,2,'Kolik nohou má pták?','2',['4','6','8'],'🐦'],
    [0,2,'Kolik nohou má pes?','4',['2','6','8'],'🐕'],[1,3,'Čím je pokryté tělo ptáka?','peřím',['srstí','šupinami','bodlinami'],'🪶'],
    [1,3,'Čím je pokryté tělo ryby?','šupinami',['peřím','srstí','bodlinami'],'🐟'],[0,2,'Co má ježek na zádech?','bodliny',['peří','šupiny','krunýř'],'🦔'],
    [0,2,'Které zvíře má krunýř?','želva',['žába','kočka','sova'],'🐢'],[2,3,'Čím dýchá ryba?','žábrami',['nosem','ušima','ploutvemi'],'🐟'],
    [1,3,'Které zvíře je hmyz?','včela',['pavouk','šnek','žížala'],'🐝'],[2,3,'Čím savci krmí svá mláďata?','mlékem',['semínky','trávou','mravenci'],'🍼'],
    [1,3,'Co se líhne z žabího vajíčka?','pulec',['housenka','kuře','štěně'],'🐸'],[1,3,'Co se stane z housenky?','motýl',['včela','žížala','pavouk'],'🦋'],
    [1,3,'Které zvíře je vzhůru hlavně v noci?','sova',['slepice','kráva','veverka'],'🦉'],[1,3,'Které zvíře žije v lese?','jelen',['kráva','slepice','velbloud'],'🦌'],
    [1,3,'Které zvíře žije v moři?','delfín',['veverka','kráva','krtek'],'🐬'],[2,3,'Které zvíře žije v Africe?','žirafa',['srna','ježek','veverka'],'🦒'],
    [0,1,'Pes štěká a kočka…','mňouká',['bučí','kokrhá','bečí'],'🐱'],[0,1,'Kráva…','bučí',['mňouká','štěká','kváká'],'🐄'],
    [0,1,'Kohout…','kokrhá',['bučí','kváká','štěká'],'🐓'],[0,1,'Žába…','kváká',['štěká','bučí','kokrhá'],'🐸'],
    [0,1,'Ovce…','bečí',['kokrhá','štěká','kváká'],'🐑'],[0,2,'Kůň…','řehtá',['bučí','kváká','mňouká'],'🐴'],
  ]},
  pr_rostliny: {label:'Rostliny, stromy, ovoce a zelenina', grade:1, icon:'🌳', old:/strom|šišk|Kaštan|kaštan|žalud|bukvic|ořech|jehličí|ovoce|zelenin|rostliny|nosánk|lípa|jabloně|kůru/, bank:[
    [1,3,'Z čeho vyroste nová rostlina?','ze semínka',['z kamene','z písku','z vody'],'🌱'],[0,2,'Která z těchto věcí je zelenina?','mrkev',['jahoda','hruška','švestka'],'🥕'],
    [0,2,'Které z toho je ovoce?','hruška',['mrkev','cibule','brambora'],'🍐'],[1,3,'Z čeho se mele mouka?','z obilí',['z brambor','z jablek','ze dřeva'],'🌾'],
    [1,3,'Které z toho je obilí?','pšenice',['mrkev','jahoda','růže'],'🌾'],[0,2,'Která květina kvete žlutě a pak má bílé chmýří?','pampeliška',['růže','tulipán','sněženka'],'🌼'],
    [1,3,'Která květina kvete jako jedna z prvních na jaře?','sněženka',['slunečnice','růže','mák'],'❄️'],[0,2,'Která květina má na stonku trny?','růže',['tulipán','pampeliška','sněženka'],'🌹'],
    [1,3,'Kde rostou brambory?','v zemi',['na stromě','na keři','ve vodě'],'🥔'],[1,3,'Na kterém stromě rostou třešně?','na třešni',['na smrku','na dubu','na bříze'],'🍒'],
    [2,3,'Která část rostliny nese listy a květy?','stonek',['kořen','semínko','plod'],'🌿'],[2,3,'Která část rostliny saje vodu ze země?','kořen',['květ','list','plod'],'🌱'],
    [1,3,'Co rostlina potřebuje, aby rostla?','vodu a světlo',['tmu a sůl','jen písek','cukr a mléko'],'🪴'],[1,3,'Ze kterého stromu je jablko?','z jabloně',['z hrušně','ze smrku','z lípy'],'🍎'],
  ]},
  pr_priroda: {label:'Les, louka, pole a voda', grade:2, icon:'🌲', old:/Kde žije ryba|včely|krtek|veverka/, bank:[
    [1,3,'Kde žije kapr?','v rybníce',['v lese','na louce','v poli'],'🐟'],[1,3,'Který pták tluče zobákem do kmene stromu?','datel',['vrabec','kos','čáp'],'🐦'],
    [1,3,'Kdo staví mraveniště?','mravenci',['včely','ježci','sovy'],'🐜'],[0,2,'Kdo vyrábí med?','včely',['mouchy','mravenci','vosy'],'🍯'],
    [1,3,'Které zvíře bydlí v noře?','liška',['veverka','sova','datel'],'🦊'],[1,3,'Kde má veverka hnízdo?','na stromě',['v rybníce','pod zemí','v poli'],'🐿️'],
    [1,3,'Který pták žije u vody?','kachna',['datel','sýkora','vrabec'],'🦆'],[1,3,'Co roste v lese?','houby',['kukuřice','pšenice','vinná réva'],'🍄'],
    [1,3,'Co roste na louce?','tráva a květiny',['palmy','kaktusy','korály'],'🌼'],[1,3,'Kdo přenáší pyl z květu na květ?','včely',['ryby','krtci','žížaly'],'🐝'],
    [1,3,'Které zvíře žije na poli?','zajíc',['kapr','veverka','datel'],'🐇'],[1,3,'Které zvíře přespí celou zimu?','ježek',['zajíc','srnka','vrabec'],'🦔'],
    [1,3,'Kam odlétají vlaštovky na zimu?','do teplých krajin',['na severní pól','do sklepa','na půdu'],'🐦'],
    [1,3,'Jak pomáháme v zimě ptáčkům?','dáváme jim zrní do krmítka',['budíme je','rozbíjíme hnízda','házíme po nich sníh'],'🪺'],
    [0,2,'Co do lesa nepatří?','odpadky',['houby','stromy','mech'],'🗑️'],[2,3,'Kde žije pstruh?','v čistém potoce',['v poušti','na stromě','v hlíně'],'🐟'],
  ]},
  pr_vlast: {label:'Naše vlast – Česko', grade:2, icon:'🇨🇿', old:/Nejvyšší hora|Nejdelší řeka/, bank:[
    [1,3,'Jak se jmenuje hlavní město Česka?','Praha',['Brno','Ostrava','Plzeň'],'🏰'],[1,3,'Jak se jmenuje náš stát?','Česká republika',['Slovenská republika','Rakousko','Polsko'],'🇨🇿'],
    [3,5,'Které je druhé největší město Česka?','Brno',['Kolín','Tábor','Písek'],'🏙️'],[1,3,'Jaké barvy má česká vlajka?','bílou, červenou a modrou',['zelenou a žlutou','černou a oranžovou','růžovou a fialovou'],'🚩'],
    [2,3,'Které zvíře je na českém státním znaku?','lev',['medvěd','kůň','drak'],'🦁'],[2,3,'Jak se jmenuje česká hymna?','Kde domov můj',['Pec nám spadla','Skákal pes','Kočka leze dírou'],'🎵'],
    [2,3,'Která řeka teče Prahou?','Vltava',['Morava','Odra','Dunaj'],'🌊'],[2,3,'Se kterým státem Česko sousedí?','s Německem',['s Francií','s Itálií','se Španělskem'],'🗺️'],
    [2,3,'Se kterým státem Česko sousedí?','se Slovenskem',['s Maďarskem','s Chorvatskem','se Švédskem'],'🗺️'],[3,4,'S kolika státy Česko sousedí?','4',['2','6','8'],'🗺️'],
    [1,3,'Čím platíme v Česku?','korunami',['eury','dolary','librami'],'🪙'],[2,3,'Kdo vede obec nebo město?','starosta',['ředitel školy','pošťák','hasič'],'🏛️'],
    [2,3,'Kde sídlí prezident?','na Pražském hradě',['v Brně','na Sněžce','v Ostravě'],'🏰'],[2,3,'Kde pracuje starosta?','na radnici (obecním úřadě)',['v nemocnici','na poště','v pekárně'],'🏛️'],
  ]},
  pr_povolani: {label:'Povolání a řemesla', grade:1, icon:'🧑‍🔧', bank:[
    [0,2,'Kdo léčí nemocné lidi?','lékař',['pekař','zedník','kominík'],'🩺'],[0,2,'Kdo peče chleba a rohlíky?','pekař',['hasič','řidič','zahradník'],'🥖'],
    [0,2,'Kdo hasí požáry?','hasič',['kuchař','učitel','prodavač'],'🚒'],[0,2,'Kdo učí děti ve škole?','učitel',['zubař','kominík','zedník'],'👩‍🏫'],
    [1,3,'Kdo opravuje auta?','automechanik',['pekař','švadlena','kuchař'],'🔧'],[0,2,'Kdo prodává v obchodě?','prodavač',['pilot','hasič','zubař'],'🛒'],
    [0,2,'Kdo řídí autobus?','řidič',['kuchař','zahradník','lékař'],'🚌'],[0,2,'Kdo se stará o zuby?','zubař',['pekař','zedník','pošťák'],'🦷'],
    [1,3,'Kdo čistí komíny?','kominík',['kuchař','pilot','zubař'],'🎩'],[1,3,'Kdo staví domy ze zdí?','zedník',['zubař','pošťák','kadeřník'],'🧱'],
    [1,3,'Kdo nosí dopisy a balíky?','pošťák',['pekař','zubař','hasič'],'✉️'],[0,2,'Kdo vaří v restauraci?','kuchař',['pilot','kominík','zedník'],'👨‍🍳'],
    [1,3,'Kdo vyrábí nábytek ze dřeva?','truhlář',['zubař','pošťák','kuchař'],'🪚'],[1,3,'Kdo léčí zvířata?','veterinář',['zedník','pekař','pilot'],'🐾'],
    [1,3,'Kdo řídí letadlo?','pilot',['kuchař','kominík','zubař'],'✈️'],[1,3,'Kdo stříhá vlasy?','kadeřník',['pekař','zedník','pošťák'],'💇'],
    [1,3,'Kdo chytá zloděje?','policista',['zahradník','kuchař','pekař'],'👮'],[1,3,'Kdo pěstuje zeleninu a květiny?','zahradník',['pilot','zubař','pošťák'],'🧑‍🌾'],
  ]},
  pr_neziva: {label:'Neživá příroda, voda a vesmír', grade:3, icon:'🌍', old:/vodou v mrazu|°C|kontejner|planeta|Slunce je|Měsíc|potravního/, bank:[
    [2,4,'Na které planetě žijeme?','na Zemi',['na Marsu','na Měsíci','na Slunci'],'🌍'],[3,5,'Kolem čeho obíhá Země?','kolem Slunce',['kolem Měsíce','kolem Marsu','kolem ničeho'],'☀️'],
    [3,5,'Proč se střídá den a noc?','Země se otáčí',['Slunce zhasíná','Měsíc zakrývá Slunce','kvůli mrakům'],'🌗'],[2,4,'Kde je voda slaná?','v moři',['v rybníce','v potoce','ve studánce'],'🌊'],
    [2,4,'Co se stane s vodou, když ji vaříme?','mění se v páru',['mění se v led','zezelená','ztvrdne'],'♨️'],[2,4,'Co patří do živé přírody?','strom',['kámen','voda','vzduch'],'🌳'],
    [2,4,'Co patří do neživé přírody?','kámen',['pes','strom','houba'],'🪨'],[3,5,'Co přitáhne magnet?','železný hřebík',['dřevěnou kostku','papír','gumu'],'🧲'],
    [2,4,'Odkud padá déšť?','z mraků',['ze stromů','z kopců','z Měsíce'],'🌧️'],[3,5,'Co potřebujeme k dýchání?','vzduch',['písek','vodu','světlo'],'💨'],
  ]},
};
(function(){
  const pool=(t)=>{ const own=t.bank, keys=new Set(own.map(r=>r[2])); return own.concat((t.old?PR_BANK.filter(r=>t.old.test(r[2])&&!keys.has(r[2])):[])); };
  for(const [k,t] of Object.entries(PR_TOPICS)){
    const all=pool(t);
    CATS[k]={grade:t.grade, subj:'pr', label:t.label, gen(){
      const g=CUR_GRADE; let p=all.filter(q=>q[0]<=g && q[1]>=g); if(p.length<6) p=all.filter(q=>q[0]<=g); if(p.length<4) p=all.filter(q=>q[0]<=Math.max(g,t.grade)+1); if(!p.length) p=all;
      const q=pick(p); const opts=shuffle([q[3], ...q[4]]);
      return choice(q[2], q[2], opts.map(o=>txt(o)), opts.indexOf(q[3]), em(q[5]||t.icon,60), k+'|'+q[2]+'|'+q[3]); }};
  }
  // „mix“ ze všech témat (původní volba; mají ji uloženou stávající hrdinové)
  const seen=new Set(PR_BANK.map(r=>r[2]+'|'+r[3])); for(const t of Object.values(PR_TOPICS)) for(const r of t.bank){ const kk=r[2]+'|'+r[3]; if(!seen.has(kk)){ seen.add(kk); PR_BANK.push(r); } }
  CATS.pr_quiz.label='Prvouka – mix ze všech témat';
  SUBJ_DEFAULTS.pr={0:['pr_zvirata','pr_cas','pr_povolani'],1:['pr_cas','pr_telo','pr_zdravi','pr_rodina','pr_zvirata','pr_rostliny','pr_povolani'],
    2:['pr_cas','pr_telo','pr_zdravi','pr_rodina','pr_zvirata','pr_rostliny','pr_priroda','pr_vlast','pr_povolani'],
    3:['pr_cas','pr_telo','pr_zdravi','pr_zvirata','pr_rostliny','pr_priroda','pr_vlast','pr_neziva'],4:['pr_quiz','pr_vlast','pr_neziva'],5:['pr_quiz','pr_vlast','pr_neziva']};
})();
