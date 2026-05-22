import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('hook_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('hook_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      // Use stockQuantity (from API) or fallback to 99 if undefined
      const stock = product.stockQuantity ?? 99; 

      if (existingItem) {
        // If it exists, but we hit the stock limit, don't add more
        if (existingItem.quantity >= stock) return prev;
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // New item
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          const stock = item.stockQuantity ?? 99;
          // Ensure quantity stays between 1 and available stock
          if (newQuantity > 0 && newQuantity <= stock) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  // Calculate totals
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};