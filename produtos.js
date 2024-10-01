const activeFiltersContainer = document.getElementById('active-filters');
const clearAllButton = document.getElementById('clear-all-filters');
const filterOptions = document.querySelectorAll('#filter-options-container input[type="checkbox"]');

filterOptions.forEach(option => {
    option.addEventListener('change', () => {
        applyFilters();
        updateActiveFilters();
    });
});

function applyFilters() {
    const selectedGender = Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(el => el.value);
    const selectedCategory = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
    const selectedSize = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);
    const selectedColor = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value);

    const products = document.querySelectorAll('.product');

    products.forEach(product => {
        const productGender = product.getAttribute('data-gender');
        const productCategory = product.getAttribute('data-category');
        const productSize = product.getAttribute('data-size').split(',');
        const productColor = product.getAttribute('data-color').split(',');

        let genderMatch = selectedGender.length === 0 || selectedGender.includes(productGender);
        let categoryMatch = selectedCategory.length === 0 || selectedCategory.includes(productCategory);
        let sizeMatch = selectedSize.length === 0 || selectedSize.some(size => productSize.includes(size));
        let colorMatch = selectedColor.length === 0 || selectedColor.some(color => productColor.includes(color));

        if (genderMatch && categoryMatch && sizeMatch && colorMatch) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    updateActiveFilters();
}

function updateActiveFilters() {
    activeFiltersContainer.innerHTML = ''; // Clear the previous active filters
    let hasFilters = false;

    filterOptions.forEach(option => {
        if (option.checked) {
            hasFilters = true;

            // Create the active filter tag
            const filterTag = document.createElement('div');
            filterTag.classList.add('active-filter-tag');
            filterTag.setAttribute('data-filter', option.name);
            filterTag.setAttribute('data-value', option.value);
            filterTag.innerHTML = `${option.value} <span class="remove-filter">&times;</span>`;

            // Make the whole filter tag clickable
            filterTag.addEventListener('click', function() {
                const filterName = this.getAttribute('data-filter');
                const filterValue = this.getAttribute('data-value');
                const filterCheckbox = document.querySelector(`input[name="${filterName}"][value="${filterValue}"]`);

                if (filterCheckbox) {
                    filterCheckbox.checked = false; // Uncheck the checkbox for the filter
                    applyFilters(); // Re-apply filters
                }
            });

            activeFiltersContainer.appendChild(filterTag);
        }
    });

    // Show or hide the clear-all button based on filters
    const clearAllButton = document.getElementById('clear-all-filters');
    clearAllButton.style.display = hasFilters ? 'block' : 'none';
}

clearAllButton.addEventListener('click', () => {
    filterOptions.forEach(option => option.checked = false);
    applyFilters();
});

function toggleFilterSection(header) {
    header.classList.toggle('active');
    let options = header.nextElementSibling;
    if (options.style.display === "block") {
        options.style.display = "none";
    } else {
        options.style.display = "block";
    }
}

/* function addToCart(productName, productPrice) {
    console.log(`${productName} adicionado ao carrinho por R${productPrice.toFixed(2)}`);
} */

// Color mapping from hex to name
const colorNamesMap = {
    '#000000': 'Preto',
    '#BD632F': 'Café',
    '#84997E': 'Verde',
    // Add any additional colors here
};

// Function to get the color name from hex
function getColorName(hex) {
    return colorNamesMap[hex] || hex; // If the hex doesn't exist, return the hex as a fallback
}

document.addEventListener('DOMContentLoaded', function() {
    const allProducts = document.querySelectorAll('.product');

    allProducts.forEach(product => {
        const firstColor = product.querySelector('.color-option');
        if (firstColor) {
            firstColor.classList.add('selected');
            product.selectedColor = firstColor.getAttribute('data-color');
        }

        // Add event listeners for color selection
        const colorOptions = product.querySelectorAll('.color-option');
        colorOptions.forEach(color => {
            color.addEventListener('click', function() {
                selectColor(this, product);
            });
        });
    });
});

let selectedColor = null;
let selectedSize = null;

function selectColor(colorElement, product) {
    const allColors = product.querySelectorAll('.color-option');
    allColors.forEach(colorEl => colorEl.classList.remove('selected'));
    colorElement.classList.add('selected');
    product.selectedColor = colorElement.getAttribute('data-color');
}

function selectSize(size) {
    selectedSize = size;
}

// Show size options overlay for a specific product
function showSizeOptions(productId, productName, productPrice, productImage) {
    const sizeOverlay = document.getElementById(`size-options-overlay-${productId}`);
    sizeOverlay.style.display = 'flex'; // Show the size overlay

    sizeOverlay.onclick = function(event) {
        if (event.target.classList.contains('size-option')) {
            selectedSize = event.target.innerText;
            sizeOverlay.style.display = 'none'; // Hide the overlay after size selection

            const product = document.querySelector(`#product-${productId}`);

            if (selectedSize && product.selectedColor) {
                // Ensure productPrice is passed as a string in the format expected by parsePrice
                if (typeof productPrice === 'number') {
                    productPrice = `R$${productPrice.toFixed(2).replace('.', ',')}`;
                }

                // Convert selectedColor from hex to name before adding to cart
                const colorName = getColorName(product.selectedColor);

                // Add to cart if both size and color are selected
                addToCart(productName, productPrice, productImage, colorName, selectedSize);
            } else {
                alert('Por favor, selecione uma cor e um tamanho.');
            }
        }
    };
}

function addToCart(productName, productPrice, productImage, selectedColor, selectedSize) {
    if (!selectedColor || !selectedSize) {
        alert('Por favor, selecione uma cor e um tamanho.');
        return;
    }

    // Call the addToCart function from cart.js
    addToCartToLocalStorage(productName, productPrice, productImage, selectedColor, selectedSize);

    // Display a success message or update UI
    alert(`${productName} foi adicionado ao carrinho!`);
}

// This function will interface with cart.js to store the cart data
function addToCartToLocalStorage(productName, productPrice, productImage, selectedColor, selectedSize) {
    // Ensure this function in cart.js manages adding products to localStorage and updating the cart
    addToCart(productName, productPrice, productImage, selectedColor, selectedSize);
}