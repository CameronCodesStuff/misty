import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, orderBy, limit, getDocs, increment, serverTimestamp, runTransaction } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAr7vu7WVP2SqoE0za9kbPY7zw2J_gdMgg",
  authDomain: "misty-14365.firebaseapp.com",
  projectId: "misty-14365",
  storageBucket: "misty-14365.firebasestorage.app",
  messagingSenderId: "56752616090",
  appId: "1:56752616090:web:65c559d16cb0fe74eb2523",
  measurementId: "G-6FM7K718R8"
};
const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);
const storage = getStorage(fbApp);

const $ = s => document.querySelector(s);
const app = $('#app');
let ME = null, MYDOC = null, MYPROFILE = null, liveEditTab = 'profile';

const FONTS = {sora:"'Sora',sans-serif", unbounded:"'Unbounded',sans-serif", orbitron:"'Orbitron',sans-serif", mono:"'JetBrains Mono',monospace", pixel:"'Press Start 2P',monospace", serif:"'Playfair Display',serif", cinzel:"'Cinzel',serif"};
const FONT_NAMES = {sora:'Sora', unbounded:'Unbounded', orbitron:'Orbitron', mono:'Mono', pixel:'Pixel', serif:'Serif', cinzel:'Cinzel'};
const ACCENTS = ['#a78bfa','#67e8f9','#f472b6','#34d399','#fbbf24','#fb7185','#60a5fa','#e879f9','#ffffff'];
const EMOJIS = ['🔗','🌐','💻','🎮','🎵','📺','💬','⭐','🚀','💜','🔥','👾','🎨','📁','☕','💰','📧','🛒'];
const BRANDS = {
  github:'GitHub', youtube:'YouTube', twitch:'Twitch', discord:'Discord', x:'X',
  instagram:'Instagram', tiktok:'TikTok', spotify:'Spotify', soundcloud:'SoundCloud',
  steam:'Steam', reddit:'Reddit', telegram:'Telegram', whatsapp:'WhatsApp',
  snapchat:'Snapchat', pinterest:'Pinterest', patreon:'Patreon', kofi:'Ko-fi',
  paypal:'PayPal', kick:'Kick', roblox:'Roblox'
};
const BRAND_MATCH = [
  ['github.com','github'],['youtu','youtube'],['twitch.tv','twitch'],['discord','discord'],
  ['twitter.com','x'],['x.com','x'],['instagram.com','instagram'],['tiktok.com','tiktok'],
  ['spotify.com','spotify'],['soundcloud.com','soundcloud'],['steam','steam'],
  ['reddit.com','reddit'],['t.me','telegram'],['telegram','telegram'],['wa.me','whatsapp'],
  ['whatsapp','whatsapp'],['snapchat','snapchat'],['pinterest','pinterest'],
  ['patreon','patreon'],['ko-fi','kofi'],['paypal','paypal'],['kick.com','kick'],['roblox','roblox']
];

const PRESETS = [
  {name:'Violet Mist', pro:false, t:{preset:'Violet Mist',bgType:'mist',bgA:'#a78bfa',bgB:'#67e8f9',accent:'#a78bfa',font:'sora',btnStyle:'glass',glow:true,particles:false,cursorFx:false,textColor:'#e7e7f2',radius:16}},
  {name:'Cyber Night', pro:false, t:{preset:'Cyber Night',bgType:'gradient',bgA:'#0f0524',bgB:'#003344',accent:'#67e8f9',font:'orbitron',btnStyle:'outline',glow:true,particles:true,cursorFx:false,textColor:'#d6faff',radius:8}},
  {name:'Rose Static', pro:false, t:{preset:'Rose Static',bgType:'gradient',bgA:'#1a0512',bgB:'#2b0a2e',accent:'#f472b6',font:'unbounded',btnStyle:'glass',glow:true,particles:false,cursorFx:true,textColor:'#ffe4f1',radius:22}},
  {name:'Terminal', pro:false, t:{preset:'Terminal',bgType:'solid',bgA:'#050805',bgB:'#050805',accent:'#34d399',font:'mono',btnStyle:'outline',glow:true,particles:false,cursorFx:false,textColor:'#c6f6d5',radius:4}},
  {name:'Arcade', pro:false, t:{preset:'Arcade',bgType:'gradient',bgA:'#12002e',bgB:'#000000',accent:'#fbbf24',font:'pixel',btnStyle:'solid',glow:false,particles:true,cursorFx:false,textColor:'#fff7d6',radius:0}},
  {name:'Ivory Ghost', pro:false, t:{preset:'Ivory Ghost',bgType:'gradient',bgA:'#101018',bgB:'#1c1c28',accent:'#ffffff',font:'serif',btnStyle:'outline',glow:false,particles:false,cursorFx:false,textColor:'#f5f5fa',radius:14}},
  {name:'Aurora Veil', pro:true, t:{preset:'Aurora Veil',bgType:'anim',anim:'aurora',bgA:'#04221c',bgB:'#0b1030',accent:'#34d399',font:'sora',btnStyle:'glass',glow:true,particles:false,cursorFx:true,textColor:'#e8fff7',radius:18}},
  {name:'Nebula Drift', pro:true, t:{preset:'Nebula Drift',bgType:'anim',anim:'nebula',bgA:'#1c0b3a',bgB:'#3a0b2e',accent:'#e879f9',font:'unbounded',btnStyle:'glass',glow:true,particles:false,cursorFx:true,textColor:'#f7e9ff',radius:20}},
  {name:'Holo Chrome', pro:true, t:{preset:'Holo Chrome',bgType:'anim',anim:'holo',bgA:'#241a3a',bgB:'#0d2a33',accent:'#ffffff',font:'orbitron',btnStyle:'outline',glow:true,particles:false,cursorFx:true,textColor:'#ffffff',radius:14}},
  {name:'Midnight Gold', pro:true, t:{preset:'Midnight Gold',bgType:'anim',anim:'gold',bgA:'#0c0803',bgB:'#2a1c05',accent:'#fbbf24',font:'cinzel',btnStyle:'outline',glow:true,particles:false,cursorFx:false,textColor:'#fdf3d7',radius:10}},
  {name:'Ember Rift', pro:true, t:{preset:'Ember Rift',bgType:'anim',anim:'ember',bgA:'#160308',bgB:'#3a0d10',accent:'#fb7185',font:'unbounded',btnStyle:'glass',glow:true,particles:false,cursorFx:true,textColor:'#ffe8e4',radius:16}},
  {name:'Deep Current', pro:true, t:{preset:'Deep Current',bgType:'anim',anim:'ocean',bgA:'#02131f',bgB:'#0a2a4a',accent:'#38bdf8',font:'sora',btnStyle:'glass',glow:true,particles:true,cursorFx:false,textColor:'#e2f6ff',radius:18}}
];
const DEFAULT_THEME = JSON.parse(JSON.stringify(PRESETS[0].t));

function toast(msg, icon='✨'){ const t=document.createElement('div'); t.className='toast'; t.innerHTML=`<span>${icon}</span><span>${esc(msg)}</span>`; $('#toasts').appendChild(t); setTimeout(()=>{t.style.opacity='0';t.style.transition='.4s';setTimeout(()=>t.remove(),400)},2600); }
function esc(s){ return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function debounce(fn,ms){ let t; return (...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}; }
function uid(){ return Math.random().toString(36).slice(2,10); }
function safeUrl(u){ u=String(u||'').trim(); if(!u) return ''; if(!/^https?:\/\//i.test(u)) u='https://'+u; try{ const p=new URL(u); return (p.protocol==='http:'||p.protocol==='https:')?p.href:''; }catch{ return ''; } }
function normUser(u){ return String(u||'').toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20); }
function num(n){ n=n||0; return n>999999?(n/1e6).toFixed(1)+'M':n>999?(n/1e3).toFixed(1)+'K':String(n); }
function detectBrand(url){ try{ const h=new URL(safeUrl(url)).hostname.toLowerCase()+new URL(safeUrl(url)).pathname.toLowerCase(); for(const [k,slug] of BRAND_MATCH) if(h.includes(k)) return slug; }catch{} return ''; }
function brandImg(slug,color){ return `<img src="https://cdn.simpleicons.org/${slug}/${color.replace('#','')}" alt="${esc(BRANDS[slug]||slug)}" loading="lazy" onerror="this.style.display='none'">`; }
function iconHTML(icon, t){
  if(BRANDS[icon]){
    const c = t.btnStyle==='solid' ? '0a0a14' : (t.accent==='#ffffff' ? 'ffffff' : t.accent.replace('#',''));
    return brandImg(icon, c);
  }
  return esc(icon||'🔗');
}

const mistCanvas = $('#mistbg');
const mctx = mistCanvas.getContext('2d');
let blobs = [];
function initMist(){
  mistCanvas.width = innerWidth; mistCanvas.height = innerHeight;
  blobs = Array.from({length:6},(_, i)=>({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight,
    r:200+Math.random()*260, dx:(Math.random()-.5)*.28, dy:(Math.random()-.5)*.28,
    c:i%3===0?'167,139,250':i%3===1?'103,232,249':'244,114,182', a:.05+Math.random()*.05
  }));
}
function drawMist(){
  mctx.clearRect(0,0,mistCanvas.width,mistCanvas.height);
  for(const b of blobs){
    b.x+=b.dx; b.y+=b.dy;
    if(b.x<-b.r) b.x=innerWidth+b.r; if(b.x>innerWidth+b.r) b.x=-b.r;
    if(b.y<-b.r) b.y=innerHeight+b.r; if(b.y>innerHeight+b.r) b.y=-b.r;
    const g=mctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
    g.addColorStop(0,`rgba(${b.c},${b.a})`); g.addColorStop(1,'rgba(0,0,0,0)');
    mctx.fillStyle=g; mctx.beginPath(); mctx.arc(b.x,b.y,b.r,0,7); mctx.fill();
  }
  requestAnimationFrame(drawMist);
}
initMist(); drawMist();
addEventListener('resize', initMist);

let cursorFxOn = false;
addEventListener('mousemove', e=>{
  if(!cursorFxOn || Math.random()>.35) return;
  const d=document.createElement('div'); d.className='cursor-dot';
  d.style.left=(e.clientX-4)+'px'; d.style.top=(e.clientY-4)+'px';
  d.style.background = window.__curAccent || '#a78bfa';
  d.style.boxShadow = `0 0 10px ${window.__curAccent||'#a78bfa'}`;
  document.body.appendChild(d);
  setTimeout(()=>{d.style.opacity='0'},50); setTimeout(()=>d.remove(),700);
});

onAuthStateChanged(auth, async user=>{
  ME = user;
  if(user){
    const uref = doc(db,'users',user.uid);
    let snap = await getDoc(uref);
    if(!snap.exists()){
      const pending = sessionStorage.getItem('misty_uname');
      await claimUsername(user, normUser(pending || (user.email||'user').split('@')[0]));
      snap = await getDoc(uref);
    }
    MYDOC = snap.exists()? snap.data(): null;
    if(MYDOC?.username){
      const ps = await getDoc(doc(db,'profiles',MYDOC.username));
      MYPROFILE = ps.exists()? ps.data(): null;
    }
  } else { MYDOC=null; MYPROFILE=null; }
  router();
});

async function claimUsername(user, wanted){
  let uname = normUser(wanted) || 'user'+uid().slice(0,4);
  for(let i=0;i<5;i++){
    const test = i===0? uname : uname+Math.floor(Math.random()*999);
    try{
      await runTransaction(db, async tx=>{
        const unameRef = doc(db,'usernames',test);
        const ex = await tx.get(unameRef);
        if(ex.exists()) throw new Error('taken');
        tx.set(unameRef,{uid:user.uid});
        tx.set(doc(db,'users',user.uid),{
          username:test, displayName:user.displayName||test, email:user.email||'',
          avatar:user.photoURL||'', bio:'', pro:false, role:'user', banned:false, createdAt:serverTimestamp()
        });
        tx.set(doc(db,'profiles',test),{
          owner:user.uid, username:test, displayName:user.displayName||test,
          avatar:user.photoURL||'', banner:'', bio:'Just arrived in the mist.', status:'',
          badges:['og'], theme:DEFAULT_THEME, links:[], widgets:[],
          views:0, likes:0, createdAt:serverTimestamp()
        });
      });
      sessionStorage.removeItem('misty_uname');
      return test;
    }catch(e){ if(e.message!=='taken') throw e; }
  }
  throw new Error('Could not claim a username');
}

function route(){ const h=location.hash.replace(/^#\/?/,''); return h||''; }
addEventListener('hashchange', router);

function router(){
  cursorFxOn = false;
  document.body.classList.remove('previewing');
  document.querySelectorAll('.public-page,.fab').forEach(e=>e.remove());
  const r = route();
  if(r.startsWith('@')) return renderPublic(normUser(r.slice(1)));
  if(r==='auth') return renderAuth();
  if(r==='dashboard') return ME? renderDashboard(): renderAuth();
  if(r==='discover') return renderDiscover();
  if(r==='admin') return renderAdmin();
  renderLanding();
}

function navHTML(active){
  const user = ME && MYDOC;
  return `<nav><div class="wrap">
    <div class="logo" onclick="location.hash=''"><img src="logo.png" alt="">MISTY</div>
    <div class="navlinks">
      <button class="nl hidem ${active==='discover'?'on':''}" onclick="location.hash='#/discover'">Discover</button>
      ${user? `<button class="nl ${active==='dash'?'on':''}" onclick="location.hash='#/dashboard'">Dashboard</button>
        ${MYDOC?.role==='admin'? `<button class="nl ${active==='admin'?'on':''}" onclick="location.hash='#/admin'">Admin</button>`:''}
        <button class="nl hidem" onclick="location.hash='#/@${MYDOC.username}'">My page</button>
        <img class="avatar-mini" src="${esc(MYDOC.avatar||avatarFor(MYDOC.username))}" onclick="location.hash='#/dashboard'">`
      : `<button class="nl" onclick="location.hash='#/auth'">Log in</button>
        <button class="btn primary sm" onclick="location.hash='#/auth'">Create Your Misty</button>`}
    </div>
  </div></nav>`;
}
function avatarFor(name){ return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(name||'misty')}`; }

function miniThemeInner(p){
  const t = p.t;
  const bg = t.bgType==='anim'? '' : t.bgType==='solid'? `background:${t.bgA}` : t.bgType==='mist'? `background:radial-gradient(120% 90% at 20% 10%,${t.bgA}33,transparent 60%),radial-gradient(110% 90% at 85% 85%,${t.bgB}2e,transparent 60%),#0a0a14` : `background:linear-gradient(140deg,${t.bgA},${t.bgB})`;
  const animLayer = t.bgType==='anim'? `<div class="pp-anim anim-${t.anim}" style="inset:0"></div>`:'';
  const linkStyle = (r)=>`border-radius:${Math.min(t.radius,12)}px;${t.btnStyle==='solid'?`background:${t.accent}`:t.btnStyle==='outline'?`border:1.5px solid ${t.accent}`:`background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.15)`};${t.glow?`box-shadow:0 0 10px ${t.accent}55`:''}`;
  return `<div style="position:absolute;inset:0;${bg}">${animLayer}</div>
    <div class="pv-user" style="font-family:${FONTS[t.font]};color:${t.textColor}">username</div>
    <div class="pv-links"><i style="${linkStyle()}"></i><i style="${linkStyle()}"></i><i style="${linkStyle()}"></i></div>`;
}

function renderLanding(){
  app.innerHTML = navHTML('') + `
  <div class="wrap">
    <div class="hero">
      <img class="hero-logo" src="logo.png" alt="Misty">
      <div class="eyebrow">// digital identity, reimagined</div>
      <h1>Your identity.<br>Your space.<br><span class="gr">Your Misty.</span></h1>
      <p>Create a digital identity that feels completely yours. Animated backgrounds, living links, widgets, themes — one page that is unmistakably you.</p>
      <div class="cta">
        <button class="btn primary" onclick="location.hash='#/auth'">Create Your Misty</button>
        <button class="btn" onclick="location.hash='#/discover'">Explore Profiles</button>
      </div>
      <div class="claim glass">
        <span>misty.gg/</span>
        <input id="claimIn" placeholder="yourname" maxlength="20" spellcheck="false" autocomplete="off">
        <button class="btn primary sm" id="claimBtn">Claim</button>
      </div>
    </div>
  </div>
  <section class="land"><div class="wrap">
    <div class="sechead"><div class="eyebrow">// what you get</div><h2>Everything a link page wishes it was</h2></div>
    <div class="grid3">
      <div class="feat glass"><span class="ic">🌫️</span><h3>Living backgrounds</h3><p>Drifting mist, animated auroras, nebulas, gradients, particles and full video backgrounds — your page breathes.</p></div>
      <div class="feat glass"><span class="ic">🔗</span><h3>Links with presence</h3><p>Real brand icons, glass, outline or solid styles with glow, hover motion and per-link click tracking.</p></div>
      <div class="feat glass"><span class="ic">🧩</span><h3>Widgets</h3><p>Drop in Spotify players, YouTube videos, Discord invites, images and text blocks.</p></div>
      <div class="feat glass"><span class="ic">🎨</span><h3>Theme gallery</h3><p>Twelve full presets — six free, six animated Pro exclusives — then tune every color, font and effect.</p></div>
      <div class="feat glass"><span class="ic">📊</span><h3>Real analytics</h3><p>Profile views, likes and click counts for every single link, updated live from Firestore.</p></div>
      <div class="feat glass"><span class="ic">⚡</span><h3>Live editor</h3><p>Edit on the left, watch your actual page update instantly on the right. Autosaved as you type.</p></div>
    </div>
  </div></section>
  <section class="land"><div class="wrap">
    <div class="sechead"><div class="eyebrow">// theme showcase</div><h2>Start from a mood</h2><p>The ✦ themes are animated Pro exclusives.</p></div>
    <div class="showcase">${PRESETS.map(p=>`
      <div class="theme-mini" onclick="location.hash='#/auth'">
        <div style="position:absolute;inset:0;${p.t.bgType==='anim'?'':p.t.bgType==='solid'?`background:${p.t.bgA}`:`background:linear-gradient(140deg,${p.t.bgA},${p.t.bgB})`}">
          ${p.t.bgType==='anim'?`<div class="pp-anim anim-${p.t.anim}" style="inset:0"></div>`:''}
        </div>
        <div class="tuser" style="font-family:${FONTS[p.t.font]};color:${p.t.textColor}">username</div>
        <div class="tlinks">
          ${[1,2,3].map(()=>`<i style="border-radius:${Math.min(p.t.radius,13)}px;${p.t.btnStyle==='solid'?`background:${p.t.accent}`:p.t.btnStyle==='outline'?`border:1.5px solid ${p.t.accent}`:`background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.15)`};${p.t.glow?`box-shadow:0 0 12px ${p.t.accent}44`:''}"></i>`).join('')}
        </div>
        <div class="tlabel">${p.pro?'✦ ':''}${p.name}</div>
      </div>`).join('')}
    </div>
  </div></section>
  <section class="land"><div class="wrap">
    <div class="sechead"><div class="eyebrow">// pricing</div><h2>Free forever. Pro when you want more.</h2></div>
    <div class="pricing">
      <div class="plan glass"><h3>Free</h3><div class="price">$0<small>/forever</small></div>
        <ul><li>Your misty.gg page</li><li>Unlimited links</li><li>Six theme presets</li><li>Core effects & fonts</li><li>Views & click analytics</li></ul>
        <button class="btn" style="width:100%" onclick="location.hash='#/auth'">Start free</button></div>
      <div class="plan glass pro"><div class="tag">MISTY PRO</div><h3>Pro</h3><div class="price">$4<small>/month</small></div>
        <ul><li>Everything in Free</li><li>Six animated Pro themes</li><li>Video backgrounds</li><li>PRO badge on your page</li><li>Priority on Discover</li><li>Everything we ship next</li></ul>
        <button class="btn primary" style="width:100%" onclick="location.hash='#/auth'">Go Pro</button></div>
    </div>
  </div></section>
  <section class="land"><div class="wrap">
    <div class="sechead"><div class="eyebrow">// faq</div><h2>Questions</h2></div>
    <div class="faq">
      <details><summary>What is Misty?</summary><p>Misty is a customizable profile page — one link that holds your socials, projects, music and personality. Think link-in-bio, but alive.</p></details>
      <details><summary>Is it really free?</summary><p>Yes. Free accounts get a full page with unlimited links, themes and analytics. Pro unlocks the animated themes and video backgrounds.</p></details>
      <details><summary>Can I change my look later?</summary><p>Any time. The dashboard has a live editor — every change previews instantly and saves automatically.</p></details>
      <details><summary>Do I own my page?</summary><p>Your username is yours from the moment you claim it. You can edit or wipe your page whenever you like.</p></details>
    </div>
  </div></section>
  <footer><div class="wrap"><div class="logo"><img src="logo.png" alt="">MISTY</div>Made in the mist · © ${new Date().getFullYear()}</div></footer>`;
  $('#claimBtn').onclick = ()=>{ const v=normUser($('#claimIn').value); if(v) sessionStorage.setItem('misty_uname', v); location.hash='#/auth'; };
  $('#claimIn').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#claimBtn').click(); });
}

function renderAuth(mode='signup'){
  if(ME && MYDOC){ location.hash='#/dashboard'; return; }
  const pending = sessionStorage.getItem('misty_uname')||'';
  app.innerHTML = navHTML('') + `<div class="wrap">
    <div class="authbox glass">
      <h2>${mode==='signup'?'Create your Misty':'Welcome back'}</h2>
      <div class="sub">${mode==='signup'?'Claim your corner of the mist.':'The mist remembers you.'}</div>
      ${mode==='signup'?`<label>Username</label>
      <div class="userfield">
        <span>misty.gg/</span>
        <input id="aUser" value="${esc(pending)}" placeholder="yourname" maxlength="20" spellcheck="false" autocomplete="off">
      </div>`:''}
      <label>Email</label><input id="aEmail" type="email" placeholder="you@somewhere.com" autocomplete="email">
      <label>Password</label><input id="aPass" type="password" placeholder="••••••••" autocomplete="${mode==='signup'?'new-password':'current-password'}">
      <button class="btn primary" id="aGo" style="width:100%;margin-top:22px">${mode==='signup'?'Create account':'Log in'}</button>
      <div class="divide">or</div>
      <button class="btn" id="aGoogle" style="width:100%">🔮 Continue with Google</button>
      <div class="switchmode">${mode==='signup'?`Already have a page? <a id="aSwap">Log in</a>`:`New here? <a id="aSwap">Create your Misty</a> · <a id="aForgot">Forgot password</a>`}</div>
    </div></div>`;
  $('#aSwap').onclick = ()=>renderAuth(mode==='signup'?'login':'signup');
  const forgot = $('#aForgot'); if(forgot) forgot.onclick = async ()=>{
    const em = $('#aEmail').value.trim(); if(!em) return toast('Enter your email first','📧');
    try{ await sendPasswordResetEmail(auth, em); toast('Reset email sent','📧'); }catch(e){ toast(cleanErr(e),'⚠️'); }
  };
  $('#aGo').onclick = async ()=>{
    const em=$('#aEmail').value.trim(), pw=$('#aPass').value;
    if(!em||!pw) return toast('Email and password required','⚠️');
    $('#aGo').disabled = true;
    try{
      if(mode==='signup'){
        const un = normUser($('#aUser').value);
        if(!un || un.length<3){ $('#aGo').disabled=false; return toast('Username needs 3+ characters','⚠️'); }
        const taken = await getDoc(doc(db,'usernames',un));
        if(taken.exists()){ $('#aGo').disabled=false; return toast('That username is taken','😔'); }
        sessionStorage.setItem('misty_uname', un);
        await createUserWithEmailAndPassword(auth, em, pw);
        toast('Welcome to the mist','🌫️');
      } else {
        await signInWithEmailAndPassword(auth, em, pw);
        toast('Logged in','✨');
      }
      location.hash='#/dashboard';
    }catch(e){ toast(cleanErr(e),'⚠️'); $('#aGo').disabled=false; }
  };
  $('#aGoogle').onclick = async ()=>{
    try{ await signInWithPopup(auth, new GoogleAuthProvider()); location.hash='#/dashboard'; }
    catch(e){ if(!String(e.code).includes('popup-closed')) toast(cleanErr(e),'⚠️'); }
  };
}
function cleanErr(e){ return String(e.code||e.message||e).replace('auth/','').replace(/-/g,' '); }

async function renderDashboard(){
  if(!MYDOC || !MYPROFILE){ app.innerHTML = navHTML('dash')+`<div class="spin"></div>`; return; }
  app.innerHTML = navHTML('dash') + `<div class="wrap"><div class="dash">
    <div class="panel glass">
      <div class="tabs" id="dTabs">
        ${['profile','looks','links','widgets','stats','account'].map(t=>`<button data-t="${t}" class="${liveEditTab===t?'on':''}">${{profile:'Profile',looks:'Looks',links:'Links',widgets:'Widgets',stats:'Stats',account:'Account'}[t]}</button>`).join('')}
      </div>
      <div id="dBody"></div>
    </div>
    <div class="preview-shell">
      <div class="preview-bar">
        <span class="mono">misty.gg/${esc(MYDOC.username)}</span>
        <div style="display:flex;gap:14px;align-items:center">
          <span class="savestate"><span class="dot" id="saveDot"></span><span id="saveTxt">Saved</span></span>
          <a href="#/@${esc(MYDOC.username)}" style="font-size:12px">Open ↗</a>
        </div>
      </div>
      <div class="preview-frame" id="previewFrame"></div>
    </div>
  </div></div>`;
  const fab = document.createElement('button');
  fab.className='fab'; fab.id='pvFab'; fab.textContent='👁';
  fab.onclick = ()=>{ const on=document.body.classList.toggle('previewing'); fab.textContent=on?'✎':'👁'; };
  document.body.appendChild(fab);
  $('#dTabs').querySelectorAll('button').forEach(b=> b.onclick=()=>{ liveEditTab=b.dataset.t; renderDashboard(); });
  renderEditorTab();
  renderPreview();
}

function markSaving(){ $('#saveDot')?.classList.add('saving'); if($('#saveTxt')) $('#saveTxt').textContent='Saving…'; }
function markSaved(){ $('#saveDot')?.classList.remove('saving'); if($('#saveTxt')) $('#saveTxt').textContent='Saved'; }
const pushProfile = debounce(async ()=>{
  try{ await updateDoc(doc(db,'profiles',MYDOC.username), MYPROFILE); markSaved(); }
  catch(e){ toast('Save failed: '+cleanErr(e),'⚠️'); }
}, 700);
function saveProfile(){ markSaving(); renderPreview(); pushProfile(); }

function renderPreview(){
  const f = $('#previewFrame'); if(!f) return;
  f.innerHTML = profileHTML(MYPROFILE, {preview:true});
  wireProfileFx(f, MYPROFILE, {preview:true});
}

function field(lbl, html){ return `<label>${lbl}</label>${html}`; }

function renderEditorTab(){
  const body = $('#dBody'); const p = MYPROFILE; const t = p.theme;
  if(liveEditTab==='profile'){
    body.innerHTML = `
      ${field('Display name', `<input id="eName" value="${esc(p.displayName)}" maxlength="32">`)}
      ${field('Status', `<input id="eStatus" value="${esc(p.status||'')}" maxlength="60" placeholder="🌫️ vibing in the mist">`)}
      ${field('Bio', `<textarea id="eBio" rows="4" maxlength="400">${esc(p.bio||'')}</textarea>`)}
      ${field('Avatar', `<div class="filedrop" id="upAv">${p.avatar?'Change avatar':'Upload avatar'} · or paste a URL below</div><input id="eAv" value="${esc(p.avatar||'')}" placeholder="https://..." style="margin-top:8px">`)}
      ${field('Banner', `<div class="filedrop" id="upBan">${p.banner?'Change banner':'Upload banner'} · or paste a URL below</div><input id="eBan" value="${esc(p.banner||'')}" placeholder="https://..." style="margin-top:8px">`)}`;
    $('#eName').oninput = e=>{ p.displayName=e.target.value; saveProfile(); };
    $('#eStatus').oninput = e=>{ p.status=e.target.value; saveProfile(); };
    $('#eBio').oninput = e=>{ p.bio=e.target.value; saveProfile(); };
    $('#eAv').onchange = e=>{ p.avatar=safeUrl(e.target.value); saveProfile(); };
    $('#eBan').onchange = e=>{ p.banner=safeUrl(e.target.value); saveProfile(); };
    $('#upAv').onclick = ()=>pickUpload('avatar', url=>{ p.avatar=url; $('#eAv').value=url; saveProfile(); });
    $('#upBan').onclick = ()=>pickUpload('banner', url=>{ p.banner=url; $('#eBan').value=url; saveProfile(); });
  }
  if(liveEditTab==='looks'){
    body.innerHTML = `
      ${field('Theme presets', `<div class="preset-grid">${PRESETS.map((pr,i)=>`
        <div class="preset-card ${t.preset===pr.name?'on':''}" data-preset="${i}">
          ${miniThemeInner(pr)}
          <div class="pv-name">${pr.pro?'✦':''} ${pr.name}</div>
          ${pr.pro && !MYDOC.pro? `<div class="pv-lock">🔒</div>`:''}
        </div>`).join('')}</div>`)}
      ${field('Background', `<div class="optrow" id="bgRow">${['mist','gradient','solid','image','video'].map(b=>`<button class="opt ${t.bgType===b?'on':''}" data-bg="${b}">${b[0].toUpperCase()+b.slice(1)}${b==='video'?' ✦':''}</button>`).join('')}${t.bgType==='anim'?`<button class="opt on">Animated ✦</button>`:''}</div>`)}
      <div id="bgExtra"></div>
      ${field('Accent color', `<div class="swatches">${ACCENTS.map(c=>`<div class="sw ${t.accent===c?'on':''}" data-ac="${c}" style="background:${c};box-shadow:0 0 10px ${c}55"></div>`).join('')}</div>`)}
      ${field('Font', `<div class="optrow">${Object.keys(FONTS).map(f=>`<button class="opt ${t.font===f?'on':''}" data-font="${f}" style="font-family:${FONTS[f]}">${FONT_NAMES[f]}</button>`).join('')}</div>`)}
      ${field('Button style', `<div class="optrow">${['glass','outline','solid'].map(s=>`<button class="opt ${t.btnStyle===s?'on':''}" data-bs="${s}">${s[0].toUpperCase()+s.slice(1)}</button>`).join('')}</div>`)}
      ${field('Corner radius', `<input id="eRad" type="range" min="0" max="28" value="${t.radius??16}">`)}
      ${field('Effects', `<div class="optrow">
        <button class="opt ${t.glow?'on':''}" id="fxGlow">✨ Glow</button>
        <button class="opt ${t.particles?'on':''}" id="fxPart">❄ Particles</button>
        <button class="opt ${t.cursorFx?'on':''}" id="fxCur">🖱 Cursor trail</button>
      </div>`)}
      ${field('Text color', `<div class="swatches">${['#e7e7f2','#ffffff','#d6faff','#ffe4f1','#c6f6d5','#fff7d6','#f7e9ff','#e2f6ff'].map(c=>`<div class="sw ${t.textColor===c?'on':''}" data-tc="${c}" style="background:${c}"></div>`).join('')}</div>`)}`;
    body.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>{
      const pr = PRESETS[+b.dataset.preset];
      if(pr.pro && !MYDOC.pro) return openProModal(pr.name);
      p.theme = JSON.parse(JSON.stringify(pr.t));
      toast(`Applied ${pr.name}`, pr.pro?'✦':'🎨');
      saveProfile(); renderEditorTab();
    });
    body.querySelectorAll('[data-bg]').forEach(b=>b.onclick=()=>{
      if(b.dataset.bg==='video' && !MYDOC.pro) return openProModal();
      t.bgType=b.dataset.bg; t.preset=''; saveProfile(); renderEditorTab();
    });
    body.querySelectorAll('[data-ac]').forEach(b=>b.onclick=()=>{ t.accent=b.dataset.ac; saveProfile(); renderEditorTab(); });
    body.querySelectorAll('[data-tc]').forEach(b=>b.onclick=()=>{ t.textColor=b.dataset.tc; saveProfile(); renderEditorTab(); });
    body.querySelectorAll('[data-font]').forEach(b=>b.onclick=()=>{ t.font=b.dataset.font; saveProfile(); renderEditorTab(); });
    body.querySelectorAll('[data-bs]').forEach(b=>b.onclick=()=>{ t.btnStyle=b.dataset.bs; saveProfile(); renderEditorTab(); });
    $('#eRad').oninput = e=>{ t.radius=+e.target.value; saveProfile(); };
    $('#fxGlow').onclick = ()=>{ t.glow=!t.glow; saveProfile(); renderEditorTab(); };
    $('#fxPart').onclick = ()=>{ t.particles=!t.particles; saveProfile(); renderEditorTab(); };
    $('#fxCur').onclick = ()=>{ t.cursorFx=!t.cursorFx; saveProfile(); renderEditorTab(); };
    const extra = $('#bgExtra');
    if(t.bgType==='gradient'||t.bgType==='solid'){
      extra.innerHTML = field(t.bgType==='solid'?'Color':'Gradient colors', `<div style="display:flex;gap:10px">
        <input id="bgA" type="color" value="${t.bgA||'#0f0524'}">
        ${t.bgType==='gradient'?`<input id="bgB" type="color" value="${t.bgB||'#003344'}">`:''}
      </div>`);
      $('#bgA').oninput = e=>{ t.bgA=e.target.value; t.preset=''; saveProfile(); };
      const bb=$('#bgB'); if(bb) bb.oninput = e=>{ t.bgB=e.target.value; t.preset=''; saveProfile(); };
    }
    if(t.bgType==='image'){
      extra.innerHTML = field('Background image', `<div class="filedrop" id="upBg">Upload image</div><input id="bgImg" value="${esc(t.bgImage||'')}" placeholder="https://..." style="margin-top:8px">`);
      $('#bgImg').onchange = e=>{ t.bgImage=safeUrl(e.target.value); saveProfile(); };
      $('#upBg').onclick = ()=>pickUpload('background', url=>{ t.bgImage=url; saveProfile(); renderEditorTab(); });
    }
    if(t.bgType==='video'){
      extra.innerHTML = field('Background video (mp4/webm)', `<div class="filedrop" id="upVid">Upload video</div><input id="bgVid" value="${esc(t.bgVideo||'')}" placeholder="https://....mp4" style="margin-top:8px">`);
      $('#bgVid').onchange = e=>{ t.bgVideo=safeUrl(e.target.value); saveProfile(); };
      $('#upVid').onclick = ()=>pickUpload('bgvideo', url=>{ t.bgVideo=url; saveProfile(); renderEditorTab(); }, 'video/*', 50);
    }
  }
  if(liveEditTab==='links'){
    body.innerHTML = `
      <button class="btn primary" id="addLink" style="width:100%">+ Add link</button>
      <div style="margin-top:18px" id="linkList">
        ${p.links.length? p.links.map((l,i)=>`
          <div class="linkitem">
            <div class="lic">${BRANDS[l.icon]? brandImg(l.icon,'8b8ba3') : esc(l.icon||'🔗')}</div>
            <div class="info"><b>${esc(l.title)}</b><span>${esc(l.url)}</span></div>
            <div class="iconbtns">
              <button data-up="${i}" title="Move up">↑</button>
              <button data-dn="${i}" title="Move down">↓</button>
              <button data-ed="${i}" title="Edit">✎</button>
              <button data-rm="${i}" title="Delete">✕</button>
            </div>
          </div>`).join('') : `<div class="empty"><span class="big">🔗</span>No links yet. Add your first one.</div>`}
      </div>`;
    $('#addLink').onclick = ()=>linkModal();
    body.querySelectorAll('[data-ed]').forEach(b=>b.onclick=()=>linkModal(+b.dataset.ed));
    body.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{ p.links.splice(+b.dataset.rm,1); saveProfile(); renderEditorTab(); });
    body.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.up; if(i>0){ [p.links[i-1],p.links[i]]=[p.links[i],p.links[i-1]]; saveProfile(); renderEditorTab(); }});
    body.querySelectorAll('[data-dn]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.dn; if(i<p.links.length-1){ [p.links[i+1],p.links[i]]=[p.links[i],p.links[i+1]]; saveProfile(); renderEditorTab(); }});
  }
  if(liveEditTab==='widgets'){
    body.innerHTML = `
      ${field('Add a widget', `<div class="optrow">
        ${[['youtube','▶ YouTube'],['spotify','🎵 Spotify'],['discord','💬 Discord'],['image','🖼 Image'],['text','✍ Text']].map(([k,n])=>`<button class="opt" data-w="${k}">${n}</button>`).join('')}
      </div>`)}
      <div style="margin-top:18px">
        ${p.widgets.length? p.widgets.map((w,i)=>`
          <div class="linkitem">
            <div class="lic">${{youtube:'▶',spotify:'🎵',discord:'💬',image:'🖼',text:'✍'}[w.type]||'🧩'}</div>
            <div class="info"><b>${esc(w.title||w.type)}</b><span>${esc((w.value||'').slice(0,60))}</span></div>
            <div class="iconbtns">
              <button data-wup="${i}">↑</button><button data-wdn="${i}">↓</button><button data-wrm="${i}">✕</button>
            </div>
          </div>`).join(''): `<div class="empty"><span class="big">🧩</span>No widgets yet.</div>`}
      </div>`;
    body.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>widgetModal(b.dataset.w));
    body.querySelectorAll('[data-wrm]').forEach(b=>b.onclick=()=>{ p.widgets.splice(+b.dataset.wrm,1); saveProfile(); renderEditorTab(); });
    body.querySelectorAll('[data-wup]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.wup; if(i>0){ [p.widgets[i-1],p.widgets[i]]=[p.widgets[i],p.widgets[i-1]]; saveProfile(); renderEditorTab(); }});
    body.querySelectorAll('[data-wdn]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.wdn; if(i<p.widgets.length-1){ [p.widgets[i+1],p.widgets[i]]=[p.widgets[i],p.widgets[i+1]]; saveProfile(); renderEditorTab(); }});
  }
  if(liveEditTab==='stats'){
    body.innerHTML = `<div class="spin"></div>`;
    loadStats(body);
  }
  if(liveEditTab==='account'){
    body.innerHTML = `
      <div class="statgrid">
        <div class="stat glass"><div class="n">${MYDOC.pro?'PRO':'FREE'}</div><div class="l">Plan</div></div>
        <div class="stat glass"><div class="n mono" style="font-size:15px;padding-top:8px">@${esc(MYDOC.username)}</div><div class="l">Username</div></div>
      </div>
      ${!MYDOC.pro? `<button class="btn primary" id="goPro" style="width:100%">✦ Upgrade to Misty Pro</button>`:`<div class="empty" style="padding:16px">✦ You're a Pro. Thanks for supporting the mist.</div>`}
      ${field('Share your page', `<div style="display:flex;gap:8px"><input readonly value="${location.origin+location.pathname}#/@${esc(MYDOC.username)}"><button class="btn sm" id="copyUrl">Copy</button></div>`)}
      <div style="display:flex;gap:10px;margin-top:26px">
        <button class="btn" id="logout" style="flex:1">Log out</button>
        <button class="btn danger" id="wipe" style="flex:1">Reset page</button>
      </div>`;
    const gp=$('#goPro'); if(gp) gp.onclick=()=>openProModal();
    $('#copyUrl').onclick = e=>{ navigator.clipboard.writeText(e.target.previousElementSibling.value); toast('Link copied','📋'); };
    $('#logout').onclick = async ()=>{ await signOut(auth); location.hash=''; };
    $('#wipe').onclick = ()=>{
      openModal(`<h3>Reset your page?</h3><div class="sub">This clears your links, widgets and theme. Your username stays yours.</div>
        <div style="display:flex;gap:10px;margin-top:20px"><button class="btn" id="mCancel" style="flex:1">Cancel</button><button class="btn danger" id="mYes" style="flex:1">Reset</button></div>`);
      $('#mYes').onclick = ()=>{ MYPROFILE.links=[]; MYPROFILE.widgets=[]; MYPROFILE.theme=JSON.parse(JSON.stringify(DEFAULT_THEME)); MYPROFILE.bio=''; MYPROFILE.status=''; saveProfile(); closeModal(); renderEditorTab(); toast('Page reset','🧹'); };
    };
  }
}

async function loadStats(body){
  let clicks = {};
  try{ const cs = await getDoc(doc(db,'clicks',MYDOC.username)); if(cs.exists()) clicks = cs.data(); }catch{}
  const totalClicks = Object.values(clicks).reduce((a,b)=>a+(+b||0),0);
  const max = Math.max(1,...Object.values(clicks).map(v=>+v||0));
  body.innerHTML = `
    <div class="statgrid">
      <div class="stat glass"><div class="n">${num(MYPROFILE.views)}</div><div class="l">Profile views</div></div>
      <div class="stat glass"><div class="n">${num(MYPROFILE.likes)}</div><div class="l">Likes</div></div>
      <div class="stat glass"><div class="n">${num(totalClicks)}</div><div class="l">Link clicks</div></div>
      <div class="stat glass"><div class="n">${MYPROFILE.links.length}</div><div class="l">Links</div></div>
    </div>
    <label>Clicks per link</label>
    ${MYPROFILE.links.length? MYPROFILE.links.map(l=>{
      const c = +clicks[l.id]||0;
      return `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:13px;gap:10px"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${BRANDS[l.icon]?'':esc(l.icon||'🔗')+' '}${esc(l.title)}</span><span class="mono" style="color:var(--dim)">${num(c)}</span></div><div class="bar"><i style="width:${Math.round(c/max*100)}%"></i></div></div>`;
    }).join(''): `<div class="empty">Add links to start tracking clicks.</div>`}`;
}

function linkModal(idx){
  const l = idx!=null? {...MYPROFILE.links[idx]} : {id:uid(), title:'', url:'', icon:'', desc:''};
  openModal(`<h3>${idx!=null?'Edit link':'New link'}</h3>
    ${field('Title',`<input id="mTitle" value="${esc(l.title)}" maxlength="40" placeholder="My YouTube">`)}
    ${field('URL',`<input id="mUrl" value="${esc(l.url)}" placeholder="youtube.com/@you">`)}
    ${field('Description',`<input id="mDesc" value="${esc(l.desc||'')}" maxlength="60" placeholder="optional">`)}
    ${field('Icon — auto-detected from URL, or pick one',`
      <div class="brandgrid" id="mBrands">${Object.keys(BRANDS).map(b=>`<div class="brand ${l.icon===b?'on':''}" data-bic="${b}" title="${BRANDS[b]}">${brandImg(b,'e7e7f2')}</div>`).join('')}</div>
      <div style="margin-top:8px">${EMOJIS.map(ic=>`<span class="chip ${l.icon===ic?'on':''}" data-ic="${ic}">${ic}</span>`).join('')}</div>`)}
    <div style="display:flex;gap:10px;margin-top:24px"><button class="btn" id="mCancel" style="flex:1">Cancel</button><button class="btn primary" id="mSave" style="flex:1">Save</button></div>`);
  const selectIcon = (val)=>{
    l.icon = val;
    document.querySelectorAll('[data-bic],[data-ic]').forEach(x=>x.classList.toggle('on', x.dataset.bic===val || x.dataset.ic===val));
  };
  document.querySelectorAll('[data-bic]').forEach(c=>c.onclick=()=>selectIcon(c.dataset.bic));
  document.querySelectorAll('[data-ic]').forEach(c=>c.onclick=()=>selectIcon(c.dataset.ic));
  $('#mUrl').addEventListener('change', e=>{
    if(!l.icon || BRANDS[l.icon]){
      const d = detectBrand(e.target.value);
      if(d) selectIcon(d);
    }
  });
  $('#mSave').onclick = ()=>{
    l.title = $('#mTitle').value.trim(); l.url = safeUrl($('#mUrl').value); l.desc = $('#mDesc').value.trim();
    if(!l.title || !l.url) return toast('Title and a valid URL required','⚠️');
    if(!l.icon) l.icon = detectBrand(l.url) || '🔗';
    if(idx!=null) MYPROFILE.links[idx]=l; else MYPROFILE.links.push(l);
    saveProfile(); closeModal(); renderEditorTab();
  };
}

function widgetModal(type){
  const hints = {youtube:'YouTube video URL', spotify:'Spotify track/playlist/album URL', discord:'Discord invite URL', image:'Image URL', text:'Your text'};
  openModal(`<h3>Add ${type} widget</h3>
    ${field('Title (optional)',`<input id="wTitle" maxlength="40">`)}
    ${field(hints[type], type==='text'? `<textarea id="wVal" rows="4" maxlength="600"></textarea>`:`<input id="wVal" placeholder="https://...">`)}
    ${type==='image'?`<div class="filedrop" id="wUp" style="margin-top:10px">Or upload an image</div>`:''}
    <div style="display:flex;gap:10px;margin-top:24px"><button class="btn" id="mCancel" style="flex:1">Cancel</button><button class="btn primary" id="mSave" style="flex:1">Add</button></div>`);
  const wu=$('#wUp'); if(wu) wu.onclick=()=>pickUpload('widget', url=>{ $('#wVal').value=url; });
  $('#mSave').onclick = ()=>{
    let v = $('#wVal').value.trim();
    if(type!=='text') v = safeUrl(v);
    if(!v) return toast('Value required','⚠️');
    MYPROFILE.widgets.push({id:uid(), type, title:$('#wTitle').value.trim(), value:v});
    saveProfile(); closeModal(); renderEditorTab();
  };
}

function openModal(inner){
  closeModal();
  const v = document.createElement('div'); v.className='modal-veil'; v.id='veil';
  v.innerHTML = `<div class="modal glass">${inner}</div>`;
  v.onclick = e=>{ if(e.target===v) closeModal(); };
  document.body.appendChild(v);
  const c = $('#mCancel'); if(c) c.onclick = closeModal;
}
function closeModal(){ $('#veil')?.remove(); }

function openProModal(themeName){
  openModal(`<h3>✦ Misty Pro</h3>
    <div class="sub">${themeName? `<b>${esc(themeName)}</b> is a Pro theme. `:''}Unlock all six animated themes, video backgrounds, the PRO badge, priority on Discover, and everything we ship next.</div>
    <div class="stat glass" style="margin:18px 0"><div class="n">$4<small style="font-size:13px;color:var(--dim)">/mo</small></div><div class="l">Cancel anytime</div></div>
    <button class="btn primary" id="mPro" style="width:100%">Activate Pro</button>
    <div style="text-align:center;margin-top:12px;font-size:11px;color:var(--dim)">Payment processing coming soon — activating instantly for now.</div>`);
  $('#mPro').onclick = async ()=>{
    try{
      await updateDoc(doc(db,'users',ME.uid),{pro:true});
      MYDOC.pro = true;
      if(!MYPROFILE.badges.includes('pro')) MYPROFILE.badges.push('pro');
      saveProfile(); closeModal(); toast('Welcome to Pro','✦'); renderDashboard();
    }catch(e){ toast(cleanErr(e),'⚠️'); }
  };
}

function pickUpload(kind, done, accept='image/*', maxMB=8){
  const inp = document.createElement('input'); inp.type='file'; inp.accept=accept;
  inp.onchange = async ()=>{
    const f = inp.files[0]; if(!f) return;
    if(f.size > maxMB*1024*1024) return toast(`Max ${maxMB}MB`,'⚠️');
    toast('Uploading…','☁️');
    try{
      const r = ref(storage, `users/${ME.uid}/${kind}_${Date.now()}_${f.name.replace(/[^\w.]/g,'')}`);
      await uploadBytes(r, f);
      done(await getDownloadURL(r));
      toast('Uploaded','✅');
    }catch(e){ toast('Upload failed: '+cleanErr(e),'⚠️'); }
  };
  inp.click();
}

function bgStyle(t){
  if(t.bgType==='solid') return `background:${t.bgA||'#07070f'}`;
  if(t.bgType==='gradient') return `background:linear-gradient(150deg,${t.bgA||'#0f0524'},${t.bgB||'#003344'})`;
  if(t.bgType==='image') return `background:#07070f`;
  if(t.bgType==='video') return `background:#000`;
  if(t.bgType==='anim') return `background:#04040c`;
  return `background:radial-gradient(1200px 700px at 20% 10%,${(t.bgA||'#a78bfa')}26,transparent 60%),radial-gradient(1000px 700px at 85% 85%,${(t.bgB||'#67e8f9')}22,transparent 60%),#0a0a14`;
}
function ytEmbed(u){ try{ const url=new URL(u); let id=''; if(url.hostname.includes('youtu.be')) id=url.pathname.slice(1); else id=url.searchParams.get('v')||url.pathname.split('/').pop(); return id? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`:''; }catch{ return ''; } }
function spEmbed(u){ try{ const url=new URL(u); if(!url.hostname.includes('spotify.com')) return ''; return `https://open.spotify.com/embed${url.pathname}`; }catch{ return ''; } }

function profileHTML(p, opts={}){
  const t = {...DEFAULT_THEME, ...(p.theme||{})};
  const font = FONTS[t.font]||FONTS.sora;
  const badges = (p.badges||[]).map(b=>({og:`<span class="badge og">OG</span>`,pro:`<span class="badge pro">✦ PRO</span>`,owner:`<span class="badge owner">OWNER</span>`}[b]||'')).join('');
  const animLayer = t.bgType==='anim'? `<div class="pp-anim anim-${esc(t.anim||'aurora')}"></div>`:'';
  const bgLayer = t.bgType==='image' && t.bgImage? `<img src="${esc(t.bgImage)}" alt="">`
    : t.bgType==='video' && t.bgVideo? `<video src="${esc(t.bgVideo)}" autoplay muted loop playsinline></video>` : '';
  const overlay = (t.bgType==='image'||t.bgType==='video')? `<div style="position:absolute;inset:0;background:rgba(4,4,10,.45)"></div>`:'';
  const partCanvas = t.particles? `<canvas class="pp-particles" style="position:absolute;inset:0;width:100%;height:100%;z-index:1"></canvas>`:'';
  return `<div class="pp-stage" ${t.bgType==='anim'?`data-anim="${esc(t.anim||'aurora')}"`:''} style="${bgStyle(t)};color:${t.textColor||'#e7e7f2'};font-family:${font};--pa:${t.accent};--pr:${t.radius??16}px">
    <div class="pp-bg">${animLayer}${bgLayer}${overlay}${partCanvas}</div>
    ${opts.preview?'':`<div class="pp-views mono">👁 ${num(p.views)}</div>`}
    <div class="pp-content">
      ${p.banner? `<div class="pp-banner" style="background-image:url('${esc(p.banner)}')"></div>`:`<div style="height:60px"></div>`}
      <div class="pp-head" style="${p.banner?'':'margin-top:0'}">
        <img class="pp-av" src="${esc(p.avatar||avatarFor(p.username))}" alt="" style="${t.glow?`box-shadow:0 0 34px ${t.accent}66`:''}">
        <div class="pp-name">${esc(p.displayName||p.username)} ${badges}</div>
        <div class="pp-user">misty.gg/${esc(p.username)}</div>
        ${p.status? `<div class="pp-status">${esc(p.status)}</div>`:''}
        ${p.bio? `<div class="pp-bio">${esc(p.bio)}</div>`:''}
      </div>
      <div class="pp-links">
        ${(p.links||[]).map(l=>`
          <a class="pp-link ${t.btnStyle} ${t.glow?'glow':''}" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener" data-lid="${esc(l.id)}">
            <span class="li">${iconHTML(l.icon, t)}</span>
            <span class="lt"><b>${esc(l.title)}</b>${l.desc?`<span>${esc(l.desc)}</span>`:''}</span>
            <span class="arrow">↗</span>
          </a>`).join('')}
      </div>
      <div class="pp-widgets">
        ${(p.widgets||[]).map(w=>{
          if(w.type==='youtube'){ const e=ytEmbed(w.value); return e?`<div class="pp-widget"><iframe src="${esc(e)}" height="230" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe></div>`:''; }
          if(w.type==='spotify'){ const e=spEmbed(w.value); return e?`<div class="pp-widget"><iframe src="${esc(e)}" height="152" allow="encrypted-media" loading="lazy" style="border-radius:18px"></iframe></div>`:''; }
          if(w.type==='discord'){ return `<a class="pp-link ${t.btnStyle} ${t.glow?'glow':''}" href="${esc(safeUrl(w.value))}" target="_blank" rel="noopener"><span class="li">${iconHTML('discord',t)}</span><span class="lt"><b>${esc(w.title||'Join my Discord')}</b><span>discord invite</span></span><span class="arrow">↗</span></a>`; }
          if(w.type==='image'){ return `<div class="pp-widget"><img src="${esc(safeUrl(w.value))}" alt="" loading="lazy"></div>`; }
          if(w.type==='text'){ return `<div class="pp-widget"><div class="wtext">${w.title?`<b style="display:block;margin-bottom:8px">${esc(w.title)}</b>`:''}${esc(w.value)}</div></div>`; }
          return '';
        }).join('')}
      </div>
      ${opts.preview? '' : `<div class="pp-actions">
        <button id="ppLike" class="${opts.liked?'liked':''}">❤ <span id="ppLikeN">${num(p.likes)}</span></button>
        <button id="ppShare">↗ Share</button>
      </div>`}
      <div class="pp-foot"><img src="logo.png" alt="">made with MISTY</div>
    </div>
  </div>`;
}

function wireProfileFx(root, p, opts={}){
  const t = {...DEFAULT_THEME, ...(p.theme||{})};
  window.__curAccent = t.accent;
  if(!opts.preview) cursorFxOn = !!t.cursorFx;
  const pc = root.querySelector('.pp-particles');
  if(pc){
    const ctx = pc.getContext('2d');
    pc.width = pc.offsetWidth; pc.height = pc.offsetHeight;
    const dots = Array.from({length:46},()=>({x:Math.random()*pc.width,y:Math.random()*pc.height,r:.6+Math.random()*1.8,s:.15+Math.random()*.45}));
    (function loop(){
      if(!pc.isConnected) return;
      ctx.clearRect(0,0,pc.width,pc.height);
      ctx.fillStyle = t.accent;
      for(const d of dots){ d.y -= d.s; if(d.y<-4){ d.y=pc.height+4; d.x=Math.random()*pc.width; } ctx.globalAlpha=.35; ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,7); ctx.fill(); }
      ctx.globalAlpha=1;
      requestAnimationFrame(loop);
    })();
  }
  if(!opts.preview){
    root.querySelectorAll('[data-lid]').forEach(a=>{
      a.addEventListener('click', ()=>{ recordClick(p.username, a.dataset.lid); });
    });
  }
}

async function recordClick(uname, lid){
  try{ await setDoc(doc(db,'clicks',uname), {[lid]: increment(1)}, {merge:true}); }catch{}
}

async function renderPublic(uname){
  if(!uname) return renderLanding();
  app.innerHTML = navHTML('');
  const page = document.createElement('div'); page.className='public-page'; page.innerHTML=`<div class="spin"></div>`;
  document.body.appendChild(page);
  const snap = await getDoc(doc(db,'profiles',uname));
  if(!snap.exists()){
    page.innerHTML = `<button class="pp-back" onclick="history.length>1?history.back():location.hash=''">← Back</button>
      <div class="empty" style="padding-top:30vh"><span class="big">🌫️</span>This corner of the mist is empty.<br><br>
      <button class="btn primary" onclick="document.querySelector('.public-page').remove();sessionStorage.setItem('misty_uname','${esc(uname)}');location.hash='#/auth'">Claim misty.gg/${esc(uname)}</button></div>`;
    return;
  }
  const p = snap.data();
  let liked = false;
  if(ME){ const ls = await getDoc(doc(db,'likes',`${uname}_${ME.uid}`)); liked = ls.exists(); }
  const isOwner = ME && p.owner===ME.uid;
  if(!isOwner){
    const key = 'mv_'+uname;
    if(!sessionStorage.getItem(key)){
      sessionStorage.setItem(key,'1');
      p.views = (p.views||0)+1;
      updateDoc(doc(db,'profiles',uname),{views:increment(1)}).catch(()=>{});
    }
  }
  page.innerHTML = `<button class="pp-back" onclick="history.length>1?history.back():location.hash=''">← misty</button>` + profileHTML(p,{liked});
  wireProfileFx(page, p);
  page.querySelector('#ppShare').onclick = ()=>{
    const url = location.origin+location.pathname+'#/@'+uname;
    if(navigator.share) navigator.share({title:`${p.displayName} on Misty`, url}).catch(()=>{});
    else { navigator.clipboard.writeText(url); toast('Link copied','📋'); }
  };
  page.querySelector('#ppLike').onclick = async ()=>{
    if(!ME){ toast('Log in to like profiles','🔒'); return; }
    const btn = page.querySelector('#ppLike'), n = page.querySelector('#ppLikeN');
    try{
      const lref = doc(db,'likes',`${uname}_${ME.uid}`);
      if(btn.classList.contains('liked')){
        await deleteDoc(lref);
        await updateDoc(doc(db,'profiles',uname),{likes:increment(-1)});
        p.likes--; btn.classList.remove('liked');
      } else {
        await setDoc(lref,{user:ME.uid, profile:uname, at:serverTimestamp()});
        await updateDoc(doc(db,'profiles',uname),{likes:increment(1)});
        p.likes=(p.likes||0)+1; btn.classList.add('liked');
      }
      n.textContent = num(p.likes);
    }catch(err){ toast(cleanErr(err),'⚠️'); }
  };
}

async function renderDiscover(){
  app.innerHTML = navHTML('discover') + `<div class="wrap">
    <div class="discover-head">
      <div class="eyebrow">// discover</div>
      <h2>Wandering the mist</h2>
      <p>Trending profiles from across Misty.</p>
    </div>
    <div class="discover-grid" id="dgrid"><div class="spin" style="grid-column:1/-1"></div></div>
  </div>`;
  try{
    const qs = await getDocs(query(collection(db,'profiles'), orderBy('views','desc'), limit(30)));
    const profs = []; qs.forEach(d=>profs.push(d.data()));
    profs.sort((a,b)=> ( (b.badges?.includes('pro')?1e9:0)+(b.views||0) ) - ( (a.badges?.includes('pro')?1e9:0)+(a.views||0) ));
    $('#dgrid').innerHTML = profs.length? profs.map(p=>{
      const t = {...DEFAULT_THEME,...(p.theme||{})};
      return `<div class="pcard glass" onclick="location.hash='#/@${esc(p.username)}'">
        <div class="cb" style="${p.banner?`background-image:url('${esc(p.banner)}')`:`background:linear-gradient(120deg,${t.bgA||'#1e1b3a'},${t.bgB||'#0f2a3a'})`}"></div>
        <img class="cav" src="${esc(p.avatar||avatarFor(p.username))}" loading="lazy">
        <div class="cbody">
          <b>${esc(p.displayName||p.username)}</b> ${(p.badges||[]).includes('pro')?'<span class="badge pro">✦</span>':''}
          <div class="u">@${esc(p.username)}</div>
          <div class="cstats"><span>👁 ${num(p.views)}</span><span>❤ ${num(p.likes)}</span><span>🔗 ${(p.links||[]).length}</span></div>
        </div>
      </div>`;
    }).join('') : `<div class="empty" style="grid-column:1/-1"><span class="big">🌫️</span>The mist is quiet. Be the first.</div>`;
  }catch(e){ $('#dgrid').innerHTML = `<div class="empty" style="grid-column:1/-1">Could not load profiles: ${esc(cleanErr(e))}</div>`; }
}

async function renderAdmin(){
  if(!MYDOC || MYDOC.role!=='admin'){ app.innerHTML = navHTML('admin')+`<div class="empty" style="padding-top:22vh"><span class="big">🔒</span>Admin access only.</div>`; return; }
  app.innerHTML = navHTML('admin') + `<div class="wrap">
    <div class="discover-head"><div class="eyebrow">// admin</div><h2>Control room</h2></div>
    <div class="statgrid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr))" id="adStats"><div class="spin" style="grid-column:1/-1"></div></div>
    <div class="panel glass" style="margin:10px 0 60px"><h3 style="margin-bottom:14px;font-size:16px">Users</h3><div id="adUsers"><div class="spin"></div></div></div>
  </div>`;
  try{
    const us = await getDocs(query(collection(db,'users'), limit(200)));
    const ps = await getDocs(query(collection(db,'profiles'), limit(200)));
    let totalViews=0, totalLikes=0, pros=0;
    ps.forEach(d=>{ const p=d.data(); totalViews+=p.views||0; totalLikes+=p.likes||0; });
    const users=[]; us.forEach(d=>{ const u=d.data(); u._id=d.id; users.push(u); if(u.pro) pros++; });
    $('#adStats').innerHTML = [
      ['Users', users.length],['Profiles', ps.size],['Total views', num(totalViews)],['Total likes', num(totalLikes)],['Pro members', pros]
    ].map(([l,n])=>`<div class="stat glass"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
    $('#adUsers').innerHTML = users.map(u=>`
      <div class="admin-row">
        <img src="${esc(u.avatar||avatarFor(u.username))}">
        <div class="flex1"><b>${esc(u.displayName||u.username)}</b> <span class="mono" style="color:var(--dim);font-size:11px">@${esc(u.username)}</span>${u.pro?' <span class="badge pro">✦</span>':''}${u.role==='admin'?' <span class="badge owner">ADMIN</span>':''}<div class="em">${esc(u.email||'')}</div></div>
        <button class="btn sm" onclick="location.hash='#/@${esc(u.username)}'">View</button>
        <button class="btn sm ${u.banned?'':'danger'}" data-ban="${u._id}" data-now="${u.banned?1:0}">${u.banned?'Unban':'Ban'}</button>
      </div>`).join('');
    $('#adUsers').querySelectorAll('[data-ban]').forEach(b=>b.onclick=async ()=>{
      const banned = b.dataset.now!=='1';
      try{
        await updateDoc(doc(db,'users',b.dataset.ban),{banned});
        toast(banned?'User banned':'User unbanned', banned?'🔨':'🕊️');
        renderAdmin();
      }catch(e){ toast(cleanErr(e),'⚠️'); }
    });
  }catch(e){ $('#adUsers').innerHTML = `<div class="empty">${esc(cleanErr(e))}</div>`; }
}

router();
