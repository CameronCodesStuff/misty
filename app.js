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

const FONTS = {sora:"'Sora',sans-serif", unbounded:"'Unbounded',sans-serif", orbitron:"'Orbitron',sans-serif", mono:"'JetBrains Mono',monospace", pixel:"'Press Start 2P',monospace", serif:"'Playfair Display',serif", cinzel:"'Cinzel',serif", spacemono:"'Space Mono',monospace", chillax:"'Chillax',sans-serif"};
const FONT_NAMES = {sora:'Sora', unbounded:'Unbounded', orbitron:'Orbitron', mono:'Mono', pixel:'Pixel', serif:'Serif', cinzel:'Cinzel', spacemono:'Space Mono', chillax:'Chillax'};
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
  {name:'Violet Mist', pro:false, t:{preset:'Violet Mist',bgType:'mist',bgA:'#8b5cf6',bgB:'#22d3ee',accent:'#a78bfa',font:'sora',btnStyle:'glass',glow:true,particles:false,cursorFx:false,textColor:'#e7e7f2',radius:16}},
  {name:'Cyber Night', pro:false, t:{preset:'Cyber Night',bgType:'gradient',bgA:'#2e1065',bgB:'#0e7490',accent:'#22d3ee',font:'orbitron',btnStyle:'outline',glow:true,particles:true,cursorFx:false,textColor:'#d6faff',radius:8}},
  {name:'Rose Static', pro:false, t:{preset:'Rose Static',bgType:'gradient',bgA:'#9f1239',bgB:'#581c87',accent:'#fb7185',font:'unbounded',btnStyle:'glass',glow:true,particles:false,cursorFx:true,textColor:'#ffe4f1',radius:22}},
  {name:'Terminal', pro:false, t:{preset:'Terminal',bgType:'solid',bgA:'#04120a',bgB:'#04120a',accent:'#34d399',font:'mono',btnStyle:'outline',glow:true,particles:false,cursorFx:false,textColor:'#c6f6d5',radius:4}},
  {name:'Arcade', pro:false, t:{preset:'Arcade',bgType:'gradient',bgA:'#4c1d95',bgB:'#be123c',accent:'#fbbf24',font:'pixel',btnStyle:'solid',glow:false,particles:true,cursorFx:false,textColor:'#fff7d6',radius:0}},
  {name:'Ivory Ghost', pro:false, t:{preset:'Ivory Ghost',bgType:'gradient',bgA:'#3f3f56',bgB:'#101018',accent:'#ffffff',font:'serif',btnStyle:'icons',glow:true,particles:false,cursorFx:false,textColor:'#f5f5fa',radius:14}},
  {name:'Aurora Veil', pro:true, t:{preset:'Aurora Veil',bgType:'anim',anim:'aurora',bgA:'#04221c',bgB:'#0b1030',accent:'#34d399',font:'sora',btnStyle:'glass',glow:true,particles:false,cursorFx:true,textColor:'#e8fff7',radius:18}},
  {name:'Nebula Drift', pro:true, t:{preset:'Nebula Drift',bgType:'anim',anim:'nebula',bgA:'#1c0b3a',bgB:'#3a0b2e',accent:'#e879f9',font:'unbounded',btnStyle:'glass',glow:true,particles:false,cursorFx:true,textColor:'#f7e9ff',radius:20}},
  {name:'Holo Chrome', pro:true, t:{preset:'Holo Chrome',bgType:'anim',anim:'holo',bgA:'#241a3a',bgB:'#0d2a33',accent:'#ffffff',font:'orbitron',btnStyle:'outline',glow:true,particles:false,cursorFx:true,textColor:'#ffffff',radius:14}},
  {name:'Midnight Gold', pro:true, t:{preset:'Midnight Gold',bgType:'anim',anim:'gold',bgA:'#0c0803',bgB:'#2a1c05',accent:'#fbbf24',font:'cinzel',btnStyle:'outline',glow:true,particles:false,cursorFx:false,textColor:'#fdf3d7',radius:10}},
  {name:'Ember Rift', pro:true, t:{preset:'Ember Rift',bgType:'anim',anim:'ember',bgA:'#160308',bgB:'#3a0d10',accent:'#fb7185',font:'unbounded',btnStyle:'glass',glow:true,particles:false,cursorFx:true,textColor:'#ffe8e4',radius:16}},
  {name:'Deep Current', pro:true, t:{preset:'Deep Current',bgType:'anim',anim:'ocean',bgA:'#02131f',bgB:'#0a2a4a',accent:'#38bdf8',font:'sora',btnStyle:'glass',glow:true,particles:true,cursorFx:false,textColor:'#e2f6ff',radius:18}},
  {name:'Neon Static', pro:false, t:{preset:'Neon Static',bgType:'gradient',bgA:'#0a0a1a',bgB:'#3a1030',accent:'#00ced1',font:'spacemono',btnStyle:'outline',glow:true,particles:true,cursorFx:true,textColor:'#e0e0ff',radius:20,cursorStyle:'dot',orbitRing:true}},
  {name:'Terminal Root', pro:false, t:{preset:'Terminal Root',bgType:'solid',bgA:'#04120a',bgB:'#04120a',accent:'#22c55e',font:'spacemono',btnStyle:'outline',glow:true,particles:false,cursorFx:false,textColor:'#c6f6d5',radius:4,cursorStyle:'cross',orbitRing:true}},
  {name:'Downpour', pro:false, t:{preset:'Downpour',bgType:'gradient',bgA:'#0a1230',bgB:'#1e3a8a',accent:'#2563eb',font:'spacemono',btnStyle:'glass',glow:true,particles:true,cursorFx:false,textColor:'#dbeafe',radius:16,orbitRing:true}},
  {name:'Crimson OP', pro:false, t:{preset:'Crimson OP',bgType:'gradient',bgA:'#1a0505',bgB:'#dc2626',accent:'#f87171',font:'spacemono',btnStyle:'icons',glow:true,particles:true,cursorFx:false,textColor:'#fee2e2',radius:18,nameFx:'glow',orbitRing:true}},
  {name:'Redline', pro:false, t:{preset:'Redline',bgType:'gradient',bgA:'#1a1400',bgB:'#eab308',accent:'#facc15',font:'spacemono',btnStyle:'solid',glow:true,particles:false,cursorFx:false,textColor:'#fffbea',radius:6,orbitRing:true}},
  {name:'Static Frost', pro:false, t:{preset:'Static Frost',bgType:'image',bgImage:'assets/theme-import/static-frost-bg.jpg',bgA:'#0a0a0a',bgB:'#101820',accent:'#67cae2',font:'chillax',btnStyle:'bia',glow:false,particles:false,cursorFx:false,cursorStyle:'bia',textColor:'#ffffff',radius:17,cardOpacity:70}},
  {name:'Rainy Pines', pro:true, t:{preset:'Rainy Pines',bgType:'video',bgVideo:'assets/backgrounds/rainy-pine-forest.mp4',bgA:'#0a1410',bgB:'#12201a',accent:'#7dd3a8',font:'chillax',btnStyle:'bia',glow:false,particles:false,cursorFx:false,textColor:'#ffffff',radius:15}},
  {name:'Sakura Bloom', pro:true, t:{preset:'Sakura Bloom',bgType:'video',bgVideo:'assets/backgrounds/large-sakura-tree.mp4',bgA:'#1a0a12',bgB:'#2a1020',accent:'#f9a8d4',font:'chillax',btnStyle:'bia',glow:false,particles:false,cursorFx:false,textColor:'#ffffff',radius:15}},
  {name:'Celestial Veil', pro:true, t:{preset:'Celestial Veil',bgType:'video',bgVideo:'assets/backgrounds/celestial-veil.mp4',bgA:'#080614',bgB:'#140f2a',accent:'#a78bfa',font:'chillax',btnStyle:'bia',glow:false,particles:false,cursorFx:false,textColor:'#ffffff',radius:15}},
  {name:'Shadow Monarch', pro:true, t:{preset:'Shadow Monarch',bgType:'video',bgVideo:'assets/backgrounds/shadow-king.mp4',bgA:'#0a0616',bgB:'#160b2e',accent:'#8b5cf6',font:'chillax',btnStyle:'bia',glow:true,particles:false,cursorFx:false,textColor:'#ffffff',radius:15}},
  {name:'Ultra Ego', pro:true, t:{preset:'Ultra Ego',bgType:'video',bgVideo:'assets/backgrounds/vegeta-ultra-ego.mp4',bgA:'#160516',bgB:'#2e0b2a',accent:'#d946ef',font:'chillax',btnStyle:'bia',glow:true,particles:false,cursorFx:false,textColor:'#ffffff',radius:15}},
  {name:'Poppy Field', pro:true, t:{preset:'Poppy Field',bgType:'video',bgVideo:'assets/backgrounds/poppy-field.mp4',bgA:'#160a0a',bgB:'#2e1410',accent:'#fb7185',font:'chillax',btnStyle:'bia',glow:false,particles:false,cursorFx:false,textColor:'#ffffff',radius:15}},
  {name:'Yellow Sundress', pro:true, t:{preset:'Yellow Sundress',bgType:'video',bgVideo:'assets/backgrounds/yellow-sundress.mp4',bgA:'#161206',bgB:'#2e260b',accent:'#fde047',font:'chillax',btnStyle:'bia',glow:false,particles:false,cursorFx:false,textColor:'#ffffff',radius:15}},
  {name:'Golden Sky', pro:true, t:{preset:'Golden Sky',bgType:'video',bgVideo:'assets/backgrounds/golden-sky.mp4',bgA:'#161006',bgB:'#2e220b',accent:'#fbbf24',font:'chillax',btnStyle:'bia',glow:true,particles:false,cursorFx:false,textColor:'#ffffff',radius:15}}
];

// Reskin every preset/template with the exact bia-bio look: frosted
// cyan-blue buttons, Chillax font, the real bia-bio cursor image and its
// 17px corner radius. Each preset keeps its own background/accent colors
// so they're still distinguishable as separate themes.
function applyBiaChrome(themeObj){
  themeObj.btnStyle = 'bia';
  themeObj.font = 'chillax';
  themeObj.cursorStyle = 'bia';
  themeObj.radius = 17;
  return themeObj;
}
PRESETS.forEach(p=>applyBiaChrome(p.t));
const DEFAULT_THEME = JSON.parse(JSON.stringify(PRESETS[0].t));
const BG_VIDEOS = [
  {name:'Rainy Pine Forest', res:'1080p', src:'assets/backgrounds/rainy-pine-forest.mp4'},
  {name:'Large Sakura Tree', res:'4K', src:'assets/backgrounds/large-sakura-tree.mp4'},
  {name:'Celestial Veil', res:'4K', src:'assets/backgrounds/celestial-veil.mp4'},
  {name:'Shadow King', res:'4K', src:'assets/backgrounds/shadow-king.mp4'},
  {name:'Vegeta Ultra Ego', res:'4K', src:'assets/backgrounds/vegeta-ultra-ego.mp4'},
  {name:'Poppy Field', res:'4K', src:'assets/backgrounds/poppy-field.mp4'},
  {name:'Yellow Sundress', res:'4K', src:'assets/backgrounds/yellow-sundress.mp4'},
  {name:'Golden Sky', res:'4K', src:'assets/backgrounds/golden-sky.mp4'}
];

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
    const c = t.btnStyle==='solid' ? '0a0a14' : t.btnStyle==='icons' ? 'ffffff' : (t.accent==='#ffffff' ? 'ffffff' : t.accent.replace('#',''));
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
let mistT = 0;
function drawMist(){
  mistT += 0.006;
  mctx.clearRect(0,0,mistCanvas.width,mistCanvas.height);
  mctx.globalCompositeOperation = 'lighter';
  for(const b of blobs){
    b.x+=b.dx; b.y+=b.dy;
    if(b.x<-b.r) b.x=innerWidth+b.r; if(b.x>innerWidth+b.r) b.x=-b.r;
    if(b.y<-b.r) b.y=innerHeight+b.r; if(b.y>innerHeight+b.r) b.y=-b.r;
    const pulse = 1 + Math.sin(mistT + b.x*0.002)*.08;
    const r = b.r*pulse;
    const g=mctx.createRadialGradient(b.x,b.y,0,b.x,b.y,r);
    g.addColorStop(0,`rgba(${b.c},${b.a})`); g.addColorStop(.6,`rgba(${b.c},${b.a*.4})`); g.addColorStop(1,'rgba(0,0,0,0)');
    mctx.fillStyle=g; mctx.beginPath(); mctx.arc(b.x,b.y,r,0,7); mctx.fill();
  }
  mctx.globalCompositeOperation = 'source-over';
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
          badges:['og'], theme:DEFAULT_THEME, links:[], widgets:[], location:'',
          views:0, likes:0, createdAt:serverTimestamp()
        });
      });
      sessionStorage.removeItem('misty_uname');
      return test;
    }catch(e){ if(e.message!=='taken') throw e; }
  }
  throw new Error('Could not claim a username');
}

// --- Clean-path routing (no #) ---------------------------------------
// BASE_PATH is the site's root folder (e.g. "/misty/"), figured out once
// from whatever URL the page happened to load with. Everything after it
// (e.g. "@cameron", "dashboard", "") is the route.
const ROUTE_KEYWORDS = ['auth', 'dashboard', 'discover', 'admin'];
function splitBaseAndRoute(pathname){
  const parts = pathname.split('/');
  const last = parts[parts.length - 1];
  if(last === '') return { base: pathname, route: '' };
  if(last.startsWith('@') || ROUTE_KEYWORDS.includes(last)){
    parts.pop();
    return { base: parts.join('/') + '/', route: last };
  }
  return { base: pathname.replace(/[^/]*$/, ''), route: last };
}
const BASE_PATH = splitBaseAndRoute(location.pathname).base;
function route(){
  let p = location.pathname;
  if(p.startsWith(BASE_PATH)) p = p.slice(BASE_PATH.length);
  return p.replace(/^\/+/, '').replace(/\/+$/, '');
}
function go(path){
  path = String(path || '').replace(/^\/+/, '');
  const url = BASE_PATH + path;
  if(location.pathname + location.search !== url) history.pushState(null, '', url);
  router();
}
window.go = go;
addEventListener('popstate', router);

addEventListener('scroll', ()=>{
  const n = document.querySelector('nav');
  if(n) n.classList.toggle('scrolled', scrollY>10);
}, {passive:true});

function router(){
  cursorFxOn = false;
  document.body.classList.remove('previewing');
  document.querySelectorAll('.public-page,.fab').forEach(e=>e.remove());
  app.classList.remove('page-in'); void app.offsetWidth; app.classList.add('page-in');
  const r = route();
  if(r.startsWith('@')) return renderPublic(normUser(r.slice(1)));
  if(r==='auth') return renderAuth();
  if(r==='dashboard') return ME? renderDashboard(): renderAuth();
  if(r==='discover') return renderDiscover();
  if(r==='templates') return renderTemplates();
  if(r==='admin') return renderAdmin();
  renderLanding();
}

function navHTML(active){
  const user = ME && MYDOC;
  return `<nav><div class="wrap">
    <div class="logo" onclick="go('')"><img src="logo.png" alt="">MISTY</div>
    <div class="navlinks">
      <button class="nl hidem ${active==='discover'?'on':''}" onclick="go('discover')">Discover</button>
      <button class="nl ${active==='templates'?'on':''}" onclick="go('templates')">Templates</button>
      ${user? `<button class="nl ${active==='dash'?'on':''}" onclick="go('dashboard')">Dashboard</button>
        ${MYDOC?.role==='admin'? `<button class="nl ${active==='admin'?'on':''}" onclick="go('admin')">Admin</button>`:''}
        <button class="nl hidem" onclick="go('@${MYDOC.username}')">My page</button>
        <img class="avatar-mini" src="${esc(MYDOC.avatar||avatarFor(MYDOC.username))}" onclick="go('dashboard')">`
      : `<button class="nl" onclick="go('auth')">Log in</button>
        <button class="btn primary sm" onclick="go('auth')">Create Your Misty</button>`}
    </div>
  </div></nav>`;
}
function avatarFor(name){ return `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(name||'misty')}`; }

function miniLinkStyle(t, small){
  const r = t.btnStyle==='icons'? '50%' : Math.min(t.radius, small?12:13)+'px';
  const fill = t.btnStyle==='solid'? `background:${t.accent}`
    : t.btnStyle==='outline'? `border:1.5px solid ${t.accent}`
    : t.btnStyle==='bia'? `background:linear-gradient(90deg,#3399c06b,#3365c04a);border:1px solid #2d5db18f`
    : `background:linear-gradient(165deg,rgba(255,255,255,.16),rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.25)`;
  const glow = t.glow? `${t.btnStyle==='glass'||t.btnStyle==='icons'?';':''}box-shadow:0 0 10px ${t.accent}55` : '';
  const size = t.btnStyle==='icons'? (small? 'width:16px;height:16px;flex:none' : 'width:24px;height:24px;flex:none') : '';
  return `border-radius:${r};${fill};${glow};${size}`;
}
function miniThemeInner(p){
  const t = p.t;
  const bg = t.bgType==='anim'? 'background:#04040c' : bgStyle(t);
  const animLayer = t.bgType==='anim'? `<div class="pp-anim anim-${t.anim}" style="inset:0"></div>`:'';
  const row = t.btnStyle==='icons'? 'flex-direction:row;justify-content:center' : '';
  return `<div style="position:absolute;inset:0;${bg}">${animLayer}</div>
    <div class="pv-user" style="font-family:${FONTS[t.font]};color:${t.textColor}">username</div>
    <div class="pv-links" style="${row}"><i style="${miniLinkStyle(t,true)}"></i><i style="${miniLinkStyle(t,true)}"></i><i style="${miniLinkStyle(t,true)}"></i></div>`;
}

const BUILTIN_TEMPLATES = [
  {id:'b1', name:'Bloodmoon', desc:'Deep crimson over black. For villains.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'gradient',bgA:'#7f1d1d',bgB:'#18181b',accent:'#ef4444',font:'unbounded',btnStyle:'solid',glow:true,particles:false,cursorFx:false,textColor:'#fee2e2',radius:12}},
  {id:'b2', name:'Vapor Grid', desc:'Synthwave purple-pink with cyan neon.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'gradient',bgA:'#7c3aed',bgB:'#db2777',accent:'#22d3ee',font:'orbitron',btnStyle:'outline',glow:true,particles:true,cursorFx:false,textColor:'#f5f3ff',radius:6,tilt:true,nameFx:'rainbow',cardOpacity:55}},
  {id:'b3', name:'Glacier', desc:'Cold blue glass. Calm and crisp.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'gradient',bgA:'#0c4a6e',bgB:'#155e75',accent:'#7dd3fc',font:'sora',btnStyle:'glass',glow:true,particles:false,cursorFx:false,textColor:'#e0f2fe',radius:20}},
  {id:'b4', name:'Matcha', desc:'Quiet forest greens, soft serif.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'gradient',bgA:'#14532d',bgB:'#052e16',accent:'#86efac',font:'serif',btnStyle:'glass',glow:false,particles:false,cursorFx:false,textColor:'#dcfce7',radius:18}},
  {id:'b5', name:'Noir', desc:'Monochrome. Nothing extra — not even a card.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'solid',bgA:'#0b0b0f',bgB:'#0b0b0f',accent:'#e4e4e7',font:'mono',btnStyle:'outline',glow:false,particles:false,cursorFx:false,textColor:'#e4e4e7',radius:8,cardOpacity:0,cursorStyle:'cross'}},
  {id:'b6', name:'Sakura', desc:'Pink petals on indigo dusk.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'gradient',bgA:'#9d174d',bgB:'#1e1b4b',accent:'#f9a8d4',font:'serif',btnStyle:'icons',glow:true,particles:true,cursorFx:false,textColor:'#fdf2f8',radius:22}},
  {id:'b7', name:'Starfall', desc:'Drifting nebula with icon links.', author:'misty', builtin:true, pro:true,
   theme:{bgType:'anim',anim:'nebula',bgA:'#1c0b3a',bgB:'#3a0b2e',accent:'#c4b5fd',font:'unbounded',btnStyle:'icons',glow:true,particles:false,cursorFx:true,textColor:'#f5f3ff',radius:20,tilt:true,typewriter:true,nameFx:'neon',cursorStyle:'dot'}},
  {id:'b8', name:'Golden Hour', desc:'Slow gold shimmer, serif luxury.', author:'misty', builtin:true, pro:true,
   theme:{bgType:'anim',anim:'gold',bgA:'#0c0803',bgB:'#2a1c05',accent:'#fcd34d',font:'cinzel',btnStyle:'glass',glow:true,particles:false,cursorFx:false,textColor:'#fef3c7',radius:12}},
  {id:'b9', name:'Abyss', desc:'Deep ocean light with rising particles.', author:'misty', builtin:true, pro:true,
   theme:{bgType:'anim',anim:'ocean',bgA:'#02131f',bgB:'#0a2a4a',accent:'#38bdf8',font:'sora',btnStyle:'glass',glow:true,particles:true,cursorFx:false,textColor:'#e0f2fe',radius:18}},
  {id:'b10', name:'Neon Circuit', desc:'Full-spectrum holo chrome.', author:'misty', builtin:true, pro:true,
   theme:{bgType:'anim',anim:'holo',bgA:'#241a3a',bgB:'#0d2a33',accent:'#ffffff',font:'orbitron',btnStyle:'outline',glow:true,particles:false,cursorFx:true,textColor:'#ffffff',radius:10}},
  {id:'b11', name:'Neon Static', desc:'Cyan-on-pink Space Mono, orbiting dot ring.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'gradient',bgA:'#0a0a1a',bgB:'#3a1030',accent:'#00ced1',font:'spacemono',btnStyle:'outline',glow:true,particles:true,cursorFx:true,textColor:'#e0e0ff',radius:20,cursorStyle:'dot',orbitRing:true}},
  {id:'b12', name:'Terminal Root', desc:'Black-on-green hacker console, Space Mono.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'solid',bgA:'#04120a',bgB:'#04120a',accent:'#22c55e',font:'spacemono',btnStyle:'outline',glow:true,particles:false,cursorFx:false,textColor:'#c6f6d5',radius:4,cursorStyle:'cross',orbitRing:true}},
  {id:'b13', name:'Downpour', desc:'Stormy blues with drifting particles.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'gradient',bgA:'#0a1230',bgB:'#1e3a8a',accent:'#2563eb',font:'spacemono',btnStyle:'glass',glow:true,particles:true,cursorFx:false,textColor:'#dbeafe',radius:16,orbitRing:true}},
  {id:'b14', name:'Crimson OP', desc:'Anime-red glow with icon links.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'gradient',bgA:'#1a0505',bgB:'#dc2626',accent:'#f87171',font:'spacemono',btnStyle:'icons',glow:true,particles:true,cursorFx:false,textColor:'#fee2e2',radius:18,nameFx:'glow',orbitRing:true}},
  {id:'b15', name:'Redline', desc:'Racing yellow on black, solid blocks.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'gradient',bgA:'#1a1400',bgB:'#eab308',accent:'#facc15',font:'spacemono',btnStyle:'solid',glow:true,particles:false,cursorFx:false,textColor:'#fffbea',radius:6,orbitRing:true}},
  {id:'b16', name:'Static Frost', desc:'The real forest photo, Chillax font, exact frost buttons & cursor.', author:'misty', builtin:true, pro:false,
   theme:{bgType:'image',bgImage:'assets/theme-import/static-frost-bg.jpg',bgA:'#0a0a0a',bgB:'#101820',accent:'#67cae2',font:'chillax',btnStyle:'bia',glow:false,particles:false,cursorFx:false,cursorStyle:'bia',textColor:'#ffffff',radius:17,cardOpacity:70}}
];
BUILTIN_TEMPLATES.forEach(b=>applyBiaChrome(b.theme));

let TPL_CACHE = [];
let TPL_FILTER = 'all';
let TPL_SEARCH = '';

async function renderTemplates(){
  app.innerHTML = navHTML('templates') + `<div class="wrap">
    <div class="pagehead">
      <div>
        <div class="eyebrow">// community templates</div>
        <h2>Wear someone else's fog</h2>
        <p class="sub">Full profile designs made by the community. Preview any of them, apply in one click${ME?'':' — log in to use one'}.</p>
      </div>
      ${ME&&MYPROFILE? `<button class="btn primary" id="tplPub">＋ Publish my theme</button>`:''}
    </div>
    <div class="tplbar glass">
      <input id="tplSearch" placeholder="Search templates…" value="${esc(TPL_SEARCH)}" spellcheck="false">
      <div class="optrow">${[['all','All'],['free','Free'],['pro','✦ Pro'],['mine','Mine']].map(([k,l])=>`<button class="opt ${TPL_FILTER===k?'on':''}" data-tf="${k}">${l}</button>`).join('')}</div>
    </div>
    <div class="tpl-grid" id="tplGrid"><div class="spin" style="grid-column:1/-1"></div></div>
  </div>`;
  $('#tplSearch').addEventListener('input', e=>{ TPL_SEARCH=e.target.value; drawTemplates(); });
  document.querySelectorAll('[data-tf]').forEach(b=>b.addEventListener('click', ()=>{ TPL_FILTER=b.dataset.tf; document.querySelectorAll('[data-tf]').forEach(x=>x.classList.toggle('on',x===b)); drawTemplates(); }));
  $('#tplPub')?.addEventListener('click', publishTemplate);
  TPL_CACHE = [...BUILTIN_TEMPLATES];
  drawTemplates();
  try{
    const qs = await getDocs(query(collection(db,'templates'), orderBy('uses','desc'), limit(80)));
    const remote=[]; qs.forEach(d=>{ const t=d.data(); t.id=d.id; remote.push(t); });
    TPL_CACHE = [...BUILTIN_TEMPLATES, ...remote];
  }catch(e){}
  drawTemplates();
}

function tplVisible(){
  const q = TPL_SEARCH.trim().toLowerCase();
  return TPL_CACHE.filter(t=>{
    if(TPL_FILTER==='free' && t.pro) return false;
    if(TPL_FILTER==='pro' && !t.pro) return false;
    if(TPL_FILTER==='mine' && !(ME && t.uid===ME.uid)) return false;
    if(q && !(`${t.name} ${t.desc||''} ${t.author||''}`.toLowerCase().includes(q))) return false;
    return true;
  });
}

function drawTemplates(){
  const g = $('#tplGrid'); if(!g) return;
  const list = tplVisible();
  if(!list.length){ g.innerHTML = `<div class="empty" style="grid-column:1/-1;padding:60px 0"><span class="big">🌫️</span>Nothing in the mist${TPL_FILTER==='mine'?' — publish your theme to see it here':''}.</div>`; return; }
  g.innerHTML = list.map((t,i)=>`
    <div class="tpl-card glass reveal" style="transition-delay:${(i%4)*.05}s">
      <div class="preset-card tpl-prev" data-tp="${i}" title="Preview ${esc(t.name)}">
        ${miniThemeInner({t:{...DEFAULT_THEME,...t.theme}})}
        ${t.pro && !(MYDOC&&MYDOC.pro)? `<div class="pv-lock">✦</div>`:''}
      </div>
      <div class="tpl-meta">
        <div class="tpl-name">${t.pro?'✦ ':''}${esc(t.name)}</div>
        <div class="tpl-by">${t.builtin? `<span class="badge owner">OFFICIAL</span>` : `by @${esc(t.author||'?')}${t.uses?` · ${num(t.uses)} uses`:''}`}</div>
        ${t.desc? `<div class="tpl-desc">${esc(t.desc)}</div>`:''}
      </div>
      <div class="tpl-actions">
        <button class="btn sm" data-tp="${i}">Preview</button>
        <button class="btn primary sm" data-tu="${i}">Use</button>
        ${ME && t.uid===ME.uid? `<button class="btn sm danger" data-td="${i}" title="Delete">🗑</button>`:''}
      </div>
    </div>`).join('');
  g.querySelectorAll('[data-tp]').forEach(el=>el.addEventListener('click', ()=>previewTemplate(list[+el.dataset.tp])));
  g.querySelectorAll('[data-tu]').forEach(el=>el.addEventListener('click', e=>{ e.stopPropagation(); useTemplate(list[+el.dataset.tu]); }));
  g.querySelectorAll('[data-td]').forEach(el=>el.addEventListener('click', e=>{ e.stopPropagation(); deleteTemplate(list[+el.dataset.td]); }));
  observeReveals();
}

function previewTemplate(t){
  const demo = {username: MYDOC?.username||'you', displayName: MYDOC?.displayName||MYDOC?.username||'you',
    avatar: MYDOC?.avatar||'', banner:'', status:'previewing · '+t.name, bio:'', badges: MYDOC?.pro?['pro']:[],
    views: 1234, likes: 88, widgets: [],
    theme: {...DEFAULT_THEME, ...t.theme, particles:false, cursorFx:false},
    links: (MYPROFILE?.links?.length? MYPROFILE.links.slice(0,3) : [
      {id:'p1',title:'GitHub',url:'#',icon:'github'},{id:'p2',title:'Discord',url:'#',icon:'discord'},{id:'p3',title:'Spotify',url:'#',icon:'spotify'}])};
  openModal(`<h3>${t.pro?'✦ ':''}${esc(t.name)}</h3>
    <div class="sub">${esc(t.desc||'')} ${t.builtin?'· official Misty template':`· by @${esc(t.author||'?')}`}</div>
    <div class="tplframe"><div class="mframe">${profileHTML(demo,{preview:true})}</div></div>
    <div class="mrow"><button class="btn" id="mCancel">Close</button><button class="btn primary" id="tplUseM">Use this template</button></div>`);
  $('#tplUseM').addEventListener('click', ()=>{ closeModal(); useTemplate(t); });
}

async function useTemplate(t){
  if(!ME || !MYDOC){ toast('Log in to use templates','🔐'); return go('auth'); }
  if(t.pro && !MYDOC.pro) return openProModal(t.name);
  MYPROFILE.theme = {...DEFAULT_THEME, ...JSON.parse(JSON.stringify(t.theme)), preset:''};
  try{
    await updateDoc(doc(db,'profiles',MYDOC.username), {theme: MYPROFILE.theme});
    if(!t.builtin){ try{ await updateDoc(doc(db,'templates',t.id), {uses: increment(1)}); }catch{} }
    toast(`Wearing ${t.name}`, t.pro?'✦':'🎨');
    go('dashboard');
  }catch(e){ toast('Apply failed: '+cleanErr(e),'⚠️'); }
}

function publishTemplate(){
  if(!ME || !MYPROFILE) return go('auth');
  const isProTheme = MYPROFILE.theme?.bgType==='anim' || MYPROFILE.theme?.bgType==='video';
  openModal(`<h3>Publish your theme</h3>
    <div class="sub">Shares your current colors, background, fonts and button style as a template anyone can wear. Your links and info stay private.</div>
    <label>Template name</label><input id="tpName" maxlength="30" placeholder="e.g. Midnight Static">
    <label>Description</label><input id="tpDesc" maxlength="80" placeholder="One line about the vibe (optional)">
    ${isProTheme? `<div class="sub" style="margin-top:10px">✦ Uses an animated background — it will be listed as a Pro template.</div>`:''}
    <div class="mrow"><button class="btn" id="mCancel">Cancel</button><button class="btn primary" id="tpGo">Publish</button></div>`);
  $('#tpGo').addEventListener('click', async ()=>{
    const name = $('#tpName').value.trim();
    if(!name) return toast('Give it a name','✏️');
    const d = doc(collection(db,'templates'));
    try{
      await setDoc(d, {name, desc: $('#tpDesc').value.trim(), author: MYDOC.username, uid: ME.uid,
        theme: JSON.parse(JSON.stringify(MYPROFILE.theme||DEFAULT_THEME)), pro: isProTheme, uses: 0, ts: serverTimestamp()});
      closeModal(); toast('Template published','🌫️'); renderTemplates();
    }catch(e){ toast('Publish failed: '+cleanErr(e),'⚠️'); }
  });
}

function deleteTemplate(t){
  openModal(`<h3>Delete "${esc(t.name)}"?</h3><div class="sub">People who already applied it keep the theme.</div>
    <div class="mrow"><button class="btn" id="mCancel">Cancel</button><button class="btn danger" id="tdGo">Delete</button></div>`);
  $('#tdGo').addEventListener('click', async ()=>{
    try{ await deleteDoc(doc(db,'templates',t.id)); closeModal(); toast('Deleted','🗑'); renderTemplates(); }
    catch(e){ toast('Delete failed: '+cleanErr(e),'⚠️'); }
  });
}

const MOCK_PROFILES = [
  {username:'azrea',displayName:'azrea',avatar:'',banner:'',status:'GFX Artist | Owner',bio:'',badges:['og','owner'],views:2317,likes:184,
   theme:{...PRESETS[10].t,particles:false,cursorFx:false},
   links:[{id:'m1',title:'My Portfolio',url:'#',icon:'🎨'},{id:'m2',title:'My Store',url:'#',icon:'🛒'},{id:'m3',title:'Discord Server',url:'#',icon:'discord'}],widgets:[]},
  {username:'vue',displayName:'vue',avatar:'',banner:'',status:'welcome to my page!',bio:'',badges:['og','pro'],views:3194,likes:220,
   theme:{...PRESETS[6].t,btnStyle:'icons',particles:false,cursorFx:false,cardOpacity:34,nameFx:'glow'},
   links:[{id:'m1',title:'GitHub',url:'#',icon:'github'},{id:'m2',title:'Spotify',url:'#',icon:'spotify'},{id:'m3',title:'Discord',url:'#',icon:'discord'},{id:'m4',title:'Steam',url:'#',icon:'steam'}],widgets:[]},
  {username:'hris',displayName:'hris',avatar:'',banner:'',status:'misty on top! | liquid glass | your identity',bio:'',badges:['pro','og','owner'],views:4814,likes:312,
   theme:{...PRESETS[7].t,btnStyle:'icons',particles:false,cursorFx:false,typewriter:true,nameFx:'neon'},
   links:[{id:'m1',title:'GitHub',url:'#',icon:'github'},{id:'m2',title:'Discord',url:'#',icon:'discord'},{id:'m3',title:'X',url:'#',icon:'x'}],
   widgets:[{id:'w1',type:'discord',title:'popaperc',value:'#'}]}
];

function renderLanding(){
  app.innerHTML = navHTML('') + `
  <div class="wrap">
    <div class="hero">
      <div class="hero-copy">
        <img class="hero-logo" src="logo.png" alt="Misty">
        <div class="eyebrow">// digital identity, reimagined</div>
        <h1>Your identity.<br>Your space.<br><span class="gr">Your Misty.</span></h1>
        <p>Create a digital identity that feels completely yours. Animated backgrounds, living links, widgets, themes — one page that is unmistakably you.</p>
        <div class="cta">
          <button class="btn primary" onclick="go('auth')">Create Your Misty</button>
          <button class="btn" onclick="go('discover')">Explore Profiles</button>
        </div>
        <div class="claim glass">
          <span>misty.gg/</span>
          <input id="claimIn" placeholder="yourname" maxlength="20" spellcheck="false" autocomplete="off">
          <button class="btn primary sm" id="claimBtn">Claim</button>
        </div>
      </div>
      <div class="mockdeck" aria-hidden="true">${MOCK_PROFILES.map((m,i)=>`<div class="mockcard c${i+1}"><div class="mframe">${profileHTML(m,{preview:true})}</div></div>`).join('')}</div>
    </div>
  </div>
  <section class="land"><div class="wrap">
    <div class="sechead"><div class="eyebrow">// what you get</div><h2>Everything a link page wishes it was</h2></div>
    <div class="grid3">
      <div class="feat glass reveal" style="transition-delay:.02s"><span class="ic">🌫️</span><h3>Living backgrounds</h3><p>Drifting mist, animated auroras, nebulas, gradients, particles and full video backgrounds — your page breathes.</p></div>
      <div class="feat glass reveal" style="transition-delay:.08s"><span class="ic">🔗</span><h3>Links with presence</h3><p>Real brand icons, glass, outline or solid styles with glow, hover motion and per-link click tracking.</p></div>
      <div class="feat glass reveal" style="transition-delay:.14s"><span class="ic">🧩</span><h3>Widgets</h3><p>Drop in Spotify players, YouTube videos, Discord invites, images and text blocks.</p></div>
      <div class="feat glass reveal" style="transition-delay:.02s"><span class="ic">🎨</span><h3>Theme gallery</h3><p>Twelve full presets — six free, six animated Pro exclusives — then tune every color, font and effect.</p></div>
      <div class="feat glass reveal" style="transition-delay:.08s"><span class="ic">📊</span><h3>Real analytics</h3><p>Profile views, likes and click counts for every single link, updated live from Firestore.</p></div>
      <div class="feat glass reveal" style="transition-delay:.14s"><span class="ic">⚡</span><h3>Live editor</h3><p>Edit on the left, watch your actual page update instantly on the right. Autosaved as you type.</p></div>
    </div>
  </div></section>
  <section class="land"><div class="wrap">
    <div class="sechead"><div class="eyebrow">// theme showcase</div><h2>Start from a mood</h2><p>The ✦ themes are animated Pro exclusives.</p></div>
    <div class="showcase">${PRESETS.map((p,i)=>`
      <div class="theme-mini reveal" style="transition-delay:${(i%3)*.06}s" onclick="go('auth')">
        <div style="position:absolute;inset:0;${p.t.bgType==='anim'?'background:#04040c':bgStyle(p.t)}">
          ${p.t.bgType==='anim'?`<div class="pp-anim anim-${p.t.anim}" style="inset:0"></div>`:''}
        </div>
        <div class="tuser" style="font-family:${FONTS[p.t.font]};color:${p.t.textColor}">username</div>
        <div class="tlinks" style="${p.t.btnStyle==='icons'?'flex-direction:row;justify-content:center':''}">
          ${[1,2,3].map(()=>`<i style="${miniLinkStyle(p.t,false)}"></i>`).join('')}
        </div>
        <div class="tlabel">${p.pro?'✦ ':''}${p.name}</div>
      </div>`).join('')}
    </div>
    <div style="text-align:center;margin-top:34px"><button class="btn" onclick="go('templates')">Browse community templates →</button></div>
  </div></section>
  <section class="land"><div class="wrap">
    <div class="sechead"><div class="eyebrow">// pricing</div><h2>Free forever. Pro when you want more.</h2></div>
    <div class="pricing">
      <div class="plan glass reveal"><h3>Free</h3><div class="price">$0<small>/forever</small></div>
        <ul><li>Your misty.gg page</li><li>Unlimited links</li><li>Six theme presets</li><li>Core effects & fonts</li><li>Views & click analytics</li></ul>
        <button class="btn" style="width:100%" onclick="go('auth')">Start free</button></div>
      <div class="plan glass pro reveal" style="transition-delay:.08s"><div class="tag">MISTY PRO</div><h3>Pro</h3><div class="price">$4<small>/month</small></div>
        <ul><li>Everything in Free</li><li>Six animated Pro themes</li><li>Video backgrounds</li><li>PRO badge on your page</li><li>Priority on Discover</li><li>Everything we ship next</li></ul>
        <button class="btn primary" style="width:100%" onclick="go('auth')">Go Pro</button></div>
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
  $('#claimBtn').onclick = ()=>{ const v=normUser($('#claimIn').value); if(v) sessionStorage.setItem('misty_uname', v); go('auth'); };
  $('#claimIn').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#claimBtn').click(); });
  document.querySelectorAll('.mockcard').forEach((c,i)=>wireProfileFx(c, MOCK_PROFILES[i], {preview:true}));
  observeReveals();
}

function renderAuth(mode='signup'){
  if(ME && MYDOC){ go('dashboard'); return; }
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
      go('dashboard');
    }catch(e){ toast(cleanErr(e),'⚠️'); $('#aGo').disabled=false; }
  };
  $('#aGoogle').onclick = async ()=>{
    try{ await signInWithPopup(auth, new GoogleAuthProvider()); go('dashboard'); }
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
          <a href="${BASE_PATH}@${esc(MYDOC.username)}" onclick="event.preventDefault();go('@${esc(MYDOC.username)}')" style="font-size:12px">Open ↗</a>
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

function observeReveals(){
  const els = document.querySelectorAll('.reveal:not(.in-view)');
  if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in-view')); return; }
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in-view'); io.unobserve(en.target); } });
  }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
  els.forEach(e=>io.observe(e));
}

function renderEditorTab(){
  const body = $('#dBody'); const p = MYPROFILE; const t = p.theme;
  if(liveEditTab==='profile'){
    body.innerHTML = `
      ${field('Display name', `<input id="eName" value="${esc(p.displayName)}" maxlength="32">`)}
      ${field('Status', `<input id="eStatus" value="${esc(p.status||'')}" maxlength="60" placeholder="🌫️ vibing in the mist">`)}
      ${field('Bio', `<textarea id="eBio" rows="4" maxlength="400">${esc(p.bio||'')}</textarea>`)}
      ${field('Location', `<input id="eLoc" value="${esc(p.location||'')}" maxlength="24" placeholder="NZ">`)}
      ${field('Avatar', `<div class="filedrop" id="upAv">${p.avatar?'Change avatar':'Upload avatar'} · or paste a URL below</div><input id="eAv" value="${esc(p.avatar||'')}" placeholder="https://..." style="margin-top:8px">`)}
      ${field('Banner', `<div class="filedrop" id="upBan">${p.banner?'Change banner':'Upload banner'} · or paste a URL below</div><input id="eBan" value="${esc(p.banner||'')}" placeholder="https://..." style="margin-top:8px">`)}`;
    $('#eName').oninput = e=>{ p.displayName=e.target.value; saveProfile(); };
    $('#eStatus').oninput = e=>{ p.status=e.target.value; saveProfile(); };
    $('#eBio').oninput = e=>{ p.bio=e.target.value; saveProfile(); };
    $('#eLoc').oninput = e=>{ p.location=e.target.value; saveProfile(); };
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
      ${field('Button style', `<div class="optrow">${['glass','outline','solid','icons','bia'].map(s=>`<button class="opt ${t.btnStyle===s?'on':''}" data-bs="${s}">${s==='bia'?'Frost':s[0].toUpperCase()+s.slice(1)}</button>`).join('')}</div>`)}
      ${field('Corner radius', `<input id="eRad" type="range" min="0" max="28" value="${t.radius??16}">`)}
      ${field('Card opacity', `<input id="eCo" type="range" min="0" max="100" value="${t.cardOpacity??100}"><div class="hint">Slide to 0 for a fully transparent card — your content floats on the background.</div>`)}
      ${field('Card blur', `<input id="eCb" type="range" min="0" max="40" value="${t.cardBlur??28}">`)}
      ${field('Name effect', `<div class="optrow">${[['none','None'],['glow','✨ Glow'],['neon','💡 Neon pulse'],['rainbow','🌈 Rainbow']].map(([k,l])=>`<button class="opt ${(t.nameFx||'none')===k?'on':''}" data-nf="${k}">${l}</button>`).join('')}</div>`)}
      ${field('Cursor', `<div class="optrow">${[['default','Default'],['dot','◉ Dot'],['cross','＋ Crosshair'],['bia','🖼 Frost']].map(([k,l])=>`<button class="opt ${(t.cursorStyle||'default')===k?'on':''}" data-cs="${k}">${l}</button>`).join('')}</div>`)}
      ${field('Effects', `<div class="optrow">
        <button class="opt ${t.glow?'on':''}" id="fxGlow">✨ Glow</button>
        <button class="opt ${t.particles?'on':''}" id="fxPart">❄ Particles</button>
        <button class="opt ${t.cursorFx?'on':''}" id="fxCur">🖱 Cursor trail</button>
        <button class="opt ${t.tilt?'on':''}" id="fxTilt">🎴 Card tilt</button>
        <button class="opt ${t.typewriter?'on':''}" id="fxTw">⌨ Typewriter status</button>
        <button class="opt ${t.enterScreen?'on':''}" id="fxEnter">🚪 Enter screen</button>
      </div><div class="hint">Typewriter cycles through your status — separate lines with |. Enter screen greets visitors with "click to enter" and lets audio autoplay.</div>`)}
      ${field('Profile audio ✦', `<div class="filedrop" id="upAu">Upload audio (mp3/ogg)</div><input id="auUrl" value="${esc(t.audioUrl||'')}" placeholder="https://....mp3" style="margin-top:8px">${t.audioUrl?`<button class="btn sm danger" id="auClr" style="margin-top:10px">Remove audio</button>`:''}`)}
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
    $('#eCo').oninput = e=>{ t.cardOpacity=+e.target.value; saveProfile(); };
    $('#eCb').oninput = e=>{ t.cardBlur=+e.target.value; saveProfile(); };
    body.querySelectorAll('[data-nf]').forEach(b=>b.onclick=()=>{ t.nameFx=b.dataset.nf; saveProfile(); renderEditorTab(); });
    body.querySelectorAll('[data-cs]').forEach(b=>b.onclick=()=>{ t.cursorStyle=b.dataset.cs; saveProfile(); renderEditorTab(); });
    $('#fxGlow').onclick = ()=>{ t.glow=!t.glow; saveProfile(); renderEditorTab(); };
    $('#fxPart').onclick = ()=>{ t.particles=!t.particles; saveProfile(); renderEditorTab(); };
    $('#fxCur').onclick = ()=>{ t.cursorFx=!t.cursorFx; saveProfile(); renderEditorTab(); };
    $('#fxTilt').onclick = ()=>{ t.tilt=!t.tilt; saveProfile(); renderEditorTab(); };
    $('#fxTw').onclick = ()=>{ t.typewriter=!t.typewriter; saveProfile(); renderEditorTab(); };
    $('#fxEnter').onclick = ()=>{ t.enterScreen=!t.enterScreen; saveProfile(); renderEditorTab(); };
    $('#upAu').onclick = ()=>{ if(!MYDOC.pro) return openProModal('Profile audio'); pickUpload('audio', url=>{ t.audioUrl=url; t.enterScreen=true; saveProfile(); renderEditorTab(); }, 'audio/*', 10); };
    $('#auUrl').onchange = e=>{ if(e.target.value && !MYDOC.pro){ e.target.value=''; return openProModal('Profile audio'); } t.audioUrl=safeUrl(e.target.value); if(t.audioUrl) t.enterScreen=true; saveProfile(); renderEditorTab(); };
    const ac=$('#auClr'); if(ac) ac.onclick = ()=>{ t.audioUrl=''; saveProfile(); renderEditorTab(); };
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
      extra.innerHTML = field('Video presets — full original quality', `<div class="vidgrid">${BG_VIDEOS.map((v,i)=>`
        <div class="vidcard ${t.bgVideo===v.src?'on':''}" data-vid="${i}">
          <video src="${v.src}" muted loop playsinline preload="metadata"></video>
          <div class="vidname">${v.name}<span class="vidres">${v.res}</span></div>
        </div>`).join('')}</div>`)
      + field('Or your own (mp4/webm)', `<div class="filedrop" id="upVid">Upload video</div><input id="bgVid" value="${esc(t.bgVideo||'')}" placeholder="https://....mp4" style="margin-top:8px">`);
      extra.querySelectorAll('[data-vid]').forEach(c=>{
        const vid = c.querySelector('video');
        c.onmouseenter = ()=>vid.play().catch(()=>{});
        c.onmouseleave = ()=>{ vid.pause(); vid.currentTime=0; };
        c.onclick = ()=>{ t.bgVideo=BG_VIDEOS[+c.dataset.vid].src; t.preset=''; saveProfile(); renderEditorTab(); };
      });
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
      ${field('Share your page', `<div style="display:flex;gap:8px"><input readonly value="${location.origin+BASE_PATH}@${esc(MYDOC.username)}"><button class="btn sm" id="copyUrl">Copy</button></div>`)}
      <div style="display:flex;gap:10px;margin-top:26px">
        <button class="btn" id="logout" style="flex:1">Log out</button>
        <button class="btn danger" id="wipe" style="flex:1">Reset page</button>
      </div>`;
    const gp=$('#goPro'); if(gp) gp.onclick=()=>openProModal();
    $('#copyUrl').onclick = e=>{ navigator.clipboard.writeText(e.target.previousElementSibling.value); toast('Link copied','📋'); };
    $('#logout').onclick = async ()=>{ await signOut(auth); go(''); };
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

function cursorCSS(t){
  const c = t.accent||'#a78bfa';
  let svg = '', hx = 11, hy = 11, fb = 'auto';
  if(t.cursorStyle==='bia'){
    return `cursor:url('assets/theme-import/static-frost-cursor.png') 2 2,auto;`;
  }
  if(t.cursorStyle==='dot'){
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><circle cx="11" cy="11" r="5" fill="${c}" fill-opacity="0.9"/><circle cx="11" cy="11" r="9" fill="none" stroke="${c}" stroke-opacity="0.5" stroke-width="1.5"/></svg>`;
  }else if(t.cursorStyle==='cross'){
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 3v7M12 14v7M3 12h7M14 12h7" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`;
    hx = 12; hy = 12; fb = 'crosshair';
  }else return '';
  return `cursor:url('data:image/svg+xml,${encodeURIComponent(svg)}') ${hx} ${hy},${fb};`;
}

function bgStyle(t){
  const a = t.bgA||'#a78bfa', b = t.bgB||'#67e8f9';
  if(t.bgType==='solid') return `background:radial-gradient(130% 85% at 50% -22%,color-mix(in srgb,${a} 70%,#fff 30%) 0%,transparent 56%),radial-gradient(150% 100% at 50% 120%,color-mix(in srgb,${a} 50%,#000 50%) 0%,transparent 62%),${a}`;
  if(t.bgType==='gradient') return `background:radial-gradient(115% 85% at 8% -12%,${a} 0%,transparent 58%),radial-gradient(115% 85% at 94% 114%,${b} 0%,transparent 58%),radial-gradient(65% 50% at 82% 4%,color-mix(in srgb,${b} 40%,transparent) 0%,transparent 70%),linear-gradient(165deg,color-mix(in srgb,${a} 55%,#05050d),color-mix(in srgb,${b} 48%,#04040b))`;
  if(t.bgType==='image') return `background:#07070f`;
  if(t.bgType==='video') return `background:#000`;
  if(t.bgType==='anim') return `background:#04040c`;
  return `background:radial-gradient(95% 75% at 12% -8%,${a}59 0%,transparent 60%),radial-gradient(85% 70% at 90% 18%,${b}42 0%,transparent 62%),radial-gradient(115% 85% at 50% 118%,${a}4f 0%,transparent 64%),linear-gradient(180deg,#0b0b18,#07070f)`;
}
function ytEmbed(u){ try{ const url=new URL(u); let id=''; if(url.hostname.includes('youtu.be')) id=url.pathname.slice(1); else id=url.searchParams.get('v')||url.pathname.split('/').pop(); return id? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`:''; }catch{ return ''; } }
function spEmbed(u){ try{ const url=new URL(u); if(!url.hostname.includes('spotify.com')) return ''; return `https://open.spotify.com/embed${url.pathname}`; }catch{ return ''; } }

function badgeChips(list){
  const map = {
    og:`<span class="pp-badge" title="OG — early member">✧</span>`,
    pro:`<span class="pp-badge pro" title="Misty Pro">✦</span>`,
    owner:`<span class="pp-badge owner" title="Owner">♛</span>`
  };
  const out = (list||[]).map(b=>map[b]||'').join('');
  return out? `<div class="pp-badges">${out}</div>`:'';
}

const BIA_BADGES = {
  owner:{tip:'Owner', svg:`<svg xmlns="http://www.w3.org/2000/svg" height="1.3em" width="1.3em" viewBox="0 0 24 24"><path d="m21.58 11.4-4.28-7.39-.35-.6h-9.91l-.35.6-4.27 7.39-.35.6.35.6 4.27 7.39.35.6h9.92l.35-.6 4.28-7.39.35-.6zm-13.07-1.03-1.63 1.63 1.63 1.63v2.73l-4.36-4.36 4.37-4.37v2.74zm3.12 6.93-2.04-.63 3.1-9.98 2.04.64zm3.86-.93v-2.73l1.63-1.64-1.63-1.63v-2.74l4.36 4.37z" fill="currentColor"/></svg>`},
  og:{tip:'OG — early member', svg:`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="1 1.5 22 21" style="fill:currentColor"><path d="m8.6 22.5l-1.9-3.2l-3.6-.8l.35-3.7L1 12l2.45-2.8l-.35-3.7l3.6-.8l1.9-3.2L12 2.95l3.4-1.45l1.9 3.2l3.6.8l-.35 3.7L23 12l-2.45 2.8l.35 3.7l-3.6.8l-1.9 3.2l-3.4-1.45l-3.4 1.45Zm2.35-6.95L16.6 9.9l-1.4-1.45l-4.25 4.25l-2.15-2.1L7.4 12l3.55 3.55Z"></path></svg>`},
  pro:{tip:'Misty Pro', svg:`<svg xmlns="http://www.w3.org/2000/svg" height="1em" width="1.3em" viewBox="23 32 465 448"><path d="M396.31 32H264l84.19 112.26L396.31 32zm-280.62 0l48.12 112.26L248 32H115.69zM256 74.67L192 160h128l-64-85.33zm166.95-23.61L376.26 160H488L422.95 51.06zm-333.9 0L23 160h112.74L89.05 51.06zM146.68 192H24l222.8 288h.53L146.68 192zm218.64 0L264.67 480h.53L488 192H365.32zm-35.93 0H182.61L256 400l73.39-208z" fill="currentColor"/></svg>`}
};

function profileHTML(p, opts={}){
  const t = {...DEFAULT_THEME, ...(p.theme||{})};
  const font = FONTS[t.font]||FONTS.sora;
  const pre = !!opts.preview;
  const av = pre ? 'show' : '';
  const tc = t.textColor||'#ffffff';
  const animLayer = t.bgType==='anim'? `<div class="pp-anim anim-${esc(t.anim||'aurora')}"></div>`:'';
  const bgLayer = t.bgType==='image' && t.bgImage? `<img class="bia-media" src="${esc(t.bgImage)}" alt="">`
    : t.bgType==='video' && t.bgVideo? `<video class="bia-media" src="${esc(t.bgVideo)}" autoplay muted loop playsinline preload="auto" disablepictureinpicture></video>` : '';
  const partCanvas = t.particles? `<canvas class="pp-particles" style="position:absolute;inset:0;width:100%;height:100%;z-index:1"></canvas>`:'';
  const statics = t.bgType==='mist'||t.bgType==='gradient'||t.bgType==='solid';
  const orbA = t.bgType==='solid'? (t.accent||'#a78bfa') : (t.bgA||t.accent||'#a78bfa');
  const orbB = t.bgType==='solid'? (t.bgA||'#67e8f9') : (t.bgB||t.accent||'#67e8f9');
  const fxLayers = `${statics?`<div class="pp-orb o1" style="background:${esc(orbA)}"></div><div class="pp-orb o2" style="background:${esc(orbB)}"></div>`:''}<div class="pp-tex"></div>`;
  const name = String(p.displayName||p.username||'misty');
  const nameHTML = `${esc(name.charAt(0))}<span>${esc(name.slice(1))}</span>`;
  const typedSrc = (p.status||p.bio||'welcome to my page').split('|').map(s=>s.trim()).filter(Boolean).join(' <> ');
  const badges = (p.badges||[]).filter(b=>BIA_BADGES[b]);
  const badgesHTML = badges.length? `<div class="bia-badges">${badges.map(b=>`
    <div class="bia-badge" data-tip="${esc(BIA_BADGES[b].tip)}">${BIA_BADGES[b].svg}</div>`).join('')}</div>`:'';
  const links = p.links||[];
  const host = u=>{ try{ return new URL(safeUrl(u)).hostname.replace('www.',''); }catch(e){ return ''; } };
  const linkedHTML = !links.length? '' : t.btnStyle==='icons'?
    `<div class="bia-linked">${links.map(l=>`
    <a class="bia-la" data-type="${esc(l.title)}" data-lid="${esc(l.id)}" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener">${iconHTML(l.icon,{...t,btnStyle:'icons'})}</a>`).join('')}</div>`
    : `<div class="pp-links">${links.map(l=>`
    <a class="pp-link ${t.btnStyle==='glass'?'':esc(t.btnStyle||'')} ${t.glow?'glow':''}" data-type="${esc(l.title)}" data-lid="${esc(l.id)}" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener">
      <span class="li">${iconHTML(l.icon,t)}</span>
      <span class="lt"><b>${esc(l.title)}</b><span>${esc(host(l.url))}</span></span>
      <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
    </a>`).join('')}</div>`;
  const widgetsHTML = (p.widgets||[]).map(w=>{
    if(w.type==='youtube'){ const e=ytEmbed(w.value); return e?`<div class="pp-widget"><iframe src="${esc(e)}" height="230" allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe></div>`:''; }
    if(w.type==='spotify'){ const e=spEmbed(w.value); return e?`<div class="pp-widget"><iframe src="${esc(e)}" height="152" allow="encrypted-media" loading="lazy" style="border-radius:18px"></iframe></div>`:''; }
    if(w.type==='discord'){ return `<a class="bia-la wide" data-type="${esc(w.title||'Discord')}" href="${esc(safeUrl(w.value))}" target="_blank" rel="noopener">${iconHTML('discord',{...t,btnStyle:'icons'})}</a>`; }
    if(w.type==='image'){ return `<div class="pp-widget"><img src="${esc(safeUrl(w.value))}" alt="" loading="lazy"></div>`; }
    if(w.type==='text'){ return `<div class="pp-widget"><div class="wtext">${w.title?`<b style="display:block;margin-bottom:8px">${esc(w.title)}</b>`:''}${esc(w.value)}</div></div>`; }
    return '';
  }).join('');
  const loc = (p.location||'').trim();
  const audio = t.audioUrl? safeUrl(t.audioUrl) : '';
  return `<div class="pp-stage biav" ${t.bgType==='anim'?`data-anim="${esc(t.anim||'aurora')}"`:''} style="${bgStyle(t)};${cursorCSS(t)}color:${tc};font-family:${font};--pa:${t.accent};--btc:${tc};--pr:${Math.min(t.radius??16,18)}px">
    <div class="pp-bg">${animLayer}${bgLayer}${fxLayers}${partCanvas}</div>
    ${audio && !pre? `<div class="bia-volume">
      <svg class="bia-volicon" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24" style="opacity:.7"><path fill="currentColor" d="M3 9v6h4l5 5V4L7 9zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77"></path></svg>
      <input type="range" class="bia-volslider" min="0" max="1" step="0.1" value="1">
    </div>`:''}
    <div class="bia-content">
      <div class="bia-container">
        <div class="bia-anim delay-7 ${av}"><img class="bia-avatar" src="${esc(p.avatar||avatarFor(p.username))}" alt=""></div>
        <div class="bia-layout">
          <div class="bia-anim delay-10 ${av}"><h1 class="bia-username" style="color:${tc}">${nameHTML}</h1></div>
          ${badgesHTML? `<div class="bia-anim delay-15 ${av}">${badgesHTML}</div>`:''}
          <div class="bia-anim delay-16 ${av}"><h3 class="bia-bio" data-typed="${esc(typedSrc)}">&nbsp;</h3></div>
        </div>
        <div class="bia-anim delay-17 ${av}">
          <div class="bia-presence">
            <div class="bia-pav"><img src="${esc(p.avatar||avatarFor(p.username))}" alt=""><span class="bia-dot"></span></div>
            <div class="bia-pinfo">
              <div class="bia-puser"><span>${esc(p.username)}</span>${badges[0]?`<i class="bia-pbadge">${BIA_BADGES[badges[0]].svg}</i>`:''}</div>
              <h3>misty.gg/${esc(p.username)}</h3>
            </div>
          </div>
        </div>
        ${linkedHTML? `<div class="bia-anim delay-18 ${av}">${linkedHTML}</div>`:''}
        ${widgetsHTML? `<div class="bia-anim delay-19 ${av}"><div class="bia-widgets">${widgetsHTML}</div></div>`:''}
        <div class="bia-anim delay-20 ${av}">
          <div class="bia-stats">
            <div class="bia-stat" data-type="Views">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span style="font-weight:400;font-size:17px">${num(p.views)}</span>
            </div>
            ${loc? `<div class="bia-sep"></div>
            <div class="bia-stat" data-type="Location">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span style="font-weight:550;font-size:17px">${esc(loc)}</span>
            </div>`:''}
            ${opts.preview? '' : `<div class="bia-sep"></div>
            <button id="ppLike" class="bia-stat asbtn ${opts.liked?'liked':''}" data-type="Like">❤ <span id="ppLikeN">${num(p.likes)}</span></button>
            <div class="bia-sep"></div>
            <button id="ppShare" class="bia-stat asbtn" data-type="Share">↗</button>`}
          </div>
        </div>
      </div>
      ${audio? `<div class="bia-anim delay-5 ${av}">
        <div class="bia-music">
          <div class="bia-player">
            <div class="bia-ptimeline">
              <span class="bia-cur" style="margin-right:5px;opacity:.9">0:00</span>
              <div class="bia-timeline"><div class="bia-tprog"></div></div>
              <span class="bia-tot" style="margin-left:5px;opacity:.9">0:00</span>
            </div>
            <div class="bia-pcontrols">
              <svg style="opacity:.4" class="bia-prev" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1m3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07a1 1 0 0 0 0 1.64"></path></svg>
              <svg class="bia-pause" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" style="cursor:pointer;pointer-events:auto;display:none"><path fill="currentColor" d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2m6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2"></path></svg>
              <svg class="bia-play" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" style="cursor:pointer;pointer-events:auto"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"></path></svg>
              <svg style="opacity:.4" class="bia-next" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m7.58 16.89l5.77-4.07c.56-.4.56-1.24 0-1.63L7.58 7.11C6.91 6.65 6 7.12 6 7.93v8.14c0 .81.91 1.28 1.58.82M16 7v10c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1s-1 .45-1 1"></path></svg>
            </div>
          </div>
          <audio class="bia-audio" src="${esc(audio)}" loop preload="${pre?'none':'auto'}"></audio>
        </div>
      </div>`:''}
      <div class="pp-foot"><img src="logo.png" alt="">made with MISTY</div>
    </div>
  </div>`;
}

function wireProfileFx(root, p, opts={}){
  const t = {...DEFAULT_THEME, ...(p.theme||{})};
  const pre = !!opts.preview;
  window.__curAccent = t.accent;
  if(!pre) cursorFxOn = !!t.cursorFx;

  const pc = root.querySelector('.pp-particles');
  if(pc){
    const ctx = pc.getContext('2d');
    pc.width = pc.offsetWidth; pc.height = pc.offsetHeight;
    const dots = Array.from({length:46},()=>({x:Math.random()*pc.width,y:Math.random()*pc.height,r:.6+Math.random()*1.8,s:.15+Math.random()*.45,tw:Math.random()*Math.PI*2}));
    ctx.shadowColor = t.accent;
    (function loop(){
      if(!pc.isConnected) return;
      ctx.clearRect(0,0,pc.width,pc.height);
      ctx.fillStyle = t.accent;
      for(const d of dots){
        d.y -= d.s; d.tw += .03;
        if(d.y<-4){ d.y=pc.height+4; d.x=Math.random()*pc.width; }
        const twinkle = .5 + Math.sin(d.tw)*.35;
        ctx.shadowBlur = d.r*4;
        ctx.globalAlpha = .35 + twinkle*.3;
        ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,7); ctx.fill();
      }
      ctx.globalAlpha=1; ctx.shadowBlur=0;
      requestAnimationFrame(loop);
    })();
  }

  const typedEl = root.querySelector('.bia-bio');
  if(typedEl){
    const texts = (typedEl.dataset.typed||'').split(' <> ').map(s=>s.trim()).filter(Boolean);
    if(texts.length){
      const cursorChar = '|';
      let ti = 0;
      function typeWriter(text, i){
        if(!typedEl.isConnected) return;
        if(i < text.length){
          typedEl.textContent = text.substring(0, i+1) + cursorChar;
          setTimeout(()=>typeWriter(text, i+1), 185);
        } else {
          setTimeout(()=>eraseText(text), 1000);
        }
      }
      function eraseText(text){
        if(!typedEl.isConnected) return;
        const len = text.length;
        if(len > 0){
          typedEl.textContent = text.substring(0, len-1) + cursorChar;
          setTimeout(()=>eraseText(text.substring(0, len-1)), 40);
        } else {
          ti = (ti+1) % texts.length;
          setTimeout(()=>typeWriter(texts[ti], 0), 500);
        }
      }
      typeWriter(texts[ti], 0);
    }
  }

  const container = root.querySelector('.bia-container');
  const music = root.querySelector('.bia-music');
  if(container && !pre && t.tilt!==false && matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    container.style.willChange = 'transform';
    container.style.backfaceVisibility = 'hidden';
    container.style.transformStyle = 'preserve-3d';
    let currentX=0, currentY=0, targetX=0, targetY=0, rafId=null;
    function animateTransform(){
      currentX += (targetX-currentX)*0.1;
      currentY += (targetY-currentY)*0.1;
      container.style.transform = `perspective(1000px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
      if(Math.abs(targetX-currentX)>0.01 || Math.abs(targetY-currentY)>0.01) rafId=requestAnimationFrame(animateTransform);
      else rafId=null;
    }
    container.addEventListener('mousemove', e=>{
      const rect = container.getBoundingClientRect();
      const offsetX = ((e.clientX-rect.left)-rect.width/2)/(rect.width/2);
      const offsetY = ((e.clientY-rect.top)-rect.height/2)/(rect.height/2);
      const intensity = 15;
      targetX = offsetX*intensity*0.5;
      targetY = -offsetY*intensity*0.5;
      if(!rafId) rafId=requestAnimationFrame(animateTransform);
    });
    container.addEventListener('mouseleave', ()=>{
      targetX=0; targetY=0;
      if(!rafId) rafId=requestAnimationFrame(animateTransform);
    });
  }

  let tipEl = document.querySelector('.badge-tooltip');
  if(!tipEl){ tipEl = document.createElement('div'); tipEl.className='badge-tooltip'; document.body.appendChild(tipEl); }
  root.querySelectorAll('.bia-badge').forEach(b=>{
    b.addEventListener('mouseenter', ()=>{
      const r = b.getBoundingClientRect();
      tipEl.textContent = b.dataset.tip||'';
      tipEl.style.left = (r.left+r.width/2)+'px';
      tipEl.style.top = (r.top-38)+'px';
      tipEl.classList.add('show');
    });
    b.addEventListener('mouseleave', ()=>tipEl.classList.remove('show'));
  });

  if(!pre){
    document.documentElement.style.setProperty('--profileFont', FONTS[t.font]||FONTS.sora);
    root.querySelectorAll('.bia-la[data-lid], .pp-link[data-lid]').forEach(a=>{
      a.addEventListener('click', e=>{
        if(a.dataset.lid) recordClick(p.username, a.dataset.lid);
        e.preventDefault();
        openRedirectPopup(a.dataset.type||'this link', a.href);
      });
    });
  }

  const audio = root.querySelector('.bia-audio');
  if(audio){
    const playIcon = root.querySelector('.bia-play');
    const pauseIcon = root.querySelector('.bia-pause');
    const timeline = root.querySelector('.bia-timeline');
    const prog = root.querySelector('.bia-tprog');
    const cur = root.querySelector('.bia-cur');
    const tot = root.querySelector('.bia-tot');
    const fmt = s=>{ s=Math.floor(s||0); return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; };
    audio.addEventListener('loadedmetadata', ()=>{ tot.textContent = fmt(audio.duration); });
    audio.addEventListener('timeupdate', ()=>{
      cur.textContent = fmt(audio.currentTime);
      if(audio.duration) prog.style.width = (audio.currentTime/audio.duration*100)+'%';
    });
    const setPlaying = on=>{ playIcon.style.display = on?'none':'block'; pauseIcon.style.display = on?'block':'none'; };
    playIcon.addEventListener('click', ()=>{ audio.play().catch(()=>{}); setPlaying(true); });
    pauseIcon.addEventListener('click', ()=>{ audio.pause(); setPlaying(false); });
    audio.addEventListener('play', ()=>setPlaying(true));
    audio.addEventListener('pause', ()=>setPlaying(false));
    root.querySelector('.bia-prev').addEventListener('click', ()=>{ audio.currentTime = Math.max(audio.currentTime-5, 0); });
    root.querySelector('.bia-next').addEventListener('click', ()=>{ audio.currentTime = Math.min(audio.currentTime+5, audio.duration||0); });
    timeline.addEventListener('click', e=>{
      const r = timeline.getBoundingClientRect();
      if(audio.duration) audio.currentTime = ((e.clientX-r.left)/r.width)*audio.duration;
    });
    const slider = root.querySelector('.bia-volslider');
    if(slider) slider.oninput = e=>{ audio.volume = +e.target.value; };
    root.__biaAudio = audio;
  }

  if(!pre){
    const elements = root.querySelectorAll('.bia-anim');
    const reveal = ()=>{
      elements.forEach(el=>{
        const dc = Array.from(el.classList).find(c=>c.startsWith('delay-'));
        const delay = dc? parseInt(dc.replace('delay-',''),10)*100 : 0;
        setTimeout(()=>{
          el.style.transition = 'opacity 500ms cubic-bezier(0.4,0,0.2,1), transform 500ms cubic-bezier(0.4,0,0.2,1)';
          el.style.opacity='1'; el.style.transform='translateY(0)';
          setTimeout(()=>{ el.style.willChange='auto'; }, 500);
        }, delay);
      });
    };
    if(t.enterScreen!==false){
      const lock = document.createElement('div');
      lock.className='bia-lockscreen';
      lock.style.fontFamily = FONTS[t.font]||FONTS.sora;
      lock.style.setProperty('--pa', t.accent||'#a78bfa');
      lock.innerHTML = `<div class="bia-lockcontent"><div class="bia-clicktext">[ click to unlock ]</div></div>`;
      root.appendChild(lock);
      let unlocked = false;
      lock.addEventListener('click', ()=>{
        if(unlocked) return;
        unlocked = true;
        lock.querySelector('.bia-clicktext').style.animation='none';
        lock.style.transition='opacity 500ms cubic-bezier(0.165,0.84,0.44,1), transform 500ms cubic-bezier(0.165,0.84,0.44,1)';
        lock.style.opacity='0';
        lock.style.transform='scale(1.1) translateZ(0)';
        setTimeout(()=>{ reveal(); setTimeout(()=>lock.remove(), 300); }, 500);
        if(audio) setTimeout(()=>{ audio.play().catch(()=>{}); }, 2000);
      });
    } else {
      reveal();
      if(audio){
        document.addEventListener('click', function once(){
          document.removeEventListener('click', once);
          setTimeout(()=>{ audio.play().catch(()=>{}); }, 2000);
        });
      }
    }
  }
}

function openRedirectPopup(label, url){
  let pop = document.querySelector('.bia-popup');
  if(!pop){
    pop = document.createElement('div');
    pop.className='bia-popup';
    pop.innerHTML = `<div class="bia-popbox">
      <p class="bia-popmsg"></p>
      <div class="bia-popbtns">
        <button class="bia-popbtn confirm">Continue</button>
        <button class="bia-popbtn cancel">Cancel</button>
      </div>
    </div>`;
    document.body.appendChild(pop);
    pop.addEventListener('click', e=>{ if(e.target===pop) pop.classList.remove('active'); });
    pop.querySelector('.cancel').onclick = ()=>pop.classList.remove('active');
  }
  pop.querySelector('.bia-popmsg').textContent = `You will be redirected to ${label}. Continue?`;
  pop.querySelector('.confirm').onclick = ()=>{ pop.classList.remove('active'); window.open(url,'_blank','noopener'); };
  pop.classList.add('active');
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
    page.innerHTML = `<button class="pp-back" onclick="history.length>1?history.back():go('')">← Back</button>
      <div class="empty" style="padding-top:30vh"><span class="big">🌫️</span>This corner of the mist is empty.<br><br>
      <button class="btn primary" onclick="document.querySelector('.public-page').remove();sessionStorage.setItem('misty_uname','${esc(uname)}');go('auth')">Claim misty.gg/${esc(uname)}</button></div>`;
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
  page.innerHTML = `<button class="pp-back" onclick="history.length>1?history.back():go('')">← misty</button>` + profileHTML(p,{liked});
  wireProfileFx(page, p);
  page.querySelector('#ppShare').onclick = ()=>{
    const url = location.origin+BASE_PATH+'@'+uname;
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
      return `<div class="pcard glass" onclick="go('@${esc(p.username)}')">
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
        <button class="btn sm" onclick="go('@${esc(u.username)}')">View</button>
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
