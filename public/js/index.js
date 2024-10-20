const header = document.getElementById('header');
const product_header = document.getElementById('product-header');
const readMoreBtn = document.getElementById('read-more-btn');
const fullTextElements = document.querySelectorAll('.about-full');

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const sliderContainer = document.querySelector('.slider-container');
let autoSlideInterval;

function updateSliderPosition() {
    const offset = currentSlide * 100;
    sliderContainer.style.transform = `translateX(${offset}%)`;
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSliderPosition();
    }, 5000);
}

autoSlideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSliderPosition();
}, 5000); 

document.querySelector('.next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSliderPosition();
    resetAutoSlide();
});

document.querySelector('.prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSliderPosition();
    resetAutoSlide();
});

function updateSliderPosition() {
    const offset = -currentSlide * 100;
    sliderContainer.style.transform = `translateX(${offset}%)`;
}

// Header Scroll
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) { 
            header.classList.add('header-scrolled');
            console.log('Header scrolled: class added');
        } else {
            header.classList.remove('header-scrolled');
            console.log('Header scrolled: class removed');
        }
    });
} else {
    console.error('Header not found');
}

// Header Scroll Products
if (product_header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) { 
            product_header.classList.add('header-scrolled');
            console.log('Header scrolled: class added');
        } else {
            product_header.classList.remove('header-scrolled');
            console.log('Header scrolled: class removed');
        }
    });
} else {
    console.error('Header not found');
}

document.querySelectorAll('#navbar li').forEach(menuItem => {
    menuItem.addEventListener('mouseenter', () => {
        menuItem.classList.add('active');
    });

    menuItem.addEventListener('mouseleave', () => {
        menuItem.classList.remove('active');
    });
});

// Read More Button
readMoreBtn.addEventListener('click', () => {
    fullTextElements.forEach((element) => {
        element.classList.toggle('hidden');
    });
    if (fullTextElements[0].classList.contains('hidden')) {
        readMoreBtn.textContent = 'Leia mais';
    } else {
        readMoreBtn.textContent = 'Leia menos';
    }
});