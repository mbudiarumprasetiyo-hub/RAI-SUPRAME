require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

app.use(session({
  secret: process.env.SESSION_SECRET || "rai-supreme-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60 * 8
  }
}));

app.use(express.static(path.join(__dirname, "public")));

function auth(req, res, next) {
  if (!req.session.authenticated) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

/* LOGIN */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.RAI_USER &&
    password === process.env.RAI_PASS
  ) {
    req.session.authenticated = true;
    req.session.username = username;

    return res.json({
      success: true,
      message: "ACCESS GRANTED"
    });
  }

  res.status(401).json({
    success: false,
    message: "ACCESS DENIED"
  });
});

/* SESSION */
app.get("/api/session", (req, res) => {
  res.json({
    authenticated: !!req.session.authenticated,
    username: req.session.username || null
  });
});

/* LOGOUT */
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

/* SYSTEM */
app.get("/api/system", auth, (req, res) => {
  res.json({
    status: "ONLINE",
    system: "RAI SUPRAME",
    version: "2.0.0",
    mode: "SUPRAME",
    uptime: Math.floor(process.uptime()),
    memory: Math.round(process.memoryUsage().rss / 1024 / 1024)
  });
});

/* AI CORE */
app.post("/api/chat", auth, async (req, res) => {
  try {
    const message = String(req.body.message || "").trim();

    if (!message) {
      return res.status(400).json({
        error: "Pesan kosong."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY belum ada di .env"
      });
    }

    const model =
      process.env.GEMINI_MODEL || "gemini-3.6-flash";

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: `
Kamu adalah RAI SUPRAME, AI assistant dari Republik Of AI.

Karakter:
- cerdas
- santai
- futuristik
- membantu
- jawab sesuai bahasa pengguna
- jangan mengarang kemampuan yang tidak tersedia

Kamu berjalan sebagai AI core di website RAI SUPRAME.
Jika pengguna meminta tindakan yang membutuhkan aplikasi eksternal,
jelaskan keterbatasannya dan berikan langkah yang bisa dilakukan.
`
          }]
        },
        contents: [{
          role: "user",
          parts: [{ text: message }]
        }],
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 1400
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini:", data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "Gemini API error"
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map(x => x.text || "")
        .join("")
        .trim();

    if (!text) {
      return res.status(502).json({
        error: "RAI menerima respons kosong."
      });
    }

    res.json({
      success: true,
      reply: text,
      model
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI CORE ERROR: " + error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`
╔══════════════════════════════════════════╗
║          RAI SUPRAME v2 ONLINE           ║
║                                          ║
║  http://localhost:${PORT}                  ║
║                                          ║
║  AI CORE .............. READY            ║
║  AUTH ................. READY            ║
║  COMMAND .............. READY            ║
║  SYSTEM MONITOR ....... READY            ║
╚══════════════════════════════════════════╝
`);
});
