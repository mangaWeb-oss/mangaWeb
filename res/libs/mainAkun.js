// === KONFIGURASI FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyD20Efj4YUjq5yqsP1oLRo8apdYmJxDwJ0",
  authDomain: "mangawebapp-43750.firebaseapp.com",
  projectId: "mangawebapp-43750",
  storageBucket: "mangawebapp-43750.firebasestorage.app",
  messagingSenderId: "883744625809",
  appId: "1:883744625809:web:647003fe305e780b185b30",
  measurementId: "G-RNJSSC22QQ"
};

// === INISIALISASI FIREBASE ===
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// === UPDATE UI AKUN ===
const img = document.getElementById("menuAkunImages");
const nama = document.getElementById("menuNama");
const uid = document.getElementById("menuUid");
const tombol = document.getElementById("logout");

tombol.addEventListener("click", () => {
  if (auth.currentUser) {
    auth.signOut()
      .then(() => alert("Berhasil logout"))
      .catch(err => alert(err.message));
  } else {
    auth.signInWithPopup(provider)
      .then(result => alert("Login sebagai " + result.user.displayName))
      .catch(err => alert("Error: " + err.message));
  }
});

auth.onAuthStateChanged(user => {
  if (user) {
    img.src = user.photoURL || "res/images/user.png";
    nama.textContent = user.displayName || "Tanpa Nama";
    uid.textContent = user.uid;
    tombol.textContent = "Logout";
  } else {
    img.src = "res/images/user.png";
    nama.textContent = "Guest";
    uid.textContent = "-";
    tombol.textContent = "Login";
  }
});


// === FUNGSI 1: Menampilkan semua angka view dari view.txt ===
function loadAllViewNumbers() {
  document.querySelectorAll("[view-num]").forEach(div => {
    const path = div.getAttribute("view-num");

    fetch(path)
      .then(res => res.text())
      .then(text => {
        const match = text.match(/total_view=(\d+)/);
        const total = match ? parseInt(match[1]) : 0;
        div.textContent = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      })
      .catch(() => div.textContent = "0");
  });
}


// === FUNGSI 2: Tombol tambah view per akun (pakai JSON) ===
function setupViewButtons(dataJson) {
  document.querySelectorAll("[view-on]").forEach(btn => {
    const judul = btn.getAttribute("view-on");

    btn.addEventListener("click", () => {
      const user = auth.currentUser;
      if (!user) {
        alert("Silakan login terlebih dahulu.");
        return;
      }

      // Cari manga di JSON berdasarkan judul
      let found = null;
      for (const key in dataJson) {
        if (dataJson[key].judul.id === judul) {
          found = dataJson[key];
          break;
        }
      }

      if (!found) {
        alert("Judul manga tidak ditemukan di JSON!");
        return;
      }

      const path = found.view.id;
      const uid = user.uid;

      // Kirim ke backend Node.js di Vercel
      fetch("https://manga-web-one.vercel.app/api/viewManga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, path })
      })
      .then(res => res.text())
      .then(msg => {
        console.log(msg);
        loadAllViewNumbers(); // update tampilan view
      })
      .catch(err => console.error("Gagal update view:", err));
    });
  });
}


// === FUNGSI TAMBAH VIEW MANUAL (bisa dipanggil langsung juga) ===
function tambahView(mangaPath) {
  const user = auth.currentUser;
  if (!user) {
    alert("Silakan login terlebih dahulu untuk membaca manga ini.");
    return;
  }

  const uid = user.uid;

  fetch("https://manga-web-one.vercel.app/api/viewManga", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, path: mangaPath })
  })
  .then(res => res.text())
  .then(res => console.log(res))
  .catch(err => console.error("Gagal update view:", err));
}


// === SAAT LOGIN / REFRESH, TAMPILKAN JUMLAH VIEW ===
auth.onAuthStateChanged(() => {
  loadAllViewNumbers();
});


// === SAAT HALAMAN SELESAI DIMUAT ===
window.addEventListener("DOMContentLoaded", () => {
  fetch("res/libs/dataS1.json")
    .then(res => res.json())
    .then(json => setupViewButtons(json))
    .then(() => loadAllViewNumbers());
});
