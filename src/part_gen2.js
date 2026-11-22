
/* ============ Další typy příkladů ============ */
const kus = (n, one, few, many) => n===1?one:(n>=2&&n<=4?few:many);
const NUM = (easySmall, normal) => EASY ? easySmall() : normal();
Object.assign(CATS, {
  // ---- 1. třída ----
  seq1: {grade:1, label:'Číselné řady (do 20)', gen(){
    const step=pick(EASY?[1,2]:[1,2,5]), up=R()<.75, len=4;
    const start = up ? ri(0, 20-step*len) : ri(step*len, 20);
    const s=[...Array(len)].map((_,i)=>start+(up?1:-1)*step*i);
    const nxt=start+(up?1:-1)*step*len;
    return {q:`Pokračuj v řadě: ${s.join(', ')}, ?`, a:nxt, small:true};
  }},
  double1: {grade:1, label:'Dvojnásobek a polovina (do 20)', gen(){
    if(R()<.5){ const a=ri(1,EASY?5:10); return {q:`Dvakrát ${a}`, a:2*a}; }
    const a=ri(1,EASY?5:10); return {q:`Polovina z ${2*a}`, a:a};
  }},
  money1: {grade:1, label:'Počítání s mincemi (do 20 Kč)', gen(){
    const coins=[1,2,5,10]; const n=ri(2,EASY?2:3); let c=[];
    do{ c=[...Array(n)].map(()=>pick(coins)); }while(c.reduce((s,x)=>s+x,0)>20);
    return {q:`🪙 ${c.map(x=>x+' Kč').join(' + ')} = ? Kč`, a:c.reduce((s,x)=>s+x,0), small:true};
  }},
  // ---- 2.–3. třída ----
  seq2: {grade:2, label:'Číselné řady (po 2, 3, 4, 5, 10)', gen(){
    const step=pick(EASY?[2,5,10]:[2,3,4,5,10]), up=R()<.7, len=4;
    const start = up ? ri(0, 100-step*len) : ri(step*len, 100);
    const s=[...Array(len)].map((_,i)=>start+(up?1:-1)*step*i);
    return {q:`Pokračuj v řadě: ${s.join(', ')}, ?`, a:start+(up?1:-1)*step*len, small:true};
  }},
  halfdouble2: {grade:2, label:'Dvojnásobek a polovina (do 100)', gen(){
    if(R()<.5){ const a=EASY?ri(1,10)*5:ri(6,45); return {q:`Dvojnásobek čísla ${a}`, a:2*a, small:true}; }
    const a=EASY?ri(1,10)*5:ri(6,50); return {q:`Polovina z ${2*a}`, a:a, small:true};
  }},
  money2: {grade:2, label:'Peníze – placení a vracení', gen(){
    if(R()<.5){ const pay=pick(EASY?[20,50]:[20,50,100]), cost=EASY?ri(1,pay/5-1)*5:ri(5,pay-1); return {q:`Platíš ${pay} Kč, nákup stojí ${cost} Kč. Kolik ti vrátí?`, a:pay-cost, small:true}; }
    const coins=EASY?[1,2,5,10,20]:[1,2,5,10,20,50]; const c=[...Array(ri(2,3))].map(()=>pick(coins)).sort((a,b)=>b-a);
    return {q:`🪙 ${c.map(x=>x+' Kč').join(' + ')} = ? Kč`, a:c.reduce((s,x)=>s+x,0), small:true};
  }},
  diff2: {grade:2, label:'O kolik je víc / méně', gen(){
    const a=EASY?ri(12,50):ri(20,99), b=EASY?ri(a-9,a-2):ri(10,a-3);
    return R()<.5 ? {q:`O kolik je ${a} víc než ${b}?`, a:a-b, small:true} : {q:`O kolik je ${b} méně než ${a}?`, a:a-b, small:true};
  }},
  tens2: {grade:2, label:'Desítky a jednotky', gen(){
    const t=ri(1,9), u=ri(0,9), k=ri(0,2);
    if(k===0) return {q:`${t} ${kus(t,'desítka','desítky','desítek')} a ${u} ${kus(u,'jednotka','jednotky','jednotek')} = ?`, a:t*10+u, small:true};
    if(k===1) return {q:`Kolik desítek má číslo ${t*10+u}?`, a:t, small:true};
    return {q:`${t*10+u} = ${t*10} + ?`, a:u, small:true};
  }},
  // ---- 3.–5. třída ----
  seq4: {grade:4, label:'Číselné řady (větší kroky)', gen(){
    const step=pick(EASY?[6,7,8,9,25,50,100]:[6,7,8,9,25,50,100,250,125]), up=R()<.7, len=4, max=EASY?1000:10000;
    const start = up ? ri(0, Math.floor((max-step*len)/step))*step : ri(len, Math.floor(max/step))*step;
    const s=[...Array(len)].map((_,i)=>start+(up?1:-1)*step*i);
    return {q:`Pokračuj v řadě: ${s.map(fmt).join(', ')}, ?`, a:start+(up?1:-1)*step*len, small:true};
  }},
  units4: {grade:3, label:'Převody jednotek (m, cm, kg, h…)', gen(){
    const k=ri(0,6);
    if(k===0){ const a=ri(1,9); return {q:`${a} m = ? cm`, a:a*100, small:true}; }
    if(k===1){ const a=ri(1,9)*100; return {q:`${a} cm = ? m`, a:a/100, small:true}; }
    if(k===2){ const a=ri(1,9); return {q:`${a} cm = ? mm`, a:a*10, small:true}; }
    if(k===3){ const a=ri(1,EASY?5:9); return {q:`${a} kg = ? g`, a:a*1000, small:true}; }
    if(k===4){ const a=ri(1,EASY?3:5); return {q:`${a} h = ? min`, a:a*60, small:true}; }
    if(k===5){ const h=ri(1,3), m=pick([10,15,20,30,45]); return {q:`${h} h ${m} min = ? min`, a:h*60+m, small:true}; }
    const a=ri(1,EASY?5:9); return {q:`${a} km = ? m`, a:a*1000, small:true};
  }},
  money4: {grade:4, label:'Peníze – nákupy a vracení', gen(){
    if(R()<.5){ const pay=pick(EASY?[100,200]:[200,500,1000]), cost=EASY?ri(2,pay/10-1)*10:ri(pay/10,pay-5); return {q:`Platíš ${fmt(pay)} Kč, nákup stojí ${fmt(cost)} Kč. Kolik ti vrátí?`, a:pay-cost, small:true}; }
    const n=ri(2,EASY?4:6), c=EASY?ri(2,9)*5:ri(12,95); return {q:`${n} ${kus(n,'zmrzlina','zmrzliny','zmrzlin')} po ${c} Kč stojí dohromady ? Kč`, a:n*c, small:true};
  }},
});

/* ---- Slovní úlohy: velké zásobníky ---- */
const WORD1 = [
  (n,x)=>{ const a=ri(2,9), b=ri(1,9); return {q:`${n} měl${x} ${a} pastelek a dostal${x} ještě ${b}. Kolik pastelek má teď?`, a:a+b}; },
  ()=>{ const a=ri(8,18), b=ri(1,7); return {q:`Na stromě sedělo ${a} ptáčků. ${b} odletělo. Kolik ptáčků zůstalo na stromě?`, a:a-b}; },
  ()=>{ const a=ri(2,9), b=ri(1,9); return {q:`Na louce se pase ${a} kraviček a ${b} koníků. Kolik zvířat je na louce?`, a:a+b}; },
  ()=>{ const a=ri(8,15), b=ri(2,7); return {q:`Maminka upekla ${a} koláčů. Děti snědly ${b}. Kolik koláčů zbylo?`, a:a-b}; },
  ()=>{ const a=ri(3,10), b=ri(1,8); return {q:`V akváriu plave ${a} rybiček. Přikoupili jsme ještě ${b}. Kolik rybiček je v akváriu?`, a:a+b}; },
  (n,x)=>{ const a=ri(5,12), b=ri(1,8); return {q:`${n} má ${a} Kč a od babičky dostal${x} ${b} Kč. Kolik korun má teď?`, a:a+b}; },
  ()=>{ const a=ri(10,19), b=ri(2,8); return {q:`Na parkovišti stálo ${a} aut. ${b} aut odjelo. Kolik aut zůstalo?`, a:a-b}; },
  (n,x)=>{ const a=ri(3,9), b=ri(2,9); return {q:`${n} našl${x?'a':''} v lese ${a} hub a tatínek ${b}. Kolik hub našli dohromady?`, a:a+b}; },
  ()=>{ const a=ri(11,19), b=ri(1,9); return {q:`V krabici bylo ${a} vajíček. ${b} se rozbilo. Kolik vajíček zůstalo celých?`, a:a-b}; },
  ()=>{ const a=ri(2,8); return {q:`Ve třídě sedí ${a} holčiček a o 2 víc kluků. Kolik je ve třídě kluků?`, a:a+2}; },
];
const WORD2 = [
  (n,x)=>{ const a=NUM(()=>ri(5,20),()=>ri(12,40)), b=NUM(()=>ri(2,9),()=>ri(5,20)); return {q:`${n} měl${x} ${a} kuliček a dostal${x} dalších ${b}. Kolik kuliček má teď?`, a:a+b}; },
  ()=>{ const a=NUM(()=>ri(12,30),()=>ri(25,60)), b=NUM(()=>ri(2,9),()=>ri(6,20)); return {q:`V autobuse sedělo ${a} lidí. Na zastávce ${b} vystoupilo. Kolik lidí zůstalo v autobuse?`, a:a-b}; },
  ()=>{ const m=pick(EASY?[2,5]:[2,3,4,5]), n2=ri(2,EASY?5:8); return {q:`Na stole je ${n2} talířů a na každém leží ${m} ${kus(m,'jablko','jablka','jablek')}. Kolik jablek je dohromady?`, a:m*n2}; },
  ()=>{ const m=pick(EASY?[2,5]:[2,3,4,5]), n2=ri(2,EASY?5:8); return {q:`${m*n2} bonbónů rozdělíme spravedlivě mezi ${m} děti. Kolik bonbónů dostane každé dítě?`, a:n2}; },
  (n,x)=>{ const a=NUM(()=>ri(3,8)*10,()=>ri(40,99)), b=NUM(()=>ri(1,2)*10,()=>ri(12,a-10)); return {q:`Kniha má ${a} stran. ${n} už přečetl${x} ${b} stran. Kolik stran ${x?'jí':'mu'} zbývá?`, a:a-b}; },
  ()=>{ const a=NUM(()=>ri(2,9)*5,()=>ri(12,45)), b=NUM(()=>ri(1,4)*5,()=>ri(8,30)); return {q:`Rohlíky stojí ${a} Kč a mléko ${b} Kč. Kolik zaplatíme za obojí?`, a:a+b}; },
  ()=>{ const n2=ri(2,EASY?5:9); return {q:`Trojkolka má 3 kola. Kolik kol má ${n2} ${kus(n2,'trojkolka','trojkolky','trojkolek')}?`, a:3*n2}; },
  ()=>{ const n2=ri(2,EASY?5:9); return {q:`Pejsek má 4 nohy. Kolik nohou má ${n2} ${kus(n2,'pejsek','pejsci','pejsků')}?`, a:4*n2}; },
  (n,x,f)=>{ const a=ri(6,10), b=NUM(()=>ri(20,30),()=>ri(24,40)); return {q:`${n} má ${a} let. ${f?'Její':'Jeho'} táta je o ${b} let starší. Kolik let má táta?`, a:a+b}; },
  (n)=>{ const a=NUM(()=>ri(10,20),()=>ri(20,60)), b=NUM(()=>ri(a-8,a-2),()=>ri(10,a-5)); return {q:`${n} má ${a} nálepek, kamarád ${b}. O kolik nálepek má ${n} víc?`, a:a-b}; },
  ()=>{ const r=ri(2,EASY?5:9), s=pick(EASY?[2,5,10]:[3,4,5,10]); return {q:`Na zahradě je ${r} řad stromků a v každé řadě ${s} stromků. Kolik stromků je na zahradě?`, a:r*s}; },
  ()=>{ const a=NUM(()=>ri(20,40),()=>ri(30,80)), b=NUM(()=>ri(2,9),()=>ri(5,15)), c=NUM(()=>ri(2,9),()=>ri(5,15)); return {q:`Ve stáji bylo ${a} ovcí. Ráno ${b} ovcí vyšlo na pastvu a odpoledne dalších ${c}. Kolik ovcí zůstalo ve stáji?`, a:a-b-c}; },
];
const WORD4 = [
  (n,x,f)=>{ const p=ri(2,EASY?4:9), c=NUM(()=>ri(2,9)*5,()=>ri(12,25)), m=p*c+NUM(()=>ri(1,9)*5,()=>ri(5,60)); return {q:`${n} má ${m} Kč. Koupí ${p} ${kus(p,'sešit','sešity','sešitů')} po ${c} Kč. Kolik korun ${f?'jí':'mu'} zbude?`, a:m-p*c}; },
  ()=>{ const b=ri(8,15), extra=ri(3,15); return {q:`Ve třídě je ${b} lavic a v každé sedí 2 žáci. Na výlet jede ještě ${extra} žáků z jiné třídy. Kolik žáků jede na výlet?`, a:b*2+extra}; },
  ()=>{ const box=ri(3,EASY?6:8), per=ri(EASY?4:6,9), eaten=ri(2,box*per-5); return {q:`V ${box} krabicích je po ${per} kouscích čokolády. Děti snědly ${eaten} kousků. Kolik kousků zbylo?`, a:box*per-eaten}; },
  ()=>{ const km=NUM(()=>ri(2,9)*10,()=>ri(12,45)), d=ri(2,EASY?4:7); return {q:`Cyklista ujede každý den ${km} km. Kolik kilometrů ujede za ${d} ${kus(d,'den','dny','dní')}?`, a:km*d}; },
  ()=>{ const c=NUM(()=>ri(8,15)*10,()=>ri(120,190)), n2=ri(3,EASY?4:6); return {q:`Vstupenka do kina stojí ${c} Kč. Kolik zaplatí rodina za ${n2} vstupenky?`.replace(' vstupenky',n2>=5?' vstupenek':' vstupenky'), a:c*n2}; },
  ()=>{ const t=ri(3,EASY?5:9), s=ri(18,28); return {q:`Ve škole je ${t} tříd a v každé ${s} žáků. Kolik žáků chodí do školy?`, a:t*s}; },
  ()=>{ const v=pick(EASY?[50,60,80]:[45,60,75,80,90]), h=ri(2,EASY?3:5); return {q:`Vlak jede rychlostí ${v} km za hodinu. Kolik kilometrů ujede za ${h} hodiny?`.replace(' hodiny',h>=5?' hodin':' hodiny'), a:v*h}; },
  ()=>{ const a=NUM(()=>ri(10,30)*10,()=>ri(250,600)), b=NUM(()=>ri(2,8)*10,()=>ri(40,150)), c=NUM(()=>ri(2,8)*10,()=>ri(40,150)); return {q:`Obchod měl ${a} kg jablek. Dopoledne prodal ${b} kg a odpoledne ${c} kg. Kolik kilogramů jablek zbylo?`, a:a-b-c}; },
  (n)=>{ const s=pick(EASY?[5,10]:[6,8,12,15]), d=ri(4,EASY?8:12); return {q:`Kniha má ${s*d} stran. ${n} čte ${s} stran denně. Za kolik dní knihu přečte?`, a:d}; },
  ()=>{ const s=ri(EASY?3:8,EASY?9:20), k=ri(EASY?2:3,EASY?5:12); return {q:`Na farmě je ${s} slepic a ${k} krav. Kolik nohou mají všechna zvířata dohromady?`, a:2*s+4*k}; },
  (n,x,f)=>{ const a=NUM(()=>ri(3,9)*100,()=>ri(800,2500)), b=NUM(()=>ri(1,a/100-1)*100,()=>ri(200,a-100)); return {q:`Stavebnice stojí ${fmt(a)} Kč. ${n} má našetřeno ${fmt(b)} Kč. Kolik korun ${f?'jí':'mu'} ještě chybí?`, a:a-b}; },
  ()=>{ const n2=ri(3,EASY?5:8), q=NUM(()=>ri(2,9)*10,()=>ri(25,90)); return {q:`Babička rozdělila ${fmt(n2*q)} Kč spravedlivě mezi ${n2} vnoučat. Kolik korun dostalo každé?`, a:q}; },
];
function fromBank(bank){ const [n,f]=pick(NAMES); return pick(bank)(n, f?'a':'', f); }
CATS.word1.gen = ()=>fromBank(WORD1);
CATS.word2.gen = ()=>fromBank(WORD2);
CATS.word4.gen = ()=>fromBank(WORD4);
delete EASY_GEN.word2; delete EASY_GEN.word4;

Object.assign(DEFAULT_CATS, {
  1:['add10','add20nb','missing10','compare20','seq1','double1','money1','word1'],
  2:['add20','addsub100','mul2','missing','compare','seq2','halfdouble2','money2','diff2','tens2','word2'],
  3:['addsub100','mulall','missing','divext','seq2','halfdouble2','money2','diff2','units4','word2'],
  4:['mulall','rem','big','mulext','divext','order','fractions','round','seq4','units4','money4','word4'],
  5:['mulall','rem','big','mulext','divext','order','fractions','round','seq4','units4','money4','word4']});
const NEW_CATS_V2 = {1:['seq1','double1','money1'],2:['seq2','halfdouble2','money2','diff2','tens2'],3:['seq2','halfdouble2','money2','diff2','units4'],4:['seq4','units4','money4'],5:['seq4','units4','money4']};

/* ---- Paměť proti opakování ---- */
const SEEN_MAX = 400;
function qKey(pr){ return hashStr(String(pr.key||pr.q)) % 1000000007; }
function remember(p, prs){ if(!p || !p.id) return; p.seen=(p.seen||[]).concat(prs.map(qKey)); if(p.seen.length>SEEN_MAX) p.seen=p.seen.slice(-SEEN_MAX); }
