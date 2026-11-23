
/* ---- Angličtina – slovíčka po tématech a jednoduché věty (podle učebnic 1.–3. třídy) ---- */
const EN_TOPICS = {
  en_z: {label:'Slovíčka – zvířata', w:'cat dog fish bird horse cow pig duck rabbit mouse frog lion elephant monkey bear sheep snake tiger hen parrot giraffe zebra hippo crocodile butterfly spider'},
  en_j: {label:'Slovíčka – jídlo a pití', w:'apple banana orange strawberry bread milk egg cake cheese carrot tomato grapes|ice cream|pizza|spaghetti|salad|hamburger|chicken|chips|soup|sandwich|mashed potato'},
  en_s: {label:'Slovíčka – škola, hry a hřiště', w:'ball book pencil pen ruler bag crayons scissors|pencil sharpener|rubber|glue stick|school|slide|roundabout|swing|climbing frame|sandpit|zip line|tunnel|tree house|guitar|computer|walk|swim|clap|hop|jump'},
  en_t: {label:'Slovíčka – tělo a oblečení', w:'arm leg foot hand eye ear mouth nose head hair hat shoe|woolly hat|gloves|scarf|boots|socks|sandals|swimsuit|sunglasses|cap'},
  en_r: {label:'Slovíčka – rodina, pocity, pozdravy', w:'mum dad brother sister baby grandma grandad happy sad sleepy sick hello goodbye'},
  en_d: {label:'Slovíčka – doma, venku a doprava', w:'car house sun tree flower moon star bike plane boat chair bed cup clock key umbrella rainbow snowman rocket bus train candle castle mushroom bridge goal'},
};
// první část je oddělená mezerami, víceslovná slovíčka jsou za svislítky
for(const t of Object.values(EN_TOPICS)) t.set=new Set(t.w.split('|').flatMap((x,i)=>i===0?x.split(' '):[x]));
const EN_SENT = [ // [anglicky, česky, obrázek, rámec, od ročníku]
  ["I've got a cat.",'Mám kočku.','🐱','got',2],["I've got a dog.",'Mám psa.','🐶','got',2],["I've got a bike.",'Mám kolo.','🚲','got',2],["I've got a ball.",'Mám míč.','⚽','got',2],
  ["I've got a sister.",'Mám sestru.','👧','got',2],["I've got a brother.",'Mám bratra.','👦','got',2],
  ['I can swim.','Umím plavat.','🏊','can',2],['I can run.','Umím běhat.','🏃','can',2],['I can sing.','Umím zpívat.','🎤','can',2],['I can dance.','Umím tancovat.','💃','can',2],
  ['I can ride a bike.','Umím jezdit na kole.','🚴','can',3],['I can climb.','Umím šplhat.','🧗','can',3],
  ["It's a cat.",'Je to kočka.','🐱','is',2],["It's a car.",'Je to auto.','🚗','is',2],["It's an apple.",'Je to jablko.','🍎','is',2],["It's a book.",'Je to kniha.','📖','is',2],
  ['This is my mum.','To je moje maminka.','👩','my',2],['This is my dad.','To je můj tatínek.','👨','my',2],['This is my grandma.','To je moje babička.','👵','my',3],['This is my grandad.','To je můj dědeček.','👴','my',3],
  ["I'm happy.",'Jsem veselý.','😀','feel',2],["I'm sad.",'Jsem smutný.','😢','feel',2],["I'm sleepy.",'Jsem ospalý.','😴','feel',3],["I'm sick.",'Jsem nemocný.','🤒','feel',3],
];
function enTopicPool(k){ const t=EN_TOPICS[k], all=EN_PIC.filter(x=>t.set.has(x[0])), g=Math.max(1,CUR_GRADE);
  let p=all.filter(x=>x[3]<=g+1); if(p.length<5) p=all; return p; }
for(const [k,t] of Object.entries(EN_TOPICS)){
  CATS[k]={grade:1, subj:'en', label:t.label, gen(){
    const pool=enTopicPool(k), tw=pick(pool), n=CUR_GRADE===0?3:4;
    const others=pickN(pool.filter(x=>x!==tw && x[1]!==tw[1] && !enClash(x[0],tw[0])), n-1), opts=shuffle([tw,...others]);
    if(CUR_GRADE>=2 && R()<.4) return Object.assign(choice(`Co je <b>${tw[0]}</b>?`, tw[0], opts.map(o=>enPic(o[1],52)), opts.indexOf(tw), '', k+'r|'+tw[0]+'|'+opts.map(o=>o[0]).join()), {lang:'en-GB', sayOnly:true});
    return Object.assign(choice('🎧 Poslouchej a najdi obrázek', tw[0], opts.map(o=>enPic(o[1],52)), opts.indexOf(tw), '', k+'|'+tw[0]+'|'+opts.map(o=>o[0]).join()), {lang:'en-GB'});
  }};
}
CATS.en_sent = {grade:2, subj:'en', label:'Jednoduché věty (I\'ve got…, I can…, It\'s…)', gen(){
  const pool=EN_SENT.filter(x=>x[4]<=Math.max(2,CUR_GRADE)), s=pick(pool);
  if(R()<.5){ // poslech → obrázek
    const others=pickN(pool.filter(x=>x!==s && x[3]===s[3] && x[2]!==s[2]),3), opts=shuffle([s,...others]);
    return Object.assign(choice('🎧 Poslouchej větu a najdi obrázek', s[0], opts.map(o=>em(o[2],52)), opts.indexOf(s), '', 'ens1|'+s[0]+'|'+opts.map(o=>o[0]).join()), {lang:'en-GB'}); }
  const others=pickN(pool.filter(x=>x!==s && x[1]!==s[1]),3), opts=shuffle([s,...others]); // co věta znamená
  return Object.assign(choice(`🎧 <b>${s[0]}</b> – co to znamená?`, s[0], opts.map(o=>txt(o[1])), opts.indexOf(s), '', 'ens2|'+s[0]), {lang:'en-GB'});
}};
SUBJ_DEFAULTS.en = {0:['en_listen','en_colors','en_numbers'], 1:['en_colors','en_numbers','en_z','en_j','en_s','en_t','en_r'],
  2:['en_numbers','en_z','en_j','en_s','en_t','en_r','en_d','en_read','en_phrase','en_sent'], 3:['en_numbers','en_z','en_j','en_s','en_t','en_d','en_read','en_write','en_phrase','en_sent'],
  4:['en_listen','en_numbers','en_read','en_write','en_phrase','en_sent'], 5:['en_listen','en_numbers','en_read','en_write','en_phrase','en_sent']};
Object.assign(HALF1_SKIP, {2:HALF1_SKIP[2].concat(['en_sent'])});
