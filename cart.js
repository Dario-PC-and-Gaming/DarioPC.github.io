let cart = JSON.parse(localStorage.getItem('cart')) || [];

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        // Ensure price is stored as a number
        const price = parseFloat(item.price.toString().replace(/[^0-9.-]+/g, ''));

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>$${price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <button onclick="removeItem(${index})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    updateCartTotal();
}

function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }
    saveCart();
    displayCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
}

function updateCartTotal() {
    // Calculate subtotal, tax, and total with correct price handling
    const subtotal = cart.reduce((total, item) => total + parseFloat(item.price.toString().replace(/[^0-9.-]+/g, '')) * item.quantity, 0);
    const tax = subtotal * 0.1; // Assuming 10% tax
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('cart-count').textContent = cart.reduce((count, item) => count + item.quantity, 0);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.getElementById('checkout-button').addEventListener('click', () => {
    alert('Proceeding to checkout...');
    // Implement checkout logic here
});

document.getElementById('continue-shopping').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Display the cart when the page loads
displayCart();
s