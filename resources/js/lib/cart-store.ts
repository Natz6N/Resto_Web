import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types/Resto';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number, notes?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateNotes: (productId: number, notes: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  totalTax: () => number;
  totalAmount: () => number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      setIsOpen: (isOpen: boolean) => set({ isOpen }),

      addItem: (product: Product, quantity: number, notes?: string) => {
        const { items } = get();
        const existingItem = items.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
                : item
            ),
          });
        } else {
          const price = typeof product.price === 'number' ? product.price :
                       typeof product.price === 'string' ? parseFloat(product.price) : 0;

          const hasDiscount = product.discounts && product.discounts.length > 0;
          const discountValue = hasDiscount && product.discounts ? product.discounts[0]?.value : 0;
          const discountedPrice = hasDiscount ? price * (1 - discountValue / 100) : price;

          set({
            items: [
              ...items,
              {
                product,
                quantity,
                notes,
                subtotal: discountedPrice * quantity,
              },
            ],
          });
        }
      },

      removeItem: (productId: number) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const { items } = get();

        set({
          items: items.map((item) => {
            if (item.product.id === productId) {
              const price = typeof item.product.price === 'number' ? item.product.price :
                           typeof item.product.price === 'string' ? parseFloat(item.product.price) : 0;

              const hasDiscount = item.product.discounts && item.product.discounts.length > 0;
              const discountValue = hasDiscount && item.product.discounts ? item.product.discounts[0]?.value : 0;
              const discountedPrice = hasDiscount ? price * (1 - discountValue / 100) : price;

              return {
                ...item,
                quantity,
                subtotal: discountedPrice * quantity,
              };
            }
            return item;
          }),
        });
      },

      updateNotes: (productId: number, notes: string) => {
        const { items } = get();
        set({
          items: items.map((item) =>
            item.product.id === productId ? { ...item, notes } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.subtotal, 0);
      },

      totalTax: () => {
        const { subtotal } = get();
        return subtotal() * 0.11; // 11% tax
      },

      totalAmount: () => {
        const { subtotal, totalTax } = get();
        return subtotal() + totalTax();
      },
    }),
    {
      name: 'resto-cart-storage',
    }
  )
);