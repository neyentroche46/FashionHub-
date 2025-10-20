// scripts.js - JAVASCRIPT COMPLETO PARA TODOS LOS BOTONES DE FASHIONHUB

class FashionHub {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.initNavigation();
        this.initHeader();
        this.initCart();
        this.initWishlist();
        this.initFilters();
        this.initProductInteractions();
        this.initCheckout();
        this.initUserAccount();
        this.initSearch();
        this.initAnimations();
        this.initNotifications();
        this.initFormValidations();
        this.initExportFunctions();
        this.initModalSystem();
        this.initResponsiveMenu();
        this.initSocialMedia();
    }

    // NAVEGACIÓN Y ENLACES
    initNavigation() {
        // Prevenir comportamiento por defecto de enlaces vacíos
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href') === '#') {
                e.preventDefault();
                this.showNotification('Enlace en desarrollo', 'info');
            }
        });

        // Navegación entre páginas
        const navLinks = document.querySelectorAll('.nav-links a, .footer-links a, .category-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
                    // Permitir navegación normal
                    return true;
                }
            });
        });

        // Botones de volver al inicio
        const backButtons = document.querySelectorAll('.back-home-btn, .back-btn');
        backButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'index.html';
            });
        });

        // Botones de ver detalles
        const detailButtons = document.querySelectorAll('.btn-primary, .view-details-btn');
        detailButtons.forEach(btn => {
            if (btn.getAttribute('href') === 'producto.html') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Simular navegación a página de producto
                    this.showNotification('Redirigiendo a detalles del producto...', 'info');
                    setTimeout(() => {
                        window.location.href = 'producto.html';
                    }, 1000);
                });
            }
        });
    }

    // HEADER Y MENÚ RESPONSIVE
    initHeader() {
        const header = document.getElementById('mainHeader');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
            });
        }
    }

    initResponsiveMenu() {
        // Crear botón de menú móvil si no existe
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                const navLinks = document.querySelector('.nav-links');
                navLinks.classList.toggle('mobile-open');
                mobileBtn.innerHTML = navLinks.classList.contains('mobile-open') ? 
                    '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            });
        }
    }

    // SISTEMA DE CARRITO MEJORADO
    initCart() {
        this.updateCartCount();
        
        // Añadir productos al carrito
        const addToCartButtons = document.querySelectorAll('.add-btn, .add-to-cart-btn, .action-btn.add-btn');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (button.disabled) {
                    this.showNotification('Producto agotado', 'error');
                    return;
                }
                this.addToCart(button);
            });
        });

        // Control de cantidad en el carrito
        const quantityControls = document.querySelectorAll('.quantity-controls, .item-quantity');
        quantityControls.forEach(control => {
            const minusBtn = control.querySelector('.quantity-btn:first-child');
            const plusBtn = control.querySelector('.quantity-btn:last-child');
            const input = control.querySelector('.quantity-input');

            if (minusBtn && plusBtn && input) {
                minusBtn.addEventListener('click', () => {
                    let value = parseInt(input.value);
                    if (value > 1) {
                        input.value = value - 1;
                        this.updateCartPrices();
                    }
                });

                plusBtn.addEventListener('click', () => {
                    let value = parseInt(input.value);
                    input.value = value + 1;
                    this.updateCartPrices();
                });

                input.addEventListener('change', () => {
                    let value = parseInt(input.value);
                    if (isNaN(value) || value < 1) {
                        input.value = 1;
                    }
                    this.updateCartPrices();
                });
            }
        });

        // Botón comprar ahora
        const buyNowButtons = document.querySelectorAll('.buy-now-btn');
        buyNowButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.buyNow(button);
            });
        });

        // Icono del carrito en el header
        const cartIcon = document.querySelector('.nav-icons a[aria-label*="carrito"]');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCartModal();
            });
        }
    }

    addToCart(button) {
        const productCard = button.closest('[data-id]');
        if (!productCard) return;

        const productId = productCard.dataset.id;
        const productName = productCard.querySelector('.product-name, .item-name, .product-title')?.textContent || 'Producto';
        const priceElement = productCard.querySelector('.current-price, .item-price, .product-price');
        const price = priceElement ? this.parsePrice(priceElement.textContent) : 0;
        
        const existingItem = this.cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cartItems.push({
                id: productId,
                name: productName,
                price: price,
                quantity: 1,
                image: productCard.querySelector('.product-img, .item-image, .product-image')?.innerHTML || '<i class="fas fa-tshirt"></i>',
                variant: this.getProductVariant(productCard)
            });
        }

        this.saveCart();
        this.showNotification(`✓ ${productName} añadido al carrito`, 'success');
    }

    showCartModal() {
        if (this.cartItems.length === 0) {
            this.showNotification('Tu carrito está vacío', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Tu Carrito de Compras</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${this.cartItems.map(item => `
                        <div class="cart-item">
                            <div class="cart-item-image">${item.image}</div>
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p>${item.variant}</p>
                                <div class="cart-item-price">${this.formatPrice(item.price)} x ${item.quantity}</div>
                            </div>
                            <button class="remove-from-cart" data-id="${item.id}">&times;</button>
                        </div>
                    `).join('')}
                </div>
                <div class="modal-footer">
                    <div class="cart-total">
                        Total: ${this.formatPrice(this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-outline" id="continueShopping">Seguir Comprando</button>
                        <button class="btn btn-primary" id="goToCheckout">Finalizar Compra</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Event listeners del modal del carrito
        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('#continueShopping').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('#goToCheckout').addEventListener('click', () => {
            window.location.href = 'comprar.html';
        });

        // Eliminar items del carrito
        modal.querySelectorAll('.remove-from-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.id;
                this.removeFromCart(itemId);
                this.closeModal(modal);
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    }

    removeFromCart(itemId) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.saveCart();
        this.showNotification('Producto eliminado del carrito', 'success');
    }

    // SISTEMA DE FAVORITOS MEJORADO
    initWishlist() {
        const wishlistButtons = document.querySelectorAll('.product-wishlist, .wishlist-btn');
        
        wishlistButtons.forEach(button => {
            const productCard = button.closest('[data-id]');
            if (productCard) {
                const productId = productCard.dataset.id;
                
                if (this.wishlistItems.includes(productId)) {
                    button.classList.add('active');
                    const icon = button.querySelector('i');
                    if (icon) icon.className = 'fas fa-heart';
                }

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleWishlist(button, productId);
                });
            }
        });

        // Icono de favoritos en el header
        const wishlistIcon = document.querySelector('.nav-icons a[aria-label*="cuenta"]');
        if (wishlistIcon) {
            wishlistIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showWishlistModal();
            });
        }
    }

    toggleWishlist(button, productId) {
        const icon = button.querySelector('i');
        
        if (this.wishlistItems.includes(productId)) {
            // Remover de favoritos
            this.wishlistItems = this.wishlistItems.filter(id => id !== productId);
            button.classList.remove('active');
            if (icon) icon.className = 'far fa-heart';
            this.showNotification('Producto removido de favoritos', 'info');
        } else {
            // Añadir a favoritos
            this.wishlistItems.push(productId);
            button.classList.add('active');
            if (icon) icon.className = 'fas fa-heart';
            this.showNotification('Producto añadido a favoritos', 'success');
        }
        
        this.saveWishlist();
    }

    showWishlistModal() {
        if (this.wishlistItems.length === 0) {
            this.showNotification('No tienes productos en favoritos', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Tus Favoritos</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Tienes ${this.wishlistItems.length} productos en tu lista de favoritos.</p>
                    <button class="btn btn-primary" id="viewWishlist">Ver Mis Favoritos</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('#viewWishlist').addEventListener('click', () => {
            window.location.href = 'cuenta.html#favoritos';
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    }

    // SISTEMA DE BÚSQUEDA
    initSearch() {
        const searchIcon = document.querySelector('.nav-icons a[aria-label*="Buscar"]');
        if (searchIcon) {
            searchIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSearchModal();
            });
        }

        // Búsqueda en página de búsqueda
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }
    }

    showSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Buscar Productos</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="search-form">
                        <input type="text" id="searchInput" placeholder="¿Qué estás buscando?" class="form-input">
                        <button class="btn btn-primary" id="performSearch">
                            <i class="fas fa-search"></i> Buscar
                        </button>
                    </div>
                    <div class="search-suggestions">
                        <h4>Sugerencias populares:</h4>
                        <div class="suggestion-tags">
                            <span class="suggestion-tag">Camisetas</span>
                            <span class="suggestion-tag">Jeans</span>
                            <span class="suggestion-tag">Zapatos</span>
                            <span class="suggestion-tag">Accesorios</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        const searchInput = modal.querySelector('#searchInput');
        searchInput.focus();

        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('#performSearch').addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                this.performSearch(query);
                this.closeModal(modal);
            } else {
                this.showNotification('Por favor, ingresa un término de búsqueda', 'warning');
            }
        });

        // Búsqueda al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                modal.querySelector('#performSearch').click();
            }
        });

        // Sugerencias clickeables
        modal.querySelectorAll('.suggestion-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.textContent;
                modal.querySelector('#performSearch').click();
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    }

    performSearch(query = null) {
        if (!query) {
            const searchInput = document.querySelector('.search-input');
            query = searchInput ? searchInput.value.trim() : '';
        }
        
        if (!query) {
            this.showNotification('Por favor, ingresa un término de búsqueda', 'warning');
            return;
        }
        
        this.showNotification(`Buscando: "${query}"`, 'info');
        // Simular búsqueda
        setTimeout(() => {
            this.showNotification(`Se encontraron productos para "${query}"`, 'success');
            // Redirigir a página de resultados si estamos en otra página
            if (!window.location.href.includes('buscar.html')) {
                window.location.href = `buscar.html?q=${encodeURIComponent(query)}`;
            }
        }, 1500);
    }

    // SISTEMA DE USUARIO Y CUENTA
    initUserAccount() {
        const userIcon = document.querySelector('.nav-icons a[aria-label*="cuenta"], .nav-icons a[aria-label*="sesión"]');
        if (userIcon) {
            userIcon.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentUser) {
                    this.showUserModal();
                } else {
                    this.showLoginModal();
                }
            });
        }

        // Tabs de cuenta
        this.initAccountTabs();
    }

    initAccountTabs() {
        const tabItems = document.querySelectorAll('.account-menu .menu-item');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabItems.forEach(item => {
            if (!item.classList.contains('logout')) {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const tabId = item.getAttribute('href').substring(1);
                    
                    // Remover clase active de todos los tabs
                    tabItems.forEach(tab => tab.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    // Añadir clase active al tab seleccionado
                    item.classList.add('active');
                    const targetTab = document.getElementById(tabId);
                    if (targetTab) {
                        targetTab.classList.add('active');
                    }
                });
            }
        });
    }

    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Iniciar Sesión</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="login-form">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Contraseña</label>
                            <input type="password" id="loginPassword" class="form-input" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Iniciar Sesión</button>
                    </form>
                    <div class="login-options">
                        <p>¿No tienes cuenta? <a href="#" class="register-link">Regístrate aquí</a></p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        const form = modal.querySelector('.login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(form);
        });

        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.register-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.closeModal(modal);
            this.showRegisterModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    }

    handleLogin(form) {
        const email = form.querySelector('#loginEmail').value;
        const password = form.querySelector('#loginPassword').value;
        
        // Simular login
        this.currentUser = {
            name: 'Usuario Demo',
            email: email
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.showNotification(`¡Bienvenido ${this.currentUser.name}!`, 'success');
        this.closeAllModals();
    }

    showUserModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Mi Cuenta</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="user-info">
                        <h4>¡Hola, ${this.currentUser.name}!</h4>
                        <p>${this.currentUser.email}</p>
                    </div>
                    <div class="user-actions">
                        <button class="user-action-btn">
                            <i class="fas fa-shopping-bag"></i> Mis Pedidos
                        </button>
                        <button class="user-action-btn">
                            <i class="fas fa-heart"></i> Mis Favoritos
                        </button>
                        <button class="user-action-btn">
                            <i class="fas fa-cog"></i> Configuración
                        </button>
                        <button class="user-action-btn logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.logout-btn').addEventListener('click', () => {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            this.showNotification('Sesión cerrada correctamente', 'success');
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    }

    // SISTEMA DE MODALES
    initModalSystem() {
        // Cerrar modales con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            document.body.style.overflow = 'auto';
        }, 300);
    }

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            this.closeModal(modal);
        });
    }

    // FILTROS MEJORADOS
    initFilters() {
        const filterSelects = document.querySelectorAll('select');
        filterSelects.forEach(select => {
            select.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        const clearFiltersBtn = document.querySelector('.clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearFilters();
            });
        }

        const filterTags = document.querySelectorAll('.filter-tag i');
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                this.removeFilterTag(tag);
            });
        });

        // Botones de vista (tabla/cajas)
        const viewToggle = document.querySelectorAll('.view-toggle a');
        viewToggle.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!btn.classList.contains('active')) {
                    viewToggle.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.showNotification('Vista cambiada', 'info');
                }
            });
        });
    }

    applyFilters() {
        this.showNotification('Filtros aplicados', 'info');
    }

    clearFilters() {
        const filterSelects = document.querySelectorAll('select');
        filterSelects.forEach(select => {
            select.value = '';
        });
        this.showNotification('Filtros limpiados', 'info');
    }

    removeFilterTag(tag) {
        const filterTag = tag.closest('.filter-tag');
        if (filterTag) {
            filterTag.remove();
            this.showNotification('Filtro removido', 'info');
        }
    }

    // INTERACCIONES DE PRODUCTOS MEJORADAS
    initProductInteractions() {
        // Vista rápida
        const quickViewButtons = document.querySelectorAll('.quick-view-btn');
        quickViewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showQuickView(button);
            });
        });

        // Selectores de variantes
        const variantOptions = document.querySelectorAll('.variant-option:not(.disabled)');
        variantOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.selectVariant(option);
            });
        });

        // Tabs de productos
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.switchTab(tabId, btn);
            });
        });

        // Galería de imágenes
        this.initProductGallery();

        // Ordenamiento de tabla
        this.initTableSorting();

        // Paginación
        this.initPagination();

        // Botones de acción en tabla
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            if (btn.classList.contains('view-btn')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'producto.html';
                });
            }
        });
    }

    showQuickView(button) {
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        const productName = productCard.querySelector('.product-title, .product-name')?.textContent || 'Producto';
        const productPrice = productCard.querySelector('.current-price')?.textContent || '';
        const productImage = productCard.querySelector('.product-img, .product-image')?.innerHTML || '<i class="fas fa-tshirt"></i>';

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Vista Rápida</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="product-gallery">
                        <div class="product-main-image">
                            ${productImage}
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${productName}</h3>
                        <div class="product-price">${productPrice}</div>
                        <p>Vista previa rápida del producto. Haz clic en "Ver Detalles" para más información.</p>
                        <div class="product-actions">
                            <a href="producto.html" class="btn btn-primary">Ver Detalles</a>
                            <button class="btn btn-secondary add-to-cart-btn">Añadir al Carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.querySelector('.close-modal').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            this.addToCart(button);
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    }

    selectVariant(option) {
        const variantGroup = option.closest('.variant-selector');
        const selectedSpan = variantGroup.querySelector('#selected-color, #selected-size');
        
        // Remover clase selected de todas las opciones
        const options = variantGroup.querySelectorAll('.variant-option');
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Añadir clase selected a la opción clickeada
        option.classList.add('selected');
        
        // Actualizar texto del selector
        if (selectedSpan) {
            selectedSpan.textContent = option.textContent;
        }
        
        this.showNotification(`Variante seleccionada: ${option.textContent}`, 'info');
    }

    switchTab(tabId, btn) {
        // Remover clase active de todos los botones y contenidos
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Añadir clase active al botón y contenido seleccionado
        btn.classList.add('active');
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    initProductGallery() {
        const thumbnails = document.querySelectorAll('.product-thumbnail');
        const mainImage = document.querySelector('.product-main-image');
        
        if (thumbnails.length > 0 && mainImage) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    // Remover clase active de todas las miniaturas
                    thumbnails.forEach(t => t.classList.remove('active'));
                    // Añadir clase active a la miniatura clickeada
                    thumb.classList.add('active');
                    // Aquí normalmente cambiarías la imagen principal
                    this.showNotification('Imagen cambiada', 'info');
                });
            });
        }
    }

    initTableSorting() {
        const sortableHeaders = document.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const sortBy = header.getAttribute('data-sort');
                this.showNotification(`Tabla ordenada por: ${sortBy}`, 'info');
            });
        });
    }

    initPagination() {
        const paginationItems = document.querySelectorAll('.pagination-item:not(.pagination-dots)');
        paginationItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                if (!item.classList.contains('active')) {
                    paginationItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                    this.showNotification('Cambiando de página...', 'info');
                }
            });
        });
    }

    // CHECKOUT MEJORADO
    initCheckout() {
        // Métodos de pago
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                this.selectPaymentMethod(method);
            });
        });

        // Métodos de envío
        const shippingMethods = document.querySelectorAll('.shipping-method');
        shippingMethods.forEach(method => {
            method.addEventListener('click', () => {
                this.selectShippingMethod(method);
            });
        });

        // Formulario de tarjeta
        this.initCardForm();

        // Validación de formulario
        const submitBtn = document.getElementById('submitOrder');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.submitOrder();
            });
        }

        // Código de descuento
        const promoBtn = document.querySelector('.promo-btn');
        if (promoBtn) {
            promoBtn.addEventListener('click', () => {
                this.applyPromoCode();
            });
        }

        // Términos y condiciones
        const termsCheckbox = document.getElementById('acceptTerms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => {
                this.updateSubmitButton();
            });
        }

        // Progreso del checkout
        this.initCheckoutProgress();
    }

    selectPaymentMethod(method) {
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
        
        const methodType = method.getAttribute('data-method');
        this.showNotification(`Método de pago seleccionado: ${methodType}`, 'info');
        
        // Mostrar formulario correspondiente
        const cardForm = document.querySelector('.card-form');
        if (cardForm) {
            if (methodType === 'credit' || methodType === 'debit') {
                cardForm.classList.add('active');
            } else {
                cardForm.classList.remove('active');
            }
        }
    }

    selectShippingMethod(method) {
        const shippingMethods = document.querySelectorAll('.shipping-method');
        shippingMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
        
        const methodName = method.querySelector('.shipping-name').textContent;
        this.showNotification(`Método de envío seleccionado: ${methodName}`, 'info');
    }

    initCardForm() {
        // Formatear número de tarjeta
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let matches = value.match(/\d{4,16}/g);
                let match = matches && matches[0] || '';
                let parts = [];
                
                for (let i = 0; i < match.length; i += 4) {
                    parts.push(match.substring(i, i + 4));
                }
                
                if (parts.length) {
                    e.target.value = parts.join(' ');
                } else {
                    e.target.value = value;
                }
            });
        }

        // Formatear fecha de expiración
        const expiryInput = document.getElementById('cardExpiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                if (value.length >= 2) {
                    e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
            });
        }
    }

    submitOrder() {
        const termsCheckbox = document.getElementById('acceptTerms');
        if (termsCheckbox && !termsCheckbox.checked) {
            this.showNotification('Debes aceptar los términos y condiciones', 'error');
            return;
        }
        
        this.showNotification('Procesando pedido...', 'info');
        setTimeout(() => {
            this.showNotification('¡Pedido realizado con éxito!', 'success');
            // Limpiar carrito después de una compra exitosa
            this.cartItems = [];
            this.saveCart();
        }, 2000);
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        if (promoInput) {
            const code = promoInput.value.trim();
            if (code) {
                this.showNotification(`Código aplicado: ${code}`, 'success');
            } else {
                this.showNotification('Por favor, ingresa un código de descuento', 'warning');
            }
        }
    }

    updateSubmitButton() {
        const termsCheckbox = document.getElementById('acceptTerms');
        const submitBtn = document.getElementById('submitOrder');
        
        if (termsCheckbox && submitBtn) {
            submitBtn.disabled = !termsCheckbox.checked;
        }
    }

    initCheckoutProgress() {
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach(step => {
            step.addEventListener('click', () => {
                if (step.classList.contains('completed')) {
                    this.showNotification('Paso completado', 'info');
                }
            });
        });
    }

    // ANIMACIONES MEJORADAS
    initAnimations() {
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.category-card, .product-card, .feature-card, .product-box, .hero-content');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        const animatedElements = document.querySelectorAll('.category-card, .product-card, .feature-card, .product-box, .hero-content');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
        });

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll();

        // Efectos hover en botones
        const buttons = document.querySelectorAll('.btn, .action-btn, .product-wishlist');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    }

    // SISTEMA DE NOTIFICACIONES MEJORADO
    initNotifications() {
        // Ya está implementado en showNotification
    }

    showNotification(message, type = 'success') {
        // Eliminar notificaciones existentes
        document.querySelectorAll('.notification').forEach(notification => {
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-notification" aria-label="Cerrar notificación">&times;</button>
        `;
        
        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);

        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('active');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // VALIDACIONES DE FORMULARIOS MEJORADAS
    initFormValidations() {
        // Newsletter
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(newsletterForm);
            });
        }

        // Validación en tiempo real
        const formInputs = document.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                input.classList.remove('error');
                input.classList.add('validating');
            });
        });

        // Formulario de contacto en footer
        const contactLinks = document.querySelectorAll('a[href^="mailto"], a[href^="tel"]');
        contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('Redirigiendo a aplicación externa', 'info');
                setTimeout(() => {
                    window.open(link.getAttribute('href'), '_blank');
                }, 1000);
            });
        });
    }

    handleNewsletterSubmit(form) {
        const emailInput = form.querySelector('.newsletter-input');
        const email = emailInput.value.trim();
        
        if (this.validateEmail(email)) {
            this.showNotification('¡Te has suscrito exitosamente!', 'success');
            emailInput.value = '';
        } else {
            this.showNotification('Por favor, ingresa un email válido', 'error');
        }
    }

    validateField(field) {
        const value = field.value.trim();
        
        if (field.type === 'email') {
            if (!this.validateEmail(value)) {
                field.classList.add('error');
                this.showNotification('Por favor, ingresa un email válido', 'error');
                return false;
            }
        }
        
        if (field.hasAttribute('required') && !value) {
            field.classList.add('error');
            this.showNotification('Este campo es obligatorio', 'error');
            return false;
        }
        
        field.classList.remove('error');
        field.classList.remove('validating');
        return true;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // FUNCIONES DE EXPORTACIÓN E IMPRESIÓN
    initExportFunctions() {
        const exportCSVBtn = document.querySelector('.export-btn .fa-file-export')?.closest('.export-btn');
        const printBtn = document.querySelector('.export-btn .fa-print')?.closest('.export-btn');
        
        if (exportCSVBtn) {
            exportCSVBtn.addEventListener('click', () => {
                this.exportToCSV();
            });
        }
        
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.printPage();
            });
        }
    }

    exportToCSV() {
        this.showNotification('Exportando a CSV...', 'info');
        // Simular exportación
        setTimeout(() => {
            this.showNotification('Archivo CSV descargado', 'success');
        }, 1500);
    }

    printPage() {
        window.print();
    }

    // REDES SOCIALES
    initSocialMedia() {
        const socialIcons = document.querySelectorAll('.social-icons a');
        socialIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = icon.querySelector('i').className.split('-')[1];
                this.showNotification(`Redirigiendo a ${platform}`, 'info');
            });
        });
    }

    // MÉTODOS AUXILIARES
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    parsePrice(priceString) {
        return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
    }

    formatPrice(price) {
        return `$${price.toLocaleString()}`;
    }

    getProductVariant(productCard) {
        const colorElement = productCard.querySelector('[data-color]');
        const sizeElement = productCard.querySelector('.variant-option.selected');
        
        let variant = '';
        if (colorElement) {
            variant += `Color: ${colorElement.getAttribute('data-color')}`;
        }
        if (sizeElement) {
            variant += variant ? `, Talla: ${sizeElement.textContent}` : `Talla: ${sizeElement.textContent}`;
        }
        
        return variant || 'Color: Negro, Talla: M';
    }

    buyNow(button) {
        this.addToCart(button);
        setTimeout(() => {
            window.location.href = 'comprar.html';
        }, 1000);
    }

    updateCartPrices() {
        // Actualizar precios en el carrito
        this.showNotification('Cantidad actualizada', 'info');
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        this.updateCartCount();
    }

    saveWishlist() {
        localStorage.setItem('wishlistItems', JSON.stringify(this.wishlistItems));
    }

    showRegisterModal() {
        this.showNotification('Funcionalidad de registro en desarrollo', 'info');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.fashionHub = new FashionHub();
    
    // Asegurar que todos los botones tengan funcionalidad
    document.querySelectorAll('button').forEach(button => {
        if (!button.hasAttribute('data-initialized')) {
            button.setAttribute('data-initialized', 'true');
            if (!button.onclick && button.type !== 'submit') {
                button.addEventListener('click', (e) => {
                    if (!e.defaultPrevented && button.id !== 'submitOrder') {
                        window.fashionHub.showNotification(`Función: ${button.textContent || button.className}`, 'info');
                    }
                });
            }
        }
    });
});
