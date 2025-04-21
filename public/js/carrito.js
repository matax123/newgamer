function createProductElement(id, title, category, price, img, quantity) {
    return html = `
        <div class="product-card flex flex-col gap-0 md:flex-row justify-between p-4 backgroundColor2 darkBackgroundColor10 md:max-h-[160px]" data-product-id="${id}">
            <div class="itemImage md:relative md:w-32 md:pt-[100%]">
                <img src="${img}" class="w-32 h-32 md:absolute md:inset-0 md:object-cover p-2 m-0">
            </div>
            <div class="grid grid-cols-2 pt-2 md:pt-0 gap-2 md:grid-rows-[30px,30px] md:w-[calc(100%-9rem)]">
                <span class="leading-none font-semibold flex items-center md:items-start">${title}</span>
                <button class="flex flex-row justify-end items-center md:items-start" onclick="deleteProduct(${id})">
                    <svg class="color1 darkColor2" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m20.015 6.506h-16v14.423c0 .591.448 1.071 1 1.071h14c.552 0 1-.48 1-1.071 0-3.905 0-14.423 0-14.423zm-5.75 2.494c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-4.5 0c.414 0 .75.336.75.75v8.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-8.5c0-.414.336-.75.75-.75zm-.75-5v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-16.507c-.413 0-.747-.335-.747-.747s.334-.747.747-.747zm4.5 0v-.5h-3v.5z" fill-rule="nonzero"/></svg>
                </button>
                <div class="productInCart md:mt-3 flex flex-row justify-start items-center gap-3">
                    <button class="bg-red-600 hover:bg-red-700 text-white font-semibold px-2 rounded" onclick="addProduct(${id})">
                        +
                    </button>
                    <span class="quantity font-bold">0</span>
                    <button class="bg-red-600 hover:bg-red-700 text-white font-semibold px-2 rounded" onclick="removeProduct(${id})">
                        -
                    </button>
                </div>
                <span class="text-right flex justify-end md:justify-unset items-center">$${price}</span>
            </div>
        </div>
    `
}

function addProduct(productId) {
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    productsIds.push(productId);
    localStorage.setItem('productsIds', JSON.stringify(productsIds));
    refreshProductInCart();
}

function removeProduct(productId) {
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    productsIds.splice(productsIds.indexOf(productId), 1);
    localStorage.setItem('productsIds', JSON.stringify(productsIds));
    refreshProductInCart();
}

function deleteProduct(productId) {
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    //remove all ocurrences of productId
    productsIds = productsIds.filter(id => id != productId);
    localStorage.setItem('productsIds', JSON.stringify(productsIds));
    refreshProductInCart();
}

function refreshProductInCart() {
    productsCards = document.querySelectorAll('.product-card');
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    productsQuantity = productsIds.length;
    let totalPrice = 0;
    productsCards.forEach(card => {
        let productId = parseInt(card.dataset.productId);
        let quantity = productsIds.filter(id => id == parseInt(productId)).length;
        if(quantity == 0) card.classList.add('hidden');
        else card.querySelector('.quantity').innerText = quantity;
        totalPrice += quantity * productsLists.find(product => product.id == productId).price;
    });
    if (productsQuantity > 0) {
        cartQuantity = document.getElementById('cartQuantity');
        cartQuantity.innerText = productsQuantity;
        cartQuantity.classList.remove('hidden');
    }
    else cartQuantity.classList.add('hidden');
    document.querySelector('#total .price').innerText = 'Total: $'+totalPrice.toLocaleString('es-CL');
}

function clearCart() {
    localStorage.removeItem('productsIds');
    loadProducts();
}

function formUpdate(){
    let region = document.getElementById('region').value;
    let ciudad = document.getElementById('ciudad').value;
    let calle = document.getElementById('calle').value;
    let numero = document.getElementById('numero').value;
    let apartamentoCasa = document.getElementById('apartamentoCasa').value;
    let check = document.getElementById('check').checked;
    if(region != '' && ciudad != '' && calle != '' && numero != '' && apartamentoCasa != '' && check == true){
        document.getElementById('confirmar').disabled = false;
    } else {
        document.getElementById('confirmar').disabled = true;
    }
}

async function createOrder(){
    let products = JSON.parse(localStorage.getItem('productsIds')) || [];
    let region = document.getElementById('region').value;
    let ciudad = document.getElementById('ciudad').value;
    let calle = document.getElementById('calle').value;
    let numero = document.getElementById('numero').value;
    let apartamentoCasa = document.getElementById('apartamentoCasa').value;
    if(products.length == 0) return alert('No hay productos en el carrito.');

    let distinctProducts = [...new Set(products)];
    let productsQuantity = distinctProducts.map(id => {
        return {
            productId: id,
            quantity: products.filter(product => product == id).length,
            price: productsLists.find(p => p.id == id).price
        }
    });
    let totalPrice = 0;
    productsQuantity.forEach(product => {
        totalPrice += product.price * product.quantity;
    });

    let body = {
        products: productsQuantity,
        totalPrice: totalPrice,
        regionId: region,
        city: ciudad,
        street: calle,
        houseNumber: numero,
        residence: apartamentoCasa
    }

    let response = await fetch(backendUrl + '/CreateOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if(response.status != 200) return alert('Error al crear la orden');
    let json = await response.json();
    let orderId = json.id;
    // localStorage.removeItem('productsIds');
    window.location.href = '/confirmar?orderId='+orderId+"&amount="+totalPrice;
}


//Load functions
async function loadProducts() {
    let productGrid = document.getElementById('product-grid');

    //fetch products
    productsLists = [];
    let response = await fetch(backendUrl + '/GetProducts')
    if(response.status != 200) {
        console.log('Error fetching products');
        return;
    }
    let json = await response.json();
    productsLists = json.products;

    productsLists.forEach(product => {
        let filesNames = product.filesNames.split(',');
        let imageUrl = backendUrl + "/GetImage?fileName=" + filesNames[0];
        let price = product.price.toLocaleString('es-CL');
        productGrid.innerHTML += createProductElement(product.id, product.name, product.category, price, imageUrl, product.quantity);
    });
    refreshProductInCart();
}

loadProducts();