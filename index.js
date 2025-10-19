import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

// API untuk tambah view
app.post("/api/viewManga", (req, res) => {
  try {
    const { path: filePath } = req.body;
    if (!filePath) return res.status(400).send("Path tidak dikirim.");

    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).send("File view.txt tidak ditemukan.");
    }

    // Baca dan tambah view
    let content = fs.readFileSync(fullPath, "utf8");
    let match = content.match(/total_view=(\d+)/);
    let total = match ? parseInt(match[1]) : 0;
    total++;

    fs.writeFileSync(fullPath, `total_view=${total}`);
    return res.json({ success: true, total, message: "View berhasil ditambah." });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Terjadi kesalahan di server.");
  }
});

// Test server aktif
app.get("/", (req, res) => {
  res.send("✅ Server Node.js MangaWeb aktif di Vercel!");
});

export default app;
