const $ = id => document.getElementById(id);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const loginScreen = $("loginScreen");
const appScreen = $("appScreen");
const modal = $("modal");
const modalContent = $("modalContent");

const themes = {
  green: ["#00ff88", "#00d9ff"],
  cyan: ["#00eaff", "#008cff"],
  purple: ["#b86cff", "#ff5bea"],
  red: ["#ff3155", "#ff7835"],
  ice: ["#8eeeff", "#4db8ff"]
};


/* =========================================
   BOOT
========================================= */

window.addEventListener("load", () => {
  // Boot harus selalu selesai walaupun modul lain error
  setTimeout(() => {
    const boot = document.getElementById("boot");

    if (boot) {
      boot.classList.add("hide");

      setTimeout(() => {
        boot.style.display = "none";
      }, 900);
    }

    try {
      createParticles();
    } catch (e) {
      console.warn("Particles error:", e);
    }

    try {
      checkSession();
    } catch (e) {
      console.warn("Session error:", e);
    }
  }, 1800);
});


/* =========================================
   PARTICLES - LIGHTWEIGHT
========================================= */

function createParticles() {
  const container = $("particles");

  if (!container) return;

  const fragment = document.createDocumentFragment();

  const amount = window.innerWidth <= 700 ? 12 : 20;

  for (let i = 0; i < amount; i++) {
    const p = document.createElement("span");

    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";

    p.style.setProperty(
      "--x",
      `${Math.random() * 80 - 40}px`
    );

    p.style.setProperty(
      "--y",
      `${Math.random() * -160 - 20}px`
    );

    p.style.animationDuration =
      `${6 + Math.random() * 8}s`;

    fragment.appendChild(p);
  }

  container.appendChild(fragment);
}


/* =========================================
   SESSION
========================================= */

async function checkSession() {
  try {
    const res = await fetch("/api/session");

    const data = await res.json();

    if (data.authenticated) {
      showApp(data.username);
    }

  } catch {
    // Server belum tersedia
  }
}


function showApp(username) {
  loginScreen?.classList.add("hidden");
  appScreen?.classList.remove("hidden");

  if ($("userName")) {
    $("userName").textContent =
      String(username || "OPERATOR").toUpperCase();
  }

  typeText(
    $("typingText"),
    "Neural command environment ready. All core systems operational."
  );

  addTerminal("Operator authenticated");
}


/* =========================================
   GENERAL TYPING
========================================= */

async function typeText(el, text, speed = 18) {
  if (!el) return;

  el.textContent = "";

  for (const char of String(text)) {
    el.textContent += char;

    await sleep(speed);
  }
}


/* =========================================
   AI TYPING ENGINE
========================================= */

async function typeAIResponse(element, text) {

  if (!element) return;

  element.textContent = "";

  const content = String(text || "");

  for (let i = 0; i < content.length; i++) {

    element.textContent += content[i];

    /*
      Jangan delay terlalu lama.
      Ini membuat efek tetap keren
      tapi tidak bikin HP berat.
    */

    if (i % 2 === 0) {
      await sleep(8);
    }

    const box = $("chatBox");

    if (box) {
      box.scrollTop = box.scrollHeight;
    }
  }
}


/* =========================================
   LOGIN
========================================= */

$("loginForm")?.addEventListener(
  "submit",
  async e => {

    e.preventDefault();

    const status = $("loginStatus");

    status.textContent = "AUTHENTICATING...";
    status.className = "";

    try {

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: $("username").value,
          password: $("password").value
        })
      });

      const data = await res.json();

      if (!res.ok) {

        status.textContent =
          data.message || "ACCESS DENIED";

        status.className = "error";

        return;
      }

      status.textContent =
        "ACCESS GRANTED";

      await sleep(350);

      showApp(
        $("username").value
      );

    } catch {

      status.textContent =
        "SERVER CONNECTION FAILED";

      status.className = "error";
    }
  }
);


/* =========================================
   LOGOUT
========================================= */

$("logoutBtn")?.addEventListener(
  "click",
  async () => {

    try {
      await fetch("/api/logout", {
        method: "POST"
      });
    } catch {}

    location.reload();
  }
);


/* =========================================
   FEATURES
========================================= */

document
  .querySelectorAll("[data-open]")
  .forEach(el => {

    el.addEventListener(
      "click",
      () => openFeature(el.dataset.open)
    );

  });


function openFeature(name) {

  const features = {
    chat: openChat,
    send: openSend,
    voice: openVoice,
    code: openCode,
    file: openFile,
    search: openSearch,
    tools: openTools,
    create: openCreate,
    memory: openMemory,
    command: openCommand
  };

  if (features[name]) {
    features[name]();
  }
}


/* =========================================
   MODAL
========================================= */

function openModal(html) {

  modalContent.innerHTML = html;

  modal.classList.remove("hidden");
}


function closeModal() {
  modal.classList.add("hidden");
}


$("closeModal")?.addEventListener(
  "click",
  closeModal
);


modal?.addEventListener(
  "click",
  e => {

    if (e.target === modal) {
      closeModal();
    }

  }
);


/* =========================================
   CHAT
========================================= */

function openChat() {

  openModal(`
    <div class="module-label">
      AI CORE / GEMINI
    </div>

    <h2>RAI CHAT</h2>

    <div id="chatBox" class="chat-box">

      <div class="rai-message">
        <b>[RAI]</b>
        SUPRAME AI CORE READY.
      </div>

    </div>

    <div class="chat-row">

      <input
        id="chatInput"
        placeholder="Tulis pesan ke RAI..."
        autocomplete="off">

      <button id="chatSend">
        SEND
      </button>

    </div>
  `);

  const input = $("chatInput");

  input?.focus();

  $("chatSend")?.addEventListener(
    "click",
    sendChat
  );

  input?.addEventListener(
    "keydown",
    e => {

      if (e.key === "Enter") {
        e.preventDefault();
        sendChat();
      }

    }
  );
}


/* =========================================
   SEND CHAT
========================================= */

async function sendChat() {

  const input = $("chatInput");
  const box = $("chatBox");

  if (!input || !box) return;

  const message =
    input.value.trim();

  if (!message) return;

  input.value = "";

  appendChat(
    box,
    "YOU",
    message,
    "user-message"
  );

  const thinking =
    document.createElement("div");

  thinking.className =
    "rai-message thinking";

  thinking.innerHTML =
    "<b>[RAI]</b> THINKING...";

  box.appendChild(thinking);

  box.scrollTop =
    box.scrollHeight;

  try {

    const res = await fetch(
      "/api/chat",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message
        })
      }
    );

    const data =
      await res.json();

    thinking.remove();

    if (!res.ok) {

      appendChat(
        box,
        "ERROR",
        data.error || "AI ERROR",
        "error-message"
      );

      return;
    }

    /*
      Buat bubble RAI kosong.
      Setelah itu jawaban diketik
      huruf demi huruf.
    */

    const reply =
      document.createElement("div");

    reply.className =
      "rai-message";

    reply.innerHTML =
      "<b>[RAI]</b> ";

    const text =
      document.createElement("span");

    reply.appendChild(text);

    box.appendChild(reply);

    await typeAIResponse(
      text,
      data.reply || "No response"
    );

    addTerminal(
      `AI response received / ${data.model || "GEMINI"}`
    );

  } catch {

    thinking.remove();

    appendChat(
      box,
      "ERROR",
      "CONNECTION FAILED",
      "error-message"
    );
  }

  box.scrollTop =
    box.scrollHeight;
}


/* =========================================
   CHAT APPEND
========================================= */

function appendChat(
  box,
  name,
  text,
  className
) {

  const div =
    document.createElement("div");

  div.className =
    className;

  div.innerHTML =
    `<b>[${escapeHTML(name)}]</b> ` +
    escapeHTML(text);

  box.appendChild(div);
}


/* =========================================
   RAI CODE
========================================= */

function openCode() {

  openModal(`

    <div class="module-label">
      DEVELOPER SYSTEM
    </div>

    <h2>RAI CODE</h2>

    <textarea
      id="codeInput"
      class="module-textarea tall"
      placeholder="Contoh: buat function JavaScript untuk..."></textarea>

    <button
      id="codeAsk"
      class="module-button">
      ASK RAI TO CODE →
    </button>

    <div
      id="codeResult"
      class="result-box">
      Waiting for instruction...
    </div>

  `);

  $("codeAsk").addEventListener(
    "click",
    async () => {

      const prompt =
        $("codeInput").value.trim();

      if (!prompt) {
        $("codeResult").textContent =
          "Masukkan instruksi terlebih dahulu.";

        return;
      }

      const result =
        $("codeResult");

      const button =
        $("codeAsk");

      button.disabled = true;

      button.textContent =
        "RAI CODING...";

      result.textContent = "";

      try {

        /*
          BUG LAMA DI SINI:
          sebelumnya request /api/chat
          dipanggil dua kali.

          Sekarang hanya SATU request.
        */

        const response =
          await fetch(
            "/api/chat",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json"
              },

              body: JSON.stringify({
                message:
                  `Bertindak sebagai programmer ahli.
Berikan jawaban coding yang lengkap, jelas,
dan siap digunakan.

Permintaan:
${prompt}`
              })
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          result.textContent =
            data.error ||
            "RAI CODE ERROR";

          return;
        }

        /*
          Typing effect untuk RAI CODE
        */

        await typeResult(
          result,
          data.reply ||
          "RAI tidak memberikan jawaban."
        );

        addTerminal(
          "RAI CODE response generated"
        );

      } catch {

        result.textContent =
          "CONNECTION FAILED";

      } finally {

        button.disabled =
          false;

        button.textContent =
          "ASK RAI TO CODE →";
      }

    }
  );
}


/* =========================================
   RESULT TYPING
========================================= */

async function typeResult(
  element,
  text
) {

  element.textContent = "";

  const content =
    String(text || "");

  /*
    Kecepatan dibuat sedikit lebih cepat
    supaya kode panjang tidak terasa lambat.
  */

  for (
    let i = 0;
    i < content.length;
    i++
  ) {

    element.textContent +=
      content[i];

    if (i % 3 === 0) {
      await sleep(5);
    }

    element.scrollTop =
      element.scrollHeight;
  }
}


/* =========================================
   SEND
========================================= */

function openSend() {

  openModal(`

    <div class="module-label">
      COMMUNICATION
    </div>

    <h2>RAI SEND</h2>

    <input
      id="sendNumber"
      class="module-input"
      placeholder="628xxxxxxxxxx">

    <textarea
      id="sendMessage"
      class="module-textarea"
      placeholder="Tulis pesan..."></textarea>

    <button
      id="waButton"
      class="module-button">
      OPEN WHATSAPP →
    </button>

    <p class="hint">
      RAI menyiapkan pesan lalu membuka WhatsApp.
      Pengiriman dikonfirmasi oleh WhatsApp.
    </p>

  `);

  $("waButton").addEventListener(
    "click",
    () => {

      const number =
        $("sendNumber")
          .value
          .replace(/\D/g, "");

      const message =
        $("sendMessage")
          .value
          .trim();

      if (!number || !message) {
        alert(
          "Nomor dan pesan wajib diisi."
        );
        return;
      }

      const url =
        `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

      window.open(
        url,
        "_blank"
      );

      addTerminal(
        "WhatsApp action prepared"
      );
    }
  );
}


/* =========================================
   VOICE
========================================= */

function openVoice() {

  openModal(`

    <div class="module-label">
      VOICE INTERFACE
    </div>

    <h2>RAI VOICE</h2>

    <div
      class="voice-core"
      id="voiceCore">
      🎙️
    </div>

    <p id="voiceStatus">
      Tekan tombol untuk mulai mendengarkan.
    </p>

    <button
      id="voiceButton"
      class="module-button">
      START LISTENING
    </button>

    <textarea
      id="voiceResult"
      class="module-textarea"
      placeholder="Hasil suara..."></textarea>

  `);

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    $("voiceStatus").textContent =
      "Browser ini tidak mendukung Speech Recognition.";

    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang =
    "id-ID";

  recognition.interimResults =
    true;

  $("voiceButton").addEventListener(
    "click",
    () => {

      $("voiceStatus").textContent =
        "LISTENING...";

      $("voiceCore")
        .classList
        .add("listening");

      try {
        recognition.start();
      } catch {}
    }
  );

  recognition.onresult =
    e => {

      let text = "";

      for (
        let i = e.resultIndex;
        i < e.results.length;
        i++
      ) {

        text +=
          e.results[i][0]
            .transcript;
      }

      $("voiceResult").value =
        text;
    };

  recognition.onend =
    () => {

      $("voiceStatus").textContent =
        "VOICE CAPTURE COMPLETE";

      $("voiceCore")
        .classList
        .remove("listening");
    };
}


/* =========================================
   FILE
========================================= */

function openFile() {

  openModal(`

    <div class="module-label">
      DOCUMENT INTELLIGENCE
    </div>

    <h2>RAI FILE</h2>

    <input
      id="fileInput"
      type="file"
      class="module-input">

    <button
      id="fileAnalyze"
      class="module-button">
      ANALYZE WITH RAI →
    </button>

    <div
      id="fileResult"
      class="result-box">
      Select a text-based file first.
    </div>

  `);

  $("fileAnalyze").addEventListener(
    "click",
    async () => {

      const file =
        $("fileInput")
          .files[0];

      if (!file) {

        $("fileResult").textContent =
          "Pilih file terlebih dahulu.";

        return;
      }

      const text =
        await file.text();

      if (text.length > 50000) {

        $("fileResult").textContent =
          "File terlalu besar. Maksimal 50KB.";

        return;
      }

      $("fileResult").textContent =
        "ANALYZING...";

      try {

        const res =
          await fetch(
            "/api/chat",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json"
              },

              body: JSON.stringify({
                message:
                  `Analisis file berikut dan berikan ringkasan:

${text}`
              })
            }
          );

        const data =
          await res.json();

        await typeResult(
          $("fileResult"),
          data.reply ||
          data.error ||
          "No response"
        );

      } catch {

        $("fileResult").textContent =
          "CONNECTION FAILED";
      }
    }
  );
}


/* =========================================
   SEARCH
========================================= */

function openSearch() {

  openModal(`

    <div class="module-label">
      WEB RESEARCH
    </div>

    <h2>RAI SEARCH</h2>

    <input
      id="searchInput"
      class="module-input"
      placeholder="Cari sesuatu...">

    <button
      id="searchButton"
      class="module-button">
      SEARCH WEB →
    </button>

    <p class="hint">
      Membuka pencarian web menggunakan browser.
    </p>

  `);

  $("searchButton").addEventListener(
    "click",
    () => {

      const q =
        $("searchInput")
          .value
          .trim();

      if (!q) return;

      window.open(
        "https://www.google.com/search?q=" +
        encodeURIComponent(q),
        "_blank"
      );

      addTerminal(
        "Web search launched"
      );
    }
  );
}


/* =========================================
   TOOLS
========================================= */

function openTools() {

  openModal(`

    <div class="module-label">
      UTILITY CORE
    </div>

    <h2>RAI TOOLS</h2>

    <div class="tool-grid">

      <button id="calcTool">
        🧮 CALCULATOR
      </button>

      <button id="timeTool">
        🕐 CURRENT TIME
      </button>

      <button id="clearTool">
        🧹 CLEAR TERMINAL
      </button>

    </div>

    <div
      id="toolResult"
      class="result-box">
      Utility system ready.
    </div>

  `);

  $("calcTool").onclick =
    () => {

      const expression =
        prompt(
          "Masukkan perhitungan:"
        );

      if (!expression) return;

      try {

        if (
          !/^[0-9+\-*/().%\s]+$/
            .test(expression)
        ) {
          throw new Error();
        }

        const result =
          Function(
            `"use strict";return (${expression})`
          )();

        $("toolResult").textContent =
          `${expression} = ${result}`;

      } catch {

        $("toolResult").textContent =
          "Perhitungan tidak valid.";
      }
    };


  $("timeTool").onclick =
    () => {

      $("toolResult").textContent =
        new Date().toLocaleString(
          "id-ID",
          {
            dateStyle: "full",
            timeStyle: "medium"
          }
        );
    };


  $("clearTool").onclick =
    () => {

      $("terminalOutput").innerHTML =
        "<div>> Terminal cleared</div>";

      $("toolResult").textContent =
        "Terminal cleared.";
    };
}


/* =========================================
   CREATE
========================================= */

function openCreate() {

  openModal(`

    <div class="module-label">
      CREATIVE ENGINE
    </div>

    <h2>RAI CREATE</h2>

    <textarea
      id="createInput"
      class="module-textarea"
      placeholder="Contoh: buat ide konten TikTok tentang AI..."></textarea>

    <button
      id="createButton"
      class="module-button">
      CREATE WITH RAI →
    </button>

    <div
      id="createResult"
      class="result-box">
      Creative engine ready.
    </div>

  `);

  $("createButton").onclick =
    async () => {

      const prompt =
        $("createInput")
          .value
          .trim();

      if (!prompt) return;

      const button =
        $("createButton");

      button.disabled =
        true;

      button.textContent =
        "CREATING...";

      try {

        const res =
          await fetch(
            "/api/chat",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json"
              },

              body: JSON.stringify({
                message:
                  "Bantu saya membuat konten kreatif berikut:\n" +
                  prompt
              })
            }
          );

        const data =
          await res.json();

        await typeResult(
          $("createResult"),
          data.reply ||
          data.error ||
          "No response"
        );

      } catch {

        $("createResult").textContent =
          "CONNECTION FAILED";

      } finally {

        button.disabled =
          false;

        button.textContent =
          "CREATE WITH RAI →";
      }
    };
}


/* =========================================
   MEMORY
========================================= */

function openMemory() {

  const notes =
    JSON.parse(
      localStorage.getItem(
        "rai-memory"
      ) || "[]"
    );

  openModal(`

    <div class="module-label">
      LOCAL MEMORY
    </div>

    <h2>RAI MEMORY</h2>

    <textarea
      id="memoryInput"
      class="module-textarea"
      placeholder="Tulis catatan yang ingin disimpan..."></textarea>

    <button
      id="saveMemory"
      class="module-button">
      SAVE MEMORY
    </button>

    <div
      id="memoryList"
      class="memory-list">
    </div>

  `);

  renderMemory(notes);

  $("saveMemory").onclick =
    () => {

      const value =
        $("memoryInput")
          .value
          .trim();

      if (!value) return;

      notes.push({
        text: value,
        time:
          new Date()
            .toLocaleString("id-ID")
      });

      localStorage.setItem(
        "rai-memory",
        JSON.stringify(notes)
      );

      $("memoryInput").value =
        "";

      renderMemory(notes);
    };
}


function renderMemory(notes) {

  const list =
    $("memoryList");

  if (!list) return;

  list.innerHTML = "";

  if (!notes.length) {

    list.innerHTML =
      "<p class='hint'>No memories stored.</p>";

    return;
  }

  notes.forEach(
    (note, index) => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "memory-item";

      item.innerHTML = `
        <span>
          ${escapeHTML(note.text)}
        </span>

        <small>
          ${escapeHTML(note.time)}
        </small>

        <button data-index="${index}">
          ×
        </button>
      `;

      item
        .querySelector("button")
        .onclick =
        () => {

          notes.splice(index, 1);

          localStorage.setItem(
            "rai-memory",
            JSON.stringify(notes)
          );

          renderMemory(notes);
        };

      list.appendChild(item);
    }
  );
}


/* =========================================
   COMMAND CENTER
========================================= */

function openCommand() {

  openModal(`

    <div class="module-label">
      SUPRAME CONTROL
    </div>

    <h2>RAI COMMAND</h2>

    <p class="hint">
      Jalankan command langsung dari interface.
    </p>

    <div class="command-list">

      <button data-command="chat">
        🧠 OPEN AI CHAT
      </button>

      <button data-command="voice">
        🎙️ OPEN VOICE
      </button>

      <button data-command="send">
        📱 OPEN SEND
      </button>

      <button data-command="memory">
        🧠 OPEN MEMORY
      </button>

      <button data-command="tools">
        🛠️ OPEN TOOLS
      </button>

    </div>

    <div class="command-terminal">
      <span>&gt;</span>
      COMMAND CENTER READY
    </div>

  `);

  document
    .querySelectorAll("[data-command]")
    .forEach(btn => {

      btn.onclick =
        () => {

          const feature =
            btn.dataset.command;

          /*
            Tutup command lama
            lalu buka module baru.
          */

          openFeature(feature);
        };
    });
}


/* =========================================
   TERMINAL
========================================= */

function addTerminal(text) {

  const terminal =
    $("terminalOutput");

  if (!terminal) return;

  const line =
    document.createElement("div");

  line.textContent =
    "> " + text;

  terminal.appendChild(line);

  while (
    terminal.children.length > 12
  ) {

    terminal.removeChild(
      terminal.firstChild
    );
  }

  terminal.scrollTop =
    terminal.scrollHeight;
}


/* =========================================
   THEMES
========================================= */

document
  .querySelectorAll("[data-theme]")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        const theme =
          themes[btn.dataset.theme];

        if (!theme) return;

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

        localStorage.setItem(
          "rai-theme",
          btn.dataset.theme
        );
      }
    );
  });


const savedTheme =
  localStorage.getItem(
    "rai-theme"
  );

if (
  savedTheme &&
  themes[savedTheme]
) {

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


/* =========================================
   COMMAND BUTTON
========================================= */

$("commandButton")?.addEventListener(
  "click",
  () => openCommand()
);


/* =========================================
   SYSTEM CLOCK
========================================= */

setInterval(
  () => {

    const el =
      $("monitorTime");

    if (el) {

      el.textContent =
        new Date()
          .toLocaleTimeString("id-ID");
    }

  },
  1000
);


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(text) {

  return String(text)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );
}

/* ================================
   RAI SUPRAME BOOT FAILSAFE
================================ */

(function () {
  function finishBoot() {
    const boot = document.getElementById("boot");

    if (!boot) return;

    boot.classList.add("hide");

    setTimeout(function () {
      boot.style.display = "none";

      const login = document.getElementById("loginScreen");
      if (login) {
        login.style.display = "grid";
        login.style.visibility = "visible";
        login.style.opacity = "1";
      }
    }, 900);
  }

  // Beri waktu animasi boot berjalan
  setTimeout(finishBoot, 3000);

  // Kalau halaman sudah selesai dimuat
  window.addEventListener("load", function () {
    setTimeout(finishBoot, 1000);
  });
})();
