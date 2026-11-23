/* ============ State ============ */
const LS_KEY='pocitani-hrdinove-v1';
function newId(){ return 'h'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function newProfile(o={}){
  const grade=(o.grade!==undefined&&o.grade!==null&&o.grade!=='')?+o.grade:2;
  return Object.assign({id:newId(), name:'Hrdina', grade, gender:'m', mode:'quest', color:'#4f7cff', cats:defaultCats(grade, ['m']), catsV:4, pin:'', reward:'',
    points:0, xp:0, owned:{}, eq:{}, beaten:0, chests:[], rewardClaimed:false, season:1, streak:0, lastDone:null, history:{}, today:null, totalCorrect:0, created:Date.now()}, o);
}
function defaultState(){
  return {v:2, savedAt:0,
    settings:{pin:'1234', reward:'Výlet do zoo nebo nová hra – podle výběru', length:'mid', perDay:10, ver:3},
    profiles:[ newProfile({id:'p2',name:'Druháček',grade:2,color:'#ff7a45',created:1}), newProfile({id:'p4',name:'Čtvrťák',grade:4,color:'#4f7cff',created:2}) ]};
}
function migrate(p){
  if(!p) return p;
  if(p.owned===undefined || p.gear!==undefined){ p.owned={}; p.eq={}; p.xp=p.totalCorrect||0; p.beaten=0; delete p.gear; }
  if(!p.gender) p.gender='m';
  if(!p.mode) p.mode='quest';
  if(p.pin===undefined) p.pin='';
  if(p.reward===undefined) p.reward='';
  if(!p.created) p.created=1;
  if(!p.chests) p.chests=[];
  if((p.catsV||1)<2){ if(p.cats && p.cats.length){ const add=(NEW_CATS_V2[p.grade]||[]).filter(c=>!p.cats.includes(c)); p.cats=p.cats.concat(add); } p.catsV=2; }
  // v3: prvouka po tématech a nové okruhy češtiny – kdo měl předmět zapnutý, dostane doporučená témata pro ročník a pololetí
  if((p.catsV||1)<3){ if(p.cats && p.cats.length){ let c=p.cats.slice();
      if(c.includes('pr_quiz') && !c.some(x=>/^pr_/.test(x)&&x!=='pr_quiz')){ const d=defaultCats(+p.grade||0,['pr'],halfOf(p)); if(+p.grade<=3) c=c.filter(x=>x!=='pr_quiz'); c=c.concat(d.filter(x=>!c.includes(x))); }
      if(c.some(x=>/^cj_/.test(x))){ const d=defaultCats(+p.grade||0,['cj'],halfOf(p)); c=c.concat(d.filter(x=>!c.includes(x))); }
      p.cats=c; } p.catsV=3; }
  // v4: nové okruhy matematiky a angličtina po tématech
  if((p.catsV||1)<4){ if(p.cats && p.cats.length){ let c=p.cats.slice();
      for(const [sj,re] of [['m',/^(?!en_|pr_|cj_)/],['en',/^en_/]]) if(c.some(x=>re.test(x)&&CATS[x]&&subjOf(x)===sj)){ const d=defaultCats(+p.grade||0,[sj],halfOf(p)).filter(x=>/^(m_|en_[zjstrd]$|en_sent)/.test(x)); c=c.concat(d.filter(x=>!c.includes(x))); }
      p.cats=c; } p.catsV=4; }
  return p;
}
function migrateSettings(){ if(!S.settings.ver || S.settings.ver<3){ S.settings.perDay=10; S.settings.ver=3; } }
let S = lsGet(LS_KEY) || defaultState();
S.profiles.forEach(migrate); migrateSettings();
function saveLocal(){ lsSet(LS_KEY, S); if(TEST) lsSet('ph-test', TEST); }
let TEST = lsGet('ph-test');
let unlocked = new Set(lsGet('ph-unlocked')||[]);
function unlock(id){ unlocked.add(id); lsSet('ph-unlocked',[...unlocked]); }
function heroes(){ return S.profiles.filter(p=>!p.deleted); }
function prof(id){ return id==='test' ? TEST : S.profiles.find(p=>p.id===id); }
function rewardOf(p){ return (p.reward||'').trim() || S.settings.reward; }
const isTest = p => p && p.id==='test';
