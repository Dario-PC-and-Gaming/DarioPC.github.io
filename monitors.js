document.addEventListener('DOMContentLoaded', function () {
    const monitorGrid = document.getElementById('monitor-grid');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to fetch product data
    function fetchProductData() {
        fetch('products.json')
            .then(response => response.json())
            .then(data => {
                renderProducts(data.monitors); // Ensure the data structure matches your JSON
            })
            .catch(error => console.error('Error fetching product data:', error));
    }

    // Function to render product items
    function renderProducts(products) {
        monitorGrid.innerHTML = ''; // Clear existing content
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('model-item');
            productElement.setAttribute('data-price', product.price);
            productElement.setAttribute('data-performance', product.performance);
            productElement.innerHTML = `
                <div class="model-images">
                    <img src="${product.image}" alt="${product.name} - Main" class="main-image">
                    <div class="thumbnail-gallery">
                        ${product.thumbnails.map(thumb => `<img src="${thumb}" alt="Thumbnail" class="thumbnail">`).join('')}
                    </div>
                </div>
                <h3>${product.name}</h3>
                <p class="price">${product.price} Naira</p>
                <button class="toggle-specs">Show Specifications</button>
                <div class="specifications" style="display: none;">
                    <ul>
                        ${product.specifications.map(spec => `<li>${spec}</li>`).join('')}
                    </ul>
                </div>
                <button class="buy-now" data-product-id="${product.id}">Buy Now</button>
                <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            `;
            monitorGrid.appendChild(productElement);

            // Add thumbnail click functionality
            const thumbnails = productElement.querySelectorAll('.thumbnail');
            const mainImage = productElement.querySelector('.main-image');
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    mainImage.src = this.src;
                });
            });
        });

        // Add event listeners for the specifications toggle button
        document.querySelectorAll('.toggle-specs').forEach(button => {
            button.addEventListener('click', function () {
                const specs = this.nextElementSibling;
                specs.style.display = specs.style.display === 'none' ? 'block' : 'none';
                this.textContent = specs.style.display === 'none' ? 'Show Specifications' : 'Hide Specifications';
            });
        });

        // Add event listeners for the buy now button
        document.querySelectorAll('.buy-now').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id');
                window.location.href = `monitor-details.html?item=${productId}`;
            });
        });

        // Add event listeners for the add to cart button
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id');
                const selectedProduct = products.find(product => product.id === productId);
                addToCart(selectedProduct);
            });
        });
    }

    // Function to add a product to the cart
    function addToCart(product) {
        // Check if the product is already in the cart
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increase the quantity if already in cart
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price.replace(/[^0-9.-]+/g, '')),
                quantity: 1,
                image: product.image
            });
        }
        saveCart();
        alert(`${product.name} has been added to your cart.`);
    }

    // Function to save the cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Function to update cart count in the UI
    function updateCartCount() {
        const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
        document.getElementById('cart-count').textContent = cartCount;
    }

    // Initial fetch and update cart count
    fetchProductData();
    updateCartCount();
});
