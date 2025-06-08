// Local storage key for cart items
const CART_STORAGE_KEY = 'voltvillage_cart';

// Get cart items from local storage
export const getCartItems = () => {
  if (typeof window === 'undefined') return [];
  const items = localStorage.getItem(CART_STORAGE_KEY);
  return items ? JSON.parse(items) : [];
};

// Add item to cart
export const addToCart = (item) => {
  const cart = getCartItems();
  const existingItemIndex = cart.findIndex(i => i.id === item.id);

  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += 1;
  } else {
    // Add new item with quantity 1
    cart.push({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: 1,
      seller: item.seller ? `${item.seller.name} ${item.seller.surname}` : 'Unknown Seller',
      image: item.photo_urls?.[0]?.photo_url || '/placeholder.jpg',
      maxQuantity: item.quantity || 1
    });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  return cart;
};

// Remove item from cart
export const removeFromCart = (itemId) => {
  const cart = getCartItems();
  const updatedCart = cart.filter(item => item.id !== itemId);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  return updatedCart;
};

// Update item quantity in cart
export const updateCartItemQuantity = (itemId, quantity) => {
  const cart = getCartItems();
  const updatedCart = cart.map(item => 
    item.id === itemId ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) } : item
  );
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  return updatedCart;
};

// Clear cart
export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  return [];
};
