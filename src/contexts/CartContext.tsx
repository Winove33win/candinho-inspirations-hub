import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number | null;
  currency: string;
  quantity: number;
};

interface CartContextValue {
  items: CartItem[];
  totalCents: number;
  currency: string | null;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "smartx:cart";

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item?.productId && typeof item?.quantity === "number");
    }
  } catch (error) {
    console.warn("[SMARTx] Failed to parse cart", error);
  }
  return [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return loadInitialCart();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity, priceCents: item.priceCents ?? i.priceCents, currency: item.currency ?? i.currency }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { totalCents, currency } = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => ({
        total: acc.total + (item.priceCents ? item.priceCents * item.quantity : 0),
        currency: item.priceCents ? item.currency : acc.currency,
      }),
      { total: 0, currency: null as string | null }
    );
    return { totalCents: subtotal.total, currency: subtotal.currency };
  }, [items]);

  const value = useMemo(
    () => ({ items, totalCents, currency, addItem, removeItem, updateQuantity, clear }),
    [items, totalCents, currency, addItem, removeItem, updateQuantity, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
