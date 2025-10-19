import express from "express";

const app = express();
app.use(express.json());

// === ROUTE API ===
app.post("/api/viewManga", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).send("Title kosong");

    // Contoh respon API (bisa kamu ganti logika view di sini)
    return res.status(200).json({
      message: `View manga "${title}" ditambah 1!`,
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Terjadi kesalahan server");
  }
});

// === Jalankan server di lokal (saat develop manual) ===
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("Server lokal jalan di http://localhost:3000"));
}

// === Export buat Vercel ===
export default app;
