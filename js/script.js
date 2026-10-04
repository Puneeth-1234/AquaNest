/**
 * AquaNest - Main Application Script
 * Handles navigation, page rendering, live filters, countdown timer,
 * checkout validation, and interactive UI behaviors.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBubbles();
  initCustomerAuthUI();
  
  // Page Specific Router
  if (document.getElementById('home-page-marker')) {
    initHomePage();
  }
  if (document.getElementById('shop-page-marker')) {
    initShopPage();
  }
  if (document.getElementById('product-page-marker')) {
    initProductDetailPage();
  }
  if (document.getElementById('cart-page-marker')) {
    initCartPage();
  }
  if (document.getElementById('checkout-page-marker')) {
    initCheckoutPage();
  }
  if (document.getElementById('contact-page-marker')) {
    initContactPage();
  }

  initGlobalNewsletter();
  initGlobalEventListeners();
});

/* ==========================================================================
   Navigation & Mobile Menu
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  // Sticky blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && mobileDrawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.classList.toggle('open');
      mobileDrawer.classList.toggle('open', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on link click
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('open');
        mobileDrawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active link highlighter
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   Hero Aquatic Bubbles Generator
   ========================================================================== */
function initBubbles() {
  const bubbleContainer = document.querySelector('.bubble-bg');
  if (!bubbleContainer) return;

  const bubbleCount = 18;
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = Math.floor(Math.random() * 28) + 12; // 12px to 40px
    const left = Math.random() * 100;
    const duration = Math.random() * 8 + 6; // 6s to 14s
    const delay = Math.random() * 6;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;

    bubbleContainer.appendChild(bubble);
  }
}

/* ==========================================================================
   Global Product Card Renderer
   ========================================================================== */
function renderProductCard(product) {
  const isWish = typeof isInWishlist === 'function' && isInWishlist(product.id);
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const oldPriceHtml = product.oldPrice 
    ? `<span class="product-old-price">${formatCurrency(product.oldPrice)}</span>` 
    : '';
  
  let badgeHtml = '';
  if (isOutOfStock) {
    badgeHtml += `<span class="badge badge-stockout">Sold Out</span>`;
  } else {
    if (product.discountBadge) {
      badgeHtml += `<span class="badge badge-discount">${product.discountBadge}</span>`;
    }
    if (product.isBestSeller) {
      badgeHtml += `<span class="badge badge-bestseller">Bestseller</span>`;
    } else if (product.isTrending) {
      badgeHtml += `<span class="badge badge-trending">Trending</span>`;
    }
  }

  const cartBtnHtml = isOutOfStock
    ? `<button class="add-cart-btn disabled" disabled title="Currently out of stock">
         Sold Out
       </button>`
    : `<button class="add-cart-btn" data-action="add-to-cart" data-product-id="${product.id}">
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <circle cx="9" cy="21" r="1"></circle>
           <circle cx="20" cy="21" r="1"></circle>
           <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
         </svg>
         Add
       </button>`;

  return `
    <article class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
      <div class="product-thumb">
        <div class="product-badges">${badgeHtml}</div>
        <button class="product-wishlist-btn ${isWish ? 'active' : ''}" 
                data-action="toggle-wishlist" 
                data-wishlist-id="${product.id}"
                title="${isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                aria-label="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWish ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" 
               alt="${product.name}" 
               loading="lazy"
               onerror="handleProductImageError(this, '${product.name}', '${product.category}', '${product.fallbackColor}')">
        </a>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-rating">
          <span class="stars">★★★★★</span>
          <span class="rating-count">(${product.reviewsCount})</span>
        </div>
        <p class="product-desc">${product.shortDescription}</p>
        <div class="product-footer">
          <div class="product-price-box">
            <span class="product-price">${formatCurrency(product.price)}</span>
            ${oldPriceHtml}
          </div>
          ${cartBtnHtml}
        </div>
      </div>
    </article>
  `;
}

/* ==========================================================================
   Home Page Logic
   ========================================================================== */
function initHomePage() {
  // 1. Render Featured Categories
  const catGrid = document.getElementById('featured-categories-grid');
  if (catGrid && typeof AQUANEST_CATEGORIES !== 'undefined') {
    catGrid.innerHTML = AQUANEST_CATEGORIES.map(cat => `
      <a href="shop.html?category=${cat.slug}" class="category-card">
        <div class="category-img-box">
          <img src="${cat.image}" alt="${cat.name}" loading="lazy" onerror="handleProductImageError(this, '${cat.name}', 'Category', '${cat.color}')">
        </div>
        <h3 class="category-title">${cat.name}</h3>
        <span class="category-count">${cat.speciesCount}</span>
      </a>
    `).join('');
  }

  function renderFeaturedSections() {
    // 2. Render Trending Fish
    const trendingGrid = document.getElementById('trending-fish-grid');
    if (trendingGrid && typeof getTrendingProducts === 'function') {
      const trending = getTrendingProducts().slice(0, 4);
      trendingGrid.innerHTML = trending.map(renderProductCard).join('');
    }

    // 3. Render Best Sellers
    const bestSellersGrid = document.getElementById('bestsellers-grid');
    if (bestSellersGrid && typeof getBestSellerProducts === 'function') {
      const bestSellers = getBestSellerProducts().slice(0, 4);
      bestSellersGrid.innerHTML = bestSellers.map(renderProductCard).join('');
    }
  }

  renderFeaturedSections();
  window.addEventListener('aquanest:productsLoaded', renderFeaturedSections);

  // 4. Special Offer Countdown Timer
  initOfferCountdown();
}

function initOfferCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Set target date 3 days from now or fixed recurring window
  let target = new Date();
  target.setDate(target.getDate() + 3);
  target.setHours(target.getHours() + 14);

  function update() {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      target = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   Shop Page Logic (Filters, Search, Sort & Mobile Drawer)
   ========================================================================== */
function initShopPage() {
  const productsGrid = document.getElementById('shop-products-grid');
  let allProducts = getAllProducts();

  // Desktop Controls
  const searchInput = document.getElementById('shop-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const categoryFilters = document.querySelectorAll('.category-filter-btn');
  const priceSlider = document.getElementById('price-range-slider');
  const maxPriceDisplay = document.getElementById('max-price-display');
  const inStockCheckbox = document.getElementById('instock-checkbox');
  const sortSelect = document.getElementById('shop-sort-select');
  const resultsCountEl = document.getElementById('results-count');
  const clearAllFiltersBtn = document.getElementById('clear-all-filters-btn');
  const sidebarResetBtn = document.getElementById('sidebar-reset-btn');

  // Mobile Controls & Drawer
  const openDrawerBtn = document.getElementById('open-filter-drawer-btn');
  const closeDrawerBtn = document.getElementById('close-filter-drawer-btn');
  const drawerBackdrop = document.getElementById('mobile-filter-backdrop');
  const filterDrawer = document.getElementById('mobile-filter-drawer');
  const mobileFilterBadge = document.getElementById('mobile-filter-badge');
  const mobileCatPills = document.querySelectorAll('.mobile-cat-pill');
  const mobileDrawerCatsContainer = document.getElementById('mobile-drawer-categories');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  const mobileSearchClearBtn = document.getElementById('mobile-search-clear-btn');
  const mobileInStockCheckbox = document.getElementById('mobile-instock-checkbox');
  const mobilePriceSlider = document.getElementById('mobile-price-slider');
  const mobileMaxPriceDisplay = document.getElementById('mobile-max-price-display');
  const mobileSortSelect = document.getElementById('mobile-sort-select');
  const mobileDrawerResetBtn = document.getElementById('mobile-drawer-reset-btn');
  const mobileDrawerApplyBtn = document.getElementById('mobile-drawer-apply-btn');

  // Active Chips & Presets
  const activeFiltersBar = document.getElementById('active-filters-bar');
  const activeFilterChips = document.getElementById('active-filter-chips');
  const chipsClearAllBtn = document.getElementById('chips-clear-all-btn');
  const pricePresetBtns = document.querySelectorAll('.price-preset-btn');

  // State Management
  const params = new URLSearchParams(window.location.search);
  let isWishlistView = params.get('wishlist') === 'true';
  let activeCategory = params.get('category') || 'all';
  let searchQuery = params.get('search') || '';
  let minPrice = 0;
  let maxPrice = 2500;
  let inStockOnly = false;
  let sortBy = 'featured';
  let activePricePreset = 'all';

  // Category mapping
  const categoryNames = {
    'all': 'All Species',
    'koi-fish': 'Koi Fish',
    'goldfish': 'Goldfish',
    'guppy': 'Guppy',
    'betta': 'Betta',
    'molly': 'Molly',
    'angelfish': 'Angelfish',
    'tetra': 'Tetra'
  };

  // Populate dynamic category list in mobile drawer
  function populateDrawerCategories() {
    if (mobileDrawerCatsContainer) {
      mobileDrawerCatsContainer.innerHTML = Object.entries(categoryNames).map(([slug, name]) => {
        const count = slug === 'all' 
          ? allProducts.length 
          : allProducts.filter(p => p.categorySlug === slug).length;
        return `
          <button type="button" class="filter-pill-btn mobile-drawer-cat-btn ${slug === activeCategory ? 'active' : ''}" data-category="${slug}">
            <span>${name}</span>
            <span class="filter-count">${count}</span>
          </button>
        `;
      }).join('');
    }
  }
  populateDrawerCategories();

  // Update product counts across sidebar and badges
  function updateCounts() {
    // In-stock counts
    const inStockTotal = allProducts.filter(p => p.stock === undefined || p.stock > 0).length;
    const inStockCountEl = document.getElementById('instock-count');
    const mobileInStockCountEl = document.getElementById('mobile-instock-count');
    if (inStockCountEl) inStockCountEl.textContent = inStockTotal;
    if (mobileInStockCountEl) mobileInStockCountEl.textContent = inStockTotal;

    // Category counts
    Object.keys(categoryNames).forEach(slug => {
      const count = slug === 'all' 
        ? allProducts.length 
        : allProducts.filter(p => p.categorySlug === slug).length;
      const el = document.getElementById(`count-${slug}`);
      if (el) el.textContent = count;
    });
  }
  updateCounts();

  // Synchronize controls with state
  function syncControlUI() {
    // Search inputs & clear buttons
    if (searchInput) {
      searchInput.value = searchQuery;
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery ? 'flex' : 'none';
      }
    }
    if (mobileSearchInput) {
      mobileSearchInput.value = searchQuery;
      if (mobileSearchClearBtn) {
        mobileSearchClearBtn.style.display = searchQuery ? 'flex' : 'none';
      }
    }

    // Category buttons
    categoryFilters.forEach(btn => {
      const cat = btn.getAttribute('data-category');
      btn.classList.toggle('active', !isWishlistView && cat === activeCategory);
    });

    mobileCatPills.forEach(btn => {
      const cat = btn.getAttribute('data-category');
      btn.classList.toggle('active', !isWishlistView && cat === activeCategory);
    });

    document.querySelectorAll('.mobile-drawer-cat-btn').forEach(btn => {
      const cat = btn.getAttribute('data-category');
      btn.classList.toggle('active', !isWishlistView && cat === activeCategory);
    });

    // In-stock checkboxes
    if (inStockCheckbox) inStockCheckbox.checked = inStockOnly;
    if (mobileInStockCheckbox) mobileInStockCheckbox.checked = inStockOnly;

    // Price sliders & displays
    if (priceSlider) priceSlider.value = maxPrice;
    if (mobilePriceSlider) mobilePriceSlider.value = maxPrice;
    const formattedMax = formatCurrency(maxPrice);
    if (maxPriceDisplay) maxPriceDisplay.textContent = formattedMax;
    if (mobileMaxPriceDisplay) mobileMaxPriceDisplay.textContent = formattedMax;

    // Price preset buttons
    pricePresetBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-preset') === activePricePreset);
    });

    // Sort selects
    if (sortSelect) sortSelect.value = sortBy;
    if (mobileSortSelect) mobileSortSelect.value = sortBy;
  }

  // Render Active Filters Chips
  function renderActiveFilterChips() {
    if (!activeFiltersBar || !activeFilterChips) return;

    const chips = [];

    // Search chip
    if (searchQuery.trim()) {
      chips.push({
        id: 'search',
        label: `Search: "${searchQuery}"`
      });
    }

    // Category chip
    if (!isWishlistView && activeCategory !== 'all') {
      const catLabel = categoryNames[activeCategory] || activeCategory;
      chips.push({
        id: 'category',
        label: `Category: ${catLabel}`
      });
    }

    // Wishlist view chip
    if (isWishlistView) {
      chips.push({
        id: 'wishlist',
        label: 'My Saved Wishlist'
      });
    }

    // In-stock chip
    if (inStockOnly) {
      chips.push({
        id: 'instock',
        label: 'In Stock Only'
      });
    }

    // Price filter chip
    if (activePricePreset !== 'all' || maxPrice < 2500 || minPrice > 0) {
      let priceText = '';
      if (minPrice > 0 && maxPrice < 2500) {
        priceText = `Price: ${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`;
      } else if (minPrice > 0) {
        priceText = `Price: ≥ ${formatCurrency(minPrice)}`;
      } else {
        priceText = `Price: ≤ ${formatCurrency(maxPrice)}`;
      }
      chips.push({
        id: 'price',
        label: priceText
      });
    }

    // Update Mobile Filter Badge
    if (mobileFilterBadge) {
      if (chips.length > 0) {
        mobileFilterBadge.textContent = chips.length;
        mobileFilterBadge.style.display = 'inline-block';
      } else {
        mobileFilterBadge.style.display = 'none';
      }
    }

    // Render chips or hide bar
    if (chips.length > 0) {
      activeFiltersBar.style.display = 'flex';
      activeFilterChips.innerHTML = chips.map(c => `
        <span class="active-chip">
          <span>${c.label}</span>
          <button type="button" class="active-chip-remove" data-remove="${c.id}" aria-label="Remove filter: ${c.label}">&times;</button>
        </span>
      `).join('');

      // Wire remove button clicks
      activeFilterChips.querySelectorAll('.active-chip-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const type = e.currentTarget.getAttribute('data-remove');
          removeSingleFilter(type);
        });
      });
    } else {
      activeFiltersBar.style.display = 'none';
      activeFilterChips.innerHTML = '';
    }
  }

  // Remove individual filter
  function removeSingleFilter(type) {
    if (type === 'search') {
      searchQuery = '';
    } else if (type === 'category') {
      activeCategory = 'all';
    } else if (type === 'wishlist') {
      isWishlistView = false;
      activeCategory = 'all';
    } else if (type === 'instock') {
      inStockOnly = false;
    } else if (type === 'price') {
      minPrice = 0;
      maxPrice = 2500;
      activePricePreset = 'all';
    }
    syncControlUI();
    applyFiltersAndRender();
  }

  // Reset all filters to default
  function resetAllFilters() {
    isWishlistView = false;
    activeCategory = 'all';
    searchQuery = '';
    minPrice = 0;
    maxPrice = 2500;
    inStockOnly = false;
    sortBy = 'featured';
    activePricePreset = 'all';

    // Clear URL query parameters for clean state
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    syncControlUI();
    applyFiltersAndRender();
  }

  // Main filter, sort & render pipeline
  function applyFiltersAndRender() {
    let list = [...allProducts];

    // 0. Wishlist filter
    if (isWishlistView) {
      const wishIds = typeof getWishlist === 'function' ? getWishlist() : [];
      list = list.filter(p => wishIds.includes(p.id));
    }

    // 1. Category Filter
    if (!isWishlistView && activeCategory !== 'all') {
      const slug = activeCategory.toLowerCase();
      list = list.filter(p => p.categorySlug === slug || p.category.toLowerCase() === slug);
    }

    // 2. Search Filter (multi-property search)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.shortDescription.toLowerCase().includes(q) ||
        (p.specs && p.specs.scientificName && p.specs.scientificName.toLowerCase().includes(q))
      );
    }

    // 3. In-Stock Filter
    if (inStockOnly) {
      list = list.filter(p => p.stock === undefined || p.stock > 0);
    }

    // 4. Price Filter
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // 5. Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popularity') {
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Update Result count
    if (resultsCountEl) {
      if (isWishlistView) {
        resultsCountEl.innerHTML = `Showing <strong>${list.length}</strong> saved wishlist fishes`;
      } else {
        resultsCountEl.innerHTML = `Showing <strong>${list.length}</strong> of <strong>${allProducts.length}</strong> fishes`;
      }
    }

    // Render active chips
    renderActiveFilterChips();

    // Render items or empty state
    if (list.length === 0) {
      const emptyTitle = isWishlistView ? "Your wishlist is empty" : "No fishes found";
      const emptyDesc = isWishlistView 
        ? "You haven't saved any fish yet. Tap the heart icon on any card to save it!" 
        : "We couldn't find any aquatic fish matching your selected filters. Try broadening your criteria.";

      productsGrid.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3 class="empty-state-title">${emptyTitle}</h3>
          <p class="empty-state-desc">${emptyDesc}</p>
          <button type="button" class="btn btn-outline" id="reset-filters-btn">Browse All Fish</button>
        </div>
      `;
      document.getElementById('reset-filters-btn')?.addEventListener('click', resetAllFilters);
    } else {
      productsGrid.innerHTML = list.map(renderProductCard).join('');
    }
  }

  // --- EVENT LISTENERS ---

  // 1. Search Inputs (desktop & mobile)
  function handleSearchInput(e) {
    searchQuery = e.target.value;
    syncControlUI();
    applyFiltersAndRender();
  }
  if (searchInput) searchInput.addEventListener('input', handleSearchInput);
  if (mobileSearchInput) mobileSearchInput.addEventListener('input', handleSearchInput);

  // Search clear buttons
  function handleSearchClear() {
    searchQuery = '';
    syncControlUI();
    applyFiltersAndRender();
    if (searchInput) searchInput.focus();
  }
  if (searchClearBtn) searchClearBtn.addEventListener('click', handleSearchClear);
  if (mobileSearchClearBtn) mobileSearchClearBtn.addEventListener('click', handleSearchClear);

  // 2. Category selection handler
  function handleCategorySelect(catSlug) {
    isWishlistView = false;
    activeCategory = catSlug;
    syncControlUI();
    applyFiltersAndRender();
  }

  // Desktop sidebar category buttons
  categoryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') || 'all';
      handleCategorySelect(cat);
    });
  });

  // Mobile quick pills
  mobileCatPills.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') || 'all';
      handleCategorySelect(cat);
    });
  });

  // Mobile drawer category list
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.mobile-drawer-cat-btn');
    if (btn) {
      const cat = btn.getAttribute('data-category') || 'all';
      handleCategorySelect(cat);
    }
  });

  // 3. In-Stock checkboxes
  function handleInStockToggle(e) {
    inStockOnly = e.target.checked;
    syncControlUI();
    applyFiltersAndRender();
  }
  if (inStockCheckbox) inStockCheckbox.addEventListener('change', handleInStockToggle);
  if (mobileInStockCheckbox) mobileInStockCheckbox.addEventListener('change', handleInStockToggle);

  // 4. Price slider input
  function handlePriceSlider(e) {
    maxPrice = parseInt(e.target.value, 10);
    minPrice = 0;
    activePricePreset = 'custom';
    syncControlUI();
    applyFiltersAndRender();
  }
  if (priceSlider) priceSlider.addEventListener('input', handlePriceSlider);
  if (mobilePriceSlider) mobilePriceSlider.addEventListener('input', handlePriceSlider);

  // 5. Price Preset Buttons
  pricePresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      activePricePreset = preset;

      if (preset === 'all') {
        minPrice = 0;
        maxPrice = 2500;
      } else if (preset === 'under-500') {
        minPrice = 0;
        maxPrice = 500;
      } else if (preset === '500-1000') {
        minPrice = 500;
        maxPrice = 1000;
      } else if (preset === 'over-1000') {
        minPrice = 1000;
        maxPrice = 2500;
      }

      syncControlUI();
      applyFiltersAndRender();
    });
  });

  // 6. Sort Select
  function handleSortChange(e) {
    sortBy = e.target.value;
    syncControlUI();
    applyFiltersAndRender();
  }
  if (sortSelect) sortSelect.addEventListener('change', handleSortChange);
  if (mobileSortSelect) mobileSortSelect.addEventListener('change', handleSortChange);

  // 7. Clear All Buttons
  if (clearAllFiltersBtn) clearAllFiltersBtn.addEventListener('click', resetAllFilters);
  if (sidebarResetBtn) sidebarResetBtn.addEventListener('click', resetAllFilters);
  if (chipsClearAllBtn) chipsClearAllBtn.addEventListener('click', resetAllFilters);
  if (mobileDrawerResetBtn) mobileDrawerResetBtn.addEventListener('click', resetAllFilters);

  // 8. Mobile Drawer Open / Close
  function openFilterDrawer() {
    if (filterDrawer && drawerBackdrop) {
      filterDrawer.classList.add('active');
      drawerBackdrop.classList.add('active');
      filterDrawer.setAttribute('aria-hidden', 'false');
      drawerBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeFilterDrawer() {
    if (filterDrawer && drawerBackdrop) {
      filterDrawer.classList.remove('active');
      drawerBackdrop.classList.remove('active');
      filterDrawer.setAttribute('aria-hidden', 'true');
      drawerBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openFilterDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeFilterDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeFilterDrawer);
  if (mobileDrawerApplyBtn) mobileDrawerApplyBtn.addEventListener('click', closeFilterDrawer);

  // Initial sync & render
  syncControlUI();
  applyFiltersAndRender();

  // Async Live API Loader from Express & MongoDB
  async function loadLiveProductsFromAPI() {
    if (window.AquaNestAPI) {
      try {
        const live = await window.AquaNestAPI.getProducts();
        if (Array.isArray(live) && live.length > 0) {
          allProducts = live;
          populateDrawerCategories();
          updateCounts();
          applyFiltersAndRender();
        }
      } catch (err) {
        console.warn('Backend load error:', err);
        if (allProducts.length === 0 && productsGrid) {
          productsGrid.innerHTML = `
            <div class="api-error-card">
              <div style="font-size: 1.05rem; font-weight: 700; color: var(--coral-400); margin-bottom: 0.5rem;">
                Unable to connect to AquaNest server. Please try again.
              </div>
              <p style="color: var(--slate-300); font-size: 0.88rem; margin-bottom: 1rem;">
                Could not retrieve verified species from the live database. Please ensure backend is running.
              </p>
              <button class="btn btn-secondary btn-sm" onclick="location.reload()">Retry Connection</button>
            </div>
          `;
        }
      }
    }
  }

  loadLiveProductsFromAPI();
}

/* ==========================================================================

/* ==========================================================================
   Product Detail Page Logic
   ========================================================================== */
async function initProductDetailPage() {
  if (typeof getProductById !== 'function' || typeof getAllProducts !== 'function') return;

  const allProducts = getAllProducts();
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id') || 'koi-kohaku';

  let product = null;
  if (window.AquaNestAPI) {
    try {
      product = await window.AquaNestAPI.getProductById(productId);
    } catch (err) {
      console.warn('API error fetching product details:', err);
    }
  }
  if (!product) {
    product = getProductById(productId) || allProducts[0];
  }

  if (!product) return;

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  // 1. Title & Page Metadata
  document.title = `${product.name} | Premium Aquarium Livestock | AquaNest`;

  // 2. Breadcrumbs (Home > Shop > Category > Product Name)
  const breadcrumbCat = document.getElementById('detail-breadcrumb-cat');
  const breadcrumbProduct = document.getElementById('detail-breadcrumb-name');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = product.category;
    breadcrumbCat.setAttribute('href', `shop.html?category=${product.categorySlug}`);
  }
  if (breadcrumbProduct) {
    breadcrumbProduct.textContent = product.name;
  }

  // 3. Image & Visual Badges
  const imgEl = document.getElementById('detail-product-img');
  if (imgEl) {
    imgEl.src = product.image;
    imgEl.alt = `${product.name} - ${product.category}`;
    imgEl.onerror = () => handleProductImageError(imgEl, product.name, product.category, product.fallbackColor);
  }

  // Badges over main image
  const imgDiscountBadge = document.getElementById('detail-discount-badge');
  const imgTagBadge = document.getElementById('detail-tag-badge');
  const imgStockoutBadge = document.getElementById('detail-stockout-badge');

  if (imgStockoutBadge) {
    imgStockoutBadge.style.display = isOutOfStock ? 'inline-block' : 'none';
  }

  if (imgDiscountBadge) {
    if (!isOutOfStock && product.discountBadge) {
      imgDiscountBadge.textContent = product.discountBadge;
      imgDiscountBadge.style.display = 'inline-block';
    } else {
      imgDiscountBadge.style.display = 'none';
    }
  }

  if (imgTagBadge) {
    if (!isOutOfStock) {
      if (product.isBestSeller) {
        imgTagBadge.textContent = 'Bestseller';
        imgTagBadge.className = 'badge badge-bestseller';
        imgTagBadge.style.display = 'inline-block';
      } else if (product.isTrending) {
        imgTagBadge.textContent = 'Trending';
        imgTagBadge.className = 'badge badge-trending';
        imgTagBadge.style.display = 'inline-block';
      } else {
        imgTagBadge.style.display = 'none';
      }
    } else {
      imgTagBadge.style.display = 'none';
    }
  }

  // 4. Header Details: Name, Category, Scientific, Rating & Reviews
  const nameEl = document.getElementById('detail-name');
  if (nameEl) nameEl.textContent = product.name;

  const catEl = document.getElementById('detail-category');
  if (catEl) {
    catEl.textContent = product.category;
    catEl.setAttribute('href', `shop.html?category=${product.categorySlug}`);
  }

  const sciEl = document.getElementById('detail-scientific');
  if (sciEl && product.specs) {
    sciEl.textContent = product.specs.scientificName || '';
  }

  const ratingNumEl = document.getElementById('detail-rating-num');
  if (ratingNumEl) ratingNumEl.textContent = Number(product.rating || 5.0).toFixed(1);

  const reviewsEl = document.getElementById('detail-reviews-count');
  if (reviewsEl) reviewsEl.textContent = `(${product.reviewsCount || 40} verified reviews)`;

  // 5. Stock Status Indicator
  const stockStatusEl = document.getElementById('detail-stock-status');
  const stockTextEl = document.getElementById('detail-stock-text');
  const stockHintEl = document.getElementById('detail-stock-count-hint');

  if (stockStatusEl && stockTextEl) {
    if (isOutOfStock) {
      stockStatusEl.className = 'stock-status out-of-stock';
      stockTextEl.textContent = 'Out of Stock / Sold Out';
      if (stockHintEl) stockHintEl.textContent = 'Currently unavailable for dispatch';
    } else {
      stockStatusEl.className = 'stock-status in-stock';
      stockTextEl.textContent = `In Stock (${product.stock} available & ready to ship)`;
      if (stockHintEl) stockHintEl.textContent = `${product.stock} fish remaining in current batch`;
    }
  }

  // 6. Pricing & Discount Calculations
  const priceEl = document.getElementById('detail-price');
  if (priceEl) priceEl.textContent = formatCurrency(product.price);

  const oldPriceEl = document.getElementById('detail-old-price');
  const priceDiscountTag = document.getElementById('detail-price-discount-tag');

  if (oldPriceEl) {
    if (product.oldPrice && product.oldPrice > product.price) {
      oldPriceEl.textContent = formatCurrency(product.oldPrice);
      oldPriceEl.style.display = 'inline-block';
      if (priceDiscountTag) {
        const discountPct = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
        priceDiscountTag.textContent = `Save ${discountPct}%`;
        priceDiscountTag.style.display = 'inline-block';
      }
    } else {
      oldPriceEl.style.display = 'none';
      if (priceDiscountTag) priceDiscountTag.style.display = 'none';
    }
  }

  // 7. Short Description & Full Description
  const shortDescEl = document.getElementById('detail-short-description');
  if (shortDescEl) {
    shortDescEl.textContent = product.shortDescription;
  }

  const fullDescEl = document.getElementById('detail-full-description');
  if (fullDescEl) {
    fullDescEl.textContent = product.fullDescription;
  }

  // 8. Aquarium Care Information Specs
  const defaultLifespans = {
    'koi-fish': '25 – 35+ Years',
    'goldfish': '10 – 15 Years',
    'guppy': '2 – 3 Years',
    'betta': '3 – 5 Years',
    'molly': '3 – 5 Years',
    'angelfish': '10 – 12 Years',
    'tetra': '5 – 8 Years'
  };

  const lifespanVal = (product.specs && product.specs.lifespan) 
    || defaultLifespans[product.categorySlug] 
    || '3 – 5 Years';

  if (product.specs) {
    const specsMap = {
      'spec-tank': product.specs.minTankSize,
      'spec-temp': product.specs.temperature,
      'spec-ph': product.specs.phRange,
      'spec-care': product.specs.careLevel,
      'spec-diet': product.specs.diet,
      'spec-size': product.specs.adultSize,
      'spec-lifespan': lifespanVal,
      'spec-temperament': product.specs.temperament
    };

    Object.entries(specsMap).forEach(([elId, val]) => {
      const el = document.getElementById(elId);
      if (el && val) el.textContent = val;
    });
  }

  // 9. Quantity Selector Controls
  const qtyInput = document.getElementById('detail-qty-input');
  const btnDec = document.getElementById('detail-qty-decrease');
  const btnInc = document.getElementById('detail-qty-increase');
  const maxAvailable = isOutOfStock ? 0 : (product.stock || 20);

  if (qtyInput) {
    qtyInput.value = isOutOfStock ? '0' : '1';
    qtyInput.max = maxAvailable;
  }

  if (btnDec && qtyInput) {
    btnDec.disabled = isOutOfStock;
    btnDec.onclick = () => {
      if (isOutOfStock) return;
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) qtyInput.value = val - 1;
    };
  }

  if (btnInc && qtyInput) {
    btnInc.disabled = isOutOfStock;
    btnInc.onclick = () => {
      if (isOutOfStock) return;
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val < maxAvailable) qtyInput.value = val + 1;
    };
  }

  // 10. Purchase Buttons: Add to Cart, Buy Now, Wishlist
  const addBtn = document.getElementById('detail-add-cart-btn');
  const buyNowBtn = document.getElementById('detail-buy-now-btn');

  if (addBtn) {
    addBtn.disabled = isOutOfStock;
    if (isOutOfStock) {
      addBtn.innerHTML = '<span>Sold Out</span>';
      addBtn.classList.add('disabled');
    } else {
      addBtn.classList.remove('disabled');
      addBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span>Add to Cart</span>
      `;
      addBtn.onclick = () => {
        const qty = parseInt(qtyInput?.value, 10) || 1;
        addToCart(product.id, qty, true);
      };
    }
  }

  if (buyNowBtn) {
    buyNowBtn.disabled = isOutOfStock;
    if (isOutOfStock) {
      buyNowBtn.innerHTML = '<span>Out of Stock</span>';
      buyNowBtn.classList.add('disabled');
    } else {
      buyNowBtn.classList.remove('disabled');
      buyNowBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        <span>Buy Now</span>
      `;
      buyNowBtn.onclick = () => {
        const qty = parseInt(qtyInput?.value, 10) || 1;
        addToCart(product.id, qty, false);
        window.location.href = 'checkout.html';
      };
    }
  }

  // Wishlist Button
  const wishBtn = document.getElementById('detail-wishlist-btn');
  if (wishBtn) {
    const isWish = typeof isInWishlist === 'function' && isInWishlist(product.id);
    wishBtn.classList.toggle('active', isWish);
    wishBtn.onclick = () => {
      if (typeof toggleWishlist === 'function') {
        const nowAdded = toggleWishlist(product.id, true);
        wishBtn.classList.toggle('active', nowAdded);
      }
    };
  }

  // 11. "You May Also Like" Related Products (Same category, filled with compatible species)
  const relatedGrid = document.getElementById('related-products-grid');
  if (relatedGrid) {
    // Primary: products in same category
    let related = allProducts.filter(p => p.id !== product.id && p.categorySlug === product.categorySlug);

    // If fewer than 4 items, add compatible fish from other categories
    if (related.length < 4) {
      const otherPool = allProducts.filter(p => p.id !== product.id && p.categorySlug !== product.categorySlug);
      related = [...related, ...otherPool].slice(0, 4);
    } else {
      related = related.slice(0, 4);
    }

    relatedGrid.innerHTML = related.map(renderProductCard).join('');
  }
}

/* ==========================================================================
   Cart Page Logic
   ========================================================================== */
function initCartPage() {
  const container = document.getElementById('cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const discountRow = document.getElementById('cart-discount-row');
  const discountAmountEl = document.getElementById('cart-discount-amount');
  const grandTotalEl = document.getElementById('cart-grand-total');
  const couponInput = document.getElementById('cart-coupon-input');
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const freeShipTrack = document.getElementById('free-shipping-progress');
  const freeShipText = document.getElementById('free-shipping-text');
  const emptyCartState = document.getElementById('empty-cart-message');
  const cartContent = document.getElementById('cart-content-wrapper');

  function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
      if (emptyCartState) emptyCartState.style.display = 'block';
      if (cartContent) cartContent.style.display = 'none';
      return;
    }

    if (emptyCartState) emptyCartState.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';

    // Render Rows
    if (container) {
      container.innerHTML = cart.map(item => {
        const product = typeof getProductById === 'function' ? getProductById(item.id) : null;
        const maxStock = product && product.stock !== undefined ? product.stock : 99;
        const isMinQty = (item.quantity || 1) <= 1;
        const isMaxQty = (item.quantity || 1) >= maxStock;

        return `
        <div class="cart-item-row" data-cart-id="${item.id}">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="handleProductImageError(this, '${item.name}', '${item.category}', '#0077b6')">
          </div>
          <div class="cart-item-details">
            <h4 class="cart-item-title"><a href="product.html?id=${item.id}">${item.name}</a></h4>
            <span class="cart-item-cat">${item.category}</span>
            <span class="cart-item-price">${formatCurrency(item.price)} each</span>
          </div>
          <div class="qty-control">
            <button class="qty-btn" data-action="cart-qty-dec" data-id="${item.id}" aria-label="Decrease quantity" ${isMinQty ? 'disabled style="opacity:0.35; cursor:not-allowed;"' : ''}>&minus;</button>
            <input type="text" class="qty-input" value="${item.quantity}" readonly aria-label="Quantity for ${item.name}">
            <button class="qty-btn" data-action="cart-qty-inc" data-id="${item.id}" aria-label="Increase quantity" ${isMaxQty ? 'disabled style="opacity:0.35; cursor:not-allowed;"' : ''}>&plus;</button>
          </div>
          <div class="cart-item-total">
            ${formatCurrency(item.price * item.quantity)}
          </div>
          <button class="cart-remove-btn" data-action="cart-remove" data-id="${item.id}" title="Remove ${item.name} from cart" aria-label="Remove item">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `;
      }).join('');
    }

    // Calculate totals
    const totals = getCartTotals();

    if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
    if (shippingEl) {
      shippingEl.textContent = totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping);
      if (totals.shipping === 0) shippingEl.style.color = 'var(--emerald-400)';
      else shippingEl.style.color = '';
    }

    if (discountRow && discountAmountEl) {
      if (totals.discountAmount > 0) {
        discountRow.style.display = 'flex';
        discountAmountEl.textContent = `-${formatCurrency(totals.discountAmount)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (grandTotalEl) grandTotalEl.textContent = formatCurrency(totals.total);

    // Free Shipping Progress calculation (threshold ₹999)
    if (freeShipTrack && freeShipText) {
      const threshold = 999;
      if (totals.subtotal >= threshold) {
        freeShipTrack.style.width = '100%';
        freeShipText.innerHTML = '🎉 You have unlocked <strong>FREE Express Live Fish Shipping!</strong>';
      } else {
        const remaining = threshold - totals.subtotal;
        const pct = Math.min(100, Math.round((totals.subtotal / threshold) * 100));
        freeShipTrack.style.width = `${pct}%`;
        freeShipText.innerHTML = `Add <strong>${formatCurrency(remaining)}</strong> more to get <strong>FREE Shipping!</strong>`;
      }
    }
  }

  // Quantity and delete listeners
  if (container) {
    container.addEventListener('click', (e) => {
      const decBtn = e.target.closest('[data-action="cart-qty-dec"]');
      const incBtn = e.target.closest('[data-action="cart-qty-inc"]');
      const removeBtn = e.target.closest('[data-action="cart-remove"]');

      if (decBtn) {
        const id = decBtn.getAttribute('data-id');
        const cart = getCart();
        const item = cart.find(i => i.id === id);
        if (item && item.quantity > 1) {
          updateCartQuantity(id, item.quantity - 1);
          renderCart();
        }
      }

      if (incBtn) {
        const id = incBtn.getAttribute('data-id');
        const cart = getCart();
        const item = cart.find(i => i.id === id);
        const product = typeof getProductById === 'function' ? getProductById(id) : null;
        const maxStock = product && product.stock !== undefined ? product.stock : 99;

        if (item) {
          if (item.quantity < maxStock) {
            updateCartQuantity(id, item.quantity + 1);
            renderCart();
          } else {
            showToast('Stock Limit Reached', `Maximum ${maxStock} units available for ${item.name}.`, 'warning');
          }
        }
      }

      if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        removeFromCart(id);
        renderCart();
      }
    });
  }

  // Clear Cart Button
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) return;
      if (confirm('Are you sure you want to clear all items from your cart?')) {
        clearCart();
        showToast('Cart Cleared', 'All fish specimens removed from your cart.', 'info');
        renderCart();
      }
    });
  }

  // Apply Coupon
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const code = couponInput.value;
      const res = applyPromoCode(code);
      if (res.success) {
        showToast('Coupon Applied', res.message, 'success');
        couponInput.value = '';
        renderCart();
      } else {
        showToast('Coupon Error', res.message, 'warning');
      }
    });
  }

  renderCart();

  // Listen for storage / cartUpdated
  window.addEventListener('aquanest:cartUpdated', renderCart);
}

/* ==========================================================================
   Checkout Page Logic (Validation & Order Confirmation)
   ========================================================================== */
function initCheckoutPage() {
  const form = document.getElementById('checkout-form');
  const checkoutMainView = document.getElementById('checkout-main-view');
  const checkoutEmptyNotice = document.getElementById('checkout-empty-notice');
  const checkoutContentGrid = document.getElementById('checkout-content-grid');
  const itemsContainer = document.getElementById('checkout-items-list');
  const itemsCountBadge = document.getElementById('checkout-items-count-badge');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const shippingEl = document.getElementById('checkout-shipping');
  const discountRow = document.getElementById('checkout-discount-row');
  const discountEl = document.getElementById('checkout-discount');
  const totalEl = document.getElementById('checkout-total');
  const confirmationView = document.getElementById('order-confirmation-view');

  // Check if viewing an existing placed order confirmation
  const urlParams = new URLSearchParams(window.location.search);
  const isConfirmedParam = urlParams.get('confirmed') === '1';
  const lastOrderJson = localStorage.getItem('aquanest_last_order_v1');

  if (isConfirmedParam && lastOrderJson) {
    try {
      const lastOrder = JSON.parse(lastOrderJson);
      renderOrderConfirmation(lastOrder);
      return;
    } catch (e) {
      console.error('Error parsing last order', e);
    }
  }

  const cart = getCart();

  if (cart.length === 0) {
    if (checkoutEmptyNotice) checkoutEmptyNotice.style.display = 'block';
    if (checkoutContentGrid) checkoutContentGrid.style.display = 'none';
    return;
  }

  if (checkoutEmptyNotice) checkoutEmptyNotice.style.display = 'none';
  if (checkoutContentGrid) checkoutContentGrid.style.display = 'grid';

  // Render Order Items in Summary
  if (itemsContainer) {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="checkout-review-row">
        <img class="checkout-review-thumb" src="${item.image}" alt="${item.name}" onerror="handleProductImageError(this, '${item.name}', '${item.category}', '#0077b6')">
        <div class="checkout-review-info">
          <div class="checkout-review-title">${item.name}</div>
          <div class="checkout-review-meta">${item.category} &bull; Qty: <strong>${item.quantity}</strong> &bull; ${formatCurrency(item.price)}</div>
        </div>
        <div class="checkout-review-total">
          ${formatCurrency(item.price * item.quantity)}
        </div>
      </div>
    `).join('');
  }

  if (itemsCountBadge) {
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    itemsCountBadge.textContent = `${totalQty} ${totalQty === 1 ? 'Specimen' : 'Specimens'}`;
  }

  const totals = getCartTotals();
  if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
  if (shippingEl) {
    shippingEl.textContent = totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping);
    if (totals.shipping === 0) shippingEl.style.color = 'var(--emerald-400)';
    else shippingEl.style.color = '';
  }
  if (discountRow && discountEl) {
    if (totals.discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-${formatCurrency(totals.discountAmount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
  if (totalEl) totalEl.textContent = formatCurrency(totals.total);

  // Payment method option cards selection
  const paymentCards = document.querySelectorAll('.payment-option-card');
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Auto-fill logged-in customer info if available
  const loggedInCust = window.AquaNestAPI ? window.AquaNestAPI.getUser() : null;
  if (loggedInCust) {
    const nameInput = document.getElementById('cust-name');
    const phoneInput = document.getElementById('cust-phone');
    const emailInput = document.getElementById('cust-email');
    if (nameInput && !nameInput.value && loggedInCust.name) nameInput.value = loggedInCust.name;
    if (phoneInput && !phoneInput.value && loggedInCust.phone) phoneInput.value = loggedInCust.phone;
    if (emailInput && !emailInput.value && loggedInCust.email) emailInput.value = loggedInCust.email;
  }

  // Inputs real-time error removal
  const inputsToWatch = [
    { input: document.getElementById('cust-name'), err: document.getElementById('err-name') },
    { input: document.getElementById('cust-phone'), err: document.getElementById('err-phone') },
    { input: document.getElementById('cust-email'), err: document.getElementById('err-email') },
    { input: document.getElementById('cust-address'), err: document.getElementById('err-address') },
    { input: document.getElementById('cust-city'), err: document.getElementById('err-city') },
    { input: document.getElementById('cust-state'), err: document.getElementById('err-state') },
    { input: document.getElementById('cust-pin'), err: document.getElementById('err-pin') }
  ];

  inputsToWatch.forEach(({ input, err }) => {
    if (!input) return;
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        clearError(input, err);
      }
    });
    input.addEventListener('change', () => {
      if (input.classList.contains('error')) {
        clearError(input, err);
      }
    });
  });

  // Phone and PIN numeric filter
  const phoneInput = document.getElementById('cust-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  }

  const pinInput = document.getElementById('cust-pin');
  if (pinInput) {
    pinInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    });
  }

  // Form Submission & Validation
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;

      // Full Name
      const name = document.getElementById('cust-name');
      const errName = document.getElementById('err-name');
      if (!name || !name.value.trim() || name.value.trim().length < 3) {
        showError(name, errName, 'Please enter your full name (at least 3 characters).');
        isValid = false;
      } else {
        clearError(name, errName);
      }

      // Phone (Indian 10-digit mobile starting with 6-9)
      const phone = document.getElementById('cust-phone');
      const errPhone = document.getElementById('err-phone');
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanPhone = phone ? phone.value.replace(/\D/g, '') : '';
      if (!phoneRegex.test(cleanPhone)) {
        showError(phone, errPhone, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
        isValid = false;
      } else {
        clearError(phone, errPhone);
      }

      // Email
      const email = document.getElementById('cust-email');
      const errEmail = document.getElementById('err-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        showError(email, errEmail, 'Please enter a valid email address (e.g. name@example.com).');
        isValid = false;
      } else {
        clearError(email, errEmail);
      }

      // Street Address
      const address = document.getElementById('cust-address');
      const errAddress = document.getElementById('err-address');
      if (!address || !address.value.trim() || address.value.trim().length < 8) {
        showError(address, errAddress, 'Please enter a complete delivery address and landmark (min 8 chars).');
        isValid = false;
      } else {
        clearError(address, errAddress);
      }

      // City
      const city = document.getElementById('cust-city');
      const errCity = document.getElementById('err-city');
      if (!city || !city.value.trim()) {
        showError(city, errCity, 'City is required.');
        isValid = false;
      } else {
        clearError(city, errCity);
      }

      // State
      const state = document.getElementById('cust-state');
      const errState = document.getElementById('err-state');
      if (!state || !state.value.trim()) {
        showError(state, errState, 'Please select your state.');
        isValid = false;
      } else {
        clearError(state, errState);
      }

      // PIN Code (6 digits starting with 1-9)
      const pin = document.getElementById('cust-pin');
      const errPin = document.getElementById('err-pin');
      const pinRegex = /^[1-9][0-9]{5}$/;
      const cleanPin = pin ? pin.value.trim() : '';
      if (!pinRegex.test(cleanPin)) {
        showError(pin, errPin, 'Please enter a valid 6-digit PIN code (e.g. 560038).');
        isValid = false;
      } else {
        clearError(pin, errPin);
      }

      if (!isValid) {
        const firstError = document.querySelector('.form-input.error, .form-select.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Generate Unique Order ID: AN-2026-XXXXXX
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const orderId = `AN-2026-${randomNum}`;
      const selectedPayment = document.querySelector('input[name="payment-method"]:checked')?.value || 'Razorpay';
      const notes = document.getElementById('cust-notes')?.value.trim() || '';

      // Calculate Estimated Delivery window (24 - 48 hours)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Tomorrow
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 2); // Day after tomorrow

      const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
      const estDeliveryStr = `${startDate.toLocaleDateString('en-IN', dateOptions)} – ${endDate.toLocaleDateString('en-IN', dateOptions)}`;

      const currentCart = getCart();
      const currentTotals = getCartTotals();
      const authUser = window.AquaNestAPI ? window.AquaNestAPI.getUser() : null;

      const orderPayload = {
        orderId: orderId,
        userId: authUser ? (authUser.id || authUser._id) : null,
        customer: {
          fullName: name.value.trim(),
          phone: cleanPhone,
          email: email.value.trim(),
          address: address.value.trim(),
          city: city.value.trim(),
          state: state.value.trim(),
          pincode: cleanPin,
          notes: notes
        },
        items: currentCart.map(item => ({
          productId: item.id || item.productId,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity) || 1,
          image: item.image || 'images/koi-kohaku.jpg'
        })),
        subtotal: Number(currentTotals.subtotal),
        deliveryCharge: Number(currentTotals.shipping),
        discount: Number(currentTotals.discountAmount),
        total: Number(currentTotals.total),
        paymentMethod: selectedPayment,
        orderStatus: selectedPayment === 'Razorpay' ? 'Pending' : 'Confirmed',
        paymentStatus: 'Pending',
        estimatedDelivery: estDeliveryStr
      };

      // Button loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

      // --- FLOW A: RAZORPAY GATEWAY INTEGRATION ---
      if (selectedPayment === 'Razorpay') {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span class="api-spinner-sm"></span>
            Initializing Razorpay Gateway & Pending Order...
          `;
        }

        let paymentInit = null;
        try {
          if (window.AquaNestAPI) {
            paymentInit = await window.AquaNestAPI.createPaymentOrder(orderPayload);
          } else {
            throw new Error('AquaNest API client is not loaded');
          }
        } catch (initErr) {
          console.error('Failed to initialize payment order:', initErr);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
          showToast('Payment Gateway Error', initErr.message || 'Unable to create payment order. Try again.', 'warning');
          alert('Unable to initialize payment gateway: ' + (initErr.message || 'Server connection error'));
          return;
        }

        // Check if Razorpay Checkout script is loaded
        if (typeof window.Razorpay === 'function') {
          const rzpOptions = {
            key: paymentInit.keyId,
            amount: paymentInit.amount,
            currency: paymentInit.currency || 'INR',
            name: 'AquaNest Live Aquarium',
            description: `Live Fish Dispatch #${paymentInit.orderId}`,
            image: 'images/logo.png',
            order_id: paymentInit.razorpayOrderId,
            prefill: {
              name: paymentInit.customer?.fullName || name.value.trim(),
              email: paymentInit.customer?.email || email.value.trim(),
              contact: paymentInit.customer?.phone || cleanPhone
            },
            notes: {
              orderId: paymentInit.orderId,
              pincode: cleanPin
            },
            theme: {
              color: '#00d2ff'
            },
            handler: async function (response) {
              if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                  <span class="api-spinner-sm"></span>
                  Verifying Cryptographic Payment Signature...
                `;
              }

              try {
                const verifyPayload = {
                  orderId: paymentInit.orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                };

                const verifyRes = await window.AquaNestAPI.verifyPayment(verifyPayload);

                if (verifyRes && verifyRes.success) {
                  const finalPaidOrder = verifyRes.order || {
                    ...orderPayload,
                    orderId: paymentInit.orderId,
                    paymentMethod: 'Razorpay Secure Gateway',
                    paymentStatus: 'PAID',
                    orderStatus: 'Confirmed',
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    paidAt: new Date().toISOString()
                  };

                  // 1. Clear cart
                  clearCart();

                  // 2. Save last order
                  localStorage.setItem('aquanest_last_order_v1', JSON.stringify(finalPaidOrder));

                  // 3. Update URL
                  try {
                    window.history.replaceState(null, '', `checkout.html?confirmed=1&orderId=${paymentInit.orderId}`);
                  } catch (e) {}

                  // 4. Render confirmation
                  renderOrderConfirmation(finalPaidOrder);
                  showToast('Payment Verified!', `Payment ${response.razorpay_payment_id} verified. Order Confirmed!`, 'success');
                } else {
                  throw new Error(verifyRes?.message || 'Payment signature mismatch');
                }
              } catch (verifyErr) {
                console.error('Payment verification failed:', verifyErr);
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.innerHTML = originalBtnHtml;
                }
                alert('Payment verification failed: ' + (verifyErr.message || 'Signature mismatch'));
              }
            },
            modal: {
              ondismiss: function () {
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.innerHTML = originalBtnHtml;
                }
                showToast('Checkout Dismissed', `Order #${paymentInit.orderId} was saved as Pending. You can complete payment at any time.`, 'info');
              }
            }
          };

          const rzp = new window.Razorpay(rzpOptions);
          rzp.on('payment.failed', function (failResp) {
            console.error('Razorpay payment failed:', failResp.error);
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnHtml;
            }
            showToast('Payment Failed', failResp.error?.description || 'Transaction declined.', 'warning');
          });
          rzp.open();
          return;
        } else {
          // Razorpay CDN offline or blocked fallback simulation
          const simConfirm = confirm(
            `[AquaNest Payment Simulation Mode]\n\n` +
            `Order ID: ${paymentInit.orderId}\n` +
            `Amount: ₹${orderPayload.total}\n\n` +
            `External Razorpay CDN is loading or offline.\n` +
            `Click OK to simulate a Successful Payment & verify HMAC signature on backend, or Cancel to abort.`
          );

          if (simConfirm) {
            const simPayId = `pay_sim_${Math.random().toString(36).substring(2, 12)}`;
            const simSig = await window.AquaNestAPI.simulateSignature(paymentInit.razorpayOrderId, simPayId);

            if (simSig && simSig.signature) {
              const verifyRes = await window.AquaNestAPI.verifyPayment({
                orderId: paymentInit.orderId,
                razorpay_order_id: paymentInit.razorpayOrderId,
                razorpay_payment_id: simPayId,
                razorpay_signature: simSig.signature
              });

              if (verifyRes && verifyRes.success) {
                clearCart();
                localStorage.setItem('aquanest_last_order_v1', JSON.stringify(verifyRes.order));
                try {
                  window.history.replaceState(null, '', `checkout.html?confirmed=1&orderId=${paymentInit.orderId}`);
                } catch (e) {}
                renderOrderConfirmation(verifyRes.order);
                showToast('Payment Simulated & Verified!', `Order marked as PAID on backend database.`, 'success');
                return;
              }
            }
          }

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
          }
          return;
        }
      }

      // --- FLOW B: CASH ON DELIVERY (COD) ---
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="api-spinner-sm"></span>
          Transmitting Live Order to Database...
        `;
      }

      let confirmedOrder = null;
      try {
        if (window.AquaNestAPI) {
          confirmedOrder = await window.AquaNestAPI.createOrder(orderPayload);
        }
      } catch (err) {
        console.error('Order creation failed via API:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
        showError(address, errAddress, 'Unable to connect to AquaNest server. Please try again.');
        alert('Unable to connect to AquaNest server. Please try again.');
        return;
      }

      const finalOrder = confirmedOrder || {
        ...orderPayload,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        totals: currentTotals
      };

      // 1. Save last order to localStorage for confirmation view
      localStorage.setItem('aquanest_last_order_v1', JSON.stringify(finalOrder));

      // 2. Clear cart from localStorage
      clearCart();

      // 3. Update browser history URL
      try {
        window.history.replaceState(null, '', `checkout.html?confirmed=1&orderId=${orderId}`);
      } catch (err) {}

      // 4. Render and reveal order confirmation view
      renderOrderConfirmation(finalOrder);
    });
  }

  function showError(input, errorEl, msg) {
    if (input) input.classList.add('error');
    if (errorEl) errorEl.textContent = msg;
  }

  function clearError(input, errorEl) {
    if (input) input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  function renderOrderConfirmation(order) {
    if (!confirmationView) return;

    if (checkoutMainView) checkoutMainView.style.display = 'none';
    confirmationView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Populate Hero and Meta
    const custName = order.customer?.fullName || order.customer?.name || 'Valued Customer';
    const firstName = custName.split(' ')[0] || custName;
    const confirmNameFirst = document.getElementById('confirm-customer-firstname');
    if (confirmNameFirst) confirmNameFirst.textContent = firstName;

    const confirmOrderId = document.getElementById('confirm-order-id');
    if (confirmOrderId) confirmOrderId.textContent = order.orderId || order.id;

    const confirmOrderDate = document.getElementById('confirm-order-date');
    if (confirmOrderDate) confirmOrderDate.textContent = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (order.date || 'Today');

    const confirmPayment = document.getElementById('confirm-payment-method');
    if (confirmPayment) confirmPayment.textContent = order.paymentMethod || 'Razorpay Secure Gateway';

    const confirmPaymentStatus = document.getElementById('confirm-payment-status');
    const isPaid = order.paymentStatus === 'PAID' || order.isPaid;
    if (confirmPaymentStatus) {
      confirmPaymentStatus.textContent = isPaid ? '✓ PAID' : (order.paymentStatus || 'Pending');
      confirmPaymentStatus.style.color = isPaid ? 'var(--emerald-400)' : 'var(--amber-400)';
    }

    const confirmTxWrap = document.getElementById('confirm-payment-tx-wrap');
    const confirmTxId = document.getElementById('confirm-payment-tx');
    if (confirmTxWrap && confirmTxId) {
      if (order.razorpayPaymentId) {
        confirmTxWrap.style.display = 'block';
        confirmTxId.textContent = order.razorpayPaymentId;
      } else {
        confirmTxWrap.style.display = 'none';
      }
    }

    const confirmEst = document.getElementById('confirm-est-delivery');
    if (confirmEst) confirmEst.textContent = order.estimatedDelivery || '24 to 48 Hours';

    // Populate Ordered Items
    const itemsList = order.products || order.items || [];
    const itemsTable = document.getElementById('confirm-items-container');
    if (itemsTable && Array.isArray(itemsList)) {
      itemsTable.innerHTML = itemsList.map(item => `
        <div class="confirm-item-row">
          <img class="confirm-item-thumb" src="${item.image || 'images/koi-kohaku.jpg'}" alt="${item.name}" onerror="handleProductImageError(this, '${item.name}', '${item.category || ''}', '#0077b6')">
          <div class="confirm-item-info">
            <span class="confirm-item-name">${item.name}</span>
            <span class="confirm-item-sub">${item.category ? item.category + ' &bull; ' : ''}Qty: <strong>${item.quantity || 1}</strong> &times; ${formatCurrency(item.price)}</span>
          </div>
          <span class="confirm-item-total">${formatCurrency(item.price * (item.quantity || 1))}</span>
        </div>
      `).join('');
    }

    // Totals Breakdown
    const subtotalVal = order.totals?.subtotal !== undefined ? order.totals.subtotal : (order.subtotal !== undefined ? order.subtotal : 0);
    const shippingVal = order.totals?.shipping !== undefined ? order.totals.shipping : (order.deliveryCharge !== undefined ? order.deliveryCharge : 0);
    const discountVal = order.totals?.discountAmount !== undefined ? order.totals.discountAmount : (order.discount !== undefined ? order.discount : 0);
    const totalVal = order.totals?.total !== undefined ? order.totals.total : (order.total !== undefined ? order.total : (order.totalAmount || 0));

    const subtotalDisplay = document.getElementById('confirm-subtotal');
    if (subtotalDisplay) subtotalDisplay.textContent = formatCurrency(subtotalVal);

    const shippingDisplay = document.getElementById('confirm-shipping');
    if (shippingDisplay) {
      shippingDisplay.textContent = shippingVal === 0 ? 'FREE' : formatCurrency(shippingVal);
      if (shippingVal === 0) shippingDisplay.style.color = 'var(--emerald-400)';
    }

    const discountRowConfirm = document.getElementById('confirm-discount-row');
    const discountDisplay = document.getElementById('confirm-discount');
    if (discountRowConfirm && discountDisplay) {
      if (discountVal > 0) {
        discountRowConfirm.style.display = 'flex';
        discountDisplay.textContent = `-${formatCurrency(discountVal)}`;
      } else {
        discountRowConfirm.style.display = 'none';
      }
    }

    const grandTotalDisplay = document.getElementById('confirm-total-amount');
    if (grandTotalDisplay) grandTotalDisplay.textContent = formatCurrency(totalVal);

    // Customer & Shipping Address Details
    const customerNameDisplay = document.getElementById('confirm-customer-name');
    if (customerNameDisplay) customerNameDisplay.textContent = custName;

    const contactDisplay = document.getElementById('confirm-customer-contact');
    if (contactDisplay) contactDisplay.textContent = `📞 +91 ${order.customer.phone} • ✉️ ${order.customer.email}`;

    const addressDisplay = document.getElementById('confirm-customer-address');
    if (addressDisplay) {
      const pinCode = order.customer.pincode || order.customer.pin || '';
      addressDisplay.textContent = `${order.customer.address}, ${order.customer.city}, ${order.customer.state}${pinCode ? ' - ' + pinCode : ''}`;
    }

    const notesWrap = document.getElementById('confirm-notes-wrap');
    const notesDisplay = document.getElementById('confirm-customer-notes');
    if (notesWrap && notesDisplay) {
      if (order.customer.notes) {
        notesWrap.style.display = 'block';
        notesDisplay.textContent = `"${order.customer.notes}"`;
      } else {
        notesWrap.style.display = 'none';
      }
    }

    // Copy Order ID Button
    const copyBtn = document.getElementById('copy-order-id-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(order.orderId).then(() => {
          showToast('Copied!', `Order ID ${order.orderId} copied to clipboard.`, 'success');
        }).catch(() => {
          showToast('Order ID', order.orderId, 'info');
        });
      });
    }

    // Show Success Toast
    showToast('Order Placed Successfully!', `Order ${order.orderId} confirmed. Live arrival guaranteed!`, 'success');
  }
}

/* ==========================================================================
   Contact Page Logic
   ========================================================================== */
function initContactPage() {
  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // Contact form submission
  const contactForm = document.getElementById('aquanest-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !message) {
        showToast('Missing Fields', 'Please complete all required fields.', 'warning');
        return;
      }

      showToast(
        'Message Sent!',
        `Thank you ${name}. Our aquatic care specialists will reply to ${email} within 24 hours.`,
        'success'
      );
      contactForm.reset();
    });
  }
}

/* ==========================================================================
   Global Newsletter & Event Delegation
   ========================================================================== */
function initGlobalNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(f => {
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = f.querySelector('.newsletter-input');
      const email = input ? input.value.trim() : '';

      if (!email || !email.includes('@')) {
        showToast('Invalid Email', 'Please provide a valid email address.', 'warning');
        return;
      }

      showToast(
        'Welcome to AquaNest!',
        'You have received 10% off coupon code: AQUA10. Check your inbox for care tips!',
        'success'
      );
      if (input) input.value = '';
    });
  });
}

function initGlobalEventListeners() {
  document.addEventListener('click', (e) => {
    // Add to cart buttons
    const addCartBtn = e.target.closest('[data-action="add-to-cart"]');
    if (addCartBtn) {
      const pid = addCartBtn.getAttribute('data-product-id');
      if (pid) {
        addToCart(pid, 1, true);
      }
    }

    // Wishlist buttons
    const wishBtn = e.target.closest('[data-action="toggle-wishlist"]');
    if (wishBtn) {
      const pid = wishBtn.getAttribute('data-wishlist-id');
      if (pid) {
        toggleWishlist(pid, true);
      }
    }
  });
}

/* ==========================================================================
   CUSTOMER AUTHENTICATION & ACCOUNT MODAL SYSTEM
   ========================================================================== */
function initCustomerAuthUI() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  let authContainer = document.getElementById('customer-auth-container');
  if (!authContainer) {
    authContainer = document.createElement('div');
    authContainer.id = 'customer-auth-container';
    authContainer.className = 'customer-auth-wrap';
    const mobileToggle = navActions.querySelector('.mobile-toggle');
    if (mobileToggle) {
      navActions.insertBefore(authContainer, mobileToggle);
    } else {
      navActions.appendChild(authContainer);
    }
  }

  // Inject modals if needed
  injectCustomerModals();

  // Render Navbar state
  renderCustomerNavbar(authContainer);

  // Listen to live auth changes
  window.addEventListener('aquanest:authChange', () => {
    renderCustomerNavbar(authContainer);
  });
}

function renderCustomerNavbar(container) {
  const user = window.AquaNestAPI ? window.AquaNestAPI.getUser() : null;

  if (user) {
    const firstName = user.name ? user.name.split(' ')[0] : 'My Account';
    const initial = (user.name || 'U').charAt(0).toUpperCase();

    container.innerHTML = `
      <button type="button" class="customer-user-btn" id="btn-customer-user" aria-haspopup="true" aria-expanded="false" title="Account Menu">
        <div class="customer-user-avatar">${initial}</div>
        <span>${firstName}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="customer-user-dropdown" id="customer-user-dropdown">
        <div class="dropdown-user-info">
          <span class="dropdown-user-name">${user.name || 'Valued Customer'}</span>
          <span class="dropdown-user-email">${user.email || ''}</span>
        </div>
        <button type="button" class="dropdown-link" id="btn-open-account-profile">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>My Profile & Orders</span>
        </button>
        <a href="shop.html?wishlist=true" class="dropdown-link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          <span>Saved Wishlist</span>
        </a>
        ${user.role === 'admin' ? `
        <a href="admin.html" class="dropdown-link" style="color: var(--cyan-400);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span>Admin Console</span>
        </a>` : ''}
        <button type="button" class="dropdown-link danger" id="btn-customer-signout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Sign Out</span>
        </button>
      </div>
    `;

    const userBtn = container.querySelector('#btn-customer-user');
    const dropdown = container.querySelector('#customer-user-dropdown');
    const profileBtn = container.querySelector('#btn-open-account-profile');
    const signoutBtn = container.querySelector('#btn-customer-signout');

    userBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown?.classList.remove('show');
      }
    });

    profileBtn?.addEventListener('click', () => {
      dropdown?.classList.remove('show');
      openCustomerAccountModal();
    });

    signoutBtn?.addEventListener('click', () => {
      if (confirm('Sign out of your AquaNest customer account?')) {
        if (window.AquaNestAPI) window.AquaNestAPI.logout();
        showToast('Signed Out', 'You have been signed out.', 'success');
      }
    });
  } else {
    container.innerHTML = `
      <button type="button" class="btn-customer-signin" id="btn-customer-signin" title="Sign In or Register">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>Sign In</span>
      </button>
    `;

    const signinBtn = container.querySelector('#btn-customer-signin');
    signinBtn?.addEventListener('click', () => {
      openCustomerAuthModal('login');
    });
  }
}

function injectCustomerModals() {
  if (document.getElementById('customer-auth-modal')) return;

  const modalRoot = document.createElement('div');
  modalRoot.innerHTML = `
    <!-- Customer Auth Modal (Login / Register) -->
    <div class="auth-modal-overlay" id="customer-auth-modal" aria-hidden="true">
      <div class="auth-modal-card" role="dialog" aria-modal="true">
        <button type="button" class="auth-close-btn" id="btn-close-auth-modal" aria-label="Close modal">&times;</button>
        
        <div style="text-align: center; margin-bottom: 1.25rem;">
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; margin: 0 0 0.35rem; color: var(--white);" id="auth-modal-title">Sign In to AquaNest</h2>
          <p style="font-size: 0.82rem; color: var(--slate-400); margin: 0;">Access your live orders, wishlist, and priority aquatic support.</p>
        </div>

        <div class="auth-tabs-row">
          <button type="button" class="auth-tab-btn active" id="tab-btn-login">Sign In</button>
          <button type="button" class="auth-tab-btn" id="tab-btn-register">Create Account</button>
        </div>

        <div class="auth-error-box" id="auth-error-banner"></div>
        <div class="auth-success-box" id="auth-success-banner"></div>

        <!-- Login Form -->
        <form id="customer-login-form">
          <div class="auth-input-group">
            <label for="auth-login-email">Email Address</label>
            <input type="email" id="auth-login-email" class="auth-input" placeholder="you@example.com" required autocomplete="username">
          </div>
          <div class="auth-input-group">
            <label for="auth-login-password">Password</label>
            <input type="password" id="auth-login-password" class="auth-input" placeholder="••••••••" required autocomplete="current-password">
          </div>
          <button type="submit" class="auth-submit-btn" id="btn-submit-login">Sign In</button>
        </form>

        <!-- Register Form -->
        <form id="customer-register-form" style="display: none;">
          <div class="auth-input-group">
            <label for="auth-reg-name">Full Name</label>
            <input type="text" id="auth-reg-name" class="auth-input" placeholder="Rahul Sharma" required autocomplete="name">
          </div>
          <div class="auth-input-group">
            <label for="auth-reg-email">Email Address</label>
            <input type="email" id="auth-reg-email" class="auth-input" placeholder="rahul@example.com" required autocomplete="email">
          </div>
          <div class="auth-input-group">
            <label for="auth-reg-phone">Mobile Number</label>
            <input type="tel" id="auth-reg-phone" class="auth-input" placeholder="9876543210" autocomplete="tel">
          </div>
          <div class="auth-input-group">
            <label for="auth-reg-password">Password (min. 6 characters)</label>
            <input type="password" id="auth-reg-password" class="auth-input" placeholder="Create secure password" required minlength="6" autocomplete="new-password">
          </div>
          <button type="submit" class="auth-submit-btn" id="btn-submit-register">Create AquaNest Account</button>
        </form>
      </div>
    </div>

    <!-- Customer Account Profile & Orders Modal -->
    <div class="auth-modal-overlay" id="customer-account-modal" aria-hidden="true">
      <div class="account-modal-card" role="dialog" aria-modal="true">
        <button type="button" class="auth-close-btn" id="btn-close-account-modal" aria-label="Close modal">&times;</button>
        
        <div class="account-profile-header">
          <div class="account-avatar-lg" id="acc-avatar-lg">U</div>
          <div>
            <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; margin: 0 0 0.25rem; color: var(--white);" id="acc-name-lg">Customer</h2>
            <div style="font-size: 0.84rem; color: var(--slate-300);" id="acc-email-lg">user@example.com</div>
            <div style="font-size: 0.78rem; color: var(--cyan-400); margin-top: 0.25rem;" id="acc-phone-lg"></div>
          </div>
        </div>

        <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--white); margin: 0 0 1rem; display: flex; align-items: center; justify-content: space-between;">
          <span>My Live Fish Orders</span>
          <span style="font-size: 0.78rem; color: var(--cyan-300); font-weight: 600;" id="acc-orders-count">Loading orders...</span>
        </h3>

        <div id="acc-orders-list" style="min-height: 120px;">
          <div class="api-loading-wrap" style="padding: 2rem 0;">
            <div class="api-spinner-sm"></div>
            <span style="font-size: 0.85rem; color: var(--slate-400);">Fetching orders from database...</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalRoot);
  bindModalEventListeners();
}

function bindModalEventListeners() {
  const authModal = document.getElementById('customer-auth-modal');
  const accountModal = document.getElementById('customer-account-modal');
  const closeAuthBtn = document.getElementById('btn-close-auth-modal');
  const closeAccBtn = document.getElementById('btn-close-account-modal');

  const tabLogin = document.getElementById('tab-btn-login');
  const tabRegister = document.getElementById('tab-btn-register');
  const loginForm = document.getElementById('customer-login-form');
  const registerForm = document.getElementById('customer-register-form');
  const errBanner = document.getElementById('auth-error-banner');
  const succBanner = document.getElementById('auth-success-banner');

  function showAuthError(msg) {
    if (errBanner) {
      errBanner.textContent = msg;
      errBanner.style.display = 'flex';
    }
  }

  function hideAuthMessages() {
    if (errBanner) errBanner.style.display = 'none';
    if (succBanner) succBanner.style.display = 'none';
  }

  // Switch tabs
  tabLogin?.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister?.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    document.getElementById('auth-modal-title').textContent = 'Sign In to AquaNest';
    hideAuthMessages();
  });

  tabRegister?.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin?.classList.remove('active');
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.getElementById('auth-modal-title').textContent = 'Create Customer Account';
    hideAuthMessages();
  });

  // Close handlers
  closeAuthBtn?.addEventListener('click', () => {
    authModal?.classList.remove('active');
  });

  closeAccBtn?.addEventListener('click', () => {
    accountModal?.classList.remove('active');
  });

  authModal?.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.remove('active');
  });

  accountModal?.addEventListener('click', (e) => {
    if (e.target === accountModal) accountModal.classList.remove('active');
  });

  // Handle Login Submit
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthMessages();

    const email = document.getElementById('auth-login-email')?.value.trim();
    const password = document.getElementById('auth-login-password')?.value;
    const submitBtn = document.getElementById('btn-submit-login');

    if (!email || !password) {
      showAuthError('Please provide both email and password.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying...';

    try {
      const res = await window.AquaNestAPI.login({ email, password });
      authModal?.classList.remove('active');
      showToast('Welcome Back!', `Signed in as ${res.user.name}.`, 'success');
      loginForm.reset();
    } catch (err) {
      showAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });

  // Handle Register Submit
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthMessages();

    const name = document.getElementById('auth-reg-name')?.value.trim();
    const email = document.getElementById('auth-reg-email')?.value.trim();
    const phone = document.getElementById('auth-reg-phone')?.value.trim();
    const password = document.getElementById('auth-reg-password')?.value;
    const submitBtn = document.getElementById('btn-submit-register');

    if (!name || !email || !password) {
      showAuthError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      showAuthError('Password must be at least 6 characters.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
      const res = await window.AquaNestAPI.register({ name, email, phone, password });
      authModal?.classList.remove('active');
      showToast('Account Created!', `Welcome to AquaNest, ${res.user.name}!`, 'success');
      registerForm.reset();
    } catch (err) {
      showAuthError(err.message || 'Registration failed.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create AquaNest Account';
    }
  });
}

function openCustomerAuthModal(tab = 'login') {
  injectCustomerModals();
  const authModal = document.getElementById('customer-auth-modal');
  if (!authModal) return;

  const tabLogin = document.getElementById('tab-btn-login');
  const tabRegister = document.getElementById('tab-btn-register');
  const errBanner = document.getElementById('auth-error-banner');
  const succBanner = document.getElementById('auth-success-banner');
  if (errBanner) errBanner.style.display = 'none';
  if (succBanner) succBanner.style.display = 'none';

  if (tab === 'register') {
    tabRegister?.click();
  } else {
    tabLogin?.click();
  }

  authModal.classList.add('active');
}

async function openCustomerAccountModal() {
  injectCustomerModals();
  const accountModal = document.getElementById('customer-account-modal');
  if (!accountModal) return;

  const user = window.AquaNestAPI ? window.AquaNestAPI.getUser() : null;
  if (!user) {
    openCustomerAuthModal('login');
    return;
  }

  // Populate user profile info
  const avatarEl = document.getElementById('acc-avatar-lg');
  const nameEl = document.getElementById('acc-name-lg');
  const emailEl = document.getElementById('acc-email-lg');
  const phoneEl = document.getElementById('acc-phone-lg');
  const countEl = document.getElementById('acc-orders-count');
  const ordersListEl = document.getElementById('acc-orders-list');

  if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
  if (nameEl) nameEl.textContent = user.name || 'Customer';
  if (emailEl) emailEl.textContent = user.email || '';
  if (phoneEl) phoneEl.textContent = user.phone ? `Mobile: ${user.phone}` : 'Account: Verified Customer';

  accountModal.classList.add('active');

  // Load Customer Orders
  if (ordersListEl) {
    ordersListEl.innerHTML = `
      <div class="api-loading-wrap" style="padding: 2rem 0;">
        <div class="api-spinner-sm"></div>
        <span style="font-size: 0.85rem; color: var(--slate-400);">Fetching orders from database...</span>
      </div>
    `;

    try {
      const orders = await window.AquaNestAPI.getMyOrders();
      if (countEl) countEl.textContent = `${orders.length} Orders Placed`;

      if (orders.length === 0) {
        ordersListEl.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--slate-500); margin-bottom: 0.75rem;">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p style="color: var(--slate-300); font-size: 0.9rem; margin-bottom: 1rem;">You have not placed any aquatic livestock orders yet.</p>
            <a href="shop.html" class="btn btn-primary btn-sm" onclick="document.getElementById('customer-account-modal').classList.remove('active')">Browse Species Catalog</a>
          </div>
        `;
      } else {
        ordersListEl.innerHTML = orders.map(ord => {
          const itemsSummary = (ord.products || ord.items || []).map(i => `${i.name} (x${i.quantity || 1})`).join(', ');
          const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
          const status = ord.orderStatus || ord.status || 'Pending';

          return `
            <div class="order-history-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <div>
                  <strong style="color: var(--cyan-400); font-size: 0.92rem;">#${ord.orderId || ord.id}</strong>
                  <span style="font-size: 0.78rem; color: var(--slate-400); margin-left: 0.5rem;">${dateStr}</span>
                </div>
                <span class="badge-pill badge-${status.toLowerCase()}" style="font-size: 0.75rem;">${status}</span>
              </div>
              <div style="font-size: 0.82rem; color: var(--slate-300); margin-bottom: 0.5rem; line-height: 1.4;">
                ${itemsSummary}
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-top: 1px dashed rgba(255, 255, 255, 0.08); padding-top: 0.5rem;">
                <span style="color: var(--slate-400);">Total: <strong style="color: var(--white);">${formatCurrency(ord.total !== undefined ? ord.total : ord.totalAmount)}</strong></span>
                <span style="color: var(--slate-400);">Delivery: <span style="color: var(--cyan-300);">${ord.estimatedDelivery || '24-48 Hours'}</span></span>
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (e) {
      if (ordersListEl) {
        ordersListEl.innerHTML = `<p style="color: var(--coral-400); font-size: 0.85rem; text-align: center;">Unable to load order history.</p>`;
      }
    }
  }
}
