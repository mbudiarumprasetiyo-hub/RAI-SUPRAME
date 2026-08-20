require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

const FILE_LIMIT = 50 * 1024 * 1024;

const uploadDir =
  path.join(__dirname, ".rai-uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: FILE_LIMIT
  }
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

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
/* =========================================
   RAI FILE PRO
========================================= */

app.post(
  "/api/file-analyze",
  auth,
  upload.single("file"),
  async (req, res) => {

    let uploadedPath = null;
    let geminiFile = null;

    try {

      if (!req.file) {
        return res.status(400).json({
          error: "File belum dipilih."
        });
      }

      uploadedPath = req.file.path;

      if (req.file.size > FILE_LIMIT) {
        return res.status(413).json({
          error: "File terlalu besar. Maksimal 50 MB."
        });
      }

      const originalName =
        req.file.originalname || "unknown";

      const mimeType =
        req.file.mimetype ||
        "application/octet-stream";

      const stat =
        fs.statSync(uploadedPath);

      console.log(
        `[RAI FILE] ${originalName} / ` +
        `${stat.size} bytes`
      );

      /*
       * Upload file ke Gemini Files API.
       */
      geminiFile =
        await ai.files.upload({
          file: uploadedPath,
          config: {
            displayName: originalName,
            mimeType
          }
        });

      console.log(
        "[RAI FILE] Gemini upload OK:",
        geminiFile.name
      );

      const prompt = `
Kamu adalah RAI SUPRAME FILE INTELLIGENCE.

Analisis file yang diberikan pengguna.

Nama file: ${originalName}
Tipe: ${mimeType}

Berikan hasil yang jelas dan langsung.

Jika file adalah kode:
- jelaskan fungsi utamanya
- cari bug atau masalah potensial
- sebutkan bagian yang perlu diperbaiki
- berikan saran optimasi jika relevan

Jika file adalah dokumen:
- buat ringkasan
- ambil poin penting
- jelaskan struktur atau informasi penting

Jangan mengarang isi file.
Gunakan hanya informasi yang benar-benar tersedia dari file.
`;

      const result =
        await ai.models.generateContent({
          model:
            process.env.GEMINI_MODEL ||
            "gemini-3.6-flash",

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt
                },
                {
                  fileData: {
                    fileUri: geminiFile.uri,
                    mimeType:
                      geminiFile.mimeType ||
                      mimeType
                  }
                }
              ]
            }
          ]
        });

      const reply =
        result.text ||
        "";

      if (!reply.trim()) {
        return res.status(502).json({
          error:
            "RAI tidak menerima hasil analisis."
        });
      }

      return res.json({
        success: true,
        reply,
        file: {
          name: originalName,
          size: stat.size,
          mimeType
        }
      });

    } catch (error) {

      console.error(
        "[RAI FILE ERROR]",
        error
      );

      return res.status(500).json({
        error:
          "FILE ANALYSIS ERROR: " +
          (error.message || "Unknown error")
      });

    } finally {

      /*
       * Hapus file temporary dari server.
       */
      if (uploadedPath) {
        try {
          fs.unlinkSync(uploadedPath);
        } catch {}
      }

    }
  }
);


/* =========================================
   RAI CREATIVE // IMAGE GENERATION
========================================= */

app.post("/api/generate-image", auth, async (req, res) => {
  try {
    const prompt = String(req.body.prompt || "").trim();

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt gambar kosong."
      });
    }

    const apiKey = process.env.PIXAZO_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "PIXAZO_API_KEY belum ada di .env"
      });
    }

    const response = await fetch(
      "https://gateway.pixazo.ai/flux-1-schnell/v1/getData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          "Ocp-Apim-Subscription-Key": apiKey
        },
        body: JSON.stringify({
          prompt,
          num_steps: 4,
          seed: Math.floor(Math.random() * 1000000),
          height: 768,
          width: 768
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PIXAZO IMAGE ERROR:", response.status, data);

      return res.status(response.status).json({
        error:
          data.message ||
          data.error ||
          `Pixazo error ${response.status}`
      });
    }

    const imageUrl = data.output || data.image || data.url;

    if (!imageUrl) {
      console.error("PIXAZO NO IMAGE URL:", data);

      return res.status(502).json({
        error: "Pixazo tidak mengembalikan URL gambar."
      });
    }

    res.json({
      success: true,
      image: imageUrl
    });

  } catch (error) {
    console.error("RAI IMAGE ERROR:", error);

    res.status(500).json({
      error:
        error.message ||
        "IMAGE GENERATION ERROR"
    });
  }
});


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
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
        "Accept": "text/event-stream"
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

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      console.error("Gemini:", data);

      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "Gemini API error"
      });
    }

    res.status(200);
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    if (!response.body) {
      return res.end();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {

      const { value, done } =
        await reader.read();

      if (done) break;

      buffer += decoder.decode(
        value,
        { stream: true }
      );

      // Gemini SSE menggunakan CRLF pada beberapa response.
      buffer = buffer.replace(/\r\n/g, "\n");

      const events =
        buffer.split("\n\n");

      buffer =
        events.pop() || "";

      for (const event of events) {

        const lines =
          event.split("\n");

        for (const line of lines) {

          const trimmed =
            line.trim();

          if (!trimmed.startsWith("data:")) {
            continue;
          }

          const jsonText =
            trimmed.slice(5).trim();

          if (!jsonText) continue;

          try {

            const data =
              JSON.parse(jsonText);

            const parts =
              data?.candidates?.[0]
                ?.content?.parts || [];

            for (const part of parts) {

              if (
                typeof part.text === "string" &&
                part.text.length > 0
              ) {

                res.write(
                  JSON.stringify({
                    type: "text",
                    text: part.text
                  }) + "\n"
                );

                if (typeof res.flush === "function") {
                  res.flush();
                }
              }
            }

          } catch (e) {

            console.error(
              "STREAM JSON ERROR:",
              e.message
            );

          }
        }
      }
    }

    // Proses sisa buffer terakhir.
    buffer = buffer.trim();

    if (buffer.startsWith("data:")) {

      const jsonText =
        buffer.slice(5).trim();

      try {

        const data =
          JSON.parse(jsonText);

        const parts =
          data?.candidates?.[0]
            ?.content?.parts || [];

        for (const part of parts) {

          if (
            typeof part.text === "string" &&
            part.text.length > 0
          ) {

            res.write(
              JSON.stringify({
                type: "text",
                text: part.text
              }) + "\n"
            );
          }
        }

      } catch (e) {
        console.error(
          "FINAL STREAM ERROR:",
          e.message
        );
      }
    }

    res.write(
      JSON.stringify({
        type: "done",
        model
      }) + "\n"
    );

    res.end();

  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      return res.status(500).json({
        error:
          "AI CORE ERROR: " +
          error.message
      });
    }

    res.write(
      JSON.stringify({
        type: "error",
        error:
          "AI CORE ERROR: " +
          error.message
      }) + "\n"
    );

    res.end();
  }
});;

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
