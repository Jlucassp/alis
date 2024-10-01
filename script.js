const fullTextElements = document.querySelectorAll('.about-full');

// Image Product Switch Hover
document.addEventListener('DOMContentLoaded', function () {
    // Apply hover functionality for all product pages
    const products = document.querySelectorAll('.product-image img');
    
    products.forEach((img) => {
        const originalSrc = img.src;
        const hoverSrc = img.getAttribute('data-hover');

        if (hoverSrc) {
            img.addEventListener('mouseover', () => {
                img.src = hoverSrc;
            });

            img.addEventListener('mouseout', () => {
                img.src = originalSrc;
            });
        }
    });
});

// Modal Login
const loginModal = document.querySelector('#login-modal');
const closeModalBtn = document.querySelector(".close-btn");
const userIcon = document.querySelector('#user-icon a');
const pageOverlay = document.querySelector('#page-overlay');

userIcon.addEventListener('click', function(event) {
    event.preventDefault();
    loginModal.style.display = "block";
    pageOverlay.classList.add('active');
});

pageOverlay.addEventListener('click', () => {
    loginModal.style.display = 'none';
    pageOverlay.classList.remove('active');
});

closeModalBtn.addEventListener("click", function() {
    loginModal.style.display = 'none';
    pageOverlay.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', function() {
    // Close Modal Functionality
    const closeModalButton = document.querySelector('.close-modal');
    if (closeModalButton) {
      closeModalButton.addEventListener('click', function() {
        document.querySelector('.login-modal').style.display = 'none';
      });
    }
  
    // Close modal on ESC key
    document.addEventListener('keydown', function(event) {
      if (event.key === "Escape") {
        if (loginModal) {
          loginModal.style.display = 'none';
          pageOverlay.classList.remove('active');
        }
      }
    });
  
    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    }

    document.querySelector('form').addEventListener('submit', function(event) {
        const password = document.querySelector('input[type="password"]').value;
        if (!validatePassword(password)) {
            event.preventDefault();
            alert('A senha deve ter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial e no mínimo 8 caracteres.');
        }
    });
  });

// -------------------------------------------------------------- Filter Script ----------------------------------------------------------------------

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
                const productColor = product.getAttribute('data-color');
        
                let genderMatch = selectedGender.length === 0 || selectedGender.includes(productGender);
                let categoryMatch = selectedCategory.length === 0 || selectedCategory.includes(productCategory);
                let sizeMatch = selectedSize.length === 0 || selectedSize.some(size => productSize.includes(size));
                let colorMatch = selectedColor.length === 0 || selectedColor.includes(productColor);
        
                if (genderMatch && categoryMatch && sizeMatch && colorMatch) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });

            updateActiveFilters();
        }

        function updateActiveFilters() {
            const activeFiltersContainer = document.getElementById('active-filters');
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