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

function createCarousel(container, filesNames) {
    // Build carousel HTML
    let carouselHTML = `
        <div class="carousel">
            <div class="carousel-track">
                //SLIDES//
            </div>
            <button class="carousel-button prev" aria-label="Previous Slide">❮</button>
            <button class="carousel-button next" aria-label="Next Slide">❯</button>
        </div>
        <div class="thumbnails flex justify-center pt-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100">
            <div class="flex flex-row gap-2">
            //THUMBNAILS//
            </div>
        </div>
    `;

    let slidesHTML = '';
    filesNames.forEach(fileName => {
        if (fileName.endsWith('.mp4')) {
            slidesHTML += `<div class="carousel-slide bg-black">
                                <video class="carousel-video" loop muted autoplay>
                                    <source src="${backendUrl}/GetVideo?fileName=${fileName}" type="video/mp4">
                                </video>
                            </div>`;
        } else {
            slidesHTML += `<div class="carousel-slide">
                                <img src="${backendUrl}/GetImage?fileName=${fileName}" alt="Product Image">
                            </div>`;
        }
    });

    carouselHTML = carouselHTML.replace('//SLIDES//', slidesHTML);

    let thumbnailsHTML = '';

    filesNames.forEach((fileName, index) => {
        if (fileName.endsWith('.mp4')) {
            thumbnailsHTML += `
                <button class="w-20 h-20 rounded-lg overflow-hidden" data-index="${index}" onclick="onThumbnailClick(${index})">
                    <img class="w-full h-full object-cover hover:scale-110" src="${backendUrl}/GetThumbnail?fileName=${fileName.replace(/\.mp4$/i, '.avif')}" alt="Video Thumbnail ${index + 1}"  />
                </button>`;
        } else {
            thumbnailsHTML += `
                <button class="w-20 h-20 rounded-lg" data-index="${index}" onclick="onThumbnailClick(${index})">
                    <img class="w-full h-full object-cover hover:scale-110" src="${backendUrl}/GetImage?fileName=${fileName}" alt="Thumbnail ${index + 1}" />
                </button>`;
        }
    });
    

    carouselHTML = carouselHTML.replace('//THUMBNAILS//', thumbnailsHTML);
    
    // Insert the carousel into the DOM
    container.innerHTML = carouselHTML;

    // Initialize carousel behavior
    const carouselTrack = container.querySelector('.carousel-track');
    const slides = container.querySelectorAll('.carousel-slide');
    const thumbnails = container.querySelector('.thumbnails');
    const prevButton = container.querySelector('.carousel-button.prev');
    const nextButton = container.querySelector('.carousel-button.next');
    
    let currentSlide = 0;

    // Function to update the carousel position
    function updateCarousel() {
        const slideWidth = slides[0].clientWidth;  // Get the width of the first slide
        const trackWidth = slides.length * slideWidth;  // Total width for all slides

        carouselTrack.style.width = `${trackWidth}px`;  // Set track width based on number of slides
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;  // Shift the track based on current slide index

        // Pause other videos when moving to a new slide
        slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (video) {
                if (index === currentSlide) {
                    video.play();  // Play the current video
                } else {
                    video.pause(); // Pause all other videos
                }
            }
        });

        // Update thumbnails
        thumbnails.querySelectorAll('button').forEach((button, index) => {
            const isCurrentSlide = index === currentSlide;
            button.classList.toggle('opacity-50', !isCurrentSlide);
            button.classList.toggle('opacity-100', isCurrentSlide);
        });
    }

    container.querySelector('.thumbnails').addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button) {
            const index = button.getAttribute('data-index');
            currentSlide = parseInt(index);
            updateCarousel();
        }
    });

    // Button event listeners
    prevButton.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    });

    // Initial carousel update with a slight delay
    setTimeout(() => {
        updateCarousel();  // Recalculate after DOM is fully loaded
    }, 100);  // 100ms delay to ensure layout is rendered before carousel update

    // Recalculate carousel position on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Clear any ongoing resize timeout
        clearTimeout(resizeTimeout);

        // Temporarily disable smooth transition during resizing for quicker update
        carouselTrack.style.transition = 'none';  // Disable transition

        // Force the layout to recalculate
        requestAnimationFrame(() => {
            updateCarousel();  // Recalculate carousel position immediately
        });

        // Re-enable the smooth transition for normal navigation after a slight delay
        resizeTimeout = setTimeout(() => {
            carouselTrack.style.transition = 'transform 0.2s ease';  // Re-enable the smooth transition
        }, 100);
    });
}

//END: HTML FUNCTIONS

let productId = parseInt(window.location.search.split('=')[1]);

async function loadProducts() {
    let productImage = document.getElementById('productImage')
    let productTitle = document.getElementById('productTitle')
    let productsCategory = document.getElementById('productCategory')
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
    productsCategory.innerText = product.category;
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