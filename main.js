document.addEventListener('DOMContentLoaded', function() {
    // Responsive Navigation Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.style.display = (navMenu.style.display === 'none' || navMenu.style.display === '') ? 'block' : 'none';
        });
    }

    // Specifications Dropdown
    const toggleButtons = document.querySelectorAll('.toggle-specs');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const specs = this.nextElementSibling;
            specs.style.display = (specs.style.display === 'none' || specs.style.display === '') ? 'block' : 'none';
            this.textContent = specs.style.display === 'block' ? "Hide Specifications" : "Show Specifications";
        });
    });

    // Contact Form Validation
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (form && formStatus) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all fields.';
                formStatus.style.color = 'red';
            } else {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.style.color = 'green';
                form.reset();
            }
        });
    }

    // Scroll-to-Top Button
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            scrollToTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
        });
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Image Gallery Functionality
    const thumbnails = document.querySelectorAll('.thumbnail-gallery img');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            const mainImg = this.closest('.model-images').querySelector('img');
            mainImg.src = this.src.replace('-thumb', '');
        });
    });

    // Sorting Functionality
    const sortSelect = document.getElementById('sort-options');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const products = Array.from(document.querySelectorAll('.model-item'));
            const sortBy = this.value;

            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));

                if (sortBy === 'price-low') return priceA - priceB;
                if (sortBy === 'price-high') return priceB - priceA;
                if (sortBy === 'performance') return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            });

            const modelGrid = document.querySelector('.model-grid');
            products.forEach(product => modelGrid.appendChild(product));
        });
    }

    // Filter Functionality
    const filterButton = document.getElementById('filter-button');
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            document.querySelectorAll('.model-item').forEach(product => {
                const specs = product.querySelector('.specifications ul').textContent;
                product.style.display = specs.includes('Intel Core i9') || specs.includes('NVIDIA RTX 3090') ? 'block' : 'none';
            });
        });
    }

    // Load More Functionality
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        let productsShown = 1;
        loadMoreBtn.addEventListener('click', function() {
            const hiddenProducts = Array.from(document.querySelectorAll('.model-item[style="display: none;"]'));
            hiddenProducts.slice(0, 2).forEach(item => item.style.display = 'block');
            productsShown += hiddenProducts.length;

            if (productsShown >= document.querySelectorAll('.model-item').length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

    // Buy Now and Customize buttons
    document.querySelectorAll('.buy-now, .customize').forEach(button => {
        button.addEventListener('click', function() {
            const action = button.classList.contains('buy-now') ? 'Buying' : 'Customizing';
            const productName = this.closest('.model-item').querySelector('h3').textContent;
            alert(`${action}: ${productName}`);
        });
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // ... (Keep all your existing code up to the cart functionality) ...

    // Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartContents();
    }

    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }

    function removeFromCart(productName) {
        console.log('Removing from cart:', productName);
        cart = cart.filter(item => item.name !== productName);
        updateCart();
    }

    function updateCartContents() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            cart.forEach(product => {
                const itemHTML = `
                    <div class="cart-item">
                        <img src="${product.image}" alt="${product.name}">
                        <div>
                            <p>${product.name}</p>
                            <p>${product.price}</p>
                            <p>Quantity: ${product.quantity}</p>
                        </div>
                        <button class="remove-from-cart" data-name="${product.name}">Remove</button>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
            });

            // Update cart total
            const totalElement = document.getElementById('cart-total-amount');
            if (totalElement) {
                const total = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$', '')) * item.quantity), 0);
                totalElement.textContent = `$${total.toFixed(2)}`;
            }
        }
    }

    // Add to Cart button listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const item = event.target.closest('.model-item');
            const product = {
                name: item.querySelector('h3').textContent,
                price: item.querySelector('.price').textContent,
                image: item.querySelector('.model-images img').src
            };
            addToCart(product);
            alert(`${product.name} has been added to your cart.`);
        });
    });

    // Remove from Cart button listeners
    document.querySelector('.cart-items')?.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const productName = event.target.dataset.name;
            removeFromCart(productName);
        }
    });

    // Initialize cart
    updateCartCount();
    updateCartContents();

    // Checkout button listener
    document.getElementById('checkout-button')?.addEventListener('click', () => {
        alert('Proceeding to checkout...');
        // Implement checkout logic here
    });
});