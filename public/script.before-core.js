const loginScreen = document.getElementById("loginScreen");
const appScreen = document.getElementById("appScreen");
const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const typingText = document.getElementById("typingText");
const terminalOutput = document.getElementById("terminalOutput");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));


/* BOOT */

window.addEventListener("load", async () => {

  await sleep(1900);

  document.getElementById("boot")
    .classList.add("hide");

  checkSession();

});


/* PARTICLES */

const particles =
  document.getElementById("particles");

for (let i = 0; i < 35; i++) {

  const p = document.createElement("i");

  p.style.position = "fixed";
  p.style.width = `${Math.random() * 3 + 1}px`;
  p.style.height = p.style.width;
  p.style.left = `${Math.random() * 100}%`;
  p.style.top = `${Math.random() * 100}%`;
  p.style.background = "var(--main)";
  p.style.borderRadius = "50%";
  p.style.opacity = Math.random() * .5;
  p.style.boxShadow = "0 0 8px var(--main)";
  p.style.pointerEvents = "none";
  p.style.zIndex = "-1";

  const duration =
    4 + Math.random() * 8;

  p.style.animation =
    `particleFloat ${duration}s ease-in-out infinite alternate`;

  p.style.animationDelay =
    `${Math.random() * 5}s`;

  particles.appendChild(p);
}

const particleStyle =
document.createElement("style");

particleStyle.textContent = `
@keyframes particleFloat {
  from {
    transform:translateY(0) translateX(0);
  }
  to {
    transform:
      translateY(-${Math.floor(
        30 + Math.random() * 100
      )}px)
      translateX(${Math.floor(
        -30 + Math.random() * 60
      )}px);
  }
}
`;

document.head.appendChild(particleStyle);


/* SESSION */

async function checkSession() {

  try {

    const res =
      await fetch("/api/session");

    const data =
      await res.json();

    if (data.authenticated) {
      showApp(data.username);
    }

  } catch {}

}


function showApp(username) {

  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  userName.textContent =
    username.toUpperCase();

  typeText(
    typingText,
    "Your intelligent command environment is ready."
  );

}


/* TYPING */

function typeText(element,text) {

  let i = 0;

  element.textContent = "";

  const timer =
    setInterval(() => {

      element.textContent += text[i++];

      if (i >= text.length)
        clearInterval(timer);

    },25);

}


/* LOGIN */

loginForm.addEventListener("submit",async e => {

  e.preventDefault();

  loginStatus.textContent =
    "AUTHENTICATING...";

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  try {

    const res =
      await fetch("/api/login",{

        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({
          username,
          password
        })

      });

    const data =
      await res.json();

    if (data.success) {

      loginStatus.textContent =
        "ACCESS GRANTED";

      await sleep(400);

      showApp(username);

    } else {

      loginStatus.textContent =
        "ACCESS DENIED";

      loginStatus.style.color =
        "#ff3155";

    }

  } catch {

    loginStatus.textContent =
      "SERVER ERROR";

  }

});


/* LOGOUT */

logoutBtn.addEventListener(
  "click",
  async () => {

    await fetch(
      "/api/logout",
      {method:"POST"}
    );

    location.reload();

  }
);


/* FEATURE WINDOWS */

const featureNames = {

  chat: "RAI CHAT",
  send: "RAI SEND",
  voice: "RAI VOICE",
  code: "RAI CODE",
  file: "RAI FILE",
  search: "RAI SEARCH",
  tools: "RAI TOOLS",
  create: "RAI CREATE",
  memory: "RAI MEMORY",
  command: "RAI COMMAND"

};


document
.querySelectorAll("[data-open]")
.forEach(el => {

  el.addEventListener("click",() => {

    openFeature(
      el.dataset.open
    );

  });

});


function openFeature(name) {

  const title =
    featureNames[name] || "RAI";

  if (name === "chat") {
    openChat();
    return;
  }

  if (name === "send") {
    openSend();
    return;
  }

  modalContent.innerHTML = `

    <div style="
      color:var(--main);
      font-size:10px;
      letter-spacing:3px;
    ">
      SUPRAME MODULE
    </div>

    <h2 style="
      margin:12px 0;
      font-size:30px;
    ">
      ${title}
    </h2>

    <p style="
      color:var(--muted);
      line-height:1.8;
      font-size:11px;
    ">
      Interface initialized.
      This module is ready for the next
      SUPRAME development phase.
    </p>

    <div style="
      margin-top:25px;
      padding:15px;
      border-left:2px solid var(--main);
      color:#79b89b;
      font-size:10px;
    ">
      > ${title} INITIALIZING...<br>
      > CONNECTION READY<br>
      > WAITING FOR IMPLEMENTATION
    </div>

  `;

  modal.classList.remove("hidden");

}


/* CHAT */

function openChat() {

  modalContent.innerHTML = `

    <div style="
      color:var(--main);
      font-size:9px;
      letter-spacing:3px;
    ">
      AI INTERFACE
    </div>

    <h2>RAI CHAT</h2>

    <div id="chatBox"
      style="
        height:300px;
        overflow:auto;
        padding:15px;
        border:1px solid var(--border);
        background:#020605;
        line-height:1.8;
        font-size:11px;
      ">

      <div style="color:var(--main)">
        [RAI] SUPRAME AI READY.
      </div>

    </div>

    <div style="
      display:flex;
      gap:8px;
      margin-top:12px;
    ">

      <input
        id="chatInput"
        placeholder="Tulis pesan..."
        style="
          flex:1;
          padding:13px;
          background:#020605;
          border:1px solid var(--border);
          color:white;
          outline:none;
        ">

      <button
        id="chatSend"
        style="
          padding:13px;
          background:var(--main);
          color:#00140b;
          border:0;
        ">
        SEND
      </button>

    </div>
  `;

  modal.classList.remove("hidden");

  const input =
    document.getElementById("chatInput");

  input.focus();

  document
    .getElementById("chatSend")
    .addEventListener(
      "click",
      sendChat
    );

  input.addEventListener(
    "keydown",
    e => {

      if (e.key === "Enter")
        sendChat();

    }
  );

}


async function sendChat() {

  const input =
    document.getElementById("chatInput");

  const box =
    document.getElementById("chatBox");

  const message =
    input.value.trim();

  if (!message)
    return;

  input.value = "";

  box.innerHTML += `
    <div style="
      margin-top:15px;
      color:white;
    ">
      [YOU] ${escapeHTML(message)}
    </div>
  `;

  box.innerHTML += `
    <div id="thinking"
      style="
        margin-top:8px;
        color:var(--main);
      ">
      [RAI] THINKING...
    </div>
  `;

  box.scrollTop =
    box.scrollHeight;

  try {

    const res =
      await fetch("/api/chat",{

        method:"POST",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:JSON.stringify({
          message
        })

      });

    const data =
      await res.json();

    document
      .getElementById("thinking")
      ?.remove();

    if (!res.ok) {

      box.innerHTML += `
        <div style="color:#ff3155">
          [ERROR]
          ${escapeHTML(
            data.error ||
            "AI ERROR"
          )}
        </div>
      `;

      return;
    }

    box.innerHTML += `
      <div style="
        margin-top:8px;
        color:#91ffc8;
        white-space:pre-wrap;
      ">
        [RAI] ${escapeHTML(data.reply)}
      </div>
    `;

    box.scrollTop =
      box.scrollHeight;

  } catch {

    document
      .getElementById("thinking")
      ?.remove();

    box.innerHTML += `
      <div style="color:#ff3155">
        [ERROR] CONNECTION FAILED
      </div>
    `;

  }

}


/* SEND */

function openSend() {

  modalContent.innerHTML = `

    <div style="
      color:var(--main);
      font-size:9px;
      letter-spacing:3px;
    ">
      COMMUNICATION
    </div>

    <h2>RAI SEND</h2>

    <label style="color:var(--main);font-size:9px">
      PHONE NUMBER
    </label>

    <input
      id="sendNumber"
      placeholder="628xxxxxxxxxx"
      style="
        width:100%;
        margin:8px 0 18px;
        padding:13px;
        background:#020605;
        border:1px solid var(--border);
        color:white;
        outline:none;
      ">

    <label style="color:var(--main);font-size:9px">
      MESSAGE
    </label>

    <textarea
      id="sendMessage"
      placeholder="Tulis pesan..."
      style="
        width:100%;
        height:130px;
        margin-top:8px;
        padding:13px;
        resize:none;
        background:#020605;
        border:1px solid var(--border);
        color:white;
        outline:none;
      "></textarea>

    <button
      id="whatsappButton"
      style="
        width:100%;
        margin-top:15px;
        padding:14px;
        border:1px solid var(--main);
        background:var(--main);
        color:#00140b;
      ">
      OPEN WHATSAPP
    </button>

    <p style="
      color:#596d65;
      font-size:9px;
      line-height:1.7;
    ">
      RAI akan membuka WhatsApp dengan
      nomor dan pesan yang sudah disiapkan.
      Pengiriman tetap dikonfirmasi di WhatsApp.
    </p>

  `;

  modal.classList.remove("hidden");

  document
    .getElementById("whatsappButton")
    .addEventListener(
      "click",
      () => {

        const number =
          document
            .getElementById("sendNumber")
            .value
            .replace(/\D/g,"");

        const message =
          document
            .getElementById("sendMessage")
            .value;

        if (!number || !message)
          return;

        const url =
          `https://wa.me/${number}?text=${
            encodeURIComponent(message)
          }`;

        window.open(
          url,
          "_blank"
        );

      }
    );

}


/* CLOSE */

closeModal.addEventListener(
  "click",
  () => modal.classList.add("hidden")
);

modal.addEventListener(
  "click",
  e => {

    if (e.target === modal)
      modal.classList.add("hidden");

  }
);


/* THEMES */

const themes = {

  green:["#00ff88","#00d9ff"],

  cyan:["#00eaff","#008cff"],

  purple:["#b86cff","#ff5bea"],

  red:["#ff3155","#ff7835"],

  ice:["#8eeeff","#4db8ff"]

};

document
.querySelectorAll("[data-theme]")
.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const theme =
        themes[
          button.dataset.theme
        ];

      if (!theme)
        return;

      document.documentElement
        .style.setProperty(
          "--main",
          theme[0]
        );

      document.documentElement
        .style.setProperty(
          "--main2",
          theme[1]
        );

      localStorage
        .setItem(
          "rai-theme",
          button.dataset.theme
        );

    }
  );

});


const savedTheme =
  localStorage.getItem("rai-theme");

if (savedTheme && themes[savedTheme]) {

  document.documentElement
    .style.setProperty(
      "--main",
      themes[savedTheme][0]
    );

  document.documentElement
    .style.setProperty(
      "--main2",
      themes[savedTheme][1]
    );

}


/* COMMAND */

document
.getElementById("commandButton")
.addEventListener(
  "click",
  () => openFeature("command")
);


/* ESCAPE */

function escapeHTML(text) {

  return String(text)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}
