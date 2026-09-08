import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { products, type Product } from "./catalog";

type CartLine = { slug: string; qty: number };

type StoreValue = {
  cart: CartLine[];
  cartItems: { product: Product; qty: number }[];
  cartCount: number;
  cartTotal: number;
  addToCart: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  compare: string[];
  compareItems: Product[];
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  saved: string[];
  toggleSaved: (slug: string) => void;
  recent: string[];
  recentItems: Product[];
  pushRecent: (slug: string) => void;
  hydrated: boolean;
  flash: string | null;
};

const StoreContext = createContext<StoreValue | null>(null);

const KEY = "jb-marketplace-v1";
const MAX_COMPARE = 3;

type Persisted = { cart: CartLine[]; compare: string[]; saved: string[]; recent: string[] };

function read(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    const data = read();
    if (data) {
      setCart(data.cart ?? []);
      setCompare(data.compare ?? []);
      setSaved(data.saved ?? []);
      setRecent(data.recent ?? []);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ cart, compare, saved, recent }));
    } catch {
      /* storage cheio ou bloqueado: seguimos em memória */
    }
  }, [cart, compare, saved, recent, hydrated]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2200);
    return () => clearTimeout(t);
  }, [flash]);

  const addToCart = useCallback((slug: string, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { slug, qty }];
    });
    const p = products.find((x) => x.slug === slug);
    setFlash(p ? `${p.name} adicionado ao carrinho` : "Item adicionado");
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
    );
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCart((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleCompare = useCallback((slug: string) => {
    setCompare((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) {
        setFlash("Comparador cheio — máximo de 3 equipamentos");
        return prev;
      }
      return [...prev, slug];
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const toggleSaved = useCallback((slug: string) => {
    setSaved((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const pushRecent = useCallback((slug: string) => {
    setRecent((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 6));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const cartItems = cart
      .map((l) => {
        const product = products.find((p) => p.slug === l.slug);
        return product ? { product, qty: l.qty } : null;
      })
      .filter((x): x is { product: Product; qty: number } => x !== null);

    return {
      cart,
      cartItems,
      cartCount: cartItems.reduce((s, i) => s + i.qty, 0),
      cartTotal: cartItems.reduce((s, i) => s + i.product.price * i.qty, 0),
      addToCart,
      setQty,
      removeFromCart,
      clearCart,
      compare,
      compareItems: compare
        .map((s) => products.find((p) => p.slug === s))
        .filter((p): p is Product => Boolean(p)),
      toggleCompare,
      clearCompare,
      saved,
      toggleSaved,
      recent,
      recentItems: recent
        .map((s) => products.find((p) => p.slug === s))
        .filter((p): p is Product => Boolean(p)),
      pushRecent,
      hydrated,
      flash,
    };
  }, [
    cart,
    compare,
    saved,
    recent,
    hydrated,
    flash,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    toggleCompare,
    clearCompare,
    toggleSaved,
    pushRecent,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
}
