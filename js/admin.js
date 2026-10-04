/**
 * AquaNest - Admin Dashboard Application Script
 * Complete frontend product, inventory, orders, and sales analytics management.
 * All state is persisted in localStorage and synchronized with the customer storefront.
 */

// Storage Keys
const ADMIN_STORAGE_KEYS = {
  PRODUCTS: 'aquanest_products_v1',
  ORDERS: 'aquanest_orders_v1',
  LAST_ORDER: 'aquanest_last_order_v1'
};

// Seed Realistic Demo Orders if no orders exist yet
const SAMPLE_DEMO_ORDERS = [
  {
    orderId: 'AN-2026-928412',
    date: '3 Oct 2026',
    estimatedDelivery: '5 Oct – 6 Oct',
    status: 'Delivered',
    paymentMethod: 'Instant UPI',
    customer: {
      name: 'Priya Sharma',
      phone: '9845012345',
      email: 'priya.sharma@example.com',
      address: 'Flat 302, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pin: '560066',
      notes: 'Please ring bell twice, deliver before 5 PM'
    },
    items: [
      { id: 'koi-kohaku', name: 'Kohaku Japanese Koi', category: 'Koi Fish', price: 1499, quantity: 1, image: 'images/koi-kohaku.jpg' },
      { id: 'betta-halfmoon-blue', name: 'Royal Blue Halfmoon Betta', category: 'Betta', price: 420, quantity: 2, image: 'images/betta-halfmoon-blue.jpg' }
    ],
    totals: { subtotal: 2339, shipping: 0, discountAmount: 0, total: 2339 }
  },
  {
    orderId: 'AN-2026-815309',
    date: '2 Oct 2026',
    estimatedDelivery: '4 Oct – 5 Oct',
    status: 'Shipped',
    paymentMethod: 'Credit / Debit Card',
    customer: {
      name: 'Aditya Kulkarni',
      phone: '9822098765',
      email: 'aditya.k@example.com',
      address: 'Rowhouse 14, Baner Hills',
      city: 'Pune',
      state: 'Maharashtra',
      pin: '411045',
      notes: 'Leave with security guard if unavailable'
    },
    items: [
      { id: 'tetra-neon-school', name: 'Neon Tetra School (Pack of 10)', category: 'Tetra', price: 380, quantity: 2, image: 'images/tetra-neon-school.jpg' },
      { id: 'angelfish-platinum', name: 'Platinum White Angelfish Pair', category: 'Angelfish', price: 799, quantity: 1, image: 'images/angelfish-platinum.jpg' }
    ],
    totals: { subtotal: 1559, shipping: 0, discountAmount: 0, total: 1559 }
  },
  {
    orderId: 'AN-2026-749102',
    date: '1 Oct 2026',
    estimatedDelivery: '3 Oct – 4 Oct',
    status: 'Packed',
    paymentMethod: 'Cash on Delivery',
    customer: {
      name: 'Rajesh Nair',
      phone: '9744112233',
      email: 'rajesh.nair@example.com',
      address: '22 Marine Drive, Fort Kochi',
      city: 'Kochi',
      state: 'Kerala',
      pin: '682001',
      notes: 'Call before dispatch'
    },
    items: [
      { id: 'goldfish-oranda', name: 'Red Cap Oranda Goldfish', category: 'Goldfish', price: 499, quantity: 2, image: 'images/goldfish-oranda.jpg' }
    ],
    totals: { subtotal: 998, shipping: 99, discountAmount: 0, total: 1097 }
  },
  {
    orderId: 'AN-2026-621804',
    date: '30 Sep 2026',
    estimatedDelivery: '2 Oct – 3 Oct',
    status: 'Confirmed',
    paymentMethod: 'Instant UPI',
    customer: {
      name: 'Sunita Mehra',
      phone: '9811099887',
      email: 'sunita.m@example.com',
      address: 'B-44 Greater Kailash 1',
      city: 'New Delhi',
      state: 'Delhi',
      pin: '110048',
      notes: 'Check water thermal insulation'
    },
    items: [
      { id: 'guppy-blue-moscow', name: 'Blue Moscow Guppy Trio', category: 'Guppy', price: 349, quantity: 3, image: 'images/guppy-blue-moscow.jpg' },
      { id: 'molly-black', name: 'Midnight Black Molly Trio', category: 'Molly', price: 249, quantity: 2, image: 'images/molly-black.jpg' }
    ],
    totals: { subtotal: 1545, shipping: 0, discountAmount: 154, total: 1391 }
  },
  {
    orderId: 'AN-2026-512990',
    date: '28 Sep 2026',
    estimatedDelivery: '30 Sep – 1 Oct',
    status: 'Delivered',
    paymentMethod: 'Instant UPI',
    customer: {
      name: 'Vikram Sengupta',
      phone: '9830076543',
      email: 'vikram.s@example.com',
      address: '14 Salt Lake Sector V',
      city: 'Kolkata',
      state: 'West Bengal',
      pin: '700091',
      notes: ''
    },
    items: [
      { id: 'koi-showa', name: 'Showa Sanshoku Tri-Color Koi', category: 'Koi Fish', price: 1850, quantity: 1, image: 'images/koi-showa.jpg' }
    ],
    totals: { subtotal: 1850, shipping: 0, discountAmount: 0, total: 1850 }
  }
];

// Active State
let currentSection = 'dashboard';
let productToDeleteId = null;

/* ==========================================================================
   AUTHENTICATION & AUTHORIZATION GUARD
   ========================================================================== */
function checkAdminAuth() {
  const token = window.AquaNestAPI ? window.AquaNestAPI.getAdminToken() : (localStorage.getItem('aquanest_admin_token') || sessionStorage.getItem('aquanest_admin_token'));
  const user = window.AquaNestAPI ? window.AquaNestAPI.getAdminUser() : null;

  if (!token || !user) {
    window.location.replace('admin-login.html');
    return false;
  }

  if (user.role !== 'admin') {
    if (window.AquaNestAPI) window.AquaNestAPI.adminLogout();
    window.location.replace('admin-login.html?denied=1');
    return false;
  }

  // Populate admin profile info in sidebar
  const adminNameEl = document.getElementById('admin-profile-name');
  const adminRoleEl = document.getElementById('admin-profile-role');
  const adminAvatarEl = document.getElementById('admin-avatar');
  if (adminNameEl && user.name) adminNameEl.textContent = user.name;
  if (adminRoleEl && user.email) adminRoleEl.textContent = user.email;
  if (adminAvatarEl && user.name) {
    const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    adminAvatarEl.textContent = initials || 'AD';
  }

  return true;
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Enforce Administrator Authentication First
  if (!checkAdminAuth()) return;

  // 2. Wire up Admin Logout Button
  const logoutBtn = document.getElementById('btn-admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Sign out of AquaNest Administrator Console?')) {
        if (window.AquaNestAPI) {
          window.AquaNestAPI.adminLogout();
        } else {
          localStorage.removeItem('aquanest_admin_token');
          localStorage.removeItem('aquanest_admin_user');
          sessionStorage.removeItem('aquanest_admin_token');
          sessionStorage.removeItem('aquanest_admin_user');
        }
        window.location.replace('admin-login.html');
      }
    });
  }

  initStorage();
  initNavigation();
  initDashboard();
  initProductManagement();
  initOrderManagement();
  initLowStock();
  initSalesAnalytics();
  initSettings();

  // Handle URL Hash if present (e.g. admin.html#products)
  const hash = window.location.hash.replace('#', '');
  if (hash && ['dashboard', 'products', 'orders', 'lowstock', 'sales', 'customers', 'settings'].includes(hash)) {
    switchSection(hash);
  }

  // Trigger live background sync with MongoDB API
  syncAdminFromAPI();
});

/* ==========================================================================
   STORAGE INITIALIZATION & ACCESSORS (CONNECTED TO MONGODB API)
   ========================================================================== */
async function syncAdminFromAPI() {
  if (window.AquaNestAPI) {
    try {
      const [liveProds, liveOrders] = await Promise.all([
        window.AquaNestAPI.getProducts(),
        window.AquaNestAPI.getOrders()
      ]);

      if (Array.isArray(liveProds) && liveProds.length > 0) {
        saveProducts(liveProds);
      }
      if (Array.isArray(liveOrders)) {
        saveOrders(liveOrders);
      }

      updateSidebarCounts();
      renderDashboard();
      renderProducts();
      renderOrders();
      renderLowStock();
      renderSalesSummary();
    } catch (err) {
      console.warn('Admin initial API sync error:', err);
    }
  }
}

function initStorage() {
  // 1. Ensure products catalog is in localStorage
  if (typeof getStoredProducts === 'function') {
    getStoredProducts();
  }

  // 2. Ensure orders list exists
  try {
    const rawOrders = localStorage.getItem(ADMIN_STORAGE_KEYS.ORDERS);
    if (!rawOrders) {
      localStorage.setItem(ADMIN_STORAGE_KEYS.ORDERS, JSON.stringify(SAMPLE_DEMO_ORDERS));
    }
  } catch (e) {
    console.error('Error initializing admin orders', e);
  }
}

function getProducts() {
  if (typeof getAllProducts === 'function') {
    return getAllProducts();
  }
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveProducts(products) {
  if (typeof saveAllProducts === 'function') {
    saveAllProducts(products);
  } else {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {}
  }
  updateSidebarCounts();
}

function getOrders() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    updateSidebarCounts();
  } catch (e) {
    console.error('Error saving orders', e);
  }
}

function updateSidebarCounts() {
  const products = getProducts();
  const orders = getOrders();
  const lowStock = products.filter(p => (p.stock || 0) < 5);

  const prodCountEl = document.getElementById('sidebar-products-count');
  if (prodCountEl) prodCountEl.textContent = products.length;

  const orderCountEl = document.getElementById('sidebar-orders-count');
  if (orderCountEl) orderCountEl.textContent = orders.length;

  const lowStockCountEl = document.getElementById('sidebar-lowstock-count');
  if (lowStockCountEl) {
    lowStockCountEl.textContent = lowStock.length;
    lowStockCountEl.style.display = lowStock.length > 0 ? 'inline-block' : 'none';
  }
}

/* ==========================================================================
   NAVIGATION & SECTION SWITCHING
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sidebar = document.getElementById('admin-sidebar');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const closeSidebarBtn = document.getElementById('sidebar-close-btn');
  const backdrop = document.getElementById('sidebar-backdrop');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      if (target) {
        switchSection(target);
        closeMobileSidebar();
      }
    });
  });

  // Mobile drawer controls
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar?.classList.add('open');
      backdrop?.classList.add('active');
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileSidebar);
  }

  function closeMobileSidebar() {
    sidebar?.classList.remove('open');
    backdrop?.classList.remove('active');
  }

  // Quick jump links with data-jump
  document.addEventListener('click', (e) => {
    const jumpBtn = e.target.closest('[data-jump]');
    if (jumpBtn) {
      const target = jumpBtn.getAttribute('data-jump');
      if (target) switchSection(target);
    }
  });

  // Topbar quick add fish button
  const quickAddBtn = document.getElementById('btn-quick-add-product');
  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => openProductModal(null));
  }
}

function switchSection(sectionId) {
  currentSection = sectionId;

  // Update URL hash without scroll
  window.history.replaceState(null, '', `admin.html#${sectionId}`);

  // Update Nav active classes
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-target')) === sectionId;
    if (btn.getAttribute('data-target') === sectionId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Sections display
  document.querySelectorAll('.admin-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const activeSec = document.getElementById(`section-${sectionId}`);
  if (activeSec) {
    activeSec.classList.add('active');
  }

  // Update Topbar Title
  const titleMap = {
    'dashboard': { title: 'Dashboard Overview', breadcrumb: 'AquaNest Admin • Real-time Metrics & Insights' },
    'products': { title: 'Product Catalog Management', breadcrumb: 'Inventory • Pricing & Stock Control' },
    'orders': { title: 'Customer Order Management', breadcrumb: 'Shipments • Dispatch Statuses & Invoices' },
    'lowstock': { title: 'Low Stock Inventory Alerts', breadcrumb: 'Stock Alert • Species Below 5 Units' },
    'sales': { title: 'Sales & Revenue Analytics', breadcrumb: 'Financial Analytics • Category Performance' },
    'customers': { title: 'Customer CRM Directory', breadcrumb: 'Customer Profiles & Repeat Orders' },
    'settings': { title: 'Store Settings & Data Tools', breadcrumb: 'Operations • Catalog Resets & Policies' }
  };

  const meta = titleMap[sectionId] || { title: 'Admin Dashboard', breadcrumb: 'AquaNest Admin' };
  const topTitle = document.getElementById('topbar-title');
  const topBreadcrumb = document.getElementById('topbar-breadcrumb');
  if (topTitle) topTitle.textContent = meta.title;
  if (topBreadcrumb) topBreadcrumb.textContent = meta.breadcrumb;

  // Trigger section-specific refresh
  if (sectionId === 'dashboard') renderDashboard();
  if (sectionId === 'products') renderProducts();
  if (sectionId === 'orders') renderOrders();
  if (sectionId === 'lowstock') renderLowStock();
  if (sectionId === 'sales') renderSalesAnalytics();
}

/* ==========================================================================
   SECTION 1: DASHBOARD
   ========================================================================== */
function initDashboard() {
  renderDashboard();

  // Click on Low stock card jumps to low stock section
  const lowStockCard = document.getElementById('dash-card-lowstock');
  if (lowStockCard) {
    lowStockCard.addEventListener('click', () => switchSection('lowstock'));
  }
}

function renderDashboard() {
  const products = getProducts();
  const orders = getOrders();

  // 1. Metric Counts
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => (p.stock || 0) > 0).length;
  const outOfStockProducts = products.filter(p => (p.stock || 0) <= 0).length;
  const lowStockProducts = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 5).length;

  const validOrders = orders.filter(o => o.status !== 'Cancelled' && o.orderStatus !== 'Cancelled');
  const totalOrders = orders.length;
  const totalRevenue = validOrders.reduce((sum, o) => {
    const val = o.totals?.total !== undefined ? o.totals.total : (o.total !== undefined ? o.total : (o.totalAmount || 0));
    return sum + (Number(val) || 0);
  }, 0);
  const aov = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

  // Set DOM
  setText('dash-total-products', totalProducts);
  setText('dash-in-stock', inStockProducts);
  setText('dash-out-stock', outOfStockProducts);
  setText('dash-low-stock', lowStockProducts);
  setText('dash-total-orders', totalOrders);
  setText('dash-total-revenue', formatCurrency(totalRevenue));
  setText('dash-avg-order-sub', `AOV: ${formatCurrency(aov)}`);
  setText('chart-total-sales-badge', `${formatCurrency(totalRevenue)} Total`);

  // Unique categories
  const categories = [...new Set(products.map(p => p.category))];
  setText('dash-categories-count', `${categories.length} Fish Categories`);

  const confirmedCount = orders.filter(o => ['Confirmed', 'Packed', 'Shipped', 'Delivered'].includes(o.status)).length;
  setText('dash-confirmed-orders', `${confirmedCount} Active / Fulfilled`);

  // 2. Render Vanilla JS/CSS Sales Chart
  renderCategorySalesChart();

  // 3. Render Best-Selling Fish preview
  renderDashboardBestSellers();

  // 4. Render Recent Orders preview
  renderDashboardRecentOrders();

  // 5. Render Low Stock preview
  renderDashboardLowStockPreview();

  // Update sidebar pills
  updateSidebarCounts();
}

function renderCategorySalesChart() {
  const container = document.getElementById('dash-sales-chart-container');
  if (!container) return;

  const orders = getOrders().filter(o => o.status !== 'Cancelled');
  const categorySales = {
    'Koi Fish': 0,
    'Betta': 0,
    'Goldfish': 0,
    'Guppy': 0,
    'Tetra': 0,
    'Angelfish': 0,
    'Molly': 0
  };

  orders.forEach(order => {
    (order.items || []).forEach(item => {
      const cat = item.category || 'Other';
      if (categorySales[cat] !== undefined) {
        categorySales[cat] += (item.price || 0) * (item.quantity || 1);
      } else {
        categorySales[cat] = (item.price || 0) * (item.quantity || 1);
      }
    });
  });

  const maxVal = Math.max(...Object.values(categorySales), 1000);

  container.innerHTML = Object.entries(categorySales).map(([cat, val]) => {
    const heightPct = Math.max(6, Math.min(100, Math.round((val / maxVal) * 100)));
    return `
      <div class="chart-col" title="${cat}: ${formatCurrency(val)}">
        <div class="chart-tooltip">${formatCurrency(val)}</div>
        <div class="chart-bar-container">
          <div class="chart-bar-fill" style="height: ${heightPct}%;"></div>
        </div>
        <span class="chart-col-label">${cat.replace(' Fish', '')}</span>
      </div>
    `;
  }).join('');
}

function renderDashboardBestSellers() {
  const container = document.getElementById('dash-bestsellers-list');
  if (!container) return;

  const products = getProducts();
  const orders = getOrders().filter(o => o.status !== 'Cancelled');
  const salesMap = {};

  orders.forEach(order => {
    (order.items || []).forEach(item => {
      if (!salesMap[item.id]) {
        salesMap[item.id] = { qty: 0, revenue: 0 };
      }
      salesMap[item.id].qty += item.quantity || 1;
      salesMap[item.id].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  // Sort products by sales volume or default bestsellers
  const ranked = [...products].map(p => {
    const s = salesMap[p.id] || { qty: p.isBestSeller ? 8 : 2, revenue: (p.price || 0) * (p.isBestSeller ? 8 : 2) };
    return { ...p, unitsSold: s.qty, totalRevenue: s.revenue };
  }).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 4);

  container.innerHTML = ranked.map((p, idx) => `
    <div class="bestseller-item">
      <div class="bestseller-rank rank-${idx + 1}">#${idx + 1}</div>
      <img src="${p.image}" alt="${p.name}" class="bestseller-thumb" onerror="handleProductImageError(this, '${p.name}', '${p.category}', '#0077b6')">
      <div class="bestseller-info">
        <div class="bestseller-name">${p.name}</div>
        <div class="bestseller-sub">${p.category} &bull; Stock: ${p.stock}</div>
      </div>
      <div class="bestseller-stats">
        <div class="bestseller-sales">${formatCurrency(p.totalRevenue)}</div>
        <div class="bestseller-units">${p.unitsSold} sold</div>
      </div>
    </div>
  `).join('');
}

function renderDashboardRecentOrders() {
  const tbody = document.getElementById('dash-recent-orders-tbody');
  if (!tbody) return;

  const orders = getOrders().slice(0, 4);

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--slate-400); padding: 1.5rem;">No recent orders found.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(order => `
    <tr>
      <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--cyan-400);">${order.orderId}</td>
      <td style="font-weight: 600; color: var(--white);">${order.customer?.name || 'Customer'}</td>
      <td style="font-weight: 700; color: var(--slate-100);">${formatCurrency(order.totals?.total || 0)}</td>
      <td>
        <span class="badge-pill status-${order.status}">${order.status}</span>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openOrderModal('${order.orderId}')">View</button>
      </td>
    </tr>
  `).join('');
}

function renderDashboardLowStockPreview() {
  const tbody = document.getElementById('dash-lowstock-tbody');
  if (!tbody) return;

  const products = getProducts();
  const lowStock = products.filter(p => (p.stock || 0) < 5).slice(0, 4);

  if (lowStock.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--emerald-400); padding: 1.5rem;">All fish species have healthy inventory (&ge; 5).</td></tr>`;
    return;
  }

  tbody.innerHTML = lowStock.map(p => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <img src="${p.image}" alt="${p.name}" class="table-thumb" style="width: 34px; height: 34px;" onerror="handleProductImageError(this, '${p.name}', '${p.category}', '#0077b6')">
          <span style="font-weight: 600; color: var(--white); font-size: 0.85rem;">${p.name}</span>
        </div>
      </td>
      <td>
        <span class="badge-pill ${p.stock === 0 ? 'badge-outofstock' : 'badge-lowstock'}">
          ${p.stock} left
        </span>
      </td>
      <td>${formatCurrency(p.price)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="quickRestock('${p.id}', 5)" title="Add 5 units">+5</button>
      </td>
    </tr>
  `).join('');
}

/* ==========================================================================
   SECTION 2: PRODUCT MANAGEMENT
   ========================================================================== */
function initProductManagement() {
  const searchInput = document.getElementById('prod-search-input');
  const catFilter = document.getElementById('prod-category-filter');
  const stockFilter = document.getElementById('prod-stock-filter');
  const sortFilter = document.getElementById('prod-sort-filter');
  const clearFiltersBtn = document.getElementById('btn-clear-prod-filters');
  const addProdBtn = document.getElementById('btn-add-product');

  if (searchInput) searchInput.addEventListener('input', renderProducts);
  if (catFilter) catFilter.addEventListener('change', renderProducts);
  if (stockFilter) stockFilter.addEventListener('change', renderProducts);
  if (sortFilter) sortFilter.addEventListener('change', renderProducts);

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (catFilter) catFilter.value = 'all';
      if (stockFilter) stockFilter.value = 'all';
      if (sortFilter) sortFilter.value = 'name-asc';
      renderProducts();
    });
  }

  if (addProdBtn) {
    addProdBtn.addEventListener('click', () => openProductModal(null));
  }

  // Modal Save & Validation
  initProductModal();

  // Delete Confirmation Modal
  initDeleteModal();

  renderProducts();
}

function renderProducts() {
  const tbody = document.getElementById('products-tbody');
  const emptyState = document.getElementById('products-empty-message');
  const countPill = document.getElementById('prod-filtered-count');
  if (!tbody) return;

  const searchVal = document.getElementById('prod-search-input')?.value.trim().toLowerCase() || '';
  const catVal = document.getElementById('prod-category-filter')?.value || 'all';
  const stockVal = document.getElementById('prod-stock-filter')?.value || 'all';
  const sortVal = document.getElementById('prod-sort-filter')?.value || 'name-asc';

  let products = getProducts();
  const totalInCatalog = products.length;

  // Search Filter
  if (searchVal) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchVal) ||
      p.id.toLowerCase().includes(searchVal) ||
      p.category.toLowerCase().includes(searchVal) ||
      (p.specs?.scientificName && p.specs.scientificName.toLowerCase().includes(searchVal))
    );
  }

  // Category Filter
  if (catVal !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === catVal.toLowerCase());
  }

  // Stock Filter
  if (stockVal === 'instock') {
    products = products.filter(p => (p.stock || 0) > 0);
  } else if (stockVal === 'lowstock') {
    products = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 5);
  } else if (stockVal === 'outofstock') {
    products = products.filter(p => (p.stock || 0) <= 0);
  }

  // Sorting
  products.sort((a, b) => {
    if (sortVal === 'name-asc') return a.name.localeCompare(b.name);
    if (sortVal === 'price-asc') return a.price - b.price;
    if (sortVal === 'price-desc') return b.price - a.price;
    if (sortVal === 'stock-asc') return (a.stock || 0) - (b.stock || 0);
    if (sortVal === 'stock-desc') return (b.stock || 0) - (a.stock || 0);
    if (sortVal === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  if (countPill) {
    countPill.textContent = `Showing ${products.length} of ${totalInCatalog} fish`;
  }

  if (products.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = products.map(p => {
    const isOut = (p.stock || 0) <= 0;
    const isLow = (p.stock || 0) > 0 && (p.stock || 0) < 5;

    let stockBadgeClass = 'badge-instock';
    let stockBadgeText = 'In Stock';
    if (isOut) {
      stockBadgeClass = 'badge-outofstock';
      stockBadgeText = 'Out of Stock';
    } else if (isLow) {
      stockBadgeClass = 'badge-lowstock';
      stockBadgeText = 'Low Stock';
    }

    const oldPriceHtml = p.oldPrice && p.oldPrice > p.price
      ? `<span style="font-size: 0.75rem; color: var(--slate-400); text-decoration: line-through; margin-left: 0.35rem;">${formatCurrency(p.oldPrice)}</span>`
      : '';

    return `
      <tr data-prod-id="${p.id}">
        <td>
          <img src="${p.image}" alt="${p.name}" class="table-thumb" onerror="handleProductImageError(this, '${p.name}', '${p.category}', '#0077b6')">
        </td>
        <td>
          <div class="prod-cell-meta">
            <span class="prod-cell-name">${p.name}</span>
            <span class="prod-cell-id">${p.id}</span>
          </div>
        </td>
        <td>
          <span style="font-weight: 600; color: var(--cyan-300);">${p.category}</span>
        </td>
        <td>
          <span style="font-weight: 700; color: var(--white);">${formatCurrency(p.price)}</span>
          ${oldPriceHtml}
        </td>
        <td style="text-align: center;">
          <div class="stock-stepper">
            <button class="stock-stepper-btn" onclick="quickStockChange('${p.id}', -1)" title="Decrease Stock" aria-label="Decrease stock">&minus;</button>
            <span class="stock-stepper-val" style="color: ${isOut ? 'var(--coral-400)' : isLow ? 'var(--amber-400)' : 'var(--white)'};">${p.stock || 0}</span>
            <button class="stock-stepper-btn" onclick="quickStockChange('${p.id}', 1)" title="Increase Stock" aria-label="Increase stock">&plus;</button>
          </div>
        </td>
        <td>
          <button class="badge-pill ${stockBadgeClass}" style="cursor: pointer; border: 1px solid currentColor;" onclick="toggleProductAvailability('${p.id}')" title="Click to toggle in/out of stock">
            ${stockBadgeText}
          </button>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 0.4rem; justify-content: flex-end;">
            <a href="product.html?id=${p.id}" target="_blank" class="btn-icon" title="View in Customer Store" aria-label="View on site">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </a>
            <button class="btn-icon" onclick="openProductModal('${p.id}')" title="Edit Fish Details" aria-label="Edit product">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon btn-icon-danger" onclick="promptDeleteProduct('${p.id}')" title="Delete Product" aria-label="Delete product">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Quick Inline Stock increment / decrement (Synced with MongoDB)
window.quickStockChange = async function(productId, delta) {
  const products = getProducts();
  const prod = products.find(p => p.id === productId || p.productId === productId);
  if (!prod) return;

  const current = prod.stock || 0;
  const updated = Math.max(0, current + delta);
  prod.stock = updated;

  if (window.AquaNestAPI) {
    try {
      await window.AquaNestAPI.updateProduct(productId, { stock: updated });
    } catch (err) {
      console.warn('API stock update error:', err);
    }
  }

  saveProducts(products);
  renderProducts();
  renderDashboard();
  renderLowStock();
  showAdminToast('Stock Updated', `${prod.name} stock set to ${updated} units in MongoDB.`, 'info');
};

// Quick Availability Toggle (Synced with MongoDB)
window.toggleProductAvailability = async function(productId) {
  const products = getProducts();
  const prod = products.find(p => p.id === productId || p.productId === productId);
  if (!prod) return;

  let newStock = 0;
  if ((prod.stock || 0) > 0) {
    prod._savedStock = prod.stock;
    newStock = 0;
    showAdminToast('Marked Out of Stock', `${prod.name} is now marked Out of Stock.`, 'warning');
  } else {
    newStock = prod._savedStock && prod._savedStock > 0 ? prod._savedStock : 10;
    showAdminToast('Marked In Stock', `${prod.name} is now In Stock (${newStock} units).`, 'success');
  }
  prod.stock = newStock;

  if (window.AquaNestAPI) {
    try {
      await window.AquaNestAPI.updateProduct(productId, { stock: newStock });
    } catch (err) {
      console.warn('API availability toggle error:', err);
    }
  }

  saveProducts(products);
  renderProducts();
  renderDashboard();
  renderLowStock();
};

/* ==========================================================================
   PRODUCT MODAL (ADD / EDIT ALL 17 FIELDS)
   ========================================================================== */
function initProductModal() {
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('product-modal-close');
  const cancelBtn = document.getElementById('product-modal-cancel');
  const form = document.getElementById('product-form');
  const nameInput = document.getElementById('form-prod-name');
  const idInput = document.getElementById('form-prod-id');
  const imgInput = document.getElementById('form-prod-image');
  const imgPreview = document.getElementById('form-img-preview');

  if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeProductModal);

  // Auto-slug generator when adding new product
  if (nameInput && idInput) {
    nameInput.addEventListener('input', () => {
      const isEdit = document.getElementById('form-is-edit').value === 'true';
      if (!isEdit) {
        idInput.value = nameInput.value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    });
  }

  // Live image preview
  if (imgInput && imgPreview) {
    imgInput.addEventListener('input', () => {
      const val = imgInput.value.trim();
      if (val) {
        imgPreview.src = val;
        imgPreview.onerror = () => {
          imgPreview.src = 'images/koi-kohaku.jpg';
        };
      }
    });
  }

  // Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProductFormData();
    });
  }
}

window.openProductModal = function(productId = null) {
  const modal = document.getElementById('product-modal');
  const form = document.getElementById('product-form');
  const modalTitle = document.getElementById('product-modal-title');
  const modalDesc = document.getElementById('product-modal-desc');
  const isEditHidden = document.getElementById('form-is-edit');
  const origIdHidden = document.getElementById('form-original-id');
  const idInput = document.getElementById('form-prod-id');
  const saveLabel = document.getElementById('btn-save-product-label');

  if (!modal || !form) return;

  // Clear previous errors
  document.querySelectorAll('.admin-form-err').forEach(el => el.textContent = '');
  document.querySelectorAll('.admin-input, .admin-select, .admin-textarea').forEach(el => el.classList.remove('error'));

  if (productId) {
    // EDIT MODE
    const products = getProducts();
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    modalTitle.textContent = `Edit Fish: ${prod.name}`;
    modalDesc.textContent = `Modify specifications, pricing, and live inventory for ID: ${prod.id}`;
    isEditHidden.value = 'true';
    origIdHidden.value = prod.id;
    saveLabel.textContent = 'Update Product';

    // Populate Fields
    setVal('form-prod-name', prod.name);
    setVal('form-prod-id', prod.id);
    idInput.readOnly = true;
    setVal('form-prod-category', prod.category || 'Koi Fish');
    setVal('form-prod-price', prod.price || '');
    setVal('form-prod-oldprice', prod.oldPrice || '');
    setVal('form-prod-stock', prod.stock !== undefined ? prod.stock : 10);
    setVal('form-prod-rating', prod.rating || 4.8);
    setVal('form-prod-image', prod.image || '');

    const imgPreview = document.getElementById('form-img-preview');
    if (imgPreview) imgPreview.src = prod.image || 'images/koi-kohaku.jpg';

    setVal('form-prod-shortdesc', prod.shortDescription || '');
    setVal('form-prod-fulldesc', prod.fullDescription || '');

    // Specs
    setVal('form-spec-tank', prod.specs?.minTankSize || '20+ Gallons');
    setVal('form-spec-temp', prod.specs?.temperature || '24°C – 28°C');
    setVal('form-spec-ph', prod.specs?.phRange || '6.5 – 7.5');
    setVal('form-spec-care', prod.specs?.careLevel || 'Beginner');
    setVal('form-spec-diet', prod.specs?.diet || 'Omnivorous pellets');
    setVal('form-spec-size', prod.specs?.adultSize || '2.5 inches');
    setVal('form-spec-lifespan', prod.specs?.lifespan || '3 – 5 Years');

    // Checkboxes
    setCheck('form-prod-instock', (prod.stock || 0) > 0);
    setCheck('form-prod-bestseller', !!prod.isBestSeller);
    setCheck('form-prod-trending', !!prod.isTrending);

  } else {
    // ADD NEW MODE
    modalTitle.textContent = 'Add New Aquarium Fish';
    modalDesc.textContent = 'Enter biological parameters, pricing, and stock to list a new specimen in the live catalog.';
    isEditHidden.value = 'false';
    origIdHidden.value = '';
    saveLabel.textContent = 'Save & Publish Product';
    form.reset();
    idInput.readOnly = false;

    // Sensible defaults
    setVal('form-prod-category', 'Koi Fish');
    setVal('form-prod-rating', '4.8');
    setVal('form-prod-stock', '15');
    setVal('form-prod-image', 'images/koi-kohaku.jpg');
    setVal('form-spec-tank', '20+ Gallons');
    setVal('form-spec-temp', '24°C – 28°C');
    setVal('form-spec-ph', '6.8 – 7.6');
    setVal('form-spec-care', 'Beginner');
    setVal('form-spec-diet', 'High-protein pellets & flakes');
    setVal('form-spec-size', '2 – 3 inches');
    setVal('form-spec-lifespan', '3 – 5 Years');
    setCheck('form-prod-instock', true);

    const imgPreview = document.getElementById('form-img-preview');
    if (imgPreview) imgPreview.src = 'images/koi-kohaku.jpg';
  }

  modal.classList.add('open');
};

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('open');
}

function saveProductFormData() {
  const isEdit = document.getElementById('form-is-edit').value === 'true';
  const originalId = document.getElementById('form-original-id').value;

  const name = document.getElementById('form-prod-name').value.trim();
  const id = document.getElementById('form-prod-id').value.trim().toLowerCase();
  const category = document.getElementById('form-prod-category').value;
  const price = parseFloat(document.getElementById('form-prod-price').value);
  const oldPrice = parseFloat(document.getElementById('form-prod-oldprice').value) || null;
  const stock = parseInt(document.getElementById('form-prod-stock').value, 10);
  const rating = parseFloat(document.getElementById('form-prod-rating').value) || 4.8;
  const image = document.getElementById('form-prod-image').value.trim();
  const shortDesc = document.getElementById('form-prod-shortdesc').value.trim();
  const fullDesc = document.getElementById('form-prod-fulldesc').value.trim();

  // Specs
  const tank = document.getElementById('form-spec-tank').value.trim();
  const temp = document.getElementById('form-spec-temp').value.trim();
  const ph = document.getElementById('form-spec-ph').value.trim();
  const care = document.getElementById('form-spec-care').value;
  const diet = document.getElementById('form-spec-diet').value.trim();
  const size = document.getElementById('form-spec-size').value.trim();
  const lifespan = document.getElementById('form-spec-lifespan').value.trim();

  // Flags
  const inStockChecked = document.getElementById('form-prod-instock').checked;
  const isBestSeller = document.getElementById('form-prod-bestseller').checked;
  const isTrending = document.getElementById('form-prod-trending').checked;

  let isValid = true;

  if (!name || name.length < 3) {
    showFormError('form-prod-name', 'err-prod-name', 'Species name is required (min 3 chars)');
    isValid = false;
  }
  if (!id || id.length < 2) {
    showFormError('form-prod-id', 'err-prod-id', 'Unique slug ID is required');
    isValid = false;
  }
  if (isNaN(price) || price <= 0) {
    showFormError('form-prod-price', 'err-prod-price', 'Valid price in INR is required');
    isValid = false;
  }
  if (isNaN(stock) || stock < 0) {
    showFormError('form-prod-stock', 'err-prod-stock', 'Stock must be 0 or greater');
    isValid = false;
  }
  if (!image) {
    showFormError('form-prod-image', 'err-prod-image', 'Image path is required');
    isValid = false;
  }
  if (!shortDesc) {
    showFormError('form-prod-shortdesc', 'err-prod-shortdesc', 'Short description is required');
    isValid = false;
  }
  if (!fullDesc) {
    showFormError('form-prod-fulldesc', 'err-prod-fulldesc', 'Full description is required');
    isValid = false;
  }

  // ID Uniqueness check when adding
  const products = getProducts();
  if (!isEdit && products.some(p => p.id === id)) {
    showFormError('form-prod-id', 'err-prod-id', 'A product with this ID already exists!');
    isValid = false;
  }

  if (!isValid) return;

  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  const finalStock = inStockChecked ? Math.max(1, stock) : 0;

  const productData = {
    id,
    name,
    category,
    categorySlug,
    price,
    oldPrice,
    stock: finalStock,
    rating,
    reviewsCount: isEdit ? (products.find(p => p.id === originalId)?.reviewsCount || 35) : 18,
    isTrending,
    isBestSeller,
    isSpecialOffer: !!(oldPrice && oldPrice > price),
    discountBadge: oldPrice && oldPrice > price ? `${Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF` : null,
    image,
    fallbackColor: '#0077b6',
    shortDescription: shortDesc,
    fullDescription: fullDesc,
    specs: {
      scientificName: `${name} (AquaNest Select)`,
      careLevel: care,
      temperament: 'Peaceful & Hardy',
      minTankSize: tank,
      temperature: temp,
      phRange: ph,
      diet: diet,
      adultSize: size,
      lifespan: lifespan,
      liveArrivalGuarantee: '100% Live Arrival Guarantee in insulated climate crates.'
    }
  };

  if (isEdit) {
    if (window.AquaNestAPI) {
      window.AquaNestAPI.updateProduct(originalId, productData).catch(err => {
        console.warn('API update error:', err);
      });
    }
    const idx = products.findIndex(p => p.id === originalId);
    if (idx > -1) {
      products[idx] = productData;
    }
    showAdminToast('Product Updated', `Successfully updated "${name}" in MongoDB.`, 'success');
  } else {
    if (window.AquaNestAPI) {
      window.AquaNestAPI.createProduct(productData).catch(err => {
        console.warn('API create error:', err);
      });
    }
    products.unshift(productData);
    showAdminToast('Product Created', `Added "${name}" to MongoDB store catalog!`, 'success');
  }

  saveProducts(products);
  closeProductModal();
  renderProducts();
  renderDashboard();
  renderLowStock();
}

function showFormError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.add('error');
  if (err) err.textContent = msg;
}

/* ==========================================================================
   DELETE MODAL (SAFETY AGAINST ACCIDENTAL DELETION)
   ========================================================================== */
function initDeleteModal() {
  const modal = document.getElementById('delete-modal');
  const cancelBtn = document.getElementById('btn-cancel-delete');
  const confirmBtn = document.getElementById('btn-confirm-delete');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      modal?.classList.remove('open');
      productToDeleteId = null;
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      if (!productToDeleteId) return;
      const products = getProducts();
      const prod = products.find(p => p.id === productToDeleteId);
      const updated = products.filter(p => p.id !== productToDeleteId);

      if (window.AquaNestAPI) {
        try {
          await window.AquaNestAPI.deleteProduct(productToDeleteId);
        } catch (e) {
          console.warn('API delete error:', e);
        }
      }

      saveProducts(updated);
      modal?.classList.remove('open');

      showAdminToast('Product Deleted', `"${prod?.name || productToDeleteId}" was removed from MongoDB.`, 'warning');
      productToDeleteId = null;

      renderProducts();
      renderDashboard();
      renderLowStock();
    });
  }
}

window.promptDeleteProduct = function(productId) {
  const modal = document.getElementById('delete-modal');
  const nameEl = document.getElementById('delete-prod-name');
  const products = getProducts();
  const prod = products.find(p => p.id === productId);

  productToDeleteId = productId;
  if (nameEl) nameEl.textContent = prod ? prod.name : productId;
  if (modal) modal.classList.add('open');
};

/* ==========================================================================
   SECTION 3: ORDER MANAGEMENT
   ========================================================================== */
function initOrderManagement() {
  const searchInput = document.getElementById('order-search-input');
  const statusFilter = document.getElementById('order-status-filter');
  const seedBtn = document.getElementById('btn-seed-orders');
  const sampleBtn = document.getElementById('btn-create-sample-order');
  const modal = document.getElementById('order-modal');
  const closeBtn = document.getElementById('order-modal-close');
  const doneBtn = document.getElementById('order-modal-done');

  if (searchInput) searchInput.addEventListener('input', renderOrders);
  if (statusFilter) statusFilter.addEventListener('change', renderOrders);

  if (seedBtn) {
    seedBtn.addEventListener('click', () => {
      saveOrders(SAMPLE_DEMO_ORDERS);
      renderOrders();
      renderDashboard();
      showAdminToast('Orders Loaded', 'Sample live orders loaded into system.', 'success');
    });
  }

  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const orders = getOrders();
      const newOrder = {
        orderId: 'AN-2026-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Confirmed',
        paymentMethod: 'Instant UPI',
        customer: {
          name: 'Kavita Sundaram',
          phone: '9840123987',
          email: 'kavita.s@example.com',
          address: 'Villa 18, Palm Grove Estates',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pin: '600028',
          notes: 'Handle oxygen crate gently'
        },
        items: [
          { id: 'betta-halfmoon-blue', name: 'Royal Blue Halfmoon Betta', category: 'Betta', price: 420, quantity: 2, image: 'images/betta-halfmoon-blue.jpg' },
          { id: 'guppy-blue-moscow', name: 'Blue Moscow Guppy Trio', category: 'Guppy', price: 349, quantity: 1, image: 'images/guppy-blue-moscow.jpg' }
        ],
        totals: { subtotal: 1189, shipping: 0, discountAmount: 0, total: 1189 }
      };
      orders.unshift(newOrder);
      saveOrders(orders);
      renderOrders();
      renderDashboard();
      showAdminToast('Order Created', `Generated sample order #${newOrder.orderId}`, 'success');
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', () => modal?.classList.remove('open'));
  if (doneBtn) doneBtn.addEventListener('click', () => modal?.classList.remove('open'));

  renderOrders();
}

function renderOrders() {
  const tbody = document.getElementById('orders-tbody');
  const emptyState = document.getElementById('orders-empty-message');
  const countPill = document.getElementById('orders-filtered-count');
  if (!tbody) return;

  const searchVal = document.getElementById('order-search-input')?.value.trim().toLowerCase() || '';
  const statusVal = document.getElementById('order-status-filter')?.value || 'all';

  let orders = getOrders();
  const totalOrders = orders.length;

  // Search
  if (searchVal) {
    orders = orders.filter(o => 
      o.orderId.toLowerCase().includes(searchVal) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(searchVal)) ||
      (o.customer?.city && o.customer.city.toLowerCase().includes(searchVal))
    );
  }

  // Status Filter
  if (statusVal !== 'all') {
    orders = orders.filter(o => o.status === statusVal);
  }

  if (countPill) {
    countPill.textContent = `${orders.length} of ${totalOrders} Orders`;
  }

  if (orders.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = orders.map(order => {
    const orderId = order.orderId || order.id;
    const custName = order.customer?.fullName || order.customer?.name || 'Customer';
    const orderDateStr = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : (order.date || 'Today');
    const itemsList = order.products || order.items || [];
    const itemsPreview = itemsList.map(i => `${i.name} &times; ${i.quantity || 1}`).join(', ') || 'Aquarium fish';
    const totalAmount = order.total !== undefined ? order.total : (order.totalAmount !== undefined ? order.totalAmount : (order.totals?.total || 0));
    const currentStatus = order.orderStatus || order.status || 'Pending';
    const isPaid = order.paymentStatus === 'PAID' || order.isPaid;
    const paymentBadgeHtml = isPaid
      ? `<span class="badge-pill" style="background: rgba(16, 185, 129, 0.2); color: var(--emerald-400); border: 1px solid rgba(16, 185, 129, 0.4); font-size: 0.65rem; padding: 1px 6px; font-weight: 700;">✓ PAID</span>`
      : `<span class="badge-pill" style="background: rgba(245, 158, 11, 0.15); color: var(--amber-400); border: 1px solid rgba(245, 158, 11, 0.3); font-size: 0.65rem; padding: 1px 6px; font-weight: 700;">PENDING</span>`;
    const txIdHtml = order.razorpayPaymentId
      ? `<span style="font-size: 0.68rem; font-family: monospace; color: var(--cyan-300); letter-spacing: 0.2px;" title="Razorpay Tx: ${order.razorpayPaymentId}">ID: ${order.razorpayPaymentId.substring(0, 14)}${order.razorpayPaymentId.length > 14 ? '...' : ''}</span>`
      : '';

    return `
      <tr data-order-id="${orderId}">
        <td style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--cyan-400);">
          ${orderId}
        </td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <strong style="color: var(--white);">${custName}</strong>
            <span style="font-size: 0.74rem; color: var(--slate-400);">${order.customer?.phone || ''} &bull; ${order.customer?.city || ''}</span>
          </div>
        </td>
        <td style="font-size: 0.82rem; color: var(--slate-300);">${orderDateStr}</td>
        <td style="max-width: 260px;">
          <div style="font-size: 0.82rem; color: var(--slate-200); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsPreview}">
            ${itemsPreview}
          </div>
        </td>
        <td style="font-weight: 800; color: var(--white);">${formatCurrency(totalAmount)}</td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 0.2rem; align-items: flex-start;">
            <div style="display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
              <span style="font-size: 0.82rem; color: var(--slate-100); font-weight: 600;">${order.paymentMethod || 'Razorpay'}</span>
              ${paymentBadgeHtml}
            </div>
            ${txIdHtml}
          </div>
        </td>
        <td>
          <select class="status-select status-${currentStatus}" onchange="updateOrderStatus('${orderId}', this.value)" aria-label="Change status for ${orderId}">
            <option value="Pending" ${currentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${currentStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Packed" ${currentStatus === 'Packed' ? 'selected' : ''}>Packed</option>
            <option value="Shipped" ${currentStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${currentStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${currentStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td style="text-align: right;">
          <button class="btn btn-secondary btn-sm" onclick="openOrderModal('${orderId}')">Details</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.updateOrderStatus = async function(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find(o => (o.orderId === orderId || o.id === orderId));
  if (!order) return;

  order.status = newStatus;
  order.orderStatus = newStatus;

  // Send status update to MongoDB API
  if (window.AquaNestAPI) {
    try {
      await window.AquaNestAPI.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.warn('API error updating order status:', err);
    }
  }

  saveOrders(orders);
  renderOrders();
  renderDashboard();

  showAdminToast('Status Changed', `Order #${orderId} marked as ${newStatus} in MongoDB.`, 'info');
};

window.openOrderModal = function(orderId) {
  const orders = getOrders();
  const order = orders.find(o => (o.orderId === orderId || o.id === orderId));
  if (!order) return;

  const modal = document.getElementById('order-modal');
  const title = document.getElementById('order-modal-id');
  const date = document.getElementById('order-modal-date');
  const content = document.getElementById('order-modal-content');
  const statusSelect = document.getElementById('order-modal-status-select');

  if (!modal || !content) return;

  const currentOrderId = order.orderId || order.id;
  const currentStatus = order.orderStatus || order.status || 'Pending';
  const orderDateStr = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN') : (order.date || 'Today');

  title.textContent = `Order Slip: ${currentOrderId}`;
  date.textContent = `Placed on ${orderDateStr} • Payment: ${order.paymentMethod || 'COD'}`;

  if (statusSelect) {
    statusSelect.value = currentStatus;
    statusSelect.onchange = () => {
      updateOrderStatus(currentOrderId, statusSelect.value);
    };
  }

  const itemsList = order.products || order.items || [];
  const itemsHtml = itemsList.map(i => `
    <div class="order-slip-row">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <img src="${i.image || 'images/koi-kohaku.jpg'}" alt="${i.name}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;" onerror="handleProductImageError(this, '${i.name}', '${i.category || ''}', '#0077b6')">
        <div>
          <strong style="color: var(--white);">${i.name}</strong>
          <div style="font-size: 0.74rem; color: var(--slate-400);">${i.category ? i.category + ' &bull; ' : ''}Qty: ${i.quantity || 1} &times; ${formatCurrency(i.price)}</div>
        </div>
      </div>
      <strong style="color: var(--cyan-300);">${formatCurrency((i.price || 0) * (i.quantity || 1))}</strong>
    </div>
  `).join('');

  const custName = order.customer?.fullName || order.customer?.name || 'Customer';
  const pinCode = order.customer?.pincode || order.customer?.pin || '';

  const subtotalVal = order.totals?.subtotal !== undefined ? order.totals.subtotal : (order.subtotal !== undefined ? order.subtotal : 0);
  const shippingVal = order.totals?.shipping !== undefined ? order.totals.shipping : (order.deliveryCharge !== undefined ? order.deliveryCharge : 0);
  const discountVal = order.totals?.discountAmount !== undefined ? order.totals.discountAmount : (order.discount !== undefined ? order.discount : 0);
  const totalVal = order.totals?.total !== undefined ? order.totals.total : (order.total !== undefined ? order.total : (order.totalAmount || 0));
  const isPaid = order.paymentStatus === 'PAID' || order.isPaid;

  content.innerHTML = `
    <!-- Payment & Gateway Status Banner -->
    <div style="background: rgba(0, 210, 255, 0.05); border: 1px solid rgba(0, 210, 255, 0.18); border-radius: 8px; padding: 1.1rem; margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
        <span style="font-size: 0.78rem; font-weight: 700; color: var(--cyan-400); text-transform: uppercase; letter-spacing: 0.5px;">Payment Verification & Gateway</span>
        ${isPaid 
          ? `<span class="badge-pill" style="background: rgba(16, 185, 129, 0.2); color: var(--emerald-400); border: 1px solid rgba(16, 185, 129, 0.4); font-size: 0.72rem; padding: 3px 9px; font-weight: 700;">✓ VERIFIED & PAID</span>`
          : `<span class="badge-pill" style="background: rgba(245, 158, 11, 0.2); color: var(--amber-400); border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.72rem; padding: 3px 9px; font-weight: 700;">⏳ PAYMENT PENDING</span>`
        }
      </div>
      <div style="font-size: 0.88rem; color: var(--slate-200);">
        <strong>Payment Method:</strong> ${order.paymentMethod || 'Razorpay Secure Gateway'}
      </div>
      ${order.razorpayPaymentId ? `
        <div style="font-size: 0.84rem; color: var(--cyan-300); margin-top: 0.35rem; font-family: 'JetBrains Mono', monospace;">
          <strong>Razorpay Payment ID:</strong> ${order.razorpayPaymentId}
        </div>
      ` : ''}
      ${order.razorpayOrderId ? `
        <div style="font-size: 0.82rem; color: var(--slate-400); margin-top: 0.25rem; font-family: 'JetBrains Mono', monospace;">
          <strong>Razorpay Order ID:</strong> ${order.razorpayOrderId}
        </div>
      ` : ''}
      ${order.paidAt ? `
        <div style="font-size: 0.82rem; color: var(--slate-400); margin-top: 0.25rem;">
          <strong>Paid At:</strong> ${new Date(order.paidAt).toLocaleString('en-IN')}
        </div>
      ` : ''}
    </div>

    <!-- Customer Destination -->
    <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1.25rem; margin-bottom: 1.25rem;">
      <h4 style="color: var(--cyan-400); font-size: 0.8rem; text-transform: uppercase; margin-bottom: 0.4rem;">Customer Delivery Destination</h4>
      <div style="font-size: 1rem; font-weight: 700; color: var(--white);">${custName}</div>
      <div style="font-size: 0.85rem; color: var(--slate-300); margin-top: 0.2rem;">📞 +91 ${order.customer?.phone || ''} &bull; ✉️ ${order.customer?.email || ''}</div>
      <div style="font-size: 0.88rem; color: var(--slate-200); margin-top: 0.4rem;">
        ${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.state || ''}${pinCode ? ' - ' + pinCode : ''}
      </div>
      ${order.customer?.notes ? `<div style="font-size: 0.8rem; color: var(--amber-400); margin-top: 0.4rem; font-style: italic;">Note: "${order.customer.notes}"</div>` : ''}
    </div>

    <h4 style="color: var(--slate-400); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Ordered Aquatic Livestock</h4>
    <div class="order-items-slip">
      ${itemsHtml}
    </div>

    <div style="background: rgba(4, 8, 20, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 1rem; margin-top: 1rem;">
      <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--slate-300); margin-bottom: 0.35rem;">
        <span>Livestock Subtotal</span>
        <strong>${formatCurrency(subtotalVal)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--slate-300); margin-bottom: 0.35rem;">
        <span>Insulated Dispatch</span>
        <strong>${shippingVal === 0 ? 'FREE' : formatCurrency(shippingVal)}</strong>
      </div>
      ${discountVal > 0 ? `
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--emerald-400); margin-bottom: 0.35rem;">
          <span>Promo Code Discount</span>
          <strong>-${formatCurrency(discountVal)}</strong>
        </div>
      ` : ''}
      <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--white); padding-top: 0.6rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <span>Total Amount</span>
        <span style="color: var(--cyan-400);">${formatCurrency(totalVal)}</span>
      </div>
    </div>
  `;

  modal.classList.add('open');
};

/* ==========================================================================
   SECTION 4: LOW STOCK MANAGEMENT
   ========================================================================== */
function initLowStock() {
  renderLowStock();
}

function renderLowStock() {
  const tbody = document.getElementById('lowstock-tbody');
  const emptyState = document.getElementById('lowstock-empty-message');
  if (!tbody) return;

  const products = getProducts();
  const lowStock = products.filter(p => (p.stock || 0) < 5);

  if (lowStock.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = lowStock.map(p => `
    <tr>
      <td>
        <img src="${p.image}" alt="${p.name}" class="table-thumb" onerror="handleProductImageError(this, '${p.name}', '${p.category}', '#0077b6')">
      </td>
      <td>
        <div class="prod-cell-meta">
          <span class="prod-cell-name">${p.name}</span>
          <span class="prod-cell-id">${p.id}</span>
        </div>
      </td>
      <td><span style="color: var(--cyan-300); font-weight: 600;">${p.category}</span></td>
      <td style="font-weight: 700; color: var(--white);">${formatCurrency(p.price)}</td>
      <td style="text-align: center;">
        <span class="badge-pill ${p.stock === 0 ? 'badge-outofstock' : 'badge-lowstock'}" style="font-size: 0.82rem; padding: 3px 10px;">
          ${p.stock || 0} Units
        </span>
      </td>
      <td>
        <span style="font-size: 0.78rem; color: ${p.stock === 0 ? 'var(--coral-400)' : 'var(--amber-400)'}; font-weight: 700;">
          ${p.stock === 0 ? '🚨 Sold Out' : '⚠️ Low Inventory'}
        </span>
      </td>
      <td style="text-align: right;">
        <div class="restock-btn-group">
          <button class="btn btn-secondary btn-sm" onclick="quickRestock('${p.id}', 5)">+5 Units</button>
          <button class="btn btn-secondary btn-sm" onclick="quickRestock('${p.id}', 10)">+10 Units</button>
          <button class="btn btn-outline btn-sm" onclick="openProductModal('${p.id}')">Edit</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.quickRestock = function(productId, addUnits) {
  const products = getProducts();
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  prod.stock = (prod.stock || 0) + addUnits;
  saveProducts(products);

  renderLowStock();
  renderProducts();
  renderDashboard();

  showAdminToast('Restocked!', `Added ${addUnits} units to ${prod.name}. Now ${prod.stock} in stock.`, 'success');
};

/* ==========================================================================
   SECTION 5: SALES ANALYTICS
   ========================================================================== */
function initSalesAnalytics() {
  renderSalesAnalytics();
}

function renderSalesAnalytics() {
  const orders = getOrders().filter(o => o.status !== 'Cancelled');
  const products = getProducts();

  const grossRev = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
  const totalUnits = orders.reduce((sum, o) => {
    return sum + (o.items || []).reduce((isum, item) => isum + (item.quantity || 1), 0);
  }, 0);
  const aov = orders.length > 0 ? Math.round(grossRev / orders.length) : 0;

  setText('sales-gross-revenue', formatCurrency(grossRev));
  setText('sales-order-count', orders.length);
  setText('sales-aov', formatCurrency(aov));
  setText('sales-units-sold', totalUnits);

  // Horizontal Breakdown Chart by Category
  const chartContainer = document.getElementById('sales-analytics-chart');
  if (chartContainer) {
    const catMap = {
      'Koi Fish': 0,
      'Betta': 0,
      'Goldfish': 0,
      'Guppy': 0,
      'Tetra': 0,
      'Angelfish': 0,
      'Molly': 0
    };

    orders.forEach(o => {
      (o.items || []).forEach(i => {
        const cat = i.category || 'Other';
        if (catMap[cat] !== undefined) {
          catMap[cat] += (i.price || 0) * (i.quantity || 1);
        } else {
          catMap[cat] = (i.price || 0) * (i.quantity || 1);
        }
      });
    });

    const maxCat = Math.max(...Object.values(catMap), 1000);

    chartContainer.innerHTML = Object.entries(catMap).map(([cat, val]) => {
      const pct = Math.max(3, Math.min(100, Math.round((val / maxCat) * 100)));
      return `
        <div class="chart-horizontal-row">
          <span class="chart-cat-name">${cat}</span>
          <div class="chart-track">
            <div class="chart-fill-bar" style="width: ${pct}%;"></div>
          </div>
          <span class="chart-cat-val">${formatCurrency(val)}</span>
        </div>
      `;
    }).join('');
  }

  // Best Sellers Leaderboard Table
  const tbody = document.getElementById('sales-bestsellers-tbody');
  if (tbody) {
    const salesMap = {};
    orders.forEach(order => {
      (order.items || []).forEach(item => {
        if (!salesMap[item.id]) salesMap[item.id] = { qty: 0, revenue: 0 };
        salesMap[item.id].qty += item.quantity || 1;
        salesMap[item.id].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const sorted = [...products].map(p => {
      const s = salesMap[p.id] || { qty: p.isBestSeller ? 6 : 1, revenue: (p.price || 0) * (p.isBestSeller ? 6 : 1) };
      return { ...p, units: s.qty, gross: s.revenue };
    }).sort((a, b) => b.units - a.units);

    tbody.innerHTML = sorted.map((p, idx) => `
      <tr>
        <td>
          <div class="bestseller-rank rank-${idx + 1}" style="width: 26px; height: 26px;">#${idx + 1}</div>
        </td>
        <td>
          <img src="${p.image}" alt="${p.name}" class="table-thumb" style="width: 38px; height: 38px;" onerror="handleProductImageError(this, '${p.name}', '${p.category}', '#0077b6')">
        </td>
        <td>
          <strong style="color: var(--white); font-size: 0.92rem;">${p.name}</strong>
          <div style="font-size: 0.74rem; color: var(--slate-400);">${p.category}</div>
        </td>
        <td>${formatCurrency(p.price)}</td>
        <td style="text-align: center; font-weight: 800; color: var(--cyan-300);">${p.units} Units</td>
        <td style="text-align: right; font-weight: 800; color: var(--white);">${formatCurrency(p.gross)}</td>
        <td style="text-align: center;">
          <span class="badge-pill ${(p.stock || 0) <= 0 ? 'badge-outofstock' : (p.stock || 0) < 5 ? 'badge-lowstock' : 'badge-instock'}">
            ${p.stock || 0} in stock
          </span>
        </td>
      </tr>
    `).join('');
  }
}

/* ==========================================================================
   SECTION 7: SETTINGS & DATA TOOLS
   ========================================================================== */
function initSettings() {
  const resetBtn = document.getElementById('btn-reset-default-catalog');
  const seedBtn = document.getElementById('btn-seed-demo-orders-settings');
  const clearOrdersBtn = document.getElementById('btn-clear-all-orders');

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to restore the default 20 species catalog? Any custom added fish will be removed.')) {
        if (typeof resetProductsToDefault === 'function') {
          resetProductsToDefault();
        }
        renderProducts();
        renderDashboard();
        renderLowStock();
        showAdminToast('Catalog Restored', 'The default 20 fish species have been re-initialized.', 'success');
      }
    });
  }

  if (seedBtn) {
    seedBtn.addEventListener('click', () => {
      saveOrders(SAMPLE_DEMO_ORDERS);
      renderOrders();
      renderDashboard();
      renderSalesAnalytics();
      showAdminToast('Orders Loaded', 'Sample realistic customer orders imported.', 'success');
    });
  }

  if (clearOrdersBtn) {
    clearOrdersBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all order history? This cannot be undone.')) {
        saveOrders([]);
        renderOrders();
        renderDashboard();
        renderSalesAnalytics();
        showAdminToast('Orders Cleared', 'All order logs have been removed.', 'warning');
      }
    });
  }
}

/* ==========================================================================
   ADMIN TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showAdminToast(title, message, type = 'success') {
  let container = document.getElementById('admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-toast-container';
    container.className = 'admin-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `admin-toast-item toast-${type}`;
  toast.innerHTML = `
    <div class="admin-toast-content">
      <span class="admin-toast-title">${title}</span>
      <span class="admin-toast-desc">${message}</span>
    </div>
    <button class="admin-toast-close" onclick="this.closest('.admin-toast-item').remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 250);
  }, 4000);
}

// Global hook for product image errors
function handleProductImageError(imgElement, productName, category, color) {
  if (imgElement && !imgElement.dataset.fallbackSet) {
    imgElement.dataset.fallbackSet = "true";
    if (typeof getFishSvgFallback === 'function') {
      imgElement.src = getFishSvgFallback(productName, category, color);
    }
  }
}

/* ==========================================================================
   DOM UTILS
   ========================================================================== */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined ? val : '';
}

function setCheck(id, bool) {
  const el = document.getElementById(id);
  if (el) el.checked = !!bool;
}
