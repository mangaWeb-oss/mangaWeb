const displayPage = document.getElementById('menuDisplayPage');
const menuPage = document.getElementById('menuPage');
const imgLogoA = document.getElementById('imgLogoA');
const imgLogoB = document.getElementById('imgLogoB');
const imgLogoD = document.getElementById('imgLogoD');

displayPage.addEventListener('click', () => {
    displayPage.style.display = 'none';
    menuPage.style.transform = 'translateX(-100vh)';
});
imgLogoA.addEventListener('click', () => {
    displayPage.style.display = 'block';
    menuPage.style.transform = 'translateX(0)';
});

const backSearch = document.querySelector('.imgSearch1');
const hpus = document.querySelector('.imgSearch2');
const search = document.getElementById('search');
const srcInpt = document.getElementById('searchLogoInput');

backSearch.addEventListener('click', () => {
    search.style.display = 'none';
});
hpus.addEventListener('click', () => {
    srcInpt.value = "";
});
imgLogoB.addEventListener('click', () => {
    search.style.display = 'grid';
});

function imgLoC() {
    const imgLogoC = document.getElementById('imgLogoC');
    const drkMode = document.body.classList.contains('hytam');
    document.body.classList.toggle('hytam');
    imgLogoC.src = drkMode ? 'https://xarwarecloud.wuaze.com/res/images/matahari.png' : 'https://xarwarecloud.wuaze.com/res/images/bulan.png';
}
