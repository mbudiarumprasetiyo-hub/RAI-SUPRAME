cd RAI-SUPRAME
cp style.css style.backup.css
cp script.js script.backup.js
cat > style.css <<'EOF'
:root{
  --main:#00ff9d;
  --main2:#00d9ff;
  --bg:#020408;
  --panel:rgba(7,12,18,.72);
  --panel2:rgba(10,18,26,.9);
  --text:#f2fffa;
  --muted:#71858a;
  --danger:#ff3155;
  --border:rgba(0,255,157,.18);
  --glow:rgba(0,255,157,.25);
}

*{
  box-sizing:border-box;
  margin:0;
  padding:0;
}

html{
  scroll-behavior:smooth;
}

body{
  min-height:100vh;
  overflow-x:hidden;
  background:
    radial-gradient(circle at 50% -20%,rgba(0,255,157,.14),transparent 35%),
    radial-gradient(circle at 100% 50%,rgba(0,217,255,.08),transparent 30%),
    var(--bg);
  color:var(--text);
  font-family:"Courier New",monospace;
}

button,
input,
textarea{
  font:inherit;
}

button{
  cursor:pointer;
}

.hidden{
  display:none!important;
}


/* =========================
   CYBER BACKGROUND
========================= */

body::before{
  content:"";
  position:fixed;
  inset:0;
  z-index:-10;
  pointer-events:none;
  opacity:.22;
  background-image:
    linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
  background-size:45px 45px;
  animation:gridMove 15s linear infinite;
}

@keyframes gridMove{
  from{background-position:0 0}
  to{background-position:0 45px}
}

body::after{
  content:"";
  position:fixed;
  inset:0;
  z-index:1000;
  pointer-events:none;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(255,255,255,.015) 0,
      rgba(255,255,255,.015) 1px,
      transparent 1px,
      transparent 4px
    );
  mix-blend-mode:overlay;
}

.ambient{
  position:fixed;
  width:450px;
  height:450px;
  border-radius:50%;
  filter:blur(110px);
  opacity:.11;
  z-index:-8;
  pointer-events:none;
}

.ambient-1{
  left:-220px;
  top:15%;
  background:var(--main);
  animation:ambientOne 10s ease-in-out infinite;
}

.ambient-2{
  right:-220px;
  bottom:5%;
  background:var(--main2);
  animation:ambientTwo 13s ease-in-out infinite;
}

@keyframes ambientOne{
  50%{
    transform:translate(100px,-70px) scale(1.2);
  }
}

@keyframes ambientTwo{
  50%{
    transform:translate(-100px,50px) scale(1.15);
  }
}

.grid{
  position:fixed;
  inset:0;
  z-index:-9;
  pointer-events:none;
}

.scan{
  position:fixed;
  left:0;
  right:0;
  top:-5px;
  height:2px;
  z-index:900;
  pointer-events:none;
  background:linear-gradient(
    90deg,
    transparent,
    var(--main),
    transparent
  );
  box-shadow:0 0 15px var(--main);
  opacity:.25;
  animation:scanLine 5s linear infinite;
}

@keyframes scanLine{
  to{
    top:100vh;
  }
}


/* =========================
   BOOT
========================= */

.boot{
  position:fixed;
  inset:0;
  z-index:9999;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  background:
    radial-gradient(circle,rgba(0,255,157,.08),transparent 35%),
    #010305;
  transition:
    opacity .8s,
    visibility .8s,
    transform .8s;
}

.boot.hide{
  opacity:0;
  visibility:hidden;
  transform:scale(1.05);
}

.boot-logo{
  position:relative;
  font-size:clamp(70px,18vw,150px);
  font-weight:900;
  letter-spacing:20px;
  color:var(--main);
  text-shadow:
    0 0 10px var(--main),
    0 0 40px var(--main),
    5px 0 var(--danger),
    -5px 0 var(--main2);
  animation:
    bootGlitch 1.2s infinite,
    bootPulse 2s ease-in-out infinite;
}

@keyframes bootGlitch{
  0%,85%,100%{
    transform:none;
  }
  87%{
    transform:translate(8px,-3px) skew(-5deg);
  }
  89%{
    transform:translate(-7px,3px) skew(5deg);
  }
  91%{
    transform:translate(3px);
  }
}

@keyframes bootPulse{
  50%{
    filter:brightness(1.4);
  }
}

.boot-text{
  margin-top:15px;
  color:#75958c;
  font-size:10px;
  letter-spacing:4px;
  text-transform:uppercase;
}

.boot-bar{
  width:min(300px,75vw);
  height:3px;
  margin-top:25px;
  overflow:hidden;
  background:#10191b;
  border:1px solid rgba(0,255,157,.15);
}

.boot-bar span{
  display:block;
  width:0;
  height:100%;
  background:var(--main);
  box-shadow:
    0 0 15px var(--main),
    0 0 30px var(--main);
  animation:bootLoad 1.8s cubic-bezier(.7,0,.2,1) forwards;
}

@keyframes bootLoad{
  to{
    width:100%;
  }
}


/* =========================
   LOGIN
========================= */

.login-screen{
  min-height:100vh;
  display:grid;
  place-items:center;
  padding:20px;
}

.login-card{
  position:relative;
  width:min(460px,94vw);
  padding:42px 32px;
  overflow:hidden;
  background:
    linear-gradient(
      145deg,
      rgba(10,22,24,.82),
      rgba(2,6,10,.88)
    );
  border:1px solid var(--border);
  backdrop-filter:blur(25px);
  box-shadow:
    0 0 100px rgba(0,255,157,.08),
    inset 0 0 60px rgba(0,255,157,.025);
  animation:loginIn .9s cubic-bezier(.2,.8,.2,1);
}

.login-card::before,
.login-card::after{
  content:"";
  position:absolute;
  pointer-events:none;
}

.login-card::before{
  width:200px;
  height:200px;
  right:-100px;
  top:-100px;
  border-radius:50%;
  background:var(--main);
  filter:blur(70px);
  opacity:.1;
}

.login-card::after{
  left:0;
  top:0;
  width:100%;
  height:1px;
  background:linear-gradient(
    90deg,
    transparent,
    var(--main),
    transparent
  );
  box-shadow:0 0 20px var(--main);
}

@keyframes loginIn{
  from{
    opacity:0;
    transform:
      translateY(45px)
      scale(.92);
    filter:blur(8px);
  }
  to{
    opacity:1;
    transform:none;
    filter:none;
  }
}

.mini-status{
  display:flex;
  align-items:center;
  gap:8px;
  color:var(--main);
  font-size:9px;
  letter-spacing:3px;
}

.mini-status span,
.status-dot,
.live{
  width:7px;
  height:7px;
  flex:none;
  display:inline-block;
  border-radius:50%;
  background:var(--main);
  box-shadow:
    0 0 8px var(--main),
    0 0 20px var(--main);
  animation:statusPulse 1.4s infinite;
}

@keyframes statusPulse{
  50%{
    opacity:.3;
    transform:scale(.6);
  }
}

.logo{
  margin-top:25px;
  text-align:center;
  font-size:82px;
  font-weight:900;
  letter-spacing:18px;
  color:var(--main);
  text-shadow:
    0 0 20px var(--main),
    0 0 60px rgba(0,255,157,.35),
    4px 0 var(--danger),
    -4px 0 var(--main2);
  animation:logoGlitch 4s infinite;
}

@keyframes logoGlitch{
  0%,90%,100%{
    transform:none;
  }
  92%{
    transform:skew(-8deg);
  }
  94%{
    transform:translateX(7px);
  }
  96%{
    transform:translateX(-7px);
  }
}

.login-card h1{
  text-align:center;
  font-size:25px;
  letter-spacing:10px;
}

.login-desc{
  margin-top:12px;
  text-align:center;
  color:var(--muted);
  font-size:9px;
  line-height:2;
  letter-spacing:2px;
}

.field{
  margin-top:22px;
}

.field label{
  display:block;
  margin-bottom:8px;
  color:var(--main);
  font-size:9px;
  letter-spacing:3px;
}

.field input{
  width:100%;
  padding:15px;
  color:white;
  outline:none;
  background:rgba(0,0,0,.5);
  border:1px solid rgba(0,255,157,.15);
  transition:.3s;
}

.field input::placeholder{
  color:#40504f;
}

.field input:focus{
  border-color:var(--main);
  box-shadow:
    0 0 0 1px var(--main),
    0 0 25px rgba(0,255,157,.1);
}

.login-btn{
  position:relative;
  width:100%;
  margin-top:26px;
  padding:16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  overflow:hidden;
  color:#00130c;
  background:var(--main);
  border:1px solid var(--main);
  box-shadow:0 0 25px rgba(0,255,157,.12);
  transition:.3s;
}

.login-btn::before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,.35),
    transparent
  );
  transform:translateX(-100%);
  transition:.5s;
}

.login-btn:hover::before{
  transform:translateX(100%);
}

.login-btn:hover{
  transform:translateY(-3px);
  box-shadow:
    0 12px 35px rgba(0,255,157,.2),
    0 0 35px rgba(0,255,157,.15);
}

.login-status{
  margin-top:18px;
  min-height:14px;
  text-align:center;
  color:#668078;
  font-size:9px;
  letter-spacing:2px;
}

.login-footer{
  margin-top:32px;
  padding-top:15px;
  text-align:center;
  color:#354441;
  font-size:8px;
  letter-spacing:2px;
  border-top:1px solid var(--border);
}


/* =========================
   APP / NAVBAR
========================= */

.app{
  min-height:100vh;
  animation:appIn .8s ease;
}

@keyframes appIn{
  from{
    opacity:0;
    filter:blur(8px);
  }
  to{
    opacity:1;
    filter:none;
  }
}

.navbar{
  position:sticky;
  top:0;
  z-index:100;
  min-height:74px;
  padding:12px 5%;
  display:flex;
  align-items:center;
  background:rgba(2,6,9,.72);
  border-bottom:1px solid var(--border);
  backdrop-filter:blur(25px);
}

.brand{
  display:flex;
  align-items:center;
  gap:12px;
  flex:1;
}

.brand-logo{
  width:43px;
  height:43px;
  display:grid;
  place-items:center;
  color:var(--main);
  font-weight:bold;
  font-size:20px;
  border:1px solid var(--main);
  box-shadow:
    0 0 15px rgba(0,255,157,.15),
    inset 0 0 15px rgba(0,255,157,.08);
  transform:rotate(45deg);
}

.brand-logo::first-letter{
  transform:rotate(-45deg);
}

.brand strong,
.brand small{
  display:block;
}

.brand strong{
  letter-spacing:2px;
}

.brand small{
  margin-top:4px;
  color:#536665;
  font-size:8px;
  letter-spacing:3px;
}

.nav-center{
  color:var(--main);
  font-size:9px;
  letter-spacing:2px;
}

.nav-center .status-dot{
  margin-right:7px;
}

.nav-actions{
  display:flex;
  gap:8px;
  margin-left:20px;
}

.nav-actions button{
  padding:9px 13px;
  color:var(--main);
  background:transparent;
  border:1px solid var(--border);
  transition:.25s;
}

.nav-actions button:hover{
  color:#00140c;
  background:var(--main);
  border-color:var(--main);
  box-shadow:0 0 20px rgba(0,255,157,.15);
}

#logoutBtn{
  color:#ff7185;
  border-color:rgba(255,49,85,.2);
}


/* =========================
   MAIN / HERO
========================= */

main{
  width:min(1250px,92%);
  margin:auto;
}

.hero{
  position:relative;
  min-height:560px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:40px;
}

.hero-content{
  max-width:700px;
  z-index:2;
}

.eyebrow{
  display:inline-flex;
  padding:9px 13px;
  color:var(--main);
  background:rgba(0,255,157,.025);
  border:1px solid var(--border);
  font-size:9px;
  letter-spacing:2px;
  box-shadow:0 0 25px rgba(0,255,157,.04);
  animation:eyebrowFloat 3s ease-in-out infinite;
}

@keyframes eyebrowFloat{
  50%{
    transform:translateY(-5px);
    box-shadow:0 8px 30px rgba(0,255,157,.08);
  }
}

.hero h1{
  margin:25px 0 12px;
  font-size:clamp(42px,7vw,88px);
  line-height:.9;
  letter-spacing:-5px;
  text-transform:uppercase;
}

.hero h1 span{
  display:block;
  color:var(--main);
  text-shadow:
    0 0 25px rgba(0,255,157,.3),
    0 0 70px rgba(0,255,157,.1);
}

.hero p{
  min-height:25px;
  color:#71868a;
  font-size:12px;
  line-height:1.8;
}

.hero-buttons{
  display:flex;
  gap:12px;
  margin-top:30px;
}

.primary-btn,
.ghost-btn{
  position:relative;
  padding:14px 18px;
  overflow:hidden;
  border:1px solid var(--main);
  transition:.3s;
}

.primary-btn{
  color:#00140c;
  background:var(--main);
}

.ghost-btn{
  color:var(--main);
  background:transparent;
}

.primary-btn:hover,
.ghost-btn:hover{
  transform:translateY(-5px);
  box-shadow:
    0 15px 40px rgba(0,255,157,.15);
}

.primary-btn span{
  margin-left:20px;
}


/* =========================
   ORB
========================= */

.hero-orb{
  position:relative;
  width:340px;
  height:340px;
  flex:none;
  display:grid;
  place-items:center;
  animation:orbFloat 5s ease-in-out infinite;
}

@keyframes orbFloat{
  50%{
    transform:translateY(-12px);
  }
}

.hero-orb::before{
  content:"";
  position:absolute;
  width:130px;
  height:130px;
  border-radius:50%;
  background:var(--main);
  filter:blur(80px);
  opacity:.12;
}

.orb-core{
  position:relative;
  z-index:5;
  width:105px;
  height:105px;
  display:grid;
  place-items:center;
  color:var(--main);
  font-size:55px;
  font-weight:bold;
  border:1px solid var(--main);
  border-radius:50%;
  background:rgba(0,20,15,.65);
  box-shadow:
    0 0 30px rgba(0,255,157,.25),
    inset 0 0 35px rgba(0,255,157,.12);
  animation:corePulse 2.5s ease-in-out infinite;
}

@keyframes corePulse{
  50%{
    transform:scale(1.1);
    box-shadow:
      0 0 70px rgba(0,255,157,.35),
      inset 0 0 50px rgba(0,255,157,.2);
  }
}

.ring{
  position:absolute;
  border:1px solid var(--border);
  border-radius:50%;
}

.ring-1{
  width:160px;
  height:160px;
  border-color:rgba(0,255,157,.45);
  animation:spin 6s linear infinite;
}

.ring-2{
  width:230px;
  height:230px;
  border-style:dashed;
  animation:spin 10s linear infinite reverse;
}

.ring-3{
  width:310px;
  height:310px;
  border-color:rgba(0,217,255,.14);
  animation:spin 18s linear infinite;
}

@keyframes spin{
  to{
    transform:rotate(360deg);
  }
}


/* =========================
   QUICK STATUS
========================= */

.quick{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  overflow:hidden;
  background:rgba(4,10,14,.65);
  border:1px solid var(--border);
}

.quick div{
  position:relative;
  padding:22px;
  border-right:1px solid var(--border);
  transition:.3s;
}

.quick div:last-child{
  border-right:0;
}

.quick div:hover{
  background:rgba(0,255,157,.035);
}

.quick span,
.quick strong{
  display:block;
}

.quick span{
  color:#526669;
  font-size:8px;
  letter-spacing:2px;
}

.quick strong{
  margin-top:9px;
  color:var(--main);
  font-size:12px;
}


/* =========================
   SECTIONS
========================= */

.section-title{
  margin:95px 0 28px;
  display:flex;
  align-items:end;
  justify-content:space-between;
}

.section-title span{
  color:var(--main);
  font-size:9px;
  letter-spacing:3px;
}

.section-title h2{
  margin-top:8px;
  font-size:30px;
  letter-spacing:-1px;
}

.section-title p{
  color:#5f7378;
  font-size:10px;
}


/* =========================
   FEATURES
========================= */

.feature-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:15px;
}

.feature{
  position:relative;
  min-height:230px;
  padding:25px;
  overflow:hidden;
  cursor:pointer;
  background:
    linear-gradient(
      145deg,
      rgba(10,22,25,.8),
      rgba(2,7,10,.9)
    );
  border:1px solid var(--border);
  transition:
    transform .35s,
    border-color .35s,
    box-shadow .35s;
  animation:featureIn .7s backwards;
}

.feature:nth-child(2){animation-delay:.04s}
.feature:nth-child(3){animation-delay:.08s}
.feature:nth-child(4){animation-delay:.12s}
.feature:nth-child(5){animation-delay:.16s}
.feature:nth-child(6){animation-delay:.20s}
.feature:nth-child(7){animation-delay:.24s}
.feature:nth-child(8){animation-delay:.28s}
.feature:nth-child(9){animation-delay:.32s}
.feature:nth-child(10){animation-delay:.36s}

@keyframes featureIn{
  from{
    opacity:0;
    transform:translateY(30px);
  }
  to{
    opacity:1;
    transform:none;
  }
}

.feature:hover{
  transform:
    translateY(-9px)
    perspective(500px)
    rotateX(1deg);
  border-color:rgba(0,255,157,.55);
  box-shadow:
    0 20px 60px rgba(0,0,0,.4),
    0 0 35px rgba(0,255,157,.08);
}

.feature::before{
  content:"";
  position:absolute;
  top:0;
  left:-110%;
  width:80%;
  height:1px;
  background:linear-gradient(
    90deg,
    transparent,
    var(--main),
    transparent
  );
  box-shadow:0 0 20px var(--main);
  transition:.7s;
}

.feature:hover::before{
  left:110%;
}

.feature::after{
  content:"";
  position:absolute;
  right:-70px;
  bottom:-70px;
  width:140px;
  height:140px;
  border-radius:50%;
  background:var(--main);
  filter:blur(70px);
  opacity:0;
  transition:.4s;
}

.feature:hover::after{
  opacity:.08;
}

.feature-large{
  grid-column:span 2;
  min-height:255px;
}

.feature-icon{
  margin-bottom:20px;
  font-size:34px;
  filter:
    drop-shadow(0 0 10px rgba(0,255,157,.2));
  transition:.3s;
}

.feature:hover .feature-icon{
  transform:scale(1.12) rotate(-4deg);
}

.tag{
  color:var(--main);
  font-size:8px;
  letter-spacing:2px;
}

.feature h3{
  margin:8px 0;
  font-size:20px;
  letter-spacing:1px;
}

.feature p{
  max-width:350px;
  color:#697c80;
  font-size:10px;
  line-height:1.8;
}

.arrow{
  position:absolute;
  right:20px;
  bottom:18px;
  color:var(--main);
  font-size:22px;
  transition:.3s;
}

.feature:hover .arrow{
  transform:
    translate(4px,-4px)
    scale(1.2);
}

.special{
  border-color:rgba(0,255,157,.35);
}

.special-glow{
  position:absolute;
  right:-100px;
  top:-100px;
  width:220px;
  height:220px;
  border-radius:50%;
  background:var(--main);
  filter:blur(80px);
  opacity:.1;
  animation:specialPulse 3s infinite;
}

@keyframes specialPulse{
  50%{
    transform:scale(1.2);
    opacity:.16;
  }
}

.command-example{
  margin-top:20px;
  padding:11px;
  color:#7ba69a;
  background:rgba(0,0,0,.3);
  border-left:2px solid var(--main);
  font-size:9px;
}


/* =========================
   TERMINAL
========================= */

.console{
  position:relative;
  margin-top:80px;
  overflow:hidden;
  background:rgba(0,0,0,.62);
  border:1px solid var(--border);
  box-shadow:
    inset 0 0 50px rgba(0,255,157,.025);
}

.console-header{
  display:flex;
  justify-content:space-between;
  padding:14px 18px;
  color:var(--main);
  font-size:10px;
  letter-spacing:1px;
  border-bottom:1px solid var(--border);
}

.console-header .live{
  margin-right:8px;
}

.console-header small{
  color:#526567;
}

#terminalOutput{
  min-height:170px;
  max-height:240px;
  overflow:auto;
  padding:20px;
  color:#79b99e;
  font-size:10px;
  line-height:2.1;
}

#terminalOutput div{
  animation:terminalLine .35s ease;
}

@keyframes terminalLine{
  from{
    opacity:0;
    transform:translateX(-10px);
  }
  to{
    opacity:1;
    transform:none;
  }
}


/* =========================
   THEMES
========================= */

.themes{
  margin:50px 0;
}

.themes>span{
  color:var(--main);
  font-size:9px;
  letter-spacing:3px;
}

.themes div{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-top:15px;
}

.themes button{
  padding:9px 13px;
  color:var(--main);
  background:rgba(0,0,0,.25);
  border:1px solid var(--border);
  transition:.25s;
}

.themes button:hover{
  color:#00140c;
  background:var(--main);
  transform:translateY(-2px);
}


/* =========================
   MODAL
========================= */

.modal{
  position:fixed;
  inset:0;
  z-index:500;
  display:grid;
  place-items:center;
  padding:20px;
  background:rgba(0,0,0,.78);
  backdrop-filter:blur(15px);
  animation:modalBg .25s ease;
}

@keyframes modalBg{
  from{opacity:0}
  to{opacity:1}
}

.modal-box{
  position:relative;
  width:min(760px,96vw);
  max-height:90vh;
  overflow:auto;
  padding:32px;
  background:
    linear-gradient(
      145deg,
      rgba(8,18,21,.98),
      rgba(2,6,9,.98)
    );
  border:1px solid var(--main);
  box-shadow:
    0 0 80px rgba(0,255,157,.12),
    inset 0 0 40px rgba(0,255,157,.025);
  animation:modalIn .35s cubic-bezier(.2,.8,.2,1);
}

@keyframes modalIn{
  from{
    opacity:0;
    transform:scale(.9) translateY(20px);
  }
  to{
    opacity:1;
    transform:none;
  }
}

.close{
  position:absolute;
  top:12px;
  right:15px;
  z-index:2;
  color:#ff7185;
  background:none;
  border:0;
  font-size:28px;
  transition:.2s;
}

.close:hover{
  transform:rotate(90deg) scale(1.2);
}


/* =========================
   FOOTER
========================= */

footer{
  padding:35px 20px;
  text-align:center;
  color:#344548;
  font-size:8px;
  letter-spacing:2px;
}


/* =========================
   MOBILE
========================= */

@media(max-width:850px){

  .nav-center{
    display:none;
  }

  .hero{
    min-height:auto;
    padding:75px 0 50px;
    display:block;
  }

  .hero-orb{
    margin:70px auto 0;
    transform:scale(.8);
  }

  .quick{
    grid-template-columns:1fr 1fr;
  }

  .quick div:nth-child(2){
    border-right:0;
  }

  .quick div:nth-child(-n+2){
    border-bottom:1px solid var(--border);
  }

  .feature-grid{
    grid-template-columns:1fr 1fr;
  }

  .feature-large{
    grid-column:span 2;
  }

  .section-title{
    display:block;
  }

  .section-title p{
    margin-top:12px;
  }
}

@media(max-width:560px){

  .navbar{
    padding:10px 4%;
  }

  .brand strong{
    font-size:11px;
  }

  .brand small{
    font-size:6px;
  }

  .brand-logo{
    width:38px;
    height:38px;
  }

  .nav-actions{
    margin-left:8px;
  }

  .nav-actions button{
    padding:8px;
  }

  #commandButton{
    display:none;
  }

  #logoutBtn{
    font-size:8px;
  }

  main{
    width:92%;
  }

  .hero{
    padding-top:60px;
  }

  .hero h1{
    font-size:44px;
    letter-spacing:-3px;
  }

  .hero-buttons{
    flex-direction:column;
  }

  .hero-orb{
    transform:scale(.65);
    margin-top:35px;
  }

  .feature-grid{
    grid-template-columns:1fr;
  }

  .feature-large{
    grid-column:auto;
  }

  .quick strong{
    font-size:10px;
  }

  .login-card{
    padding:35px 22px;
  }

  .logo{
    font-size:65px;
  }

  .modal-box{
    padding:25px 18px;
  }
}EOF
