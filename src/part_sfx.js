
/* ==== Zvuky, hudba a vibrace ====
   Efekty a hudba se skládají přímo v kódu (Web Audio) – nic se nestahuje, funguje offline.
   Hlasy kočky, psa a dráčka jsou nahrávky CC0 (volné dílo) ze sbírky „CC0 Public Domain Sounds“.
   Nastavení platí pro dané zařízení: ph-sfx (efekty, výchozí zap.), ph-music (hudba, výchozí vyp.), ph-vib (vibrace, výchozí zap.). */
const SND = {
  ctx:null, out:null, sfxG:null, musG:null, buf:{}, duck:1,
  on(){ return lsGet('ph-sfx', true)!==false; },
  musicOn(){ return !!lsGet('ph-music', false) && this.on(); },
  vibOn(){ return lsGet('ph-vib', true)!==false; },
  init(){
    if(this.ctx) { if(this.ctx.state==='suspended') this.ctx.resume().catch(()=>{}); return this.ctx; }
    const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null;
    try{ this.ctx=new AC(); }catch(e){ return null; }
    const c=this.ctx; this.out=c.createDynamicsCompressor(); this.out.connect(c.destination);
    this.sfxG=c.createGain(); this.sfxG.gain.value=.55; this.sfxG.connect(this.out);
    this.musG=c.createGain(); this.musG.gain.value=.0; this.musG.connect(this.out);
    return c;
  },
  // nahrávky (malé mp3 ve složce assets/snd)
  load(name){ if(this.buf[name]!==undefined || !this.ctx) return; this.buf[name]=null;
    fetch(A_+'snd/'+name+'.mp3').then(r=>r.arrayBuffer()).then(a=>new Promise((ok,ko)=>this.ctx.decodeAudioData(a,ok,ko))).then(b=>{ this.buf[name]=b; }).catch(()=>{ delete this.buf[name]; }); },
  sample(name, vol=1, rate=1){ const c=this.init(); if(!c||!this.on()) return false; const b=this.buf[name]; if(!b){ this.load(name); return false; }
    const s=c.createBufferSource(); s.buffer=b; s.playbackRate.value=rate; const g=c.createGain(); g.gain.value=vol; s.connect(g); g.connect(this.sfxG); s.start(); return true; },
  // tón s obálkou
  tone(f, t0, dur, {type='sine', vol=.3, f2=null, att=.005, rel=null, dest=null, vib=0, vibF=6}={}){
    const c=this.ctx; const o=c.createOscillator(), g=c.createGain(); o.type=type; o.frequency.setValueAtTime(f,t0);
    if(f2) o.frequency.exponentialRampToValueAtTime(f2, t0+dur);
    if(vib){ const l=c.createOscillator(), lg=c.createGain(); l.frequency.value=vibF; lg.gain.value=vib; l.connect(lg); lg.connect(o.frequency); l.start(t0); l.stop(t0+dur+.05); }
    g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(vol,t0+att); g.gain.exponentialRampToValueAtTime(.0008,t0+(rel||dur));
    o.connect(g); g.connect(dest||this.sfxG); o.start(t0); o.stop(t0+(rel||dur)+.05); return o; },
  noise(t0, dur, {vol=.2, type='bandpass', f=1200, f2=null, q=1, dest=null}={}){
    const c=this.ctx, n=Math.ceil(c.sampleRate*dur), b=c.createBuffer(1,n,c.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
    const s=c.createBufferSource(); s.buffer=b; const fl=c.createBiquadFilter(); fl.type=type; fl.frequency.setValueAtTime(f,t0); if(f2) fl.frequency.exponentialRampToValueAtTime(f2,t0+dur); fl.Q.value=q;
    const g=c.createGain(); g.gain.setValueAtTime(vol,t0); g.gain.exponentialRampToValueAtTime(.0008,t0+dur); s.connect(fl); fl.connect(g); g.connect(dest||this.sfxG); s.start(t0); s.stop(t0+dur+.02); },
};
function vib(p){ try{ if(SND.vibOn() && navigator.vibrate) navigator.vibrate(p); }catch(e){} }
const N=(m)=>440*Math.pow(2,(m-69)/12);   // MIDI → Hz
const PENTA=[0,2,4,7,9,12,14,16,19,21,24];

// ---- jednotlivé zvuky ----
const SFX = {
  tap(){ const t=SND.ctx.currentTime; SND.tone(1400,t,.035,{vol:.06,f2:900}); },
  ok(streak=0){ const t=SND.ctx.currentTime, k=Math.min(streak,PENTA.length-2), b=72+PENTA[k];
    SND.tone(N(b),t,.18,{type:'triangle',vol:.28}); SND.tone(N(b+7),t+.08,.35,{type:'sine',vol:.22}); SND.tone(N(b+19),t+.08,.25,{vol:.05}); vib(15); },
  bad(){ const t=SND.ctx.currentTime; SND.tone(330,t,.22,{type:'sine',vol:.22,f2:220}); SND.tone(262,t+.12,.28,{type:'sine',vol:.14,f2:196}); vib([30,40,30]); },
  fanfare(big){ const t=SND.ctx.currentTime, seq=big?[60,64,67,72,67,72,76]:[60,64,67,72], d=big?.11:.12;
    seq.forEach((m,i)=>{ SND.tone(N(m),t+i*d,.22,{type:'square',vol:.07}); SND.tone(N(m),t+i*d,.3,{type:'triangle',vol:.16}); });
    const e=t+seq.length*d; [72,76,79,84].forEach(m=>SND.tone(N(m),e,big?1.3:.9,{type:'triangle',vol:.11}));
    if(big) for(let i=0;i<10;i++) SND.tone(N(96+PENTA[i%6]),e+.15+i*.07,.15,{vol:.05});
    vib(big?[40,60,40,60,120]:[40,60,80]); },
  swing(){ const t=SND.ctx.currentTime; SND.noise(t,.22,{vol:.35,type:'bandpass',f:500,f2:3500,q:1.2}); },
  hit(){ const t=SND.ctx.currentTime+.12; SND.tone(160,t,.18,{type:'sine',vol:.45,f2:60}); SND.noise(t,.08,{vol:.3,type:'lowpass',f:2500}); vib(25); },
  ouch(){ const t=SND.ctx.currentTime+.22; SND.tone(520,t,.32,{type:'sawtooth',vol:.07,f2:300,vib:25,vibF:18}); SND.tone(780,t,.25,{type:'sine',vol:.08,f2:420}); },
  magic(){ const t=SND.ctx.currentTime; [84,88,91,96,100].forEach((m,i)=>SND.tone(N(m),t+i*.045,.3,{vol:.08})); SND.noise(t,.35,{vol:.08,type:'highpass',f:6000}); },
  heroHurt(){ const t=SND.ctx.currentTime; SND.tone(240,t,.2,{type:'triangle',vol:.2,f2:150}); vib(40); },
  drumroll(){ const t=SND.ctx.currentTime; for(let i=0;i<14;i++) SND.noise(t+i*.045,.05,{vol:.06+i*.012,type:'bandpass',f:180,q:.8}); SND.tone(110,t+.65,.3,{vol:.45,f2:50}); },
  victory(){ const t=SND.ctx.currentTime; [[67,.12],[67,.12],[67,.12],[72,.5]].reduce((s,[m,d])=>{ SND.tone(N(m),s,d+.05,{type:'square',vol:.07}); SND.tone(N(m),s,d+.1,{type:'triangle',vol:.18}); return s+d; },t);
    [76,79,84].forEach(m=>SND.tone(N(m),t+.86,1.1,{type:'triangle',vol:.1})); vib([50,50,50,50,150]); },
  defeat(){ const t=SND.ctx.currentTime; [67,66,65,64].forEach((m,i)=>SND.tone(N(m),t+i*.28,i===3?.8:.26,{type:'triangle',vol:.16,vib:i===3?6:0,vibF:5})); },
  coin(){ const t=SND.ctx.currentTime; SND.tone(N(83),t,.08,{type:'square',vol:.07}); SND.tone(N(88),t+.07,.3,{type:'square',vol:.07}); SND.tone(N(88),t+.07,.3,{vol:.12}); vib(12); },
  chest(){ const t=SND.ctx.currentTime; for(let i=0;i<12;i++) SND.tone(N(60+i*2),t+i*.07,.14,{type:'triangle',vol:.03+i*.008}); SND.noise(t,.9,{vol:.05,type:'bandpass',f:800,f2:6000,q:2});
    const e=t+.9; [72,76,79,84].forEach((m,i)=>SND.tone(N(m),e+i*.03,1.2,{type:'triangle',vol:.13})); for(let i=0;i<8;i++) SND.tone(N(96+PENTA[i%5]),e+.1+i*.06,.15,{vol:.05}); vib([30,40,30,40,100]); },
  tick(){ const t=SND.ctx.currentTime; SND.tone(2200,t,.02,{type:'square',vol:.04}); },
  pop(){ const t=SND.ctx.currentTime; SND.tone(900,t,.12,{vol:.25,f2:1800}); SND.tone(N(88),t+.06,.25,{vol:.06}); vib(15); },
  mnam(){ if(!SND.sample('eat1',.8)){} const t=SND.ctx.currentTime+.25; SND.tone(N(76),t,.12,{type:'triangle',vol:.12}); SND.tone(N(79),t+.12,.22,{type:'triangle',vol:.12}); },
  // ---- zvířátka ----
  cat(){ if(!SND.sample(pick(['cat1','cat2','cat3']),.9, 1.05)) SFX._meow(); },
  _meow(){ const t=SND.ctx.currentTime; SND.tone(600,t,.45,{type:'sawtooth',vol:.06,f2:420,vib:20}); },
  dog(){ if(!SND.sample(pick(['dog1','dog2']),.8)){ const t=SND.ctx.currentTime; SND.noise(t,.15,{vol:.3,f:700,q:3}); } },
  dragon(){ if(!SND.sample('dragon1',.7,1.25)){ const t=SND.ctx.currentTime; SND.tone(180,t,.4,{type:'sawtooth',vol:.12,f2:110,vib:15,vibF:30}); } SFX.magic(); },
  owl(){ const t=SND.ctx.currentTime; SND.tone(N(67),t,.22,{vol:.3,att:.03,vib:4}); SND.tone(N(64),t+.32,.55,{vol:.3,att:.05,f2:N(62),vib:5}); },
  squeak(){ const t=SND.ctx.currentTime; for(let i=0;i<3;i++) SND.tone(3200+i*300,t+i*.09,.06,{vol:.09,f2:4200+i*200}); },
  bunny(){ const t=SND.ctx.currentTime; for(let i=0;i<4;i++) SND.noise(t+i*.07,.04,{vol:.12,type:'bandpass',f:3500,q:4}); SND.tone(2600,t+.32,.08,{vol:.06,f2:3400}); },
  fox(){ const t=SND.ctx.currentTime; SND.tone(900,t,.14,{type:'sawtooth',vol:.06,f2:1800}); SND.tone(1000,t+.2,.16,{type:'sawtooth',vol:.06,f2:1900}); },
  panda(){ const t=SND.ctx.currentTime; SND.tone(380,t,.35,{type:'sawtooth',vol:.05,f2:330,vib:30,vibF:9}); SND.tone(760,t,.35,{vol:.05,f2:660}); },
  horse(){ const t=SND.ctx.currentTime; SND.tone(1100,t,.7,{type:'sawtooth',vol:.06,f2:500,vib:90,vibF:16,att:.03}); SND.tone(550,t,.7,{type:'triangle',vol:.06,f2:260,vib:40,vibF:16});
    for(let i=0;i<3;i++) SND.noise(t+.75+i*.11,.06,{vol:.12,type:'bandpass',f:400,q:3}); },
  chick(){ const t=SND.ctx.currentTime; for(let i=0;i<3;i++) SND.tone(2600,t+i*.13,.08,{vol:.12,f2:3600}); },
  unicorn(){ SFX.horse(); setTimeout(()=>SFX.magic(),350); },
  phoenix(){ const t=SND.ctx.currentTime; SND.noise(t,.4,{vol:.1,type:'bandpass',f:600,f2:3000,q:1}); for(let i=0;i<4;i++) SND.tone(2200+i*250,t+.2+i*.09,.08,{vol:.09,f2:3200}); },
};
const PET_SOUND={cat:'cat',dog:'dog',bunny:'bunny',pony:'horse',rat:'squeak',hamster:'squeak',fox:'fox',panda:'panda',owl:'owl',dragon:'dragon'};
const COMP_SOUND={1:'chick',2:'dog',3:'dragon',4:'unicorn',5:'phoenix'};
// přehrát efekt (tichý, když je předčítání v běhu)
function sfx(name, ...a){ try{ const c=SND.init(); if(!c || !SND.on() || !SFX[name]) return; SFX[name](...a); }catch(e){} }

// ---- hudba na pozadí (generovaná, tichá, ve výchozím stavu vypnutá) ----
const MUSIC = { mode:null, timer:null, step:0, next:0,
  set(mode){ if(!SND.musicOn()) mode=null; if(mode===this.mode) return; this.mode=mode; clearInterval(this.timer); this.timer=null;
    const c=SND.ctx; if(!c){ return; }
    SND.musG.gain.cancelScheduledValues(c.currentTime); SND.musG.gain.setTargetAtTime(mode?.09*SND.duck:0, c.currentTime, .4);
    if(!mode) return; this.step=0; this.next=c.currentTime+.1; this.timer=setInterval(()=>this.tick(),120); },
  tick(){ const c=SND.ctx; if(!c||!this.mode) return; const bt=this.mode==='battle'?.16:.3;
    while(this.next<c.currentTime+.4){ const s=this.step++, t=this.next; this.next+=bt;
      if(this.mode==='menu'){ // klidná pentatonická ukolébavka
        const prog=[[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]][Math.floor(s/8)%4];
        SND.tone(N(prog[[0,1,2,3,2,1,2,3][s%8]]+12),t,.5,{type:'triangle',vol:.35,dest:SND.musG,att:.02});
        if(s%8===0) SND.tone(N(prog[0]-12),t,2.2,{type:'sine',vol:.45,dest:SND.musG,att:.05}); }
      else { // napínavější souboj
        const root=[57,57,53,55][Math.floor(s/16)%4];
        SND.tone(N(root-12+(s%2?12:0)),t,.14,{type:'triangle',vol:.5,dest:SND.musG});
        if(s%4===2) SND.noise(t,.05,{vol:.25,type:'highpass',f:5000,dest:SND.musG});
        if(s%4===0) SND.tone(70,t,.12,{vol:.7,f2:40,dest:SND.musG});
        if(s%16===0||s%16===6||s%16===12) SND.tone(N(root+12+[0,3,7][s%3]),t,.25,{type:'square',vol:.12,dest:SND.musG}); } } },
};
function musicForView(){ const n=view&&view.name; return !SND.musicOn()?null : n==='battle'?'battle' : (n==='play'||n==='timed'||n==='parent')?null : 'menu'; }
// při předčítání hudbu ztlumit
const _speakS=speak; speak=function(t,l){ SND.duck=.25; if(SND.musG&&SND.ctx&&MUSIC.mode) SND.musG.gain.setTargetAtTime(.09*.25,SND.ctx.currentTime,.1); return _speakS(t,l); };
setInterval(()=>{ try{ if(SND.duck<1 && !speechSynthesis.speaking){ SND.duck=1; if(SND.musG&&SND.ctx&&MUSIC.mode) SND.musG.gain.setTargetAtTime(.09,SND.ctx.currentTime,.4); } }catch(e){} },400);

// zvuk smí začít až po dotyku – první dotyk zvuk „odemkne“ a načte nahrávky
document.addEventListener('pointerdown',()=>{ if(SND.init()){ ['cat1','cat2','cat3','dog1','dog2','dragon1','eat1'].forEach(n=>SND.load(n)); MUSIC.set(musicForView()); } },{capture:true});
// jemné ťuknutí u tlačítek
document.addEventListener('pointerdown',e=>{ const b=e.target.closest&&e.target.closest('.btn,.pad button,.chip,.modebtn,.card.profile,.stkbtn,.colors button'); if(b && !b.disabled) sfx('tap'); },true);

// ---- napojení na hru ----
let _okStreak=0;
const _answerS=answer;
answer=function(val){
  if(busy) return _answerS(val);
  let ok=null, first=false; try{ const p=prof(view.pid), t=view.practice||p.today, pr=t&&t.problems[t.idx]; if(pr){ ok=isCorrect(pr,val); first=!t.tries; } }catch(e){}
  const r=_answerS(val);
  if(ok===true){ sfx('ok', first?_okStreak:0); _okStreak=first?_okStreak+1:0; } else if(ok===false){ _okStreak=0; sfx('bad'); }
  return r;
};
const _finishS=finish; finish=function(t){ const perfect=t&&t.res&&t.res.every(r=>r===2); const x=_finishS(t); _okStreak=0; setTimeout(()=>sfx('fanfare',perfect),200); return x; };
const _battleS=battleAnswer;
battleAnswer=function(val){
  let ok=null; try{ if(!busy && view.b && view.b.pr) ok=isCorrect(view.b.pr,val); }catch(e){}
  const p=view.pid&&prof(view.pid), pet=p&&p.mode==='pet';
  const before=view.b?view.b.mhp:0, r=_battleS(val);
  const b=view.b, dead=b && b.mhp<=0;
  if(ok===true){ if(pet) sfx('magic'); else sfx('swing'); sfx('hit'); if(dead) setTimeout(()=>sfx('drumroll'),250); else sfx('ouch'); }
  else if(ok===false) sfx('bad');
  if(ok!==null && !dead) setTimeout(()=>{ if(view.name==='battle') sfx('heroHurt'); }, ok?1100:1900);
  return r;
};
const _bEndS=battleEnd; battleEnd=function(win){ const x=_bEndS(win); setTimeout(()=>sfx(win?'victory':'defeat'),win?300:100); return x; };
if(typeof timedAnswer==='function'){ const _tA=timedAnswer; timedAnswer=function(val){ let ok=null; try{ if(!busy) ok=isCorrect(view.tm.pr,val); }catch(e){} const r=_tA(val); if(ok===true) sfx('ok',0); else if(ok===false) sfx('bad'); return r; }; }
const _buyS=buy; buy=function(slot){ const p=prof(view.pid), b=p?p.points:0; const r=_buyS(slot); try{ if(prof(view.pid).points<b) sfx('coin'); }catch(e){} return r; };
const _chestS=openChestFor; openChestFor=function(p){ const r=_chestS(p); if(r) sfx('chest'); return r; };
const _feedS=feed; feed=function(fid){ const p=prof(view.pid), b=p?p.points:0; const r=_feedS(fid); try{ if(prof(view.pid).points<b){ sfx('mnam'); setTimeout(()=>petVoice(prof(view.pid)),900); } }catch(e){} return r; };
const _dropS=dropSticker; dropSticker=function(p,quiet){ const r=_dropS(p,quiet); if(!quiet) sfx('pop'); return r; };
// kolo štěstí – cvakání během točení
document.addEventListener('click',e=>{ if(!e.target.closest || !e.target.closest('#wspin')) return; let k=0, d=50; const go=()=>{ if(k++>60) return; sfx('tick'); d*=1.055; if(d<700) setTimeout(go,d); else setTimeout(()=>sfx('chest'),150); }; go(); },true);
function petVoice(p){ if(!p) return; sfx(PET_SOUND[p.species]||'cat'); }
// klepnutí na zvířátko, kamaráda nebo koně
document.addEventListener('click',e=>{ const t=e.target; if(!t.closest) return;
  const pv=t.closest('.petav'); if(pv){ const card=t.closest('[data-open]'); const p=prof(card?card.dataset.open:view.pid); if(p&&p.mode==='pet'){ petVoice(p); hop(pv.querySelector('.petwrap')); } return; }
  if(t.matches('img.comp')){ const m=/i_pet(\d)/.exec(t.src); if(m) sfx(COMP_SOUND[m[1]]||'chick'); hop(t); return; }
  if(t.matches('img.horse')){ sfx('horse'); hop(t); } },true);
function hop(el){ if(!el) return; el.classList.remove('sndhop'); void el.offsetWidth; el.classList.add('sndhop'); }
// hudba podle obrazovky
const _renderS=render; render=function(){ const r=_renderS.apply(this,arguments); try{ MUSIC.set(musicForView()); addSndToggle(); }catch(e){} return r; };

// tlačítko 🔔 pro dítě (vedle 🔊)
function addSndToggle(){ let b=document.getElementById('sndtg');
  if(!b){ b=document.createElement('button'); b.id='sndtg'; document.body.appendChild(b);
    b.onclick=()=>{ const on=!SND.on(); lsSet('ph-sfx',on); addSndToggle(); MUSIC.set(musicForView()); if(on){ SND.init(); sfx('ok',2); } }; }
  const on=SND.on(); b.className=on?'on':''; b.textContent=on?'🔔':'🔕'; b.title='Zapnout nebo vypnout zvuky'; }
