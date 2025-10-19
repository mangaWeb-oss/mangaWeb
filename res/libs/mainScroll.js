
/* =========================================
   📦 SISTEM LOAD DATA MANGA (dataS1.json)
========================================= */
async function loadData1() {
    const box = document.getElementById('untukAnda');
    if (!box || isLoading) return;

    if (dataCache.length === 0) {
        isLoading = true;
        try {
            const res = await fetch('res/libs/dataS1.json');
            const data = await res.json();

            // ubah dari object ke array
            dataCache = Object.keys(data).map(key => ({
                judul: data[key].judul,
                link: data[key].link,
                icon: data[key].icon
            }));
        } catch (err) {
            console.error("Gagal memuat dataS1.json:", err);
        } finally {
            isLoading = false;
        }
    }
    renderNextBatch(box);
}

function renderNextBatch(box) {
    const nextBatch = dataCache.slice(indexData, indexData + batchSize);
    nextBatch.forEach(item => {
        // ambil sesuai bahasa aktif
        const judul = item.judul[currentLang] || item.judul.id || Object.values(item.judul)[0];
        const link = item.link[currentLang] || item.link.id || Object.values(item.link)[0];
        const icon = item.icon[currentLang] || item.icon.id || Object.values(item.icon)[0];

        const card = document.createElement('div');
        card.className = 'box-0';
        card.innerHTML = `
            <a href="${link}" target="_blank">
                <div id="cardS1">
                    <div class="imgCard">
                        <img src="${icon}" alt="${judul}">
                    </div>
                    <h4>${judul}</h4>
                </div>
            </a>
        `;
        box.appendChild(card);
    });
    indexData += batchSize;
}

document.addEventListener('DOMContentLoaded', () => {
    loadData1();

    const sc = document.getElementById('untuk-anda-2');
    if (sc) {
        sc.addEventListener('scroll', () => {
            if (sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 20)
                renderNextBatch(sc);
        });
    }
});
