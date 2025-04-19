//HTML FUNCTIONS

let firstTimeAdd = true;
function addProduct() {
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    productsIds.push(productId);
    localStorage.setItem('productsIds', JSON.stringify(productsIds));
    refreshProductInCart();
    if(firstTimeAdd) {
        firstTimeAdd = false;
        Swal.fire({
            title: "Producto agregado",
            icon: "success",	
            showDenyButton: true,
            confirmButtonText: "Ir al carrito",
            denyButtonText: `Seguir comprando`,
            customClass: {
                popup: 'color1 backgroundColor4 darkColor2 darkBackgroundColor1',
              confirmButton: 'font-semibold color2 backgroundColor11 w-48 py-2 px-4 m-1 rounded-lg',
              denyButton: 'font-semibold color7 darkColor2 darkBackgroundColor9 w-48 py-2 px-4 m-1 rounded-lg',
            },
            buttonsStyling: false
          }).then((result) => {
            if (result.isConfirmed) window.location.href = "/carrito";
          });
    }
}

function removeProduct() {
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    //remove first occurence of productId
    productsIds.splice(productsIds.indexOf(productId), 1);
    localStorage.setItem('productsIds', JSON.stringify(productsIds));
    refreshProductInCart();
}

function refreshProductInCart() {
    productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    let productNotInCart = document.body.querySelector('.productNotInCard');
    let productInCart = document.body.querySelector('.productInCart');
    let quantity = document.body.querySelector('.quantity');
    let cartQuantity = document.getElementById('cartQuantity');
    productNotInCart.classList.add('hidden');
    productInCart.classList.add('hidden');


    if(productsIds.includes(productId)) {
        quantity.innerText = productsIds.filter(id => id == productId).length;
        productInCart.classList.remove('hidden');
    }
    else {
        productNotInCart.classList.remove('hidden');
        quantity.innerText = productsIds.filter(id => id == productId).length;
    }

    if (productsIds.length > 0) {
        cartQuantity.innerText = productsIds.length;
        cartQuantity.classList.remove('hidden');
    }
    else cartQuantity.classList.add('hidden');
}

//END: HTML FUNCTIONS

let productId = parseInt(window.location.search.split('=')[1]);

async function loadProducts() {
    let productImage = document.getElementById('productImage')
    let productTitle = document.getElementById('productTitle')
    let productPrice = document.getElementById('productPrice')
    let productStock = document.getElementById('productStock')
    let productDescription = document.getElementById('productDescription')

    //fetch products
    product = null
    let response = await fetch(backendUrl + '/GetProducts?id=' + productId)
    if(response.status != 200) {
        throw new Error('Failed to load products: ' + response.statusText);
    }
    let json = await response.json();
    product = json.products[0];

    let filesNames = product.filesNames.split(',');
    let carousel = document.getElementById('carousel');
    createCarousel(carousel, filesNames);
    // let imageUrl = backendUrl + "/GetImage?fileName=" + filesNames[0];
    // productImage.src = imageUrl;
    productTitle.innerText = product.name;
    productPrice.innerText = '$' + product.price.toLocaleString('es-CL');
    productStock.innerText = product.stock;

    html = marked.parse(product.description);
    const markdownElement = document.createElement('div');
    markdownElement.className = 'flex flex-col gap-2';
    markdownElement.innerHTML = html;
    productDescription.appendChild(markdownElement);
    
    refreshProductInCart();
}

waitToLoadFunction = async function () {
    // Run both functions in parallel and wait for both to finish
    await Promise.all([loadProducts()]);
};