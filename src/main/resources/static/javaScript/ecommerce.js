// E-commerce Specific Functions

class ProductManager {
    constructor() {
        this.products = [];
        this.filters = {
            category: 'all',
            priceRange: [0, 100000],
            rating: 0,
            inStock: false
        };
        this.sortBy = 'popularity';
        this.currentPage = 1;
        this.productsPerPage = 12;
        
        this.init();
    }
    
    init() {
        this.loadProducts();
        this.setupFilters();
        this.setupSorting();
        this.setupPagination();
    }
    
    async loadProducts() {
        try {
            // Mock product data - replace with actual API call
            this.products = [
                {
                    id: 1,
                    name: 'Premium Wireless Headphones',
                    price: 2499,
                    originalPrice: 3299,
                    category: 'Electronics',
                    rating: 4.8,
                    reviews: 1234,
                    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
                    inStock: true,
                    brand: 'TechPro',
                    description: 'High-quality sound with active noise cancellation and 30-hour battery life.',
                    features: ['Noise Cancellation', '30h Battery', 'Wireless', 'Fast Charging'],
                    discount: 25
                },
                {
                    id: 2,
                    name: 'Smart Watch Pro',
                    price: 15999,
                    originalPrice: 15999,
                    category: 'Wearables',
                    rating: 4.9,
                    reviews: 856,
                    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
                    inStock: true,
                    brand: 'WearTech',
                    description: 'Advanced fitness tracking with heart rate monitor and GPS functionality.',
                    features: ['Heart Rate Monitor', 'GPS', 'Water Resistant', 'Sleep Tracking'],
                    isNew: true
                },
                {
                    id: 3,
                    name: 'Premium Running Shoes',
                    price: 4999,
                    originalPrice: 6999,
                    category: 'Sports',
                    rating: 4.7,
                    reviews: 2341,
                    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
                    inStock: true,
                    brand: 'SportMax',
                    description: 'Lightweight and comfortable shoes with superior cushioning technology.',
                    features: ['Lightweight', 'Cushioned', 'Breathable', 'Durable'],
                    isBestseller: true,
                    discount: 29
                },
                {
                    id: 4,
                    name: 'Gaming Laptop Pro',
                    price: 65999,
                    originalPrice: 79999,
                    category: 'Computers',
                    rating: 4.9,
                    reviews: 432,
                    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop',
                    inStock: true,
                    brand: 'GameTech',
                    description: 'High-performance laptop with RTX graphics and ultra-fast SSD storage.',
                    features: ['RTX Graphics', 'Fast SSD', '16GB RAM', '144Hz Display'],
                    isLimited: true,
                    discount: 17
                }
            ];
            
            this.renderProducts();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }
    
    renderProducts() {
        const container = document.querySelector('.product-grid');
        if (!container) return;
        
        const filteredProducts = this.getFilteredProducts();
        const paginatedProducts = this.getPaginatedProducts(filteredProducts);
        
        container.innerHTML = paginatedProducts.map(product => this.renderProductCard(product)).join('');
        
        this.updatePagination(filteredProducts.length);
        this.updateResultsCount(filteredProducts.length);
    }
    
    renderProductCard(product) {
        const discountPercentage = product.originalPrice > product.price 
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;
            
        const badgeClass = product.isNew ? 'bg-green-500' : 
                          product.isBestseller ? 'bg-blue-500' : 
                          product.isLimited ? 'bg-purple-500' : 
                          discountPercentage > 0 ? 'bg-red-500' : '';
                          
        const badgeText = product.isNew ? 'NEW' :
                         product.isBestseller ? 'BESTSELLER' :
                         product.isLimited ? 'LIMITED' :
                         discountPercentage > 0 ? `${discountPercentage}% OFF` : '';
        
        return `
            <div class="product-card group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                         loading="lazy">
                    
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div class="space-x-2">
                            <button onclick="productManager.quickView(${product.id})" 
                                    class="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200">
                                <i class="far fa-eye"></i>
                            </button>
                            <button onclick="addToWishlist(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                    class="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200">
                                <i class="far fa-heart"></i>
                            </button>
                            <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                    class="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                        </div>
                    </div>
                    
                    ${badgeText ? `
                        <div class="absolute top-4 left-4 ${badgeClass} text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ${badgeText}
                        </div>
                    ` : ''}
                    
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                        <i class="fas fa-star text-yellow-400 text-sm"></i>
                        <span class="text-sm font-medium">${product.rating}</span>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="mb-2">
                        <span class="text-sm text-gray-500 font-medium">${product.category}</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        ${product.name}
                    </h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                        ${product.description}
                    </p>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="text-2xl font-bold text-gray-900">₹${product.price.toLocaleString()}</span>
                            ${product.originalPrice > product.price ? `
                                <span class="text-lg text-gray-500 line-through">₹${product.originalPrice.toLocaleString()}</span>
                            ` : ''}
                        </div>
                        <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getFilteredProducts() {
        return this.products.filter(product => {
            // Category filter
            if (this.filters.category !== 'all' && product.category !== this.filters.category) {
                return false;
            }
            
            // Price range filter
            if (product.price < this.filters.priceRange[0] || product.price > this.filters.priceRange[1]) {
                return false;
            }
            
            // Rating filter
            if (product.rating < this.filters.rating) {
                return false;
            }
            
            // Stock filter
            if (this.filters.inStock && !product.inStock) {
                return false;
            }
            
            return true;
        }).sort((a, b) => {
            switch (this.sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return b.id - a.id;
                default:
                    return b.reviews - a.reviews; // popularity
            }
        });
    }
    
    getPaginatedProducts(products) {
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        return products.slice(startIndex, endIndex);
    }
    
    setupFilters() {
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.currentPage = 1;
                this.renderProducts();
            });
        }
        
        // Price range filter
        const priceRangeFilter = document.getElementById('priceRangeFilter');
        if (priceRangeFilter) {
            priceRangeFilter.addEventListener('input', (e) => {
                this.filters.priceRange = [0, parseInt(e.target.value)];
                this.updatePriceDisplay(e.target.value);
                this.currentPage = 1;
                this.renderProducts();
            });
        }
        
        // Rating filter
        const ratingFilter = document.getElementById('ratingFilter');
        if (ratingFilter) {
            ratingFilter.addEventListener('change', (e) => {
                this.filters.rating = parseFloat(e.target.value);
                this.currentPage = 1;
                this.renderProducts();
            });
        }
        
        // Stock filter
        const stockFilter = document.getElementById('stockFilter');
        if (stockFilter) {
            stockFilter.addEventListener('change', (e) => {
                this.filters.inStock = e.target.checked;
                this.currentPage = 1;
                this.renderProducts();
            });
        }
    }
    
    setupSorting() {
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.renderProducts();
            });
        }
    }
    
    setupPagination() {
        // Pagination will be handled in updatePagination method
    }
    
    updatePagination(totalProducts) {
        const totalPages = Math.ceil(totalProducts / this.productsPerPage);
        const paginationContainer = document.getElementById('pagination');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `
                <button onclick="productManager.goToPage(${this.currentPage - 1})" 
                        class="px-4 py-2 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50">
                    Previous
                </button>
            `;
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `
                    <button class="px-4 py-2 bg-blue-600 text-white border border-blue-600">
                        ${i}
                    </button>
                `;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button onclick="productManager.goToPage(${i})" 
                            class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="px-4 py-2 bg-white border border-gray-300">...</span>`;
            }
        }
        
        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `
                <button onclick="productManager.goToPage(${this.currentPage + 1})" 
                        class="px-4 py-2 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50">
                    Next
                </button>
            `;
        }
        
        paginationContainer.innerHTML = `<div class="flex justify-center mt-8">${paginationHTML}</div>`;
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    updateResultsCount(count) {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `Showing ${count} products`;
        }
    }
    
    updatePriceDisplay(value) {
        const priceDisplay = document.getElementById('priceDisplay');
        if (priceDisplay) {
            priceDisplay.textContent = `₹0 - ₹${parseInt(value).toLocaleString()}`;
        }
    }
    
    quickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.createElement('div');
        modal.className
