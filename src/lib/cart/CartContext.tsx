'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ICartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  cart: ICartItem[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  appliedVoucherCode: string | null;
  setAppliedVoucherCode: (code: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('ventershop_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      const storedVoucher = localStorage.getItem('ventershop_voucher');
      if (storedVoucher) {
        setAppliedVoucherCode(storedVoucher);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // 2. Persist cart to localStorage on state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ventershop_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart, isLoaded]);

  // 3. Persist voucher code
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (appliedVoucherCode) {
        localStorage.setItem('ventershop_voucher', appliedVoucherCode);
      } else {
        localStorage.removeItem('ventershop_voucher');
      }
    } catch (e) {
      console.error('Failed to save voucher to localStorage:', e);
    }
  }, [appliedVoucherCode, isLoaded]);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { productId, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setAppliedVoucherCode(null);
  }, []);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedVoucherCode,
        setAppliedVoucherCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
