
/* ============ Nevím – vysvětli mi to (výukové vysvětlení k úloze) ============ */
// explainProb(pr) vrací {html, say} nebo null (u otázek, kde se nedá nic vysvětlit – ptáci, slovíčka, prvouka…)
const XP = {
  plain(q){ return String(q||'').replace(/<u>.*?<\/u>/g,' ? ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim(); },
  num(s){ return +String(s).replace(/\s/g,''); },
  nums(t){ return (String(t).match(/\d{1,3}(?: \d{3})+|\d+/g)||[]).map(XP.num); },
  toks(t){ return (String(t).match(/\d{1,3}(?: \d{3})+|\d+|[+−·:=?()◯<>-]/g)||[]).map(x=>/\d/.test(x)?XP.num(x):x); },
  b(x){ return `<b>${typeof x==='number'?fmt(x):x}</b>`; },
  run(start, step, n){ const r=[]; for(let i=1;i<=n;i++) r.push(fmt(start+step*i)); return r.join(', '); },
  mult(step, upto){ const r=[]; for(let v=step; v<=upto; v+=step) r.push(fmt(v)); return r.join(', '); },
};
const XPW = {
  10:['desítka','desítky','desítek'], 100:['stovka','stovky','stovek'], 1000:['tisíc','tisíce','tisíc'],
};
const XPA = {10:['desítku','desítky','desítek'], 100:['stovku','stovky','stovek'], 1000:['tisíc','tisíce','tisíc']};
const xpKrok = n => `${n} ${kus(n,'krok','kroky','kroků')}`;
function xpUnit(n){ for(const u of [1000,100,10]) if(n%u===0) return u; return 1; }
function xpParts(n){ const r=[]; for(const u of [1000,100,10,1]){ const d=Math.floor(n/u)%10*u; if(u===1000) { const t=Math.floor(n/1000)*1000; if(t) r.push(t); } else if(d) r.push(d); } return r; }

/* ---- sčítání ---- */
function xpPlus(a,b){
  const s=a+b, B=XP.b;
  if(a<10 && b>=10) return `Je to stejné jako ${fmt(b)} + ${a}. ` + xpPlus(b,a);
  if(s<=10){ const x=Math.max(a,b), y=Math.min(a,b);
    return `${a<b?`${a} + ${b} je stejné jako ${b} + ${a}. `:''}Začni u čísla ${B(x)} a přidej ${y}: ${x} → ${XP.run(x,1,y)}. Výsledek je ${B(s)}.`; }
  if(a<10 && b<10){ const d=10-a;
    return `Nejdřív doplň do desítky: ${a} + ${d} = 10.<br>Z čísla ${b} zbývá ještě ${b} − ${d} = ${b-d}.<br>10 + ${b-d} = ${B(s)}.`; }
  if(b<10){ const u=a%10;
    if(u===0) return `${fmt(a)} končí nulou, takže jednotky jen dopíšeš: ${fmt(a)} + ${b} = ${B(s)}.`;
    if(u+b<10) return `${fmt(a)} = ${fmt(a-u)} + ${u}. Sečti jednotky: ${u} + ${b} = ${u+b}.<br>${fmt(a-u)} + ${u+b} = ${B(s)}.`;
    const d=10-u; return `Doplň do nejbližší desítky: ${fmt(a)} + ${d} = ${fmt(a+d)}.<br>Z čísla ${b} zbývá ještě ${b} − ${d} = ${b-d}.<br>${fmt(a+d)} + ${b-d} = ${B(s)}.`; }
  const parts=xpParts(b);
  if(parts.length===1){ const u=xpUnit(b), k=b/u, W=XPW[u];
    if(W && a%u===0){ const A=a/u; return `Počítej v celých ${u===10?'desítkách':u===100?'stovkách':'tisících'}: ${A} ${kus(A,...W)} + ${k} ${kus(k,...W)} = ${A+k} ${kus(A+k,...W)}, to je ${B(s)}.`; }
    if(W && k<=9) return `Přičítáš ${k} ${kus(k,...XPA[u])}. Počítej po ${fmt(u)}: ${fmt(a)} → ${XP.run(a,u,k)}. Výsledek je ${B(s)}.`; }
  let cur=a; const st=parts.map(p=>{ const l=`${fmt(cur)} + ${fmt(p)} = ${fmt(cur+p)}`; cur+=p; return l; });
  return `Přičti číslo ${fmt(b)} po kouskách – ${fmt(b)} = ${parts.map(fmt).join(' + ')}:<br>${st.join('<br>')}<br>Výsledek je ${B(s)}.`;
}
/* ---- odčítání ---- */
function xpMinus(a,b){
  const r=a-b, B=XP.b;
  if(a<=10) return `Začni u čísla ${B(a)} a udělej ${xpKrok(b)} pozpátku: ${a} → ${XP.run(a,-1,b)}. Zbude ${B(r)}.`;
  if(b<10){ const u=a%10;
    if(b<=u) return `${fmt(a)} = ${fmt(a-u)} + ${u}. Odečti od jednotek: ${u} − ${b} = ${u-b}.<br>${fmt(a-u)} + ${u-b} = ${B(r)}.`;
    if(u===0){ const T=a-10; return `${fmt(a)} = ${fmt(T)} + 10. Odečti od desítky: 10 − ${b} = ${10-b}.<br>${fmt(T)} + ${10-b} = ${B(r)}.`; }
    return `Nejdřív odečti jen do desítky: ${fmt(a)} − ${u} = ${fmt(a-u)}.<br>Z čísla ${b} zbývá odečíst ještě ${b} − ${u} = ${b-u}.<br>${fmt(a-u)} − ${b-u} = ${B(r)}.`; }
  const parts=xpParts(b);
  if(parts.length===1){ const u=xpUnit(b), k=b/u, W=XPW[u];
    if(W && a%u===0){ const A=a/u; return `Počítej v celých ${u===10?'desítkách':u===100?'stovkách':'tisících'}: ${A} ${kus(A,...W)} − ${k} ${kus(k,...W)} = ${A-k} ${kus(A-k,...W)}, to je ${B(r)}.`; }
    if(W && k<=9) return `Odečítáš ${k} ${kus(k,...XPA[u])}. Počítej pozpátku po ${fmt(u)}: ${fmt(a)} → ${XP.run(a,-u,k)}. Zbude ${B(r)}.`; }
  let cur=a; const st=parts.map(p=>{ const l=`${fmt(cur)} − ${fmt(p)} = ${fmt(cur-p)}`; cur-=p; return l; });
  return `Odečti číslo ${fmt(b)} po kouskách – ${fmt(b)} = ${parts.map(fmt).join(' + ')}:<br>${st.join('<br>')}<br>Zbude ${B(r)}.`;
}
/* ---- násobení ---- */
function xpMul(a,b){
  const p=a*b, B=XP.b;
  if(a===1||b===1) return `Když něco vezmeš jen jednou, zůstane to stejné: ${a} · ${b} = ${B(p)}.`;
  if(a===10||b===10){ const o=a===10?b:a; return `Násobit deseti je snadné – k číslu ${o} připíšeš nulu: ${B(p)}.`; }
  const ua=xpUnit(a), ub=xpUnit(b);
  if(a>10 && ua>1 && a/ua<10){ const k=a/ua, W=XPW[ua]; return `${fmt(a)} = ${k} ${kus(k,...W)}. Spočítej ${k} · ${b} = ${k*b}.<br>${k*b} ${kus(k*b,...W)} = ${B(p)}.`; }
  if(b>10 && ub>1 && b/ub<10) return xpMul(b,a);
  if(a>10 && b<10){ const t=a-a%10, u=a%10; return `Rozlož si ${a} = ${t} + ${u}.<br>${t} · ${b} = ${t*b} a ${u} · ${b} = ${u*b}.<br>Sečti: ${t*b} + ${u*b} = ${B(p)}.`; }
  if(b>10 && a<10) return xpMul(b,a);
  const big=Math.max(a,b), sm=Math.min(a,b);
  return `${a} · ${b} znamená ${sm}krát sečíst číslo ${big}.<br>Počítej po ${big}: ${XP.mult(big,p)}.<br>Výsledek je ${B(p)}.`;
}
/* ---- dělení ---- */
function xpDiv(c,d){
  const q=c/d, B=XP.b;
  if(q<=10 && d<=10) return `${c} : ${d} – kolikrát se ${d} vejde do ${c}?<br>Počítej po ${d}: ${XP.mult(d,c)} – to je ${q}×.<br>Výsledek je ${B(q)}. Zkouška: ${q} · ${d} = ${c}.`;
  if(c%10===0 && (c/10)%d===0){ const k=c/10; return `${fmt(c)} = ${k} ${kus(k,...XPW[10])}. Spočítej ${k} : ${d} = ${k/d}.<br>${k/d} ${kus(k/d,...XPW[10])} = ${B(q)}.`; }
  const T=d*10*Math.floor(q/10), Rr=c-T;
  return `Rozlož si ${c} = ${T} + ${Rr} (obě části jdou dělit ${d}).<br>${T} : ${d} = ${T/d} a ${Rr} : ${d} = ${Rr/d}.<br>Sečti: ${T/d} + ${Rr/d} = ${B(q)}.`;
}
function xpOp(a,op,b){ return op==='+'?xpPlus(a,b):op==='−'||op==='-'?xpMinus(a,b):op==='·'?xpMul(a,b):op===':'?xpDiv(a,b):null; }
function xpCalc(a,op,b){ return op==='+'?a+b:op==='−'||op==='-'?a-b:op==='·'?a*b:a/b; }

/* ---- pořadí výkonů: postupné zjednodušování ---- */
function xpOrder(tk){
  const steps=[]; let t=tk.slice(), g=0;
  const step=(arr,i)=>{ const v=xpCalc(arr[i-1],arr[i],arr[i+1]); steps.push(`${fmt(arr[i-1])} ${arr[i]} ${fmt(arr[i+1])} = ${fmt(v)}`); arr.splice(i-1,3,v); };
  while(t.length>1 && g++<20){
    const o=t.lastIndexOf('(');
    if(o>=0){ const c=t.indexOf(')',o), inner=t.slice(o+1,c);
      while(inner.length>1){ let i=inner.findIndex(x=>x==='·'||x===':'); if(i<0) i=1; step(inner,i); }
      t.splice(o,c-o+1,inner[0]); steps[steps.length-1]+=' (závorka)'; continue; }
    let i=t.findIndex(x=>x==='·'||x===':'); if(i<0) i=1; step(t,i);
  }
  return `Pravidlo: nejdřív počítáme, co je v závorce, pak násobíme a dělíme, a nakonec sčítáme a odčítáme.<br>${steps.map((s,i)=>`${i+1}. ${s}`).join('<br>')}<br>Výsledek je ${XP.b(t[0])}.`;
}

/* ---- slovní úlohy: poznání úlohy podle textu ---- */
const XP_WORD = [
  [/dostal[a]? (?:ještě|další|dalších)|od babičky dostal|Přikoupili|a tatínek|Kolik zvířat je|za obojí/, n=>`Něco <b>přibylo</b> nebo dáváme dohromady → <b>sčítáme</b>.<br>${fmt(n[0])} + ${fmt(n[1])} = ${XP.b(n[0]+n[1])}`],
  [/Ráno .* odpoledne|Dopoledne prodal .* odpoledne/, n=>`Ubylo dvakrát → odečteme obě čísla, jedno po druhém.<br>${fmt(n[0])} − ${fmt(n[1])} = ${fmt(n[0]-n[1])}<br>${fmt(n[0]-n[1])} − ${fmt(n[2])} = ${XP.b(n[0]-n[1]-n[2])}`],
  [/[Oo]dletěl|snědly \d+\. Kolik koláčů|Odjel|vystoupil|[Rr]ozbil|zbývá\?|zůstalo v autobuse/, n=>{ const b=n[1]===undefined?1:n[1]; return `Něco <b>ubylo</b> (odešlo, zmizelo) → <b>odčítáme</b>.<br>${fmt(n[0])} − ${fmt(b)} = ${XP.b(n[0]-b)}`; }],
  [/Kluků je o 2 víc/, n=>`„O 2 víc“ → k počtu holčiček <b>přičteme 2</b>.<br>${n[0]} + 2 = ${XP.b(n[0]+2)}`],
  [/o \d+ let starší/, n=>`Táta je „o ${n[1]} let starší“ → má o ${n[1]} let <b>víc</b> → sčítáme.<br>${n[0]} + ${n[1]} = ${XP.b(n[0]+n[1])}`],
  [/O kolik nálepek/, n=>`„O kolik víc?“ zjistíme <b>odčítáním</b> – od většího odečteme menší.<br>${n[0]} − ${n[1]} = ${XP.b(n[0]-n[1])}`],
  [/ještě chybí/, n=>`Kolik chybí? Od ceny odečteme to, co už je našetřené.<br>${fmt(n[0])} − ${fmt(n[1])} = ${XP.b(n[0]-n[1])}`],
  [/spravedlivě mezi/, n=>`Rozdělit spravedlivě = každý dostane stejně → <b>dělíme</b>.<br>${fmt(n[0])} : ${n[1]} = ${XP.b(n[0]/n[1])}<br>Zkouška: ${n[1]} · ${fmt(n[0]/n[1])} = ${fmt(n[0])}`],
  [/Za kolik dní knihu přečte/, n=>`Každý den ${n[1]} stran → zjišťujeme, kolikrát se ${n[1]} vejde do ${n[0]} → <b>dělíme</b>.<br>${n[0]} : ${n[1]} = ${XP.b(n[0]/n[1])}`],
  [/Koupí \d+ sešit/, n=>`Dva kroky:<br>1. Kolik stojí sešity: ${n[1]} · ${n[2]} = ${n[1]*n[2]} Kč.<br>2. Kolik zbude: ${n[0]} − ${n[1]*n[2]} = ${XP.b(n[0]-n[1]*n[2])} Kč.`],
  [/lavic a v každé sedí 2/, n=>`Dva kroky:<br>1. Žáci ze třídy: ${n[0]} lavic po 2 → ${n[0]} · 2 = ${n[0]*2}.<br>2. Přidáme žáky z jiné třídy: ${n[0]*2} + ${n[2]} = ${XP.b(n[0]*2+n[2])}.`],
  [/krabicích je po \d+ kouscích/, n=>n[2]===undefined ? `${n[0]} krabic, v každé ${n[1]} kousků → <b>násobíme</b>: ${n[0]} · ${n[1]} = ${XP.b(n[0]*n[1])}` :
     `Dva kroky:<br>1. Kolik kousků bylo: ${n[0]} · ${n[1]} = ${n[0]*n[1]}.<br>2. Kolik zbylo: ${n[0]*n[1]} − ${n[2]} = ${XP.b(n[0]*n[1]-n[2])}.`],
  [/chovají .* nohou/, n=>`Slepice má 2 nohy, kráva 4.<br>Slepice: ${n[0]} · 2 = ${n[0]*2}<br>Krávy: ${n[1]} · 4 = ${n[1]*4}<br>Dohromady: ${n[0]*2} + ${n[1]*4} = ${XP.b(n[0]*2+n[1]*4)}`],
  [/na každém .* jabl|v každé řadě|v každé je \d+ žáků|Trojkolka má 3|Pejsek má 4|ujede každý den|rychlostí|Vstupenka|po \d+ Kč stojí|krabičky a v každé/, n=>{
     const sw=/ujede každý den|rychlostí|Vstupenka|Trojkolka|Pejsek/.test(XP._pl||''), a=sw?n[1]:n[0], b=sw?n[0]:n[1]; return `Stejný počet se opakuje několikrát → <b>násobíme</b>.<br>${fmt(a)} · ${fmt(b)} = ${XP.b(a*b)}${a<=5&&b<=50?`<br>(${Array(a).fill(fmt(b)).join(' + ')} = ${fmt(a*b)})`:''}`; }],
];

/* ---- čeština: data k vysvětlení ---- */
const XP_VYJ = {
  'b_dlet':'Bydlet je vyjmenované slovo po B.', 'l_st':'List není vyjmenované slovo po L, proto píšeme měkké i.', 'm_š':'Myš je vyjmenované slovo po M.',
  'p_vo':'Pivo není vyjmenované slovo po P, proto píšeme měkké i.', 's_n':'Syn je vyjmenované slovo po S.', 'v_dra':'Vydra je vyjmenované slovo po V.',
  'z_ma':'Zima není vyjmenované slovo po Z (po Z jsou jen brzy, jazyk, nazývat se a Ruzyně), proto píšeme měkké i.', 'jaz_k':'Jazyk je vyjmenované slovo po Z.',
  'm_lý':'Milý (mít někoho rád) není vyjmenované slovo – nepleť si ho s „mýlit se“ (splést se). Proto píšeme měkké i.', 'p_tel':'Pytel je vyjmenované slovo po P.',
  's_lný':'Silný (od slova síla) není vyjmenované slovo po S, proto píšeme měkké i.', 'v_dět':'Vidět (vidím očima) není vyjmenované slovo po V, proto píšeme měkké i.',
  'pl_š':'Plyš je vyjmenované slovo po L.', 'l_ška':'Liška není vyjmenované slovo po L, proto píšeme měkké i.', 'p_tlík':'Pytlík je příbuzné slovo k vyjmenovanému slovu pytel, proto y.',
  'b_cykl':'Bicykl není vyjmenované slovo po B, proto píšeme měkké i.', 'ob_čej':'Obyčej je vyjmenované slovo po B.', 's_rový':'Syrový (nevařený) je vyjmenované slovo po S.',
  'm_slet':'Myslet je vyjmenované slovo po M.', 'f_alka':'Po F nemáme žádná vyjmenovaná slova, proto píšeme měkké i.', 'hm_z':'Hmyz je vyjmenované slovo po M.',
  'l_že':'Lyže je vyjmenované slovo po L.', 'm_nce':'Mince není vyjmenované slovo po M, proto píšeme měkké i.', 'kob_la':'Kobyla je vyjmenované slovo po B.',
  'v_soký':'Vysoký je vyjmenované slovo po V.', 'b_tva':'Bitva je od slova bít (tlouct), ne od být. Není to vyjmenované slovo, proto píšeme měkké i.',
  'zv_k':'Zvyk je příbuzné slovo k vyjmenovanému slovu zvykat, proto y.', 'p_kat':'Pykat je vyjmenované slovo po P.',
};
const XP_END = {'hra_':'hrady','plo_':'ploty','le_|d':'ledu','du_':'duby','zu_':'zuby','vů_':'vozy','nů_':'nože','le_|v':'lvi','mrá_':'mrazy','chlé_':'chleba','sní_':'sněhu',
  'ha_':'hadi','klu_':'kluci','ko_':'kosi','ry_':'ryby','hla_':'hladu','kabá_':'kabáty','no_':'nosy'};
const XP_UU_ALT = {'d_m':'domy','k_ň':'koně','st_l':'stoly','p_l':'polovina','m_j':'moje','h_l':'hole','l_žko':'lože','v_z':'vozy','dv_r':'dvora'};
const XP_BIG = {petr:'jméno člověka',eva:'jméno člověka',jana:'jméno člověka','tomáš':'jméno člověka',karel:'jméno člověka',lucie:'jméno člověka',ondra:'jméno člověka',
  praha:'jméno města',brno:'jméno města',ostrava:'jméno města','plzeň':'jméno města',vltava:'jméno řeky',labe:'jméno řeky','sněžka':'jméno hory','alík':'jméno psa',micka:'jméno kočky'};
const XP_SYL = {'ko-lo':'ko-lo','má-ma':'má-ma','au-to':'au-to','pes':'pes','vlak':'vlak','hra':'hra','ban-án':'ba-nán','jab-lko':'ja-blko','ko-čka':'ko-čka','slun-ce':'slun-ce',
  'mo-týl':'mo-týl','zmrz-li-na':'zmrz-li-na','au-to-bus':'au-to-bus','te-le-vi-ze':'te-le-vi-ze','čo-ko-lá-da':'čo-ko-lá-da','pa-pou-šek':'pa-pou-šek','ko-lo-běž-ka':'ko-lo-běž-ka',
  'be-ru-ška':'be-ru-ška','ok-no':'ok-no','dům':'dům'};
const XP_KIND = {oznamovací:'něco nám oznamuje (sděluje) a končí tečkou.', tázací:'na něco se ptá a končí otazníkem.',
  rozkazovací:'někomu něco přikazuje nebo ho o něco žádá a končí vykřičníkem.', přací:'vyjadřuje přání (často začíná slovem „kéž“ nebo „ať“) a končí vykřičníkem.'};
const XP_TO = {mužský:'ten', ženský:'ta', střední:'to'};
const XP_VS = {'Pes štěká na kočku.':['štěká'],'Maminka peče dort.':['peče'],'Na louce rostou květiny.':['rostou'],'Děti si hrají na hřišti.':['hrají'],
  'Ráno jsme šli do školy.':['jsme šli'],'Dědeček čte noviny.':['čte'],'Pes štěká a kočka utíká.':['štěká','utíká'],'Když prší, bereme si deštník.':['prší','bereme'],
  'Petr čte a Eva maluje.':['čte','maluje'],'Šli jsme ven, ale začalo pršet.':['šli jsme','začalo pršet'],'Maminka peče dort, protože má Ondra narozeniny.':['peče','má'],'Vím, že zítra bude hezky.':['vím','bude']};
const XP_POS = {
  'podstatné jméno':w=>`Zeptej se: kdo? co? – ${w}. Je to název věci, zvířete nebo člověka → podstatné jméno.`,
  'přídavné jméno':w=>`Zeptej se: jaký? – ${w}. Říká, jaká věc je → přídavné jméno.`,
  'sloveso':w=>`Zeptej se: co dělá? – ${w}. Říká, co kdo dělá → sloveso.`,
  'číslovka':w=>`Zeptej se: kolik? kolikátý? – ${w}. Vyjadřuje počet nebo pořadí → číslovka.`,
  'zájmeno':w=>`Slovo ${w} stojí místo jména (místo „Petr“ řekneme „on“) → zájmeno.`,
  'předložka':w=>`Slovo ${w} stojí před podstatným jménem (${w==='na'?'na stole':'pod stolem'}) → předložka.`,
  'spojka':w=>`Slovo ${w} spojuje slova nebo věty (${w==='a'?'pes a kočka':'chtěl jsem, ale nešlo to'}) → spojka.`,
  'příslovce':w=>`Zeptej se: jak? kdy? kde? – ${w} (${w==='dnes'?'kdy?':'jak?'}) → příslovce.`,
  'citoslovce':w=>`Slovo ${w} vyjadřuje pocit nebo zvuk (jé, haf, bum) → citoslovce.`,
  'částice':w=>`Slovo ${w} uvozuje přání („Kéž by už byly prázdniny!“) → částice.`,
};

function xpOpt(pr){ return pr.options ? XP.plain(pr.options[pr.a]) : ''; }
function xpKey(pr){ return String(pr.key||'').split('|'); }
function xpGap(pr){ const m=String(pr.q).match(/<b>(.*?)<\/b>/); return m ? m[1].replace(/<u>.*?<\/u>/,'_') : ''; }

const XP_CAT = {
  /* ---------- matematika ---------- */
  arith(pr){ const t=XP.toks(XP.plain(pr.q)); if(t.length===3 && typeof t[0]==='number' && typeof t[2]==='number') return xpOp(t[0],t[1],t[2]); return null; },
  missing(pr){ const t=XP.toks(XP.plain(pr.q)).filter(x=>x!=='-'), B=XP.b; const e=t.indexOf('='); if(e!==3) return null;
    const [x,op,y]=t, c=t[4], small=pr.cat==='missing10';
    if(x==='?' && op==='+'){ const r=c-y; return `Hledáme číslo, ke kterému když přičteme ${y}, dostaneme ${c}.<br>${small&&r<=9?`Počítej od ${y} dál až k ${c}: ${XP.run(y,1,r)} – to je ${xpKrok(r)}.<br>`:''}Spočítáš to i odčítáním: ${c} − ${y} = ${B(r)}.<br>Zkouška: ${r} + ${y} = ${c}.`; }
    if(y==='?' && op==='+'){ const r=c-x; return `Kolik musíme přidat k ${x}, abychom měli ${c}?<br>${small&&r<=9?`Počítej od ${x} dál až k ${c}: ${XP.run(x,1,r)} – to je ${xpKrok(r)}.<br>`:''}Spočítáš to i odčítáním: ${c} − ${x} = ${B(r)}.<br>Zkouška: ${x} + ${r} = ${c}.`; }
    if(y==='?' && op==='−'){ const r=x-c; return `Od ${x} jsme něco odebrali a zbylo ${c}. Kolik jsme odebrali?<br>${x} − ${c} = ${B(r)}.<br>Zkouška: ${x} − ${r} = ${c}.`; }
    if(x==='?' && op==='−'){ const r=c+y; return `Od neznámého čísla jsme odebrali ${y} a zbylo ${c}. Původně tedy bylo ${c} + ${y} = ${B(r)}.`; }
    return null; },
  compare(pr){ const pl=XP.plain(pr.q); const [L,Rt]=pl.split('◯'); if(Rt===undefined) return null;
    const ev=s=>{ const t=XP.toks(s); return t.length===3 ? {v:xpCalc(t[0],t[1],t[2]), s:`${fmt(t[0])} ${t[1]} ${fmt(t[2])} = ${fmt(xpCalc(t[0],t[1],t[2]))}`} : {v:t[0], s:''}; };
    const l=ev(L), r=ev(Rt), sign=l.v<r.v?'&lt;':l.v>r.v?'&gt;':'=';
    return `${l.s?'Nejdřív spočítej levou stranu: '+l.s+'.<br>':''}${r.s?'Pravou stranu: '+r.s+'.<br>':''}${l.v===r.v?`Obě strany jsou stejné (${fmt(l.v)}) → ${XP.b('=')}.`:
      `${fmt(l.v)} je ${l.v<r.v?'menší':'větší'} než ${fmt(r.v)} → ${fmt(l.v)} ${XP.b(sign)} ${fmt(r.v)}.<br>Znaménko se otvírá vždycky k většímu číslu – jako pusa, která chce sníst víc.`}`; },
  order(pr){ const t=XP.toks(XP.plain(pr.q)).filter(x=>x!=='-'); return t.length>=5 ? xpOrder(t) : null; },
  rem(pr){ const t=XP.toks(XP.plain(pr.q)); if(t.length!==3) return null; const c=t[0], d=t[2], q=Math.floor(c/d), r=c%d;
    return `Hledáme, kolikrát se ${d} vejde do ${c}.<br>Počítej po ${d}: ${XP.mult(d,c)}${(q+1)*d>c?' – další by už bylo '+((q+1)*d)+', to je víc než '+c:''}.<br>Nejblíž pod ${c} je ${q*d}, to je ${q} · ${d}.<br>Do ${c} chybí ještě ${c} − ${q*d} = ${r}. To je <b>zbytek</b> (musí být menší než ${d}).<br>Výsledek: ${XP.b(q+' zbytek '+r)}.`; },
  fractions(pr){ const m=String(pr.q).match(/<span>(\d+)<\/span><span>(\d+)<\/span><\/span>\s*z\s*(\d+)/); if(!m) return null;
    const n=+m[1], d=+m[2], tot=+m[3], part=tot/d;
    return `${frac(n,d)} z ${tot}: rozděl ${tot} na ${d} stejné díly – jeden díl je ${tot} : ${d} = ${part}.${n>1?`<br>Vezmeme ${n} ${kus(n,'díl','díly','dílů')}: ${n} · ${part} = ${XP.b(n*part)}.`:`<br>Jeden díl je ${XP.b(part)}.`}`; },
  round(pr){ const pl=XP.plain(pr.q), n=XP.nums(pl)[0], t=/tisíce/.test(pl)?1000:/stovky/.test(pl)?100:10;
    const place={10:'jednotek',100:'desítek',1000:'stovek'}[t], dg=Math.floor(n/(t/10))%10, down=Math.floor(n/t)*t, up=down+t, nm={10:'desítky',100:'stovky',1000:'tisíce'}[t];
    return `Číslo ${fmt(n)} leží mezi ${fmt(down)} a ${fmt(up)}.<br>Při zaokrouhlování na ${nm} rozhoduje číslice na místě ${place}: je to ${XP.b(dg)}.<br>${dg<5?'0, 1, 2, 3, 4 → zaokrouhlujeme dolů':'5, 6, 7, 8, 9 → zaokrouhlujeme nahoru'}: ${fmt(n)} → ${XP.b(dg<5?down:up)}.`; },
  seq(pr){ const s=XP.nums(XP.plain(pr.q).replace(/^.*?:/,'')); if(s.length<3) return null; const d=s[1]-s[0], up=d>0, k=Math.abs(d);
    const chain=s.map(fmt).join(` <span class="xpstep">${up?'+':'−'}${k}</span> `);
    return `Podívej se, jak se čísla mění: ${chain}<br>Každé další číslo je o ${k} ${up?'větší':'menší'}.<br>Proto další bude ${fmt(s[s.length-1])} ${up?'+':'−'} ${k} = ${XP.b(s[s.length-1]+d)}.`; },
  dbl(pr){ const pl=XP.plain(pr.q), n=XP.nums(pl)[0];
    if(/Polovina/.test(pl)){ const h=n/2, A=Math.floor(n/20)*20, Bq=n-A;
      return `Polovina = rozdělíme číslo na dvě stejné části.<br>${n>=20&&A&&Bq?`Rozlož si ${n} = ${A} + ${Bq}. Polovina z ${A} je ${A/2}, polovina z ${Bq} je ${Bq/2}. ${A/2} + ${Bq/2} = ${h}.<br>`:''}Polovina z ${n} je ${XP.b(h)}, protože ${h} + ${h} = ${n}.`; }
    const t=n-n%10, u=n%10;
    return `Dvojnásobek = dvakrát totéž číslo: ${n} + ${n} = ${XP.b(2*n)}.${n>10&&u&&t?`<br>(Desítky: ${t} + ${t} = ${2*t}, jednotky: ${u} + ${u} = ${2*u}, dohromady ${2*t} + ${2*u} = ${2*n}.)`:''}`; },
  money(pr){ const pl=XP.plain(pr.q), n=XP.nums(pl), B=XP.b;
    if(/Platíš/.test(pl)){ const P=n[0], C=n[1], r=P-C, nx=Math.ceil(C/10)*10;
      const dop = (C%10 && nx<P) ? `<br>Nebo dopočítej od ceny: ${fmt(C)} + ${nx-C} = ${fmt(nx)}, ${fmt(nx)} + ${fmt(P-nx)} = ${fmt(P)} → dohromady ${nx-C} + ${fmt(P-nx)} = ${fmt(r)}.` : '';
      return `Vrátí ti to, co jsi dal navíc: zaplacená částka minus cena.<br>${fmt(P)} − ${fmt(C)} = ${B(r)} Kč.${dop}<br>Zkouška: ${fmt(C)} + ${fmt(r)} = ${fmt(P)}.`; }
    if(/po \d+ Kč stojí/.test(pl)) return `${n[0]} zmrzlin${n[0]>=5?'':'y'} po ${n[1]} Kč → stejná cena několikrát → násobíme.<br>${n[0]} · ${n[1]} = ${B(n[0]*n[1])} Kč${n[0]<=6?`<br>(${Array(n[0]).fill(n[1]).join(' + ')} = ${n[0]*n[1]})`:''}`;
    if(n.length>=2){ let cur=n[0]; const st=n.slice(1).map(x=>{ const l=`${cur} + ${x} = ${cur+x}`; cur+=x; return l; });
      return `Sčítej mince postupně, začni tou největší:<br>${st.join('<br>')}<br>Dohromady ${B(cur)} Kč.`; }
    return null; },
  diff(pr){ const n=XP.nums(XP.plain(pr.q)); const a=Math.max(n[0],n[1]), b=Math.min(n[0],n[1]);
    return `„O kolik víc / méně?“ zjistíme <b>odčítáním</b> – od většího čísla odečteme menší.<br>${a} − ${b} = ${XP.b(a-b)}.<br>Zkouška: ${b} + ${a-b} = ${a}.`; },
  tens(pr){ const pl=XP.plain(pr.q), n=XP.nums(pl), B=XP.b;
    if(/desít/.test(pl) && /jednot/.test(pl)) return `${n[0]} ${kus(n[0],'desítka','desítky','desítek')} = ${n[0]*10}, ${n[1]} ${kus(n[1],'jednotka','jednotky','jednotek')} = ${n[1]}.<br>${n[0]*10} + ${n[1]} = ${B(n[0]*10+n[1])}.`;
    if(/Kolik desítek/.test(pl)){ const x=n[0]; return `V čísle ${x} je na místě desítek (vlevo) číslice ${Math.floor(x/10)} a na místě jednotek (vpravo) ${x%10}.<br>${x} = ${Math.floor(x/10)*10} + ${x%10}, takže má ${B(Math.floor(x/10))} ${kus(Math.floor(x/10),'desítku','desítky','desítek')}.`; }
    if(n.length>=2){ const x=n[0], t=n[1]; return `${x} = ${t} + ${x-t}. Desítky už jsou napsané (${t}), zbývají jednotky: ${B(x-t)}.`; }
    return null; },
  units(pr){ const pl=XP.plain(pr.q), n=XP.nums(pl), B=XP.b;
    const U=[[/ m = \? cm/,'1 m = 100 cm',100,'m','cm'],[/cm = \? m\b/,'100 cm = 1 m',1/100,'cm','m'],[/cm = \? mm/,'1 cm = 10 mm',10,'cm','mm'],[/kg = \? g/,'1 kg = 1 000 g',1000,'kg','g'],[/km = \? m/,'1 km = 1 000 m',1000,'km','m']];
    if(/h \d+ min/.test(pl)) return `1 h = 60 min, takže ${n[0]} h = ${n[0]} · 60 = ${n[0]*60} min.<br>Přidáme ${n[1]} min: ${n[0]*60} + ${n[1]} = ${B(n[0]*60+n[1])} min.`;
    if(/h = \? min/.test(pl)) return `1 h = 60 min, takže ${n[0]} h = ${n[0]} · 60 = ${B(n[0]*60)} min.`;
    for(const [re,rule,f,u1,u2] of U) if(re.test(' '+pl)) return f<1 ? `${rule}. Kolikrát se 100 vejde do ${fmt(n[0])}? ${fmt(n[0])} : 100 = ${n[0]/100}, takže ${fmt(n[0])} cm = ${B(n[0]/100+' m')}.` : `${rule}, takže ${n[0]} ${u1} = ${n[0]} · ${fmt(f)} = ${B(fmt(n[0]*f)+' '+u2)}.`;
    return null; },
  word(pr){ if(pr.ex) return pr.ex; const pl=XP.plain(pr.q), n=XP.nums(pl); XP._pl=pl; for(const [re,f] of XP_WORD) if(re.test(pl)) return f(n); return null; },
  m_next(pr){ const k=xpKey(pr), za=k[1]==='true', n=+k[2];
    return za ? `Hned za číslem ${n} je číslo o jedna větší: ${n} + 1 = ${XP.b(n+1)}.` : `Hned před číslem ${n} je číslo o jedna menší: ${n} − 1 = ${XP.b(n-1)}.`; },
  m_order(pr){ const k=xpKey(pr), row=Array.from(k[1]||''), i=+k[2]; if(!row.length) return null; const ord=['první','druhé','třetí','čtvrté','páté','šesté'];
    return `Počítej zleva, od začátku řady:<br>${row.slice(0,i+1).map((e,j)=>`${j+1}. ${e}`).join(' &nbsp; ')}<br>${row[i]} je ${XP.b(ord[i])}.`; },
  m_split(pr){ const n=+xpKey(pr)[1], x=XP.nums(xpOpt(pr)); return `Rozložit číslo ${n} znamená rozdělit ho na dvě části, které dají dohromady zase ${n}.<br>Zkus to sečíst: ${x[0]} + ${x[1]} = ${n} ✔ → ${XP.b(x[0]+' a '+x[1])}.`; },
  m_clock(pr){ const k=xpKey(pr), h=+k[1], m=+k[2], nx=h%12+1, B=XP.b;
    const base='Malá ručička ukazuje hodiny, velká (červená) ukazuje minuty.<br>';
    if(m===0) return base+`Velká ručička je nahoře na 12 → celá hodina. Malá ručička ukazuje na ${h} → ${B(clockLabel(h,m))}.`;
    if(m===30) return base+`Velká ručička je dole na 6 → uběhla půlhodina. Malá ručička je mezi ${h} a ${nx} → je ${B(clockLabel(h,m))}.`;
    if(m===15) return base+`Velká ručička je na 3 → uběhla čtvrthodina. Malá ručička je kousek za ${h} a míří k ${nx} → je ${B(clockLabel(h,m))}.`;
    return base+`Velká ručička je na 9 → uběhly tři čtvrtě hodiny. Malá ručička je už skoro u ${nx} → je ${B(clockLabel(h,m))}.`; },
  m_axis(pr){ const k=xpKey(pr), st=+k[2], v=+k[3], lab=st*5, base=Math.floor(v/lab)*lab, c=(v-base)/st;
    return `Číslo je napsané jen u dlouhých čárek. Každá další čárka je o ${st} víc.<br>${c===0?`Šipka ukazuje přímo na dlouhou čárku s číslem ${XP.b(v)}.`:`Šipka je ${c} ${kus(c,'čárku','čárky','čárek')} za číslem ${base}: ${base} → ${XP.run(base,st,c)}.<br>Šipka ukazuje ${XP.b(v)}.`}`; },
  m_geom(pr){ const k=xpKey(pr), B=XP.b;
    if(k[0]==='geom'){ const D={kruh:'je kulatý – nemá žádné rohy ani rovné strany',čtverec:'má 4 rohy a 4 stejně dlouhé strany',obdélník:'má 4 rohy – dvě strany jsou delší a dvě kratší',trojúhelník:'má 3 rohy a 3 strany'};
      return `Podívej se na rohy a strany. ${B(k[1][0].toUpperCase()+k[1].slice(1))} ${D[k[1]]}.`; }
    if(k[0]==='geomn'){ const n={trojúhelník:3,čtverec:4,obdélník:4}[k[1]]; return `Spočítej je na obrázku prstem: ${[...Array(n)].map((_,i)=>i+1).join(', ')}.<br>${k[1][0].toUpperCase()+k[1].slice(1)} má ${B(n)} ${k[2]==='stran'?'strany':'vrcholy (rohy)'}.`; }
    if(k[0]==='ruler'){ const l=+k[1]; return `Úsečka začíná u nuly a končí u čísla ${l}. Mezi dvěma čísly na pravítku je vždy 1 cm → úsečka měří ${B(l+' cm')}.`; }
    return null; },
  m_1000(pr){ const k=xpKey(pr), B=XP.b, n=+(k[0]==='pl'?k[2]:k[1]), s=Math.floor(n/100), d=Math.floor(n/10)%10, j=n%10;
    const tab=`<span class="xpplace"><span><small>S</small>${s}</span><span><small>D</small>${d}</span><span><small>J</small>${j}</span></span>`;
    if(k[0]==='pl'){ const w=k[1], dg=w==='stovek'?s:w==='desítek'?d:j; return `${tab}<br>Stovky jsou vlevo, desítky uprostřed, jednotky vpravo.<br>Na místě ${w} je ${B(dg)}.`; }
    return `${tab}<br>${s} ${PLACE_W(s,'stovka','stovky','stovek')} = ${s*100}, ${d} ${PLACE_W(d,'desítka','desítky','desítek')} = ${d*10}, ${j} ${PLACE_W(j,'jednotka','jednotky','jednotek')} = ${j}.<br>${s*100} + ${d*10} + ${j} = ${B(n)}.`; },
  m_written(pr){ const m=String(pr.key||'').match(/^pis\|(\d+)([+-])(\d+)/); if(!m) return null; const a=+m[1], b=+m[3], plus=m[2]==='+';
    const da=String(a).split('').reverse().map(Number), db=String(b).split('').reverse().map(Number), nm=['Jednotky','Desítky','Stovky']; let c=0; const L=[];
    for(let i=0;i<da.length;i++){ const x=da[i], y=db[i]||0;
      if(plus){ const s=x+y+c; L.push(`${nm[i]}: ${x} + ${y}${c?' + 1':''} = ${s} → píšeme ${s%10}${s>=10?', 1 si pamatujeme':''}.`); c=s>=10?1:0; }
      else { const y2=y+c, last=i===da.length-1;
        if(y2<=x){ L.push(`${nm[i]}: ${c?`${y} + 1 = ${y2}, `:''}${y2} a kolik je ${x}? ${x-y2} → píšeme ${x-y2}${last&&x-y2===0?' (nula na začátku čísla se nepíše)':''}.`); c=0; }
        else { L.push(`${nm[i]}: ${c?`${y} + 1 = ${y2}, `:''}${y2} a kolik je ${x+10}? ${x+10-y2} → píšeme ${x+10-y2}, 1 si pamatujeme.`); c=1; } } }
    const r=plus?a+b:a-b;
    return `Počítáme pod sebou, vždy zprava – od jednotek:<br>${L.join('<br>')}<br>Výsledek je ${XP.b(r)}. ${plus?`Zkouška: ${r} − ${b} = ${a}.`:`Zkouška: ${r} + ${b} = ${a}.`}`; },
  m_perim(pr){ const k=xpKey(pr), a=+k[1], B=XP.b;
    if(k.length===2) return `Obvod = délka všech stran dohromady. Čtverec má 4 stejné strany:<br>${a} + ${a} + ${a} + ${a} = 4 · ${a} = ${B(4*a)} cm.`;
    const b=+k[2]; return `Obvod = délka všech stran dohromady. Obdélník má dvě strany ${a} cm a dvě strany ${b} cm:<br>${a} + ${b} + ${a} + ${b} = ${B(2*(a+b))} cm.`; },
  /* ---------- čeština ---------- */
  cj_iy(pr){ const g=xpGap(pr), ans=xpOpt(pr), w=g.replace('_',ans), pre=g.split('_')[0], c=/ch$/.test(pre)?'ch':pre.slice(-1);
    if('žščřcj'.includes(c)) return `${XP.b(c)} je <b>měkká</b> souhláska – po ní píšeme měkké i: ${XP.b(w)}.<br>Měkké souhlásky: ž, š, č, ř, c, j (a ď, ť, ň).`;
    if('dtn'.includes(c) && ans==='i') return `Tady čteme ${c} měkce (${{d:'ďi',t:'ťi',n:'ňi'}[c]}) – proto píšeme měkké i: ${XP.b(w)}.<br>Když bychom napsali y, četlo by se tvrdě (${c}y).`;
    return `${XP.b(c)} je <b>tvrdá</b> souhláska – po ní píšeme tvrdé y: ${XP.b(w)}.<br>Tvrdé souhlásky: h, ch, k, r, d, t, n.`; },
  cj_vyj(pr){ const g=xpGap(pr), t=XP_VYJ[g]; if(!t) return null; return `${t}<br>Správně: ${XP.b(g.replace('_',xpOpt(pr)))}.<br><span class="sub">Po obojetných souhláskách (b, f, l, m, p, s, v, z) píšeme y jen ve vyjmenovaných slovech a ve slovech příbuzných.</span>`; },
  cj_end(pr){ const g=xpGap(pr), ans=xpOpt(pr), lng=XP_END[g+'|'+ans]||XP_END[g]; if(!lng) return null;
    return `Na konci slova často slyšíme jinou hlásku, než píšeme. Zkus slovo prodloužit: ${XP.b(lng)} – teď jasně slyšíme ${XP.b(ans)}.<br>Proto píšeme ${XP.b(g.replace('_',ans))}.`; },
  cj_long(pr){ const g=xpGap(pr), ans=xpOpt(pr), w=g.replace('_',ans), long=/[áéíýóúů]/.test(ans);
    return `Řekni slovo pomalu nahlas: ${XP.b(w)}.<br>${long?`Hláska ${ans} se táhne – je <b>dlouhá</b>, proto má čárku.`:`Hláska ${ans} je <b>krátká</b> – netáhne se, proto je bez čárky.`}`; },
  cj_dtn(pr){ const g=xpGap(pr), ans=xpOpt(pr), w=g.replace('_',ans), c=g.split('_')[0].slice(-1);
    if(ans==='je') return `Slovo se skládá ze dvou částí: ${XP.b(w==='objednat'?'ob + jednat':'v + jezd (jezdit)')}. Část „je“ patří ke druhému slovu, proto píšeme ${XP.b(w)}.`;
    if(c==='m') return `Ve slově ${XP.b(w)} píšeme mě.<br><span class="sub">Mně píšeme jen tam, kde je v příbuzném slově „mn“ (zapomenout → zapomněl) a ve tvaru „mně“ (komu? mně).</span>`;
    if('bpv'.includes(c)) return `Po b, p, v píšeme bě, pě, vě: ${XP.b(w)}.<br><span class="sub">Bje a vje píšeme jen tam, kde se potká ob- nebo v- se slovem začínajícím na je- (ob-jednat, v-jezd).</span>`;
    return `Slyšíme měkce ${{d:'ďe',t:'ťe',n:'ňe'}[c]||c+'e'} – a to se píše ${XP.b(c+'ě')}: ${XP.b(w)}.`; },
  cj_uu(pr){ const g=xpGap(pr), ans=xpOpt(pr), w=g.replace('_',ans), alt=XP_UU_ALT[g];
    if(ans==='ú') return `${XP.b('Ú')} s čárkou píšeme hlavně na začátku slova: ${XP.b(w)}.`;
    return `${XP.b('Ů')} s kroužkem píšeme uprostřed a na konci slova: ${XP.b(w)}.${alt?`<br>Pomůcka: ${w} – ${alt} (ů se mění na o).`:''}`; },
  cj_big(pr){ const w=xpOpt(pr); return `${XP.b(w[0].toUpperCase()+w.slice(1))} je ${XP_BIG[w]||'vlastní jméno'} – vlastní jména píšeme s velkým písmenem.<br>Ostatní slova jsou obyčejná pojmenování (pes, město…) a píšou se s malým písmenem.`; },
  cj_kinds(pr){ const s=xpKey(pr)[1], k=xpOpt(pr); return `Věta „${s}“ ${XP_KIND[k]}<br>Je to věta ${XP.b(k)}.`; },
  cj_gen(pr){ const w=xpKey(pr)[1], r=xpOpt(pr); return `Řekni před slovo „ten“, „ta“ nebo „to“: ${XP.b(XP_TO[r]+' '+w)}.<br>ten = mužský rod, ta = ženský rod, to = střední rod → ${XP.b(r)}.`; },
  cj_verb(pr){ const k=xpKey(pr), f=k[1], ans=xpOpt(pr);
    if(k[0]==='vt'){ const T={minulý:`včera ${f} – už se to stalo`, přítomný:`teď ${f} – děje se to právě teď`, budoucí:`zítra ${f} – teprve se to stane`};
      return `Zkus si říct: ${XP.b(T[ans])} → čas ${XP.b(ans)}.`; }
    if(k[0]==='vo'){ const who={'1. osoba':'já','2. osoba':'ty','3. osoba':'on (ona, ono)'}[ans];
      return `Kdo to dělá? ${XP.b(who+' '+f)} → ${XP.b(ans)}.<br><span class="sub">1. osoba = já, my · 2. osoba = ty, vy · 3. osoba = on, ona, ono, oni</span>`; }
    if(k[0]==='vc') return ans==='množné' ? `${XP.b('oni '+f)} – dělá to víc lidí → číslo ${XP.b('množné')}.` : `${XP.b('on '+f)} – dělá to jeden → číslo ${XP.b('jednotné')}.`;
    return null; },
  cj_vs(pr){ const s=xpKey(pr)[1], vb=XP_VS[s], ans=xpOpt(pr); if(!vb) return null;
    return `Najdi slovesa (co kdo dělá): ${vb.map(x=>XP.b(x)).join(', ')} – ${vb.length===1?'je tam jedno':'jsou tam '+vb.length}.<br>${vb.length===1?'Jedno sloveso → věta jednoduchá.':'Víc sloves (dvě věty dohromady) → souvětí.'} Správně: ${XP.b(ans)}.`; },
  cj_pos(pr){ const w=xpKey(pr)[1], kd=xpOpt(pr), f=XP_POS[kd]; return f ? f(w).replace('→ '+kd, '→ <b>'+kd+'</b>').replace(new RegExp('– '+w+'([ .(])'),'– <b>'+w+'</b>$1').replace('Slovo '+w+' ','Slovo <b>'+w+'</b> ') : null; },
  cj_nv(pr){ const k=xpKey(pr), w=xpOpt(pr);
    return k[1]==='v' ? `Zeptej se u každého slova: co dělá? – ${XP.b(w)}. To je ${XP.b('sloveso')}.<br>Ostatní slova jsou věci nebo vlastnosti (kdo? co? jaký?).` :
      `Zeptej se u každého slova: kdo? co? – ${XP.b(w)}. To je ${XP.b('podstatné jméno')}.<br>Ostatní slova říkají, co kdo dělá nebo jaký je.`; },
  cj_abc(pr){ const k=xpKey(pr);
    if(k[0]==='abc'){ const i=ABC.indexOf(k[1]); if(i<0) return null; const sl=ABC.slice(Math.max(0,i-2),i+3).map((x,j)=>x===ABC[i+1]?XP.b(x):x).join(' ');
      return `Zarecituj si abecedu: … ${sl} …<br>Po ${k[1]} je ${XP.b(ABC[i+1])}.${ABC[i+1]==='CH'?' (CH je v české abecedě hned za H.)':''}`; }
    if(k[0]==='syl'){ const sp=XP_SYL[k[1]]||k[1], n=sp.split('-').length;
      return `Vytleskej slovo po slabikách: ${XP.b(sp.replace(/-/g,' – '))}.<br>Tleskneš ${n}× → ${XP.b(n)} ${kus(n,'slabika','slabiky','slabik')}.`; }
    return null; },
  cj_sort(pr){ const k=xpKey(pr), list=(k[2]||'').split(','), last=k[1]==='L'; if(list.length<2) return null;
    return `Rozhoduje první písmeno. V abecedě jdou slova takto:<br>${list.map((w,i)=>`${i+1}. <b>${w.slice(0,cjFirst(w).length)}</b>${w.slice(cjFirst(w).length)}`).join(' &nbsp; ')}<br>${last?'Poslední':'První'} je ${XP.b(last?list[list.length-1]:list[0])}.`; },
  cj_group(pr){ const k=xpKey(pr);
    if(k[0]==='grp1') return `${k[2].split(',').join(', ')} – to všechno patří do jedné skupiny: ${XP.b(k[1])}.<br>Slovo „${k[1]}“ je nadřazené, ostatní jsou podřazená.`;
    const opts=pr.options.map(o=>XP.plain(o)), odd=opts[pr.a], rest=opts.filter((_,i)=>i!==pr.a), g=CJ_GROUPS.find(x=>x[1].includes(rest[0])), g2=CJ_GROUPS.find(x=>x[1].includes(odd));
    return g ? `${rest.join(', ')} – to všechno patří do skupiny ${XP.b(g[0])}.<br>Slovo ${XP.b(odd)} tam nepatří${g2?` – patří do skupiny ${g2[0]}`:''}.` : null; },
  cj_rel(pr){ const k=xpKey(pr), others=pr.options.map(o=>XP.plain(o)).filter(o=>o!==k[2]);
    return `Příbuzná slova mají stejný základ a souvisí spolu i <b>významem</b>: ${XP.b(k[1])} – ${XP.b(k[2])}.<br>Slova ${others.join(', ')} jen podobně znějí, ale znamenají něco úplně jiného.`; },
  cj_first(pr){ const w=xpKey(pr)[1], L=cjFirst(w); return `Řekni slovo pomalu nahlas: ${XP.b(w)}. První hláska je ${XP.b(L)}.${L==='CH'?' (CH je jedno písmeno.)':''}`; },
};
const XP_MAP = {add10:'arith',add20nb:'arith',add20:'arith',addsub100:'arith',big:'arith',mul2:'arith',mulall:'arith',m_mul69:'arith',mulext:'arith',divext:'arith',
  missing10:'missing',missing:'missing',compare20:'compare',compare:'compare',order:'order',rem:'rem',fractions:'fractions',round:'round',
  seq1:'seq',seq2:'seq',seq4:'seq',double1:'dbl',halfdouble2:'dbl',money1:'money',money2:'money',money4:'money',diff2:'diff',tens2:'tens',units4:'units',
  word1:'word',word2:'word',word4:'word'};

function explainProb(pr){
  try{ if(!pr || !pr.cat) return null; const fn=XP_CAT[XP_MAP[pr.cat]||pr.cat]; if(!fn) return null;
    const html=fn(pr); if(!html) return null;
    return {html, say:xpSay(html)};
  }catch(e){ return null; }
}
const XP_FR = {2:['polovina','poloviny','polovin'],3:['třetina','třetiny','třetin'],4:['čtvrtina','čtvrtiny','čtvrtin'],5:['pětina','pětiny','pětin'],10:['desetina','desetiny','desetin']};
function xpSay(html){
  return String(html).replace(/<span class="frac"><span>(\d+)<\/span><span>(\d+)<\/span><\/span>/g,(m,n,d)=>{ n=+n; const w=XP_FR[d]; if(!w) return n+' lomeno '+d; return (['','jedna','dvě','tři','čtyři'][n]||n)+' '+kus(n,...w); }).replace(/<br>/g,'. ').replace(/<span class="xpstep">([+−])(\d+)<\/span>/g,(m,s,n)=>(s==='+'?', plus ':', mínus ')+n+', ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&lt;/g,' je menší než ').replace(/&gt;/g,' je větší než ')
    .replace(/(\d) · (\d)/g,'$1 krát $2').replace(/ · /g,' krát ').replace(/(\d) : (\d)/g,'$1 děleno $2').replace(/ − /g,' mínus ').replace(/ \+ /g,' plus ').replace(/ = /g,' je ').replace(/→/g,', ').replace(/(\d)×/g,'$1krát')
    .replace(/✔/g,'').replace(/\s+/g,' ').trim();
}

/* ---- tlačítko a okénko v procvičování ---- */
function explainBoxHTML(ex){ return `<div class="xpbox" id="xpbox"><button class="say" id="xpsay" title="Přečíst vysvětlení">🔊</button><div class="xphead">💡 Jak na to</div><div class="xptext">${ex.html}</div><div class="xpgo">Teď už to zvládneš – zkus to 🙂</div></div>`; }
const _playViewX = playView;
playView = function(){
  let s=_playViewX();
  try{ const p=prof(view.pid), t=view.practice || p.today, pr=t && t.problems[t.idx], ex=explainProb(pr); if(!ex) return s;
    if(t.helpIdx===t.idx){ s=s.replace('<div class="fb" id="fb">Zkus to ještě jednou 🙂</div>','<div class="fb" id="fb"></div>').replace('<div class="fb" id="fb">', explainBoxHTML(ex)+'<div class="fb" id="fb">'); }
    else s=s.replace(/<\/div>$/, `<div class="center"><button class="btn sec small xpbtn" data-explain="1">🤔 Nevím – vysvětli mi to</button></div></div>`);
  }catch(e){}
  return s;
};
function showExplain(){
  if(busy || view.name!=='play') return;
  const p=prof(view.pid), t=view.practice || p.today, pr=t && t.problems[t.idx], ex=explainProb(pr); if(!ex) return;
  if(!t.tries){ t.tries=1; try{ if(!pr.review) catTrack(p, pr.cat, false); reviewTrack(p, pr, false, true); }catch(e){} }
  t.helpIdx=t.idx; save();
  const btn=document.querySelector('[data-explain]'); if(btn) btn.parentNode.remove();
  const fb=document.getElementById('fb'); if(fb){ fb.className='fb'; fb.innerHTML=''; fb.insertAdjacentHTML('beforebegin', explainBoxHTML(ex)); }
  wireExplain(ex); if(readOn()) setTimeout(()=>speak(ex.say),150);
  try{ const box=document.getElementById('xpbox'); if(box && box.scrollIntoView) box.scrollIntoView({block:'nearest', behavior:'smooth'}); }catch(e){}
}
function wireExplain(ex){ const b=document.getElementById('xpsay'); if(b) b.onclick=ev=>{ ev.stopPropagation(); try{speechSynthesis.cancel();}catch(e){} speak._t=null; speak((ex||explainProb(curProblem())||{}).say); }; }
document.addEventListener('click', e=>{ const b=e.target.closest && e.target.closest('[data-explain]'); if(b){ e.preventDefault(); showExplain(); } });
const _renderX = render;
render = function(){ const r=_renderX.apply(this, arguments); try{ if(document.getElementById('xpbox')) wireExplain(); }catch(e){} return r; };
