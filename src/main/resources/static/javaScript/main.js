// Main JavaScript File - Enhanced E-commerce Functionality

class EcommerceApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        this.currency = '₹';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.updateCartUI();
        this.setupScrollEffects();
        this.setupLazyLoading();
        this.setupSearchFunctionality();
        this.setupMobileMenu();
        this.setupBackToTop();
        this.loadSavedData();
    }
    
    setupEventListeners() {
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('load', this.handleLoad.bind(this));
        
        // Storage events
        window.addEventListener('storage', this.handleStorageChange.bind(this));
        
        // Form submissions
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Click events delegation
        document.addEventListener('click', this.handleGlobalClick.bind(this));
    }
    
    initializeComponents() {
        this.initializeAnimations();
        this.initializeTooltips();
        this.initializeModals();
        this.initializeCarousels();
    }
    
    // Cart Management
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart!`, 'success');
        this.trackEvent('add_to_cart', { product_id: product.id, product_name: product.name });
    }
    
    removeFromCart(productId) {
        const itemIndex = this.cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const removedItem = this.cart[itemIndex];
            this.cart.splice(itemIndex, 1);
            this.saveCart();
            this.updateCartUI();
            this.showNotification(`${removedItem.name} removed from cart`, 'info');
        }
    }
    
    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Cart cleared', 'info');
    }
    
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getCartItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.dispatchCartEvent();
    }
    
    dispatchCartEvent() {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: {
                cart: this.cart,
                total: this.getCartTotal(),
                itemCount: this.getCartItemCount()
            }
        }));
    }
    
    updateCartUI() {
        this.updateCartCount();
        this.updateCartSidebar();
    }
    
    updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        const itemCount = this.getCartItemCount();
        
        if (cartCountElement) {
            cartCountElement.textContent = itemCount;
            cartCountElement.style.display = itemCount > 0 ? 'flex' : 'none';
            
            // Add animation
            cartCountElement.classList.add('animate-pulse');
            setTimeout(() => cartCountElement.classList.remove('animate-pulse'), 500);
        }
    }
    
    updateCartSidebar() {
        const cartItems = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartItems) return;
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center text-gray-500 mt-20">
                    <i class="fas fa-shopping-cart text-4xl mb-4"></i>
                    <p>Your cart is empty</p>
                    <button onclick="toggleCart()" class="mt-4 text-blue-600 hover:text-blue-800">
                        Continue Shopping
                    </button>
                </div>
            `;
            cartFooter.classList.add('hidden');
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item flex items-center space-x-4 bg-gray-50 p-4 rounded-xl mb-4">
                    <img src="${item.image || '/images/placeholder.jpg'}" 
                         alt="${item.name}" 
                         class="w-16 h-16 object-cover rounded-lg">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${item.name}</h4>
                        <p class="text-gray-600 text-sm">${item.category || ''}</p>
                        <div class="flex items-center justify-between mt-2">
                            <div class="flex items-center space-x-2">
                                <button onclick="ecommerceApp.updateCartQuantity(${item.id}, ${item.quantity - 1})" 
                                        class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                                    <i class="fas fa-minus text-xs"></i>
                                </button>
                                <span class="w-8 text-center font-medium">${item.quantity}</span>
                                <button onclick="ecommerceApp.updateCartQuantity(${item.id}, ${item.quantity + 1})" 
                                        class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                                    <i class="fas fa-plus text-xs"></i>
                                </button>
                            </div>
                            <span class="font-bold text-lg">${this.currency}${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    </div>
                    <button onclick="ecommerceApp.removeFromCart(${item.id})" 
                            class="text-red-500 hover:text-red-700 transition-colors">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
            
            const total = this.getCartTotal();
            cartSubtotal.textContent = `${this.currency}${total.toLocaleString()}`;
            cartTotal.textContent = `${this.currency}${total.toLocaleString()}`;
            cartFooter.classList.remove('hidden');
        }
    }
    
    // Wishlist Management
    addToWishlist(product) {
        const exists = this.wishlist.find(item => item.id === product.id);
        if (!exists) {
            this.wishlist.push({...product, addedAt: new Date().toISOString()});
            this.saveWishlist();
            this.showNotification(`${product.name} added to wishlist!`, 'success');
        } else {
            this.showNotification(`${product.name} is already in wishlist`, 'info');
        }
    }
    
    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.saveWishlist();
        this.showNotification('Item removed from wishlist', 'info');
    }
    
    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }
    
    // Search Functionality
    setupSearchFunctionality() {
        const searchInput = document.getElementById('searchInput');
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    this.fetchSearchSuggestions(query);
                }, 300);
            } else {
                this.hideSuggestions();
            }
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(e.target.value.trim());
            }
        });
        
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }
    
    async fetchSearchSuggestions(query) {
        try {
            // Mock API call - replace with actual endpoint
            const mockSuggestions = [
                { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', image: '/images/iphone.jpg' },
                { id: 2, name: 'Samsung Galaxy S24', category: 'Electronics', image: '/images/samsung.jpg' },
                { id: 3, name: 'MacBook Pro', category: 'Computers', image: '/images/macbook.jpg' },
                { id: 4, name: 'AirPods Pro', category: 'Audio', image: '/images/airpods.jpg' },
            ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
            
            this.displaySuggestions(mockSuggestions);
        } catch (error) {
            console.error('Search error:', error);
        }
    }
    
    displaySuggestions(suggestions) {
        const container = document.getElementById('searchSuggestions');
        if (!container) return;
        
        if (suggestions.length === 0) {
            container.innerHTML = '<div class="search-suggestion-item">No results found</div>';
        } else {
            container.innerHTML = suggestions.map(item => `
                <div class="search-suggestion-item" onclick="ecommerceApp.selectSuggestion(${item.id}, '${item.name}')">
                    <div class="flex items-center space-x-3">
                        <img src="${item.image}" alt="${item.name}" class="w-8 h-8 object-cover rounded">
                        <div>
                            <div class="font-medium">${item.name}</div>
                            <div class="text-sm text-gray-500">${item.category}</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        container.classList.remove('hidden');
    }
    
    hideSuggestions() {
        const container = document.getElementById('searchSuggestions');
        if (container) {
            container.classList.add('hidden');
        }
    }
    
    selectSuggestion(productId, productName) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = productName;
        }
        this.hideSuggestions();
        this.performSearch(productName);
    }
    
    performSearch(query) {
        if (!query) return;
        
        // Track search
        this.trackEvent('search', { search_term: query });
        
        // Redirect to search results page or filter current page
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
    
    // Mobile Menu
    setupMobileMenu() {
        const mobileMenuButton = document.querySelector('[onclick="toggleMobileMenu()"]');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuButton && mobileMenu) {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'mobile-menu-overlay';
            overlay.onclick = () => this.closeMobileMenu();
            document.body.appendChild(overlay);
        }
    }
    
    toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (!menu) return;
        
        const isOpen = menu.classList.contains('open');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        menu.classList.remove('closed');
        menu.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        menu.classList.remove('open');
        menu.classList.add('closed');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Cart Slideout
    toggleCart() {
        const cartSlideout = document.getElementById('cartSlideout');
        if (!cartSlideout) return;
        
        const isOpen = cartSlideout.classList.contains('open');
        
        if (isOpen) {
            cartSlideout.classList.remove('open');
            cartSlideout.style.transform = 'translateX(100%)';
        } else {
            cartSlideout.classList.add('open');
            cartSlideout.style.transform = 'translateX(0)';
        }
    }
    
    // Notifications
    showNotification(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="${icons[type]}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, duration);
    }
    
    // Scroll Effects
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.page-transition').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        if (!backToTopButton) return;
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    handleScroll() {
        const backToTopButton = document.getElementById('backToTop');
        
        if (backToTopButton) {
            if (window.scrollY > 500) {
                backToTopButton.classList.add('show');
                backToTopButton.style.opacity = '1';
                backToTopButton.style.pointerEvents = 'auto';
            } else {
                backToTopButton.classList.remove('show');
                backToTopButton.style.opacity = '0';
                backToTopButton.style.pointerEvents = 'none';
            }
        }
        
        // Update navbar on scroll
        const navbar = document.querySelector('nav');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    // Lazy Loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Animation Initialization
    initializeAnimations() {
        // Initialize AOS (Animate on Scroll) if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
        
        // Custom animations
        this.animateCounters();
        this.animateProgressBars();
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        });
    }
    
    // Event Handlers
    handleGlobalClick(e) {
        // Handle dynamic button clicks
        if (e.target.matches('.add-to-cart-btn')) {
            const productData = JSON.parse(e.target.getAttribute('data-product'));
            this.addToCart(productData);
        }
        
        if (e.target.matches('.add-to-wishlist-btn')) {
            const productData = JSON.parse(e.target.getAttribute('data-product'));
            this.addToWishlist(productData);
        }
        
        // Close modals when clicking outside
        if (e.target.matches('.modal-overlay')) {
            this.closeModal(e.target.closest('.modal'));
        }
    }
    
    handleFormSubmit(e) {
        // Handle newsletter subscription
        if (e.target.matches('.newsletter-form')) {
            e.preventDefault();
            this.handleNewsletterSubmission(e.target);
        }
        
        // Handle contact form
        if (e.target.matches('.contact-form')) {
            e.preventDefault();
            this.handleContactFormSubmission(e.target);
        }
    }
    
    handleResize() {
        // Handle responsive changes
        this.updateLayoutForScreenSize();
    }
    
    handleLoad() {
        // Page loaded
        document.body.classList.add('loaded');
        this.initializeAnimations();
    }
    
    handleStorageChange(e) {
        if (e.key === 'cart') {
            this.cart = JSON.parse(e.newValue) || [];
            this.updateCartUI();
        }
    }
    
    // Utility Functions
    loadSavedData() {
        // Load user preferences
        const theme = localStorage.getItem('theme');
        if (theme) {
            document.body.classList.add(`theme-${theme}`);
        }
        
        // Load language preference
        const language = localStorage.getItem('language');
        if (language) {
            this.setLanguage(language);
        }
    }
    
    updateLayoutForScreenSize() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            document.body.classList.add('mobile-layout');
        } else {
            document.body.classList.remove('mobile-layout');
        }
    }
    
    trackEvent(eventName, properties = {}) {
        // Google Analytics or other tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Custom analytics
        console.log('Event tracked:', eventName, properties);
    }
    
    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Newsletter Subscription
    async handleNewsletterSubmission(form) {
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('button[type="submit"]');
        
        button.classList.add('btn-loading');
        
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Subscription failed. Please try again.', 'error');
        } finally {
            button.classList.remove('btn-loading');
        }
    }
    
    // Performance Monitoring
    measurePerformance() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            
            this.trackEvent('page_load_time', { load_time: loadTime });
        }
    }
}

// Global Functions for HTML onclick handlers
function addToCart(product) {
    window.ecommerceApp.addToCart(product);
}

function toggleCart() {
    window.ecommerceApp.toggleCart();
}

function toggleMobileMenu() {
    window.ecommerceApp.toggleMobileMenu();
}

function addToWishlist(product) {
    window.ecommerceApp.addToWishlist(product);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ecommerceApp = new EcommerceApp();
    
    // Add page transition class to body
    document.body.classList.add('page-transition');
    
    // Performance monitoring
    window.addEventListener('load', () => {
        window.ecommerceApp.measurePerformance();
    });
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
