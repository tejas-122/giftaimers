import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("ga_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ga_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity, personalization) => {
    setItems((prev) => {
      const key = `${product._id}-${JSON.stringify(personalization || {})}`;
      const existingIndex = prev.findIndex(
        (i) => `${i.productId}-${JSON.stringify(i.personalization || {})}` === key
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          productId: product._id,
          slug: product.slug,
          name: product.name,
          image: product.images?.[0],
          price: product.sellingPrice,
          minOrderQty: product.minOrderQty,
          maxOrderQty: product.maxOrderQty,
          stock: product.stock,
          quantity,
          personalization: personalization || {},
        },
      ];
    });
  };

  const updateQuantity = (index, quantity) => {
    setItems((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const numQty = Math.floor(Number(quantity));
      if (isNaN(numQty) || numQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const copy = [...prev];
      const item = copy[index];
      let validQty = numQty;
      if (typeof item.stock === "number" && item.stock > 0) {
        validQty = Math.min(validQty, item.stock);
      }
      if (typeof item.maxOrderQty === "number" && item.maxOrderQty > 0) {
        validQty = Math.min(validQty, item.maxOrderQty);
      }
      copy[index] = { ...item, quantity: validQty };
      return copy;
    });
  };

  const removeFromCart = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setItems([]);

  const itemsTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, itemsTotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
