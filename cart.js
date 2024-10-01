let cart = [];
const FREE_SHIPPING_THRESHOLD = 290; // Free shipping >= price

// Load cart from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
    updateCartCount();
});

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (totalItems > 0) {
        cartCountElement.style.display = 'block';
        cartCountElement.innerText = totalItems;
    } else {
        cartCountElement.style.display = 'none';
    }
}

// Function to ensure the price is a float number
function parsePrice(priceStr) {
    return parseFloat(priceStr.replace('R$', '').replace(',', '.'));
}

function addToCart(productName, productPrice, productImage, color = null, size = null, quantity = 1) {
    // Ensure productPrice is a number
    productPrice = parsePrice(productPrice);

    // Check if the product already exists in the cart
    const existingProductIndex = cart.findIndex(item => item.name === productName && item.color === color && item.size === size);

    if (existingProductIndex > -1) {
        // If the product exists, increase its quantity
        cart[existingProductIndex].quantity += quantity;
    } else {
        // If the product doesn't exist, add it to the cart
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            color: color,
            size: size,
            quantity: quantity
        });
    }

    saveCart();
    updateCartUI();
    updateCartCount();
    toggleCartSidebar(true);
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const freeShippingText = document.getElementById('free-shipping-text');
    const progressBar = document.getElementById('progress-bar');

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        itemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
                <div class="cart-item-details">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-color-size">Cor: ${item.color} | Tamanho: ${item.size}</p>
                    <div class="cart-item-controls">
                        <button onclick="updateItemQuantity(${index}, -1)" class="quantity-btn" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button onclick="updateItemQuantity(${index}, 1)" class="quantity-btn">+</button>
                    </div>
                </div>
                <button onclick="removeCartItem(${index})" class="remove-cart-item">Remover</button>
                <p class="cart-item-price">R$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    cartSubtotalElement.innerHTML = `<span class="subtotal-text">Subtotal: R$${subtotal.toFixed(2)}</span>`;

    if (cart.length > 0) {
        cartItemsContainer.style.display = 'block';
        cartSubtotalElement.parentElement.style.display = 'block';
        emptyCartMessage.style.display = 'none';
        updateFreeShippingProgress(subtotal);
    } else {
        cartItemsContainer.style.display = 'none';
        cartSubtotalElement.parentElement.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        progressBar.style.width = '0%';
        freeShippingText.innerText = `Frete grátis a partir de R$${FREE_SHIPPING_THRESHOLD.toFixed(2)}`;
    }
    updateCartCount();
    saveCart();
}

function updateFreeShippingProgress(subtotal) {
    const freeShippingText = document.getElementById('free-shipping-text');
    const progressBar = document.getElementById('progress-bar');

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        freeShippingText.innerHTML = `Você ganhou <strong style="text-transform: uppercase;">FRETE GRÁTIS!</strong>`;
        progressBar.style.width = '100%';
    } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        freeShippingText.innerText = `Faltam R$${remaining.toFixed(2)} para ganhar frete grátis nas suas compras!`;

        const progressPercent = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
}

function updateItemQuantity(index, change) {
    const item = cart[index];
    item.quantity += change;

    if (item.quantity < 1) {
        item.quantity = 1;
    }

    updateCartUI();
}

function removeCartItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    updateCartUI();
}

function showEmptyCartMessage() {
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotalElement = document.getElementById('cart-subtotal');

    cartItemsContainer.style.display = 'none';
    cartSubtotalElement.parentElement.style.display = 'none';
    emptyCartMessage.style.display = 'block';
}

function toggleCartSidebar(show) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const pageOverlay = document.getElementById('page-overlay');

    if (show) {
        cartSidebar.classList.add('cart-sidebar-visible');
        cartSidebar.classList.remove('cart-sidebar-hidden');
        pageOverlay.classList.add('active');
    } else {
        cartSidebar.classList.add('cart-sidebar-hidden');
        cartSidebar.classList.remove('cart-sidebar-visible');
        pageOverlay.classList.remove('active');
    }
}

// Close the cart sidebar when the close button is clicked
document.getElementById('close-cart').addEventListener('click', function() {
    toggleCartSidebar(false);
});

// Add an event listener for the cart icon to open the cart sidebar
document.getElementById('cart-icon').addEventListener('click', function(event) {
    event.preventDefault();
    if (cart.length === 0) {
        // If the cart is empty, show the empty cart message
        showEmptyCartMessage();
    } else {
        // If the cart has items, show the full cart sidebar
        updateCartUI();
    }
    toggleCartSidebar(true);
});

// Close the cart when clicking outside the sidebar
document.getElementById('page-overlay').addEventListener('click', function() {
    toggleCartSidebar(false);
});

document.addEventListener('DOMContentLoaded', function() {
    const cartCountElement = document.getElementById('cart-count');
    if (parseInt(cartCountElement.innerText) === 0) {
        cartCountElement.style.display = 'none';
    }
});

document.getElementById('find-products-btn').addEventListener('click', function() {
    window.location.href = 'produtos.html';
});