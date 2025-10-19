export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("❌ Only POST allowed");

  try {
    const { uid, path: fileUrl } = req.body || {};

    if (!uid || !fileUrl) {
      return res.status(400).send("❌ Data tidak lengkap");
    }

    // Ambil isi file dari URL aslinya
    const response = await fetch(fileUrl);
    const text = await response.text();

    // Ambil total_view dan daftar UID
    const totalMatch = text.match(/total_view=(\d+)/);
    const uidMatch = text.match(/uid_list=(.*)/);

    let total = totalMatch ? parseInt(totalMatch[1]) : 0;
    let uidList = uidMatch && uidMatch[1] ? uidMatch[1].split(",") : [];

    if (!uidList.includes(uid)) {
      uidList.push(uid);
      total += 1;
    } else {
      return res.send("ℹ️ Sudah pernah baca, tidak menambah view.");
    }

    // Gabungkan ulang konten
    const newContent = `total_view=${total}\nuid_list=${uidList.join(",")}`;

    // Kirim PUT request ke server asli untuk menulis ulang file
    // ⚠️ CATATAN: Wuaze (000webhost) kadang tidak izinkan PUT, jadi pastikan endpoint-nya bisa terima update
    // Kalau tidak bisa, nanti pakai route proxy ke Firebase Realtime Database saja.
    await fetch(fileUrl, {
      method: "PUT",
      headers: { "Content-Type": "text/plain" },
      body: newContent
    });

    res.send(`✅ View ditambah. Total: ${total}`);
  } catch (err) {
    res.status(500).send("❌ Gagal update view: " + err.message);
  }
}
