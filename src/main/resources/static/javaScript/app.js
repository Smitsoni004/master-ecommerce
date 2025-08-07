// Add these functions to your existing app.js file

// Load product detail
function loadProductDetail(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        document.getElementById('product-detail-container').innerHTML = '<p class="text-red-600 text-center">Product not found.</p>';
        return;
    }

    // Update breadcrumb
    document.getElementById('breadcrumb-category').textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    document.getElementById('breadcrumb-product').textContent = product.name;

    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    
    document.getElementById('product-detail-container').innerHTML = `
        <div>
            <img src="${product.imageUrl}" alt="${product.name}" class="w-full rounded-lg">
        </div>
        <div class="space-y-6">
            <div>
                <h1 class="text-3xl font-bold mb-2">${product.name}</h1>
                <div class="flex items-center mb-4">
                    <div class="flex text-yellow-400 mr-2">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="text-gray-600">${product.rating} (${product.reviews} reviews)</span>
                </div>
            </div>
            
            <div class="border-b pb-6">
                <div class="flex items-center space-x-4 mb-4">
                    <span class="text-3xl font-bold text-gray-900">₹${product.price.toLocaleString()}</span>
                    ${product.originalPrice > product.price ? 
                        `<span class="text-xl text-gray-500 line-through">₹${product.originalPrice.toLocaleString()}</span>
                         <span class="bg-red-500 text-white px-2 py-1 rounded text-sm">${discount}% OFF</span>` : ''}
                </div>
                <p class="text-gray-700 mb-6">${product.description}</p>
                
                <div class="flex space-x-4">
                    <button onclick="addToCart(${product.id})" 
                            class="flex-1 bg-yellow-500 text-black py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition
                                   ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}" 
                            ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    <button class="bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition">
                        Buy Now
                    </button>
                </div>
            </div>
            
            <div class="space-y-4 text-sm">
                <div class="flex items-center">
                    <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Free delivery on orders above ₹499</span>
                </div>
                <div class="flex items-center">
                    <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                    <span>Easy returns within 30 days</span>
                </div>
            </div>
        </div>
    `;

    // Load description
    document.getElementById('product-full-description').textContent = product.description + " This is a high-quality product with excellent features and great value for money. Perfect for everyday use and built to last.";
    
    // Load related products
    loadRelatedProducts(product.category, productId);
}

// Load cart
function loadCart() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 18h12M10 21a1 1 0 100 2 1 1 0 000-2zM21 21a1 1 0 100 2 1 1 0 000-2z"></path>
                </svg>
                <h3 class="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p class="text-gray-600 mb-4">Add some products to get started!</p>
                <a href="products.html" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Continue Shopping</a>
            </div>
        `;
        updateOrderSummary();
        return;
    }

    const cartHTML = cart.map((item, index) => `
        <div class="bg-white rounded-lg shadow p-4">
            <div class="flex items-center space-x-4">
                <img src="${item.product.imageUrl}" alt="${item.product.name}" class="w-20 h-20 object-cover rounded">
                <div class="flex-1">
                    <h3 class="font-semibold">${item.product.name}</h3>
                    <p class="text-gray-600 text-sm">${item.product.description.substring(0, 60)}...</p>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center space-x-2">
                            <button onclick="updateQuantity(${index}, -1)" class="w-8 h-8 border rounded text-center hover:bg-gray-100">-</button>
                            <span class="w-8 text-center">${item.quantity}</span>
                            <button onclick="updateQuantity(${index}, 1)" class="w-8 h-8 border rounded text-center hover:bg-gray-100">+</button>
                        </div>
                        <div class="flex items-center space-x-4">
                            <span class="font-semibold">₹${(item.product.price * item.quantity).toLocaleString()}</span>
                            <button onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-800">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = cartHTML;
    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.18); // 18% tax
    const shipping = subtotal > 499 ? 0 : 50;
    const total = subtotal + tax + shipping;

    // Update cart page summary
    const summaryElements = {
        'summary-items': cart.length,
        'summary-subtotal': `₹${subtotal.toLocaleString()}`,
        'summary-tax': `₹${tax.toLocaleString()}`,
        'summary-shipping': shipping === 0 ? 'FREE' : `₹${shipping}`,
        'summary-total': `₹${total.toLocaleString()}`
    };

    Object.entries(summaryElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

// Update quantity in cart
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        loadCart();
    }
}

// Remove from cart
function removeFromCart(index) {
    if (confirm('Remove this item from cart?')) {
        cart.splice(index, 1);
        saveCart();
        loadCart();
    }
}

// Load category products
function loadCategoryProducts(category) {
    const categoryInfo = {
        electronics: { title: 'Electronics', description: 'Latest gadgets and technology' },
        fashion: { title: 'Fashion', description: 'Trendy clothes and accessories' },
        home: { title: 'Home & Kitchen', description: 'Everything for your home' },
        books: { title: 'Books', description: 'Knowledge and entertainment' },
        sports: { title: 'Sports', description: 'Fitness and outdoor gear' },
        beauty: { title: 'Beauty', description: 'Personal care products' }
    };

    const info = categoryInfo[category] || { title: 'Products', description: 'Browse our collection' };
    
    // Update page title and description
    document.getElementById('category-title').textContent = info.title;
    document.getElementById('category-description').textContent = info.description;

    // Filter products by category
    const categoryProducts = allProducts.filter(p => p.category === category);
    
    // Update results count
    document.getElementById('results-count').textContent = categoryProducts.length;
    
    // Render products
    const container = document.getElementById('category-products');
    container.innerHTML = categoryProducts.map(renderProductCard).join('');
}

// Load checkout summary
function loadCheckoutSummary() {
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    const container = document.getElementById('checkout-items');
    if (!container) return;

    const itemsHTML = cart.map(item => `
        <div class="flex items-center space-x-3 text-sm">
            <img src="${item.product.imageUrl}" alt="${item.product.name}" class="w-12 h-12 object-cover rounded">
            <div class="flex-1">
                <div class="font-medium">${item.product.name}</div>
                <div class="text-gray-600">Qty: ${item.quantity}</div>
            </div>
            <div class="font-semibold">₹${(item.product.price * item.quantity).toLocaleString()}</div>
        </div>
    `).join('');

    container.innerHTML = itemsHTML;
    
    // Update checkout totals
    const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('checkout-tax').textContent = `₹${tax.toLocaleString()}`;
    document.getElementById('checkout-total').textContent = `₹${total.toLocaleString()}`;
}

// Load related products
function loadRelatedProducts(category, currentProductId) {
    const relatedProducts = allProducts
        .filter(p => p.category === category && p.id !== currentProductId)
        .slice(0, 4);
    
    const container = document.getElementById('related-products');
    if (container && relatedProducts.length > 0) {
        container.innerHTML = relatedProducts.map(renderProductCard).join('');
    }
}

// Export new functions
window.loadProductDetail = loadProductDetail;
window.loadCart = loadCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.loadCategoryProducts = loadCategoryProducts;
window.loadCheckoutSummary = loadCheckoutSummary;
