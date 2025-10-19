/* =========================================
   🌐 SISTEM TRANSLATE GLOBAL + LOGO AUTO GANTI
========================================= */
let translations = {};
let currentLang = "id"; // default bahasa
let dataCache = [];
let indexData = 0;
const batchSize = 10;
let isLoading = false;

// Ambil data bahasa dari JSON
fetch('res/libs/data-translate.json')
    .then(res => res.json())
    .then(data => {
        translations = data;
        applyTranslations();
        applyContohTranslation();
    })
    .catch(err => console.error("Gagal memuat data bahasa:", err));

/* =========================================
   🧠 FUNGSI PENERAPAN TRANSLATE
========================================= */
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.dataset.translate;
        el.textContent = translations[key]?.[currentLang] || `[${key}]`;
    });
}

/* =========================================
   💡 FITUR TAMBAHAN: KHUSUS UNTUK data-translate="contoh"
========================================= */
function applyContohTranslation() {
    document.querySelectorAll('[data-translate="contoh"]').forEach(el => {
        const teks = translations["contoh"]?.[currentLang] || "Masukkan teks di sini...";
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = teks;
        } else {
            el.textContent = teks;
        }
    });
}

/* =========================================
   🌍 GANTI BAHASA GLOBAL
========================================= */
const langButtons = {
    df: "id",  // Default
    id: "id",  // Indonesia
    jp: "jp",  // Jepang
    jw: "jw",  // Jawa
    sn: "su",  // Sunda
    cn: "cn",  // China
    ar: "ar",  // Arab
    ml: "ms"   // Malaysia (Melayu)
};

Object.keys(langButtons).forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener("click", () => {
        currentLang = langButtons[id];
        applyTranslations();
        applyContohTranslation();

        // Update konten dari dataS1.json juga
        const box = document.getElementById('untukAnda');
        if (box) {
            box.innerHTML = "";
            indexData = 0;
            renderNextBatch(box);
        }

        // 🔹 Ganti logo utama sesuai gambar di tombol
        const imgLogo = document.getElementById("imgLogoD");
        const imgButton = btn.querySelector("img");
        if (imgLogo && imgButton) imgLogo.src = imgButton.src;

        // Reset hasil pencarian (kalau ada)
        const results = document.getElementById('results');
        if (results) results.innerHTML = '';
    });
});
/* =========================================
   🌐 SISTEM TOGGLE MENU BAHASA (LOGO BENDERA)
========================================= */
const displayBahasa = document.querySelector('.displayBahasa');
function imgLoD() {
    document.body.classList.toggle('hilang');
}
if (displayBahasa) {
    displayBahasa.addEventListener('click', () => {
        document.body.classList.toggle('hilang');
    });
}
