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
    
    // Insert the carousel into the DOM
    container.innerHTML = carouselHTML;

    // Initialize carousel behavior
    const carouselTrack = container.querySelector('.carousel-track');
    const slides = container.querySelectorAll('.carousel-slide');
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
    }

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
            carouselTrack.style.transition = 'transform 0.3s ease';  // Re-enable the smooth transition
        }, 100);
    });
}



//Project functions
function onClickShoppingCart(url) {
    let productsIds = JSON.parse(localStorage.getItem('productsIds')) || [];
    if (productsIds.length == 0) return;
    window.location.href = url;
}