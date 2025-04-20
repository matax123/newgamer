function changeDayTime() {
    const dayIcon = document.getElementById('dayIcon');
    const nightIcon = document.getElementById('nightIcon');
    if (dayTime == 'day') {
        dayTime = 'night';
        dayIcon.classList.add('hidden');
        nightIcon.classList.remove('hidden');
        document.documentElement.setAttribute('theme', 'dark');
        localStorage.setItem('dayTime', 'night');
    }
    else {
        dayTime = 'day';
        dayIcon.classList.remove('hidden');
        nightIcon.classList.add('hidden');
        document.documentElement.setAttribute('theme', 'light');
        localStorage.setItem('dayTime', 'day');
    }
}

//Global variables
let waitToLoadFunction = async function () { };

//Load functions
window.onload = async function () {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    document.body.style = "opacity: 1;";

    const dayIcon = document.getElementById('dayIcon');
    const nightIcon = document.getElementById('nightIcon');
    if (dayIcon != null && dayTime == 'day') dayIcon.classList.remove('hidden');
    else if (nightIcon != null) nightIcon.classList.remove('hidden');

    let cartQuantity = document.getElementById('cartQuantity');
    let productsIdsLocalStorage = JSON.parse(localStorage.getItem('productsIds'));

    let productsIds;
    async function loadProductsIds() {
        let response = await fetch(backendUrl + '/GetProducts');
        let json = await response.json();
        let products = json.products;
        productsIds = products.map(p => p.id);
    }

    await Promise.all([waitToLoadFunction(), loadProductsIds()]);

    if (productsIdsLocalStorage != null) {
        productsIdsLocalStorage.map(id => {
            if (productsIds != null && !productsIds.includes(id)) {
                productsIdsLocalStorage = productsIdsLocalStorage.filter(pId => pId != id);
            }
        });

        localStorage.setItem('productsIds', JSON.stringify(productsIdsLocalStorage));

        let quantity = productsIdsLocalStorage.length;

        if (cartQuantity != null && productsIdsLocalStorage != null) {
            cartQuantity.classList.add('hidden');
            cartQuantity.innerText = quantity;
            if (quantity > 0) cartQuantity.classList.remove('hidden');
        }
    }


    document.getElementById("loading").close();
    document.querySelector('.preload').classList.remove('preload');
}

// secondary functions
function startsWithNumber(str) {
    return /^\d/.test(str);
}

function customCompare(a, b) {
    const aText = a[orderSelectValue];
    const bText = b[orderSelectValue];
    const aStartsWithNumber = /^\d/.test(aText);
    const bStartsWithNumber = /^\d/.test(bText);

    if (aStartsWithNumber && !bStartsWithNumber && orderSelectDirection == 'asc') {
        return 1; // aText starts with a number, should come after bText
    }
    if (aStartsWithNumber && !bStartsWithNumber && orderSelectDirection == 'desc') {
        return -1; // aText starts with a number, should come after bText
    }
    if (!aStartsWithNumber && bStartsWithNumber && orderSelectDirection == 'asc') {
        return -1; // bText starts with a number, should come after aText
    }
    if (!aStartsWithNumber && bStartsWithNumber && orderSelectDirection == 'desc') {
        return 1; // bText starts with a number, should come after aText
    }
    else {
        // If both or neither start with a number, compare normally
        if (aText == null) console.log('aText is null');
        if (bText == null) console.log('bText is null');
        return orderSelectDirection === 'asc'
            ? aText.localeCompare(bText, undefined, { numeric: true })
            : bText.localeCompare(aText, undefined, { numeric: true });
    }
}

function closeDialogWhenClickedOutside(dialog) {
    dialog.addEventListener('mousedown', (event) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom;

        if (!isInDialog) {
            dialog.close();
        }
    });
}

function openDialog(id) {
    let dialog = document.getElementById(id);
    dialog.showModal();
}

function closeDialog(id) {
    let dialog = document.getElementById(id);
    dialog.close();
}



//Project functions
function onClickShoppingCart(url) {
    let productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    if (productsIds.length == 0) return;
    window.location.href = url;
}