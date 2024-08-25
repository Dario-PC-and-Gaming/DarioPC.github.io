document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('item');
    
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const product = data.monitors.find(m => m.id === productId);
            if (product) {
                document.getElementById('monitor-details').innerHTML = `
                    <h1>${product.name}</h1>
                    <img src="${product.image}" alt="${product.name}">
                    <p class="price">${product.price}</p>
                    <ul>
                        ${product.specifications.map(spec => `<li>${spec}</li>`).join('')}
                    </ul>
                    <button class="buy-now">Buy Now</button>
                `;
            } else {
                document.getElementById('monitor-details').innerHTML = `<p>Product not found.</p>`;
            }
        })
        .catch(error => console.error('Error fetching product data:', error));
});
