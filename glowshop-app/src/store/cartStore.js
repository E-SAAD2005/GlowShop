import { create } from 'zustand'
import { persist } from 'zustand/middleware'

function generateToken() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const getOrCreateToken = (key) => {
  let t = localStorage.getItem(key)
  if (!t) { t = generateToken(); localStorage.setItem(key, t) }
  return t
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      sessionToken: getOrCreateToken('glow_cart_token'),
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addItem: (item) => set((state) => {
        const vId = item.variantId || item.variant_id
        const existing = state.items.find(i => (i.variantId || i.variant_id) === vId)
        
        let newItems;
        if (existing) {
          newItems = state.items.map(i =>
            (i.variantId || i.variant_id) === vId 
              ? { ...i, quantity: i.quantity + (item.quantity || 1) } 
              : i
          )
        } else {
          newItems = [...state.items, { ...item, quantity: item.quantity || 1 }]
        }

        return { 
          items: newItems,
          isCartOpen: true // Open the drawer automatically
        }
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => (i.variantId || i.variant_id) !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: quantity < 1
          ? state.items.filter(i => (i.variantId || i.variant_id) !== id)
          : state.items.map(i => (i.variantId || i.variant_id) === id ? { ...i, quantity } : i)
      })),

      setCoupon: (code) => set({ couponCode: code }),

      clearCart: () => set({ items: [], couponCode: '' }),

      // Computed helpers via selectors (not state getters)
      getItemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
      getSubtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: 'glowshop-cart' }
  )
)
