
/* ---- Čeština – další okruhy 1.–3. třídy (podle tematických plánů učebnic) ---- */
const gapQ = w => `Doplň: <b>${w.replace('_','<u>&nbsp;?&nbsp;</u>')}</b>`;
const letterOpt = o => `<span class="num0">${o}</span>`;
// 1. třída – první písmeno slova podle obrázku (slovo se jen čte nahlas, nepíše se)
const CJ_FIRST = [['auto','🚗'],['ananas','🍍'],['banán','🍌'],['balónek','🎈'],['citron','🍋'],['cibule','🧅'],['čokoláda','🍫'],['dům','🏠'],['dort','🎂'],
  ['hruška','🍐'],['jablko','🍎'],['jahoda','🍓'],['kočka','🐱'],['kolo','🚲'],['lev','🦁'],['lízátko','🍭'],['myš','🐭'],['mrkev','🥕'],['měsíc','🌙'],['nůžky','✂️'],
  ['ovce','🐑'],['pes','🐶'],['prase','🐷'],['ryba','🐟'],['raketa','🚀'],['slon','🐘'],['slunce','☀️'],['šnek','🐌'],['šála','🧣'],['traktor','🚜'],['ucho','👂'],
  ['veverka','🐿️'],['velryba','🐳'],['zebra','🦓'],['zmrzlina','🍦'],['žába','🐸'],['žirafa','🦒']];
// 1. třída – krátká, nebo dlouhá samohláska
const CJ_LONG = [['k_lo','o','ó'],['pt_k','á','a'],['m_k','á','a'],['r_ba','y','ý'],['s_r','ý','y'],['b_lý','í','i'],['m_š','y','ý'],
  ['n_s','o','ó'],['dr_k','a','á'],['ž_ba','á','a'],['tr_va','á','a'],['k_va','á','a'],['l_pa','í','i'],['m_d','e','é'],
  ['ml_ko','é','e'],['l_to','é','e'],['l_s','e','é'],['h_ra','o','ó'],['m_lo','á','a'],['s_va','o','ó'],['sl_n','o','ó'],['k_za','o','ó'],['ř_ka','e','é'],['kl_č','í','i'],['m_č','í','i'],['r_ma','ý','y']];
// velké písmeno: vlastní jména × obecná slova (vše psáno malými)
const CJ_NAMES = ['petr','eva','jana','tomáš','praha','brno','vltava','sněžka','alík','micka','ostrava','karel','lucie','ondra','labe','plzeň'];
const CJ_COMMON = ['pes','kočka','město','řeka','hora','strom','stůl','okno','kluk','holka','auto','kolo','dům','škola','kniha','míč'];
// 2. třída – druhy vět (věta je i se znaménkem, otázka je na smysl)
const CJ_SENT = [['Pes leží na dvoře.','oznamovací'],['Dnes prší.','oznamovací'],['Babička peče buchty.','oznamovací'],['Na stromě sedí kos.','oznamovací'],['Venku svítí sluníčko.','oznamovací'],
  ['Kdy přijdeš domů?','tázací'],['Máš rád jahody?','tázací'],['Kolik je hodin?','tázací'],['Kde je moje taška?','tázací'],['Půjdeš ven?','tázací'],
  ['Zavři okno!','rozkazovací'],['Pojď sem!','rozkazovací'],['Ukliď si pokoj!','rozkazovací'],['Buď potichu!','rozkazovací'],['Podej mi tužku!','rozkazovací'],
  ['Kéž by už byly prázdniny!','přací'],['Ať se ti daří!','přací'],['Kéž by zítra svítilo slunce!','přací'],['Ať jsi brzy zdravý!','přací']];
// 2. třída – dě/tě/ně, bě/pě/vě (× bje/pje/vje), mě (× mně)
const CJ_DTN = [['d_ti','ě','e'],['t_lo','ě','e'],['n_co','ě','e'],['kot_','ě','e'],['v_ž','ě','je'],['ob_d','ě','je'],['p_t','ě','je'],['v_trník','ě','je'],['v_ci','ě','je'],
  ['b_žet','ě','je'],['p_na','ě','je'],['p_kný','ě','je'],['ob_dnat','je','ě'],['v_zd','je','ě'],['m_sto','ě','ně'],['m_síc','ě','ně'],['zm_na','ě','ně'],['pam_ť','ě','ně'],['nám_stí','ě','ně'],
  ['d_da','ě','e'],['t_sto','ě','e'],['n_kdo','ě','e']];
// 2.–3. třída – ú, nebo ů
const CJ_UU = [['d_m','ů'],['_terý','ú'],['k_ň','ů'],['st_l','ů'],['_kol','ú'],['r_že','ů'],['kr_ta','ů'],['p_l','ů'],['m_j','ů'],['_l','ú'],['_směv','ú'],
  ['h_l','ů'],['l_žko','ů'],['_nor','ú'],['dom_','ů'],['v_z','ů'],['_hel','ú'],['_klid','ú'],['dv_r','ů']];
// 2. třída – slova nadřazená a podřazená
const CJ_GROUPS = [['ovoce',['jablko','hruška','švestka','banán']],['zelenina',['mrkev','cibule','okurka','paprika']],['nábytek',['stůl','židle','skříň','postel']],
  ['ptáci',['vrabec','sýkora','kos','čáp']],['oblečení',['tričko','kalhoty','sukně','svetr']],['nádobí',['hrnec','talíř','hrnek','pánev']],['nářadí',['kladivo','pila','šroubovák','kleště']],
  ['hračky',['panenka','míč','kostky','medvídek']],['květiny',['růže','tulipán','sedmikráska','pampeliška']],['stromy',['dub','buk','smrk','bříza']],
  ['dopravní prostředky',['auto','vlak','autobus','tramvaj']],['hudební nástroje',['kytara','housle','buben','flétna']]];
// 2. třída – podstatná jména a slovesa
const CJ_NOUN = ['pes','stůl','škola','kniha','jablko','auto','strom','sestra','okno','míč','kočka','město'];
const CJ_VERB = ['běží','zpívá','skáče','čte','píše','spí','maluje','plave','vaří','tancuje','kreslí','staví'];
const CJ_ADJ = ['velký','zelený','rychlý','veselý','malý','modrý','starý','hodný'];
// 3. třída – slova příbuzná [slovo, příbuzná, nepříbuzná]
const CJ_REL = [['les',['lesník','lesní','lesík'],['lev','list','pes']],['voda',['vodník','vodní','vodička'],['vosa','koza','váza']],['hrad',['hradní','hradby'],['hrách','had','hrát']],
  ['škola',['školní','školák'],['kola','skála','škoda']],['kniha',['knihovna','knížka'],['knoflík','kmín','kníže']],['ryba',['rybník','rybář'],['rýže','rýma','ruka']],
  ['sníh',['sněhulák','sněžit','sněhový'],['snít','sen','nit']],['dům',['domov','domek','domácí'],['dub','dým','kůň']],['mléko',['mlékárna','mléčný'],['mlok','mlýn','mlha']],
  ['zahrada',['zahradník','zahrádka'],['zábava','záhada','zahrát']],['pes',['psí','pejsek'],['pec','les','pás']],['hora',['horský','horolezec'],['hra','hrom','noha']]];
// 3. třída – slovesa: [neurčitek, minulý (on), přítomný (on), 1. os. j. č., 2. os. j. č., 3. os. mn. č. (nebo null)]
const CJ_VERBS = [['zpívat','zpíval','zpívá','zpívám','zpíváš','zpívají'],['skákat','skákal','skáče','skáču','skáčeš','skáčou'],['psát','psal','píše','píšu','píšeš','píšou'],
  ['číst','četl','čte','čtu','čteš','čtou'],['malovat','maloval','maluje','maluju','maluješ','malují'],['hrát','hrál','hraje','hraju','hraješ','hrají'],['běhat','běhal','běhá','běhám','běháš','běhají'],
  ['spát','spal','spí','spím','spíš',null],['plavat','plaval','plave','plavu','plaveš','plavou'],['vařit','vařil','vaří','vařím','vaříš',null],['kreslit','kreslil','kreslí','kreslím','kreslíš',null],
  ['stavět','stavěl','staví','stavím','stavíš',null],['tancovat','tancoval','tancuje','tancuju','tancuješ','tancují']];
// 3. třída – věta jednoduchá × souvětí
const CJ_VS = [['Pes štěká na kočku.','věta jednoduchá'],['Maminka peče dort.','věta jednoduchá'],['Na louce rostou květiny.','věta jednoduchá'],['Děti si hrají na hřišti.','věta jednoduchá'],
  ['Ráno jsme šli do školy.','věta jednoduchá'],['Dědeček čte noviny.','věta jednoduchá'],['Pes štěká a kočka utíká.','souvětí'],['Když prší, bereme si deštník.','souvětí'],
  ['Petr čte a Eva maluje.','souvětí'],['Šli jsme ven, ale začalo pršet.','souvětí'],['Maminka peče dort, protože má Ondra narozeniny.','souvětí'],['Vím, že zítra bude hezky.','souvětí']];
const cjFirst = w => /^ch/i.test(w) ? 'CH' : w[0].toUpperCase();
const cjAbcIdx = w => ABC.indexOf(cjFirst(w));

Object.assign(CATS, {
  cj_first: {grade:0, subj:'cj', label:'Na jaké písmeno slovo začíná (podle obrázku)', gen(){
    const w=pick(CJ_FIRST), right=cjFirst(w[0]);
    const near=ABC.filter(x=>x!==right && x!=='CH' && x!=='Q' && x!=='W' && x!=='X' && x!=='Ď' && x!=='Ť' && x!=='Ň');
    const opts=shuffle([right, ...pickN(near,3)]);
    return choice('Na jaké písmeno začíná slovo na obrázku?', `Na jaké písmeno začíná slovo ${w[0]}?`, opts.map(letterOpt), opts.indexOf(right), em(w[1],72), 'first|'+w[0]);
  }},
  cj_long: {grade:1, subj:'cj', label:'Krátká, nebo dlouhá samohláska', gen(){
    const w=pick(CJ_LONG), opts=shuffle([w[1],w[2]]);
    return choice(gapQ(w[0]), '', opts.map(letterOpt), opts.indexOf(w[1]), '', 'long|'+w[0]);
  }},
  cj_big: {grade:1, subj:'cj', label:'Velké písmeno – jména lidí, zvířat, měst a řek', gen(){
    const n=pick(CJ_NAMES), opts=shuffle([n, ...pickN(CJ_COMMON,3)]);
    return choice('Které slovo se píše s <b>velkým</b> písmenem?', 'Které slovo se píše s velkým písmenem?', opts.map(o=>txt(o)), opts.indexOf(n), '', 'big|'+n+'|'+opts.join(','));
  }},
  cj_sort: {grade:2, subj:'cj', label:'Řazení slov podle abecedy', gen(){
    let words=[]; const pool=shuffle(CJ_FIRST.map(x=>x[0]).concat(CJ_COMMON, CJ_NOUN));
    for(const w of pool){ if(words.length>=4) break; if(cjAbcIdx(w)>=0 && !words.some(x=>cjFirst(x)===cjFirst(w))) words.push(w); }
    const sorted=words.slice().sort((a,b)=>cjAbcIdx(a)-cjAbcIdx(b)), last=R()<.35, right=last?sorted[3]:sorted[0], opts=shuffle(words);
    const q=`Které slovo bude v abecedě <b>${last?'poslední':'první'}</b>?`;
    return choice(q, q.replace(/<[^>]+>/g,''), opts.map(o=>txt(o)), opts.indexOf(right), '', 'sort|'+(last?'L':'F')+'|'+sorted.join(','));
  }},
  cj_kinds: {grade:2, subj:'cj', label:'Druhy vět (oznamovací, tázací, rozkazovací, přací)', gen(){
    const s=pick(CJ_SENT), opts=['oznamovací','tázací','rozkazovací','přací'];
    return choice(`Jaká je to věta?<br><b>${s[0]}</b>`, `Jaká je to věta? ${s[0]}`, opts.map(o=>txt(o)), opts.indexOf(s[1]), '', 'kinds|'+s[0]);
  }},
  cj_dtn: {grade:2, subj:'cj', label:'dě, tě, ně, bě, pě, vě, mě', gen(){
    const w=pick(CJ_DTN), opts=shuffle([w[1],w[2]]);
    return choice(gapQ(w[0]), '', opts.map(letterOpt), opts.indexOf(w[1]), '', 'dtn|'+w[0]);
  }},
  cj_uu: {grade:2, subj:'cj', label:'ú, nebo ů', gen(){
    const w=pick(CJ_UU), opts=['ú','ů'];
    return choice(gapQ(w[0]), '', opts.map(letterOpt), opts.indexOf(w[1]), '', 'uu|'+w[0]);
  }},
  cj_group: {grade:2, subj:'cj', label:'Slova nadřazená a podřazená', gen(){
    // hračky se nemíchají s nástroji a dopravou (buben nebo auto může být i hračka)
    const clash=(a,b)=>{ const s=new Set([a,b]); return s.has('hračky') && (s.has('hudební nástroje')||s.has('dopravní prostředky')); };
    const g=pick(CJ_GROUPS), others=CJ_GROUPS.filter(x=>x!==g && !clash(x[0],g[0]));
    if(R()<.5){ const three=pickN(g[1],3), opts=shuffle([g[0], ...pickN(others,3).map(x=>x[0])]);
      return choice(`Jak se jedním slovem nazývá: <b>${three.join(', ')}</b>?`, `Jak se jedním slovem nazývá: ${three.join(', ')}?`, opts.map(o=>txt(o)), opts.indexOf(g[0]), '', 'grp1|'+g[0]+'|'+three.join(',')); }
    const three=pickN(g[1],3), odd=pick(pick(others)[1]), opts=shuffle([...three, odd]);
    return choice('Které slovo nepatří mezi ostatní?', 'Které slovo nepatří mezi ostatní?', opts.map(o=>txt(o)), opts.indexOf(odd), '', 'grp2|'+opts.join(','));
  }},
  cj_nv: {grade:2, subj:'cj', label:'Podstatná jména a slovesa', gen(){
    const verb=R()<.5;
    if(verb){ const v=pick(CJ_VERB), opts=shuffle([v, ...pickN(CJ_NOUN.concat(CJ_ADJ),3)]);
      return choice('Které slovo je <b>sloveso</b> (co kdo dělá)?', 'Které slovo je sloveso? Co kdo dělá?', opts.map(o=>txt(o)), opts.indexOf(v), '', 'nv|v|'+opts.join(',')); }
    const n=pick(CJ_NOUN), opts=shuffle([n, ...pickN(CJ_VERB.concat(CJ_ADJ),3)]);
    return choice('Které slovo je <b>podstatné jméno</b> (kdo nebo co)?', 'Které slovo je podstatné jméno? Kdo nebo co?', opts.map(o=>txt(o)), opts.indexOf(n), '', 'nv|n|'+opts.join(','));
  }},
  cj_rel: {grade:3, subj:'cj', label:'Slova příbuzná', gen(){
    const r=pick(CJ_REL), right=pick(r[1]), opts=shuffle([right, ...r[2]]);
    return choice(`Které slovo je příbuzné se slovem <b>${r[0]}</b>?`, `Které slovo je příbuzné se slovem ${r[0]}?`, opts.map(o=>txt(o)), opts.indexOf(right), '', 'rel|'+r[0]+'|'+right);
  }},
  cj_verb: {grade:3, subj:'cj', label:'Slovesa – osoba, číslo a čas', gen(){
    const v=pick(CJ_VERBS), k=R();
    if(k<.4){ const forms=[[v[1],'minulý'],[v[2],'přítomný'],['bude '+v[0],'budoucí']], f=pick(forms), opts=['minulý','přítomný','budoucí'];
      return choice(`V jakém čase je sloveso <b>${f[0]}</b>?`, `V jakém čase je sloveso ${f[0]}?`, opts.map(o=>txt(o)), opts.indexOf(f[1]), '', 'vt|'+f[0]); }
    if(k<.75){ const forms=[[v[3],'1. osoba'],[v[4],'2. osoba'],[v[2],'3. osoba']], f=pick(forms), opts=['1. osoba','2. osoba','3. osoba'];
      return choice(`V jaké osobě je sloveso <b>${f[0]}</b>?`, `V jaké osobě je sloveso ${f[0]}?`, opts.map(o=>txt(o)), opts.indexOf(f[1]), '', 'vo|'+f[0]); }
    const vv=v[5]?v:pick(CJ_VERBS.filter(x=>x[5])), pl=R()<.5, f=pl?vv[5]:vv[2], opts=['jednotné','množné'];
    return choice(`V jakém čísle je sloveso <b>${f}</b>?`, `V jakém čísle je sloveso ${f}?`, opts.map(o=>txt(o)), pl?1:0, '', 'vc|'+f);
  }},
  cj_vs: {grade:3, subj:'cj', label:'Věta jednoduchá a souvětí', gen(){
    const s=pick(CJ_VS), opts=['věta jednoduchá','souvětí'];
    return choice(`Je to věta jednoduchá, nebo souvětí?<br><b>${s[0]}</b>`, `Je to věta jednoduchá, nebo souvětí? ${s[0]}`, opts.map(o=>txt(o)), opts.indexOf(s[1]), '', 'vs|'+s[0]);
  }},
});
SUBJ_DEFAULTS.cj = {0:['cj_opp','cj_first'], 1:['cj_abc','cj_opp','cj_first','cj_long','cj_big'],
  2:['cj_abc','cj_opp','cj_iy','cj_end','cj_sort','cj_kinds','cj_dtn','cj_uu','cj_group','cj_nv','cj_big'],
  3:['cj_iy','cj_vyj','cj_end','cj_pos','cj_gen','cj_rel','cj_verb','cj_vs','cj_uu','cj_dtn'],
  4:['cj_vyj','cj_end','cj_pos','cj_gen','cj_rel','cj_verb','cj_vs'], 5:['cj_vyj','cj_end','cj_pos','cj_gen','cj_rel','cj_verb','cj_vs']};
Object.assign(HALF1_SKIP, {1:HALF1_SKIP[1].concat(['cj_long','cj_big']), 2:HALF1_SKIP[2].concat(['cj_nv','cj_big','cj_uu']), 3:HALF1_SKIP[3].concat(['cj_verb','cj_vs'])});
