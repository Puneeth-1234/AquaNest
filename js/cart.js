/**
 * AquaNest - Cart & Wishlist Service
 * State persistence with localStorage, calculations, coupons, and toast notifications
 */

const STORAGE_KEYS = {
  CART: 'aquanest_cart_v1',
  WISHLIST: 'aquanest_wishlist_v1',
  PROMO: 'aquanest_applied_promo_v1',
  LAST_ORDER: 'aquanest_last_order_v1'
};

const PROMO_CODES = {
  'AQUA10': { type: 'percent', value: 10, description: '10% off entire order' },
  'WELCOME50': { type: 'flat', value: 50, minSubtotal: 500, description: '₹50 flat off on ₹500+' },
  'FREESHIP': { type: 'shipping', value: 100, description: 'Free Express Aquatic Shipping' }
};

// --- CART CORE ---
function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    const cart = raw ? JSON.parse(raw) : [];
    if (typeof getProductById === 'function') {
      cart.forEach(item => {
        const prod = getProductById(item.id);
        if (prod) {
          item.image = prod.image;
          item.name = prod.name;
          item.category = prod.category;
        }
      });
    }
    return cart;
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    updateHeaderBadges();
    window.dispatchEvent(new CustomEvent('aquanest:cartUpdated', { detail: { cart } }));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
}

function addToCart(productId, quantity = 1, showNotification = true) {
  const product = typeof getProductById === 'function' ? getProductById(productId) : null;
  if (!product) {
    console.error('Product not found:', productId);
    return false;
  }

  if (product.stock !== undefined && product.stock <= 0) {
    if (showNotification) {
      showToast('Out of Stock', `${product.name} is currently out of stock. We will restock soon!`, 'warning');
    }
    return false;
  }

  const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    const newQty = cart[existingItemIndex].quantity + qtyToAdd;
    // Check against available stock if specified
    if (product.stock && newQty > product.stock) {
      cart[existingItemIndex].quantity = product.stock;
      if (showNotification) {
        showToast('Maximum Stock Reached', `Only ${product.stock} units available for ${product.name}.`, 'warning');
      }
    } else {
      cart[existingItemIndex].quantity = newQty;
    }
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      quantity: Math.min(qtyToAdd, product.stock || 99)
    });
  }

  saveCart(cart);

  if (showNotification) {
    showToast(
      'Added to Cart!',
      `${qtyToAdd} × ${product.name} added to your cart.`,
      'success',
      'View Cart',
      'cart.html'
    );
  }

  return true;
}

function updateCartQuantity(productId, newQuantity) {
  let qty = parseInt(newQuantity, 10);
  if (isNaN(qty) || qty < 1) {
    qty = 1;
  }
  const product = typeof getProductById === 'function' ? getProductById(productId) : null;
  const maxStock = product && product.stock !== undefined ? product.stock : 99;

  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity = Math.max(1, Math.min(qty, maxStock));
    saveCart(cart);
  }
}

function removeFromCart(productId, showNotification = true) {
  let cart = getCart();
  const item = cart.find(i => i.id === productId);
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);

  if (showNotification && item) {
    showToast('Item Removed', `${item.name} was removed from your cart.`, 'info');
  }
  return true;
}

function clearCart() {
  saveCart([]);
  localStorage.removeItem(STORAGE_KEYS.PROMO);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
}

// Calculations & Totals
function getCartTotals() {
  const subtotal = getCartSubtotal();
  const appliedPromo = getAppliedPromo();
  let standardShipping = subtotal >= 999 || subtotal === 0 ? 0 : 99; // Free above ₹999
  let discountAmount = 0;

  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo.type === 'percent') {
      discountAmount = Math.round((subtotal * promo.value) / 100);
    } else if (promo.type === 'flat') {
      if (!promo.minSubtotal || subtotal >= promo.minSubtotal) {
        discountAmount = promo.value;
      }
    } else if (promo.type === 'shipping') {
      standardShipping = 0;
      discountAmount = 0;
    }
  }

  // Live Fish Oxygen Packing is covered under shipping, estimated 5% GST included in base
  const total = Math.max(0, subtotal - discountAmount + standardShipping);

  return {
    subtotal,
    shipping: standardShipping,
    isFreeShipping: standardShipping === 0 && subtotal > 0,
    appliedPromo,
    discountAmount,
    total
  };
}

function applyPromoCode(rawCode) {
  const code = (rawCode || '').trim().toUpperCase();
  if (!code) {
    return { success: false, message: 'Please enter a coupon code.' };
  }

  const promo = PROMO_CODES[code];
  if (!promo) {
    return { success: false, message: 'Invalid coupon code. Try AQUA10 for 10% off.' };
  }

  const subtotal = getCartSubtotal();
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return { 
      success: false, 
      message: `Minimum order amount of ₹${promo.minSubtotal} required for code ${code}.` 
    };
  }

  localStorage.setItem(STORAGE_KEYS.PROMO, code);
  window.dispatchEvent(new CustomEvent('aquanest:cartUpdated', { detail: { cart: getCart() } }));
  return { 
    success: true, 
    code, 
    description: promo.description, 
    message: `Promo code "${code}" applied successfully!` 
  };
}

function removePromoCode() {
  localStorage.removeItem(STORAGE_KEYS.PROMO);
  window.dispatchEvent(new CustomEvent('aquanest:cartUpdated', { detail: { cart: getCart() } }));
}

function getAppliedPromo() {
  return localStorage.getItem(STORAGE_KEYS.PROMO);
}

// --- WISHLIST CORE ---
function getWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading wishlist', e);
    return [];
  }
}

function saveWishlist(list) {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
    updateHeaderBadges();
    window.dispatchEvent(new CustomEvent('aquanest:wishlistUpdated', { detail: { wishlist: list } }));
  } catch (e) {
    console.error('Error saving wishlist', e);
  }
}

function isInWishlist(productId) {
  const list = getWishlist();
  return list.includes(productId);
}

function toggleWishlist(productId, showNotification = true) {
  let list = getWishlist();
  const product = typeof getProductById === 'function' ? getProductById(productId) : null;
  const name = product ? product.name : 'Item';
  const index = list.indexOf(productId);
  let isAdded = false;

  if (index > -1) {
    list.splice(index, 1);
    isAdded = false;
    if (showNotification) {
      showToast('Wishlist Updated', `${name} removed from your wishlist.`, 'info');
    }
  } else {
    list.push(productId);
    isAdded = true;
    if (showNotification) {
      showToast('Saved to Wishlist', `${name} added to your wishlist.`, 'success');
    }
  }

  saveWishlist(list);
  updateWishlistButtons(productId, isAdded);
  return isAdded;
}

function updateWishlistButtons(productId, isAdded) {
  const btns = document.querySelectorAll(`[data-wishlist-id="${productId}"]`);
  btns.forEach(btn => {
    btn.classList.toggle('active', isAdded);
    btn.setAttribute('aria-pressed', isAdded ? 'true' : 'false');
    const icon = btn.querySelector('svg, i');
    if (icon) {
      if (isAdded) {
        btn.setAttribute('title', 'Remove from Wishlist');
      } else {
        btn.setAttribute('title', 'Add to Wishlist');
      }
    }
  });
}

function getWishlistCount() {
  return getWishlist().length;
}

// --- UI BADGES SYNC ---
function updateHeaderBadges() {
  const cartBadges = document.querySelectorAll('.cart-count-badge');
  const cartCount = getCartCount();
  cartBadges.forEach(badge => {
    badge.textContent = cartCount;
    badge.style.display = cartCount > 0 ? 'inline-flex' : 'none';
  });

  const wishlistBadges = document.querySelectorAll('.wishlist-count-badge');
  const wishCount = getWishlistCount();
  wishlistBadges.forEach(badge => {
    badge.textContent = wishCount;
    badge.style.display = wishCount > 0 ? 'inline-flex' : 'none';
  });
}

// --- TOAST NOTIFICATION SYSTEM ---
function showToast(title, message, type = 'info', actionText = null, actionUrl = null) {
  let container = document.getElementById('aquanest-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'aquanest-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.setAttribute('role', 'alert');

  // Aquatic Icons
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (type === 'warning') {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconSvg = `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  let actionHtml = '';
  if (actionText && actionUrl) {
    actionHtml = `<a href="${actionUrl}" class="toast-action-btn">${actionText} &rarr;</a>`;
  }

  toast.innerHTML = `
    <div class="toast-icon-wrapper">${iconSvg}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-desc">${message}</div>
      ${actionHtml}
    </div>
    <button class="toast-close-btn" aria-label="Close notification" onclick="this.closest('.toast-item').remove()">&times;</button>
  `;

  container.appendChild(toast);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 300);
  }, 4500);
}

// Initial Sync
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderBadges();
});

// Sync across tabs
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEYS.CART || e.key === STORAGE_KEYS.WISHLIST) {
    updateHeaderBadges();
  }
});
