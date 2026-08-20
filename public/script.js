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
  startRAIBoot();
});


/* =========================================
   RAI SUPRAME // CINEMATIC BOOT V2
========================================= */

function startRAIBoot() {
  const boot = document.getElementById("boot");
  const bootText = document.getElementById("bootText");
  const progress = document.querySelector(".boot-progress span");

  if (!boot) return;

  const stages = [
    [8,  "INITIALIZING NEURAL CORE..."],
    [22, "SCANNING AI ARCHITECTURE..."],
    [38, "LOADING SUPRAME ENGINE..."],
    [55, "ESTABLISHING NEURAL LINK..."],
    [72, "CALIBRATING RESPONSE MATRIX..."],
    [88, "SECURITY PROTOCOLS ONLINE..."],
    [100, "SYSTEM READY"]
  ];

  let i = 0;

  boot.classList.remove("hide");
  boot.style.display = "grid";
  boot.style.visibility = "visible";
  boot.style.opacity = "1";

  if (progress) progress.style.width = "0%";

  function nextStage() {
    if (i >= stages.length) {
      setTimeout(finishRAIBoot, 550);
      return;
    }

    const [percent, text] = stages[i++];

    if (bootText) {
      bootText.textContent = text;
      bootText.classList.remove("boot-text-pulse");
      void bootText.offsetWidth;
      bootText.classList.add("boot-text-pulse");
    }

    if (progress) {
      progress.style.width = percent + "%";
    }

    setTimeout(nextStage, percent === 100 ? 420 : 300);
  }

  nextStage();

  // Safety fallback
  setTimeout(finishRAIBoot, 5200);
}


function finishRAIBoot() {
  const boot = document.getElementById("boot");

  if (!boot || boot.dataset.finished === "1") return;

  boot.dataset.finished = "1";

  const bootText = document.getElementById("bootText");

  if (bootText) {
    bootText.textContent = "SYSTEM READY // RAI ONLINE";
  }

  boot.classList.add("hide");

  setTimeout(() => {
    boot.style.display = "none";

    const login = document.getElementById("loginScreen");

    if (login) {
      login.style.display = "grid";
      login.style.visibility = "visible";
      login.style.opacity = "1";
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
  }, 900);
}


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
   RAI ACCESS TRANSITION
========================================= */

async function openRAIAccess() {

  const gate = $("raiAccess");
  const message = $("accessMessage");
  const status = $("accessStatus");
  const progress = $("accessProgress");

  if (!gate) return;

  gate.classList.add("active");
  gate.classList.remove("opened");
  gate.setAttribute("aria-hidden", "false");

  if (progress) progress.style.width = "0%";

  if (message) {
    message.innerHTML =
      'MEMBUKA AKSES<span class="access-dots">...</span>';
  }

  if (status) {
    status.textContent = "INITIALIZING RAI ACCESS";
  }

  await sleep(500);

  if (progress) progress.style.width = "20%";
  if (status) status.textContent = "VERIFYING IDENTITY";

  await sleep(700);

  if (progress) progress.style.width = "40%";
  if (status) status.textContent = "ESTABLISHING NEURAL LINK";

  await sleep(700);

  if (progress) progress.style.width = "60%";
  if (status) status.textContent = "LOADING RAI SUPRAME";

  await sleep(700);

  if (progress) progress.style.width = "80%";
  if (status) status.textContent = "ACCESS PROTOCOL VERIFIED";

  await sleep(700);

  if (progress) progress.style.width = "100%";

  if (message) {
    message.textContent = "AKSES TERBUKA";
  }

  if (status) {
    status.textContent = "RAI SUPRAME // SYSTEM ONLINE";
  }

  gate.classList.add("opened");

  await sleep(500);

  if (message) {
    message.textContent = "WELCOME TO RAI";
  }

  await sleep(500);

  gate.classList.remove("active");
  gate.setAttribute("aria-hidden", "true");
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

      await openRAIAccess();

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
    analyzer: openAnalyzer,
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

  const message = input.value.trim();

  if (!message) return;

  input.value = "";

  appendChat(
    box,
    "YOU",
    message,
    "user-message"
  );

  const thinking = document.createElement("div");

  thinking.className =
    "rai-message thinking";

  thinking.innerHTML =
    "<b>[RAI]</b> THINKING...";

  box.appendChild(thinking);

  box.scrollTop = box.scrollHeight;

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

    if (!res.ok) {

      const data =
        await res.json().catch(() => ({}));

      thinking.remove();

      appendChat(
        box,
        "ERROR",
        data.error || "AI ERROR",
        "error-message"
      );

      return;
    }

    if (!res.body) {
      throw new Error("STREAM TIDAK TERSEDIA");
    }

    thinking.remove();

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

    const reader =
      res.body.getReader();

    const decoder =
      new TextDecoder();

    let buffer = "";
    let fullReply = "";
    let model = "GEMINI";

    while (true) {

      const { value, done } =
        await reader.read();

      if (done) break;

      buffer += decoder.decode(
        value,
        { stream: true }
      );

      const lines =
        buffer.split("\n");

      buffer = lines.pop() || "";

      for (const line of lines) {

        if (!line.trim()) continue;

        try {

          const data =
            JSON.parse(line);

          if (data.type === "text") {

            fullReply += data.text;

            text.textContent =
              fullReply;

            box.scrollTop =
              box.scrollHeight;
          }

          if (data.type === "done") {
            model =
              data.model || model;
          }

          if (data.type === "error") {
            throw new Error(
              data.error || "STREAM ERROR"
            );
          }

        } catch (e) {

          if (
            e instanceof SyntaxError
          ) {
            continue;
          }

          throw e;
        }
      }
    }

    if (!fullReply.trim()) {
      text.textContent =
        "RAI menerima respons kosong.";
    }

    addTerminal(
      `AI response received / ${model}`
    );

  } catch (error) {

    console.error(
      "RAI CHAT:",
      error
    );

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

function openAnalyzer() {

  openModal(`

    <div class="module-label">
      RAI NEURAL DIAGNOSTIC
    </div>

    <h2>RAI ANALYZER</h2>

    <div class="analyzer-panel">

      <div class="analyzer-status">
        ANALYZER CORE // READY
      </div>

      <textarea
        id="analyzerInput"
        class="module-textarea"
        placeholder="Tempel kode, error, log, teks, konfigurasi, atau masalah di sini..."></textarea>

      <div class="analyzer-modes">

        <button class="module-button analyzer-mode active"
          data-mode="analyze">
          <span class="mode-check">✓</span>
          ANALYZE
        </button>

        <button class="module-button analyzer-mode"
          data-mode="bug">
          <span class="mode-check">✓</span>
          FIND BUG
        </button>

        <button class="module-button analyzer-mode"
          data-mode="optimize">
          <span class="mode-check">✓</span>
          OPTIMIZE
        </button>

        <button class="module-button analyzer-mode"
          data-mode="explain">
          <span class="mode-check">✓</span>
          EXPLAIN
        </button>

      </div>

      <button
        id="analyzerRun"
        class="module-button">
        RUN ANALYSIS →
      </button>

      <div
        id="analyzerResult"
        class="result-box">
        RAI ANALYZER READY.
      </div>

    </div>

  `);

  const input = $("analyzerInput");
  const run = $("analyzerRun");
  const output = $("analyzerResult");

  const modes =
    document.querySelectorAll(".analyzer-mode");

  if (!input || !run || !output) return;

  let selectedMode = "analyze";

  function updateModeButtons() {

    modes.forEach(button => {

      const selected =
        button.dataset.mode === selectedMode;

      button.classList.toggle(
        "active",
        selected
      );

      const check =
        button.querySelector(".mode-check");

      if (check) {
        check.textContent =
          selected ? "✓" : "";
      }
    });
  }

  updateModeButtons();

  modes.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        selectedMode =
          button.dataset.mode ||
          "analyze";

        updateModeButtons();

      }
    );

  });

  run.addEventListener(
    "click",
    async () => {

      const value =
        input.value.trim();

      if (!value) {

        output.textContent =
          "Masukkan sesuatu untuk dianalisis.";

        return;
      }

      const instructions = {

        analyze:
          "Analisis input berikut secara menyeluruh. Jelaskan masalah, struktur, dan poin pentingnya.",

        bug:
          "Cari bug, error, kelemahan logika, atau masalah potensial. Jelaskan penyebab dan perbaikannya.",

        optimize:
          "Cari bagian yang bisa dioptimalkan. Berikan perbaikan konkret dan aman.",

        explain:
          "Jelaskan input berikut dengan bahasa sederhana tetapi tetap teknis dan akurat."

      };

      const prompt =
`${instructions[selectedMode]}

Kamu adalah RAI ANALYZER dari RAI SUPRAME.

PENTING:
- Gunakan hanya informasi dari input.
- Jangan mengarang.
- Jika input adalah kode, gunakan format kode saat memberikan perbaikan.
- Jawab langsung dan terstruktur.

INPUT:
${value}`;

      run.disabled = true;
      run.textContent = "ANALYZING...";
      output.textContent = "";

      try {

        const res =
          await fetch(
            "/api/chat",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                message: prompt
              })
            }
          );

        if (!res.ok) {

          const errorData =
            await res.json()
              .catch(() => ({}));

          throw new Error(
            errorData.error ||
            "ANALYZER ERROR"
          );
        }

        if (!res.body) {
          throw new Error(
            "STREAM TIDAK TERSEDIA"
          );
        }

        const reader =
          res.body.getReader();

        const decoder =
          new TextDecoder();

        let buffer = "";
        let fullReply = "";

        while (true) {

          const { value, done } =
            await reader.read();

          if (done) break;

          buffer += decoder.decode(
            value,
            { stream: true }
          );

          const lines =
            buffer.split("\n");

          buffer =
            lines.pop() || "";

          for (const line of lines) {

            if (!line.trim()) continue;

            try {

              const data =
                JSON.parse(line);

              if (data.type === "text") {

                fullReply +=
                  data.text || "";

                output.textContent =
                  fullReply;
              }

              if (data.type === "error") {
                throw new Error(
                  data.error ||
                  "STREAM ERROR"
                );
              }

            } catch (e) {

              if (
                e instanceof SyntaxError
              ) {
                continue;
              }

              throw e;
            }
          }
        }

        if (!fullReply.trim()) {

          output.textContent =
            "RAI menerima respons kosong.";
        }

        run.textContent =
          "RUN ANALYSIS →";

      } catch (error) {

        console.error(
          "RAI ANALYZER:",
          error
        );

        output.textContent =
          "ANALYZER ERROR // " +
          error.message;

        run.textContent =
          "TRY AGAIN →";

      } finally {

        run.disabled = false;

      }
    }
  );
}

/* =========================================
   FILE
========================================= */

function openFile() {

  openModal(`

    <div class="module-label">
      DOCUMENT INTELLIGENCE
    </div>

    <h2>RAI FILE PRO</h2>

    <div class="file-pro-info">
      MAXIMUM FILE SIZE: <b>50 MB</b>
    </div>

    <input
      id="fileInput"
      type="file"
      class="module-input">

    <div
      id="fileMeta"
      class="file-meta">
      NO FILE SELECTED
    </div>

    <button
      id="fileAnalyze"
      class="module-button">
      ANALYZE WITH RAI →
    </button>

    <div
      id="fileResult"
      class="result-box">
      Pilih file untuk memulai analisis.
    </div>

  `);

  const input =
    $("fileInput");

  const analyze =
    $("fileAnalyze");

  const meta =
    $("fileMeta");

  const result =
    $("fileResult");

  if (!input || !analyze || !result) {
    return;
  }

  input.addEventListener(
    "change",
    () => {

      const file =
        input.files[0];

      if (!file) {

        meta.textContent =
          "NO FILE SELECTED";

        return;
      }

      const sizeMB =
        file.size /
        (1024 * 1024);

      meta.textContent =
        `${file.name} • ` +
        `${sizeMB.toFixed(2)} MB`;

      if (sizeMB > 50) {

        meta.textContent +=
          " • FILE TOO LARGE";

        analyze.disabled = true;

        result.textContent =
          "File terlalu besar. Maksimal 50 MB.";

        return;
      }

      analyze.disabled = false;

      result.textContent =
        "READY FOR RAI ANALYSIS";
    }
  );

  analyze.addEventListener(
    "click",
    async () => {

      const file =
        input.files[0];

      if (!file) {

        result.textContent =
          "Pilih file terlebih dahulu.";

        return;
      }

      if (
        file.size >
        50 * 1024 * 1024
      ) {

        result.textContent =
          "File terlalu besar. Maksimal 50 MB.";

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      analyze.disabled = true;

      analyze.textContent =
        "UPLOADING TO RAI...";

      result.textContent =
        "RAI FILE CORE // UPLOADING...";

      try {

        const res =
          await fetch(
            "/api/file-analyze",
            {
              method: "POST",
              body: formData
            }
          );

        const data =
          await res.json()
            .catch(() => ({}));

        if (!res.ok) {

          throw new Error(
            data.error ||
            "FILE ANALYSIS FAILED"
          );
        }

        analyze.textContent =
          "ANALYSIS COMPLETE ✓";

        const info =
          data.file
            ? `FILE: ${data.file.name}\n` +
              `SIZE: ${(data.file.size / (1024 * 1024)).toFixed(2)} MB\n` +
              `TYPE: ${data.file.mimeType}\n\n`
            : "";

        result.textContent =
          info +
          (
            data.reply ||
            "No response"
          );

      } catch (error) {

        console.error(
          "RAI FILE:",
          error
        );

        result.textContent =
          "FILE ERROR // " +
          error.message;

        analyze.textContent =
          "TRY AGAIN →";

      } finally {

        analyze.disabled =
          false;
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
      CREATIVE ENGINE // SUPRAME
    </div>

    <h2>RAI CREATIVE</h2>

    <div class="creative-modes">

      <button class="module-button creative-mode active"
        data-mode="image">
        <span class="creative-check">✓</span>
        🖼️ CREATE IMAGE
      </button>

      <button class="module-button creative-mode"
        data-mode="idea">
        <span class="creative-check"></span>
        💡 CREATE IDEA
      </button>

      <button class="module-button creative-mode"
        data-mode="text">
        <span class="creative-check"></span>
        ✍️ CREATE TEXT
      </button>

    </div>

    <div id="creativeModeInfo"
      class="creative-mode-info">
      IMAGE CREATOR // POSTER • ART • DESIGN
    </div>

    <textarea
      id="createInput"
      class="module-textarea"
      placeholder="Contoh: Buat poster futuristik RAI SUPRAME..."></textarea>

    <button
      id="createButton"
      class="module-button">
      CREATE IMAGE →
    </button>

    <div
      id="createResult"
      class="result-box">
      RAI CREATIVE ENGINE READY.
    </div>

  `);

  const input =
    $("createInput");

  const button =
    $("createButton");

  const result =
    $("createResult");

  const info =
    $("creativeModeInfo");

  const modes =
    document.querySelectorAll(
      ".creative-mode"
    );

  let selectedMode = "image";

  const modeData = {

    image: {
      info:
        "IMAGE CREATOR // POSTER • ART • DESIGN",

      placeholder:
        "Contoh: Poster futuristik RAI SUPRAME, tema cyber AI...",

      button:
        "CREATE IMAGE →"
    },

    idea: {
      info:
        "IDEA ENGINE // CONCEPT • CONTENT • PROJECT",

      placeholder:
        "Contoh: Berikan 5 ide konten AI yang menarik...",

      button:
        "CREATE IDEA →"
    },

    text: {
      info:
        "TEXT ENGINE // CAPTION • SCRIPT • COPYWRITING",

      placeholder:
        "Contoh: Buat caption promosi RAI SUPRAME...",

      button:
        "CREATE TEXT →"
    }

  };

  function updateMode() {

    modes.forEach(mode => {

      const selected =
        mode.dataset.mode === selectedMode;

      mode.classList.toggle(
        "active",
        selected
      );

      const check =
        mode.querySelector(
          ".creative-check"
        );

      if (check) {
        check.textContent =
          selected ? "✓" : "";
      }

    });

    const config =
      modeData[selectedMode];

    info.textContent =
      config.info;

    input.placeholder =
      config.placeholder;

    button.textContent =
      config.button;

    result.textContent =
      "RAI CREATIVE // READY";
  }

  modes.forEach(mode => {

    mode.addEventListener(
      "click",
      () => {

        selectedMode =
          mode.dataset.mode;

        updateMode();

      }
    );

  });

  updateMode();


  button.addEventListener(
    "click",
    async () => {

      const prompt =
        input.value.trim();

      if (!prompt) {

        result.textContent =
          "Masukkan deskripsi terlebih dahulu.";

        return;
      }

      button.disabled = true;
      button.textContent = "GENERATING...";
      result.textContent = "RAI CREATIVE // PROCESSING...";

      try {

        /* =========================
           IMAGE
        ========================= */

        if (selectedMode === "image") {

          const res =
            await fetch(
              "/api/generate-image",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                  prompt
                })
              }
            );

          const data =
            await res.json();

          if (!res.ok) {
            throw new Error(
              data.error ||
              "IMAGE GENERATION FAILED"
            );
          }

          if (!data.image) {
            throw new Error(
              "RAI tidak menerima URL gambar."
            );
          }

          result.innerHTML = "";

          const image =
            document.createElement("img");

          image.src = data.image;

          image.alt =
            "RAI GENERATED IMAGE";

          image.className =
            "rai-generated-image";

          image.loading =
            "lazy";

          result.appendChild(image);

          const save =
            document.createElement("button");

          save.className =
            "module-button";

          save.textContent =
            "SAVE IMAGE ↓";

          save.style.marginTop =
            "12px";

          save.onclick = () => {

            const link =
              document.createElement("a");

            link.href =
              image.src;

            link.download =
              "RAI-CREATIVE.png";

            link.click();

          };

          result.appendChild(save);

          return;
        }


        /* =========================
           IDEA / TEXT
        ========================= */

        const instruction =
          selectedMode === "idea"

            ? `Kamu adalah RAI CREATIVE.

Buat beberapa ide kreatif yang menarik berdasarkan permintaan pengguna.
Berikan judul dan penjelasan singkat untuk setiap ide.

Permintaan:
${prompt}`

            : `Kamu adalah RAI CREATIVE.

Buat tulisan berdasarkan permintaan pengguna.
Hasil harus natural, menarik, dan siap digunakan.

Permintaan:
${prompt}`;

        const res =
          await fetch(
            "/api/chat",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                message: instruction
              })
            }
          );

        if (!res.ok) {

          const data =
            await res.json()
              .catch(() => ({}));

          throw new Error(
            data.error ||
            "CREATIVE ERROR"
          );
        }

        if (!res.body) {
          throw new Error("STREAM TIDAK TERSEDIA");
        }

        const reader =
          res.body.getReader();

        const decoder =
          new TextDecoder();

        let buffer = "";
        let fullReply = "";

        while (true) {

          const { value, done } =
            await reader.read();

          if (done) break;

          buffer += decoder.decode(
            value,
            { stream: true }
          );

          const lines =
            buffer.split("\n");

          buffer =
            lines.pop() || "";

          for (const line of lines) {

            if (!line.trim()) continue;

            try {

              const data =
                JSON.parse(line);

              if (data.type === "text") {

                fullReply +=
                  data.text || "";

                result.textContent =
                  fullReply;
              }

              if (data.type === "error") {

                throw new Error(
                  data.error ||
                  "STREAM ERROR"
                );
              }

            } catch (e) {

              if (
                e instanceof SyntaxError
              ) {
                continue;
              }

              throw e;
            }
          }
        }

        if (!fullReply.trim()) {

          result.textContent =
            "RAI menerima respons kosong.";
        }

      } catch (error) {

        console.error(
          "RAI CREATIVE:",
          error
        );

        result.textContent =
          "CREATIVE ERROR // " +
          error.message;

      } finally {

        button.disabled = false;

        button.textContent =
          modeData[selectedMode].button;

      }

    }
  );

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

      <button data-command="analyzer">
        🧠 OPEN ANALYZER
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

/* =========================================
   RAI SYSTEM STATUS
========================================= */

(function initRAISystemStatus() {

  const battery =
    document.getElementById("batteryStatus");

  const network =
    document.getElementById("networkStatus");

  const temperature =
    document.getElementById("temperatureStatus");

  if (!battery || !network || !temperature) {
    return;
  }

  /* BATTERY */

  async function updateBattery() {

    try {

      if (!navigator.getBattery) {
        battery.textContent = "--%";
        return;
      }

      const manager =
        await navigator.getBattery();

      function render() {

        const percent =
          Math.round(
            manager.level * 100
          );

        battery.textContent =
          `${percent}%`;

        battery.parentElement
          ?.classList.toggle(
            "charging",
            manager.charging
          );
      }

      render();

      manager.addEventListener(
        "levelchange",
        render
      );

      manager.addEventListener(
        "chargingchange",
        render
      );

    } catch {

      battery.textContent = "--%";

    }
  }


  /* NETWORK */

  function updateNetwork() {

    if (!navigator.onLine) {

      network.textContent =
        "OFFLINE";

      return;
    }

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (!connection) {

      network.textContent =
        "ONLINE";

      return;
    }

    const type =
      connection.type;

    if (type === "wifi") {

      network.textContent =
        "WIFI";

    } else if (
      type === "cellular"
    ) {

      network.textContent =
        "MOBILE DATA";

    } else if (
      connection.effectiveType
    ) {

      network.textContent =
        connection.effectiveType
          .toUpperCase();

    } else {

      network.textContent =
        "ONLINE";
    }
  }


  /* TEMPERATURE */

  function updateTemperature() {

    /*
      Browser tidak menyediakan
      API standar untuk suhu HP.
      Jangan menampilkan angka palsu.
    */

    if ("temperature" in navigator) {

      try {

        const value =
          navigator.temperature;

        if (
          typeof value === "number" &&
          Number.isFinite(value)
        ) {

          temperature.textContent =
            `${Math.round(value)}°C`;

          return;
        }

      } catch {}
    }

    temperature.textContent =
      "--°C";
  }


  window.addEventListener(
    "online",
    updateNetwork
  );

  window.addEventListener(
    "offline",
    updateNetwork
  );

  updateBattery();
  updateNetwork();
  updateTemperature();

  setInterval(
    updateNetwork,
    3000
  );

  setInterval(
    updateTemperature,
    5000
  );

})();



/* =========================================
   RAI MUSIC CORE
   MAX 3 LOCAL SONGS
   PERSISTENT STORAGE — INDEXEDDB
========================================= */

(() => {
  const musicButton = document.getElementById("musicButton");
  const musicPanel = document.getElementById("musicPanel");
  const musicClose = document.getElementById("musicClose");
  const musicInput = document.getElementById("musicInput");
  const musicSlots = document.getElementById("musicSlots");
  const musicPlay = document.getElementById("musicPlay");
  const musicPrev = document.getElementById("musicPrev");
  const musicNext = document.getElementById("musicNext");
  const musicVolume = document.getElementById("musicVolume");
  const audio = document.getElementById("raiAudio");

  if (!musicButton || !musicPanel || !audio) return;

  const MAX_SONGS = 3;
  const DB_NAME = "RAI_MUSIC_DATABASE";
  const DB_VERSION = 1;
  const STORE_NAME = "songs";

  let db = null;
  let songs = [];
  let currentIndex = -1;

  audio.volume = 0.2;

  /* =========================================
     INDEXEDDB
  ========================================= */

  function openMusicDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = event => {
        const database = event.target.result;

        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true
          });
        }
      };

      request.onsuccess = event => {
        db = event.target.result;
        resolve(db);
      };

      request.onerror = () => {
        console.error("RAI MUSIC DB ERROR:", request.error);
        reject(request.error);
      };
    });
  }

  function dbGetAll() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  function dbAdd(song) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);

      const request = store.add({
        name: song.name,
        type: song.type,
        blob: song.blob
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function dbDelete(id) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /* =========================================
     URL MANAGEMENT
  ========================================= */

  function makeSongURL(song) {
    if (song.url) {
      URL.revokeObjectURL(song.url);
    }

    song.url = URL.createObjectURL(song.blob);
    return song.url;
  }

  /* =========================================
     ANDROID MEDIA SESSION
  ========================================= */

  function updateMediaSession(song) {
    if (!("mediaSession" in navigator)) return;
    if (typeof MediaMetadata === "undefined") return;

    try {
      const logo = new URL(
        "assets/rai-logo.png",
        window.location.href
      ).href;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: song?.name || "RAI SUPRAME",
        artist: "RAI MUSIC",
        album: "REPUBLIK OF AI",
        artwork: [
          {
            src: logo,
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: logo,
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: logo,
            sizes: "128x128",
            type: "image/png"
          }
        ]
      });
    } catch (e) {
      console.warn("RAI MEDIA SESSION:", e);
    }
  }

  /* =========================================
     RENDER
  ========================================= */

  function renderMusic() {
    musicSlots.innerHTML = "";

    for (let i = 0; i < MAX_SONGS; i++) {
      const song = songs[i];
      const slot = document.createElement("div");

      slot.className =
        "music-slot" +
        (i === currentIndex ? " active" : "");

      if (song) {
        slot.innerHTML = `
          <div class="music-slot-info">
            <span class="music-slot-name"></span>
            <span class="music-slot-meta">
              SLOT ${i + 1} • SAVED
            </span>
          </div>

          <button class="music-select" type="button">
            ${i === currentIndex && !audio.paused ? "❚❚" : "▶"}
          </button>

          <button class="music-delete" type="button">
            ×
          </button>
        `;

        slot.querySelector(".music-slot-name").textContent =
          song.name;

        slot.querySelector(".music-select").onclick = () => {
          if (i === currentIndex && !audio.paused) {
            audio.pause();
          } else {
            playSong(i);
          }

          renderMusic();
        };

        slot.querySelector(".music-delete").onclick = () => {
          removeSong(i);
        };

      } else {

        slot.innerHTML = `
          <div class="music-slot-info">
            <span class="music-slot-name">EMPTY SLOT</span>
            <span class="music-slot-meta">
              SLOT ${i + 1}
            </span>
          </div>
        `;
      }

      musicSlots.appendChild(slot);
    }
  }

  /* =========================================
     PLAY SONG
  ========================================= */

  async function playSong(index) {
    const song = songs[index];
    if (!song) return;

    currentIndex = index;

    makeSongURL(song);

    audio.src = song.url;

    updateMediaSession(song);

    try {
      await audio.play();

      musicButton.classList.add("active");
      musicPlay.textContent = "❚❚";

      renderMusic();

    } catch (err) {
      console.warn("RAI MUSIC PLAY:", err);
    }
  }

  /* =========================================
     REMOVE SONG
  ========================================= */

  async function removeSong(index) {
    const song = songs[index];
    if (!song) return;

    const wasCurrent = index === currentIndex;

    try {
      await dbDelete(song.id);
    } catch (e) {
      console.error("RAI MUSIC DELETE:", e);
    }

    if (song.url) {
      URL.revokeObjectURL(song.url);
    }

    songs.splice(index, 1);

    if (!songs.length) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      currentIndex = -1;

      musicButton.classList.remove("active");
      musicPlay.textContent = "▶";

      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null;
      }

    } else if (wasCurrent) {

      audio.pause();

      currentIndex = Math.min(
        index,
        songs.length - 1
      );

      musicButton.classList.remove("active");
      musicPlay.textContent = "▶";

    } else if (index < currentIndex) {
      currentIndex--;
    }

    renderMusic();
  }

  /* =========================================
     MUSIC PANEL
  ========================================= */

  musicButton.onclick = () => {
    musicPanel.classList.toggle("hidden");
    renderMusic();
  };

  musicClose.onclick = () => {
    musicPanel.classList.add("hidden");
  };

  /* =========================================
     ADD MUSIC
  ========================================= */

  musicInput.onchange = async event => {
    const files = [...event.target.files];

    for (const file of files) {
      if (songs.length >= MAX_SONGS) break;

      if (!file.type.startsWith("audio/")) continue;

      try {
        const id = await dbAdd({
          name: file.name,
          type: file.type,
          blob: file
        });

        songs.push({
          id,
          name: file.name,
          type: file.type,
          blob: file,
          url: null
        });

      } catch (e) {
        console.error("RAI MUSIC SAVE:", e);
      }
    }

    musicInput.value = "";

    renderMusic();
  };

  /* =========================================
     MAIN PLAY BUTTON
  ========================================= */

  musicPlay.onclick = () => {

    if (currentIndex < 0) {
      if (songs.length) {
        playSong(0);
      }
      return;
    }

    if (audio.paused) {

      updateMediaSession(songs[currentIndex]);

      audio.play().then(() => {
        musicButton.classList.add("active");
        musicPlay.textContent = "❚❚";
        renderMusic();
      }).catch(err => {
        console.warn("RAI MUSIC RESUME:", err);
      });

    } else {

      audio.pause();

      musicButton.classList.remove("active");
      musicPlay.textContent = "▶";

      renderMusic();
    }
  };

  /* =========================================
     PREVIOUS
  ========================================= */

  musicPrev.onclick = () => {
    if (!songs.length) return;

    const next =
      currentIndex <= 0
        ? songs.length - 1
        : currentIndex - 1;

    playSong(next);
  };

  /* =========================================
     NEXT
  ========================================= */

  musicNext.onclick = () => {
    if (!songs.length) return;

    const next =
      currentIndex >= songs.length - 1
        ? 0
        : currentIndex + 1;

    playSong(next);
  };

  /* =========================================
     VOLUME
  ========================================= */

  musicVolume.oninput = () => {
    audio.volume = Number(musicVolume.value);
  };

  /* =========================================
     AUTO NEXT
  ========================================= */

  audio.onended = () => {
    if (!songs.length) return;

    const next =
      currentIndex >= songs.length - 1
        ? 0
        : currentIndex + 1;

    playSong(next);
  };

  audio.onpause = () => {
    musicButton.classList.remove("active");
    musicPlay.textContent = "▶";
    renderMusic();
  };

  /* =========================================
     LOAD SAVED MUSIC
  ========================================= */

  async function initMusic() {
    try {
      await openMusicDB();

      const savedSongs = await dbGetAll();

      songs = savedSongs.map(song => ({
        id: song.id,
        name: song.name,
        type: song.type,
        blob: song.blob,
        url: null
      }));

      renderMusic();

      console.log(
        "RAI MUSIC:",
        songs.length,
        "lagu berhasil dimuat dari penyimpanan lokal."
      );

    } catch (e) {
      console.error(
        "RAI MUSIC STORAGE ERROR:",
        e
      );

      renderMusic();
    }
  }

  initMusic();

})();

/* ==========================================
   RAI MUSIC — ANDROID MEDIA ARTWORK
   ========================================== */
(function () {
    function setRAIMediaArtwork() {
        if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;

        const logo = new URL("assets/rai-logo.png", window.location.href).href;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: "RAI SUPRAME",
            artist: "REPUBLIK OF AI",
            album: "RAI MUSIC",
            artwork: [
                {
                    src: logo,
                    sizes: "512x512",
                    type: "image/png"
                },
                {
                    src: logo,
                    sizes: "256x256",
                    type: "image/png"
                },
                {
                    src: logo,
                    sizes: "128x128",
                    type: "image/png"
                }
            ]
        });
    }

    function hookAudio() {
        document.querySelectorAll("audio").forEach(audio => {
            audio.addEventListener("play", setRAIMediaArtwork);
            audio.addEventListener("loadedmetadata", setRAIMediaArtwork);
        });

        setRAIMediaArtwork();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", hookAudio);
    } else {
        hookAudio();
    }
})();
