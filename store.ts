import {create} from 'zustand'
import { persist} from 'zustand/middleware'
import { Product } from './sanity.types';



export interface CartItem {
    product: Product;
    quantity: number;
}

interface StoreState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    deleteCartProduct: (productId: string) => void;
    resetCart: () => void;
    getTotalPrice: () => number;
    getSubTotalPrice: () => number;
    getItemCount: (productId: string) => number;
    getGroupedItems: () => CartItem[];
    //favourite
    favoriteProduct: Product[];
    addToFavorite: (product: Product) => Promise<void>;
    removeFromFavorite: (productId: string) => void;
    resetFavorite: () => void;   
}

const useStore=create<StoreState>()(
    persist(
        (set, get) => ({
     items: [],
     favoriteProduct: [],
     addItem: (product) =>
        set((state) => {
            const existingItem = state.items.find(
                (item) => item.product._id === product._id
            );
             if(existingItem) {
                return {
                    items: state.items.map((item)=>
                    item.product._id === product._id
                     ? {...item, quantity: item.quantity + 1}
                      : item
                    ),
                };
            } else {
                return { items: [...state.items, {product, quantity: 1}] };
            }
        }),
      removeItem: (productId) =>
          set((state) => ({
                items: state.items
                     .map((item) => item.product._id === productId
                          ? { ...item, quantity: item.quantity - 1 }
                          : item)
                     .filter((item) => item.quantity > 0),
          })),
      deleteCartProduct: (productId) =>
          set((state) => ({ items: state.items.filter((item) => item.product._id !== productId) })),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => get().items.reduce(
          (total, item) => total + Number(item.product.price ?? 0) * item.quantity, 0
      ),
      getSubTotalPrice: () => get().items.reduce(
          (total, item) => total + Number(item.product.price ?? 0) * item.quantity, 0
      ),
      getItemCount: (productId) => get().items.find((item) => item.product._id === productId)?.quantity ?? 0,
      getGroupedItems: () => get().items,
      addToFavorite: async (product): Promise<void> => {
          set((state) => ({
              favoriteProduct: state.favoriteProduct.some((item) => item._id === product._id)
                  ? state.favoriteProduct
                  : [...state.favoriteProduct, product],
          }));
      },
      removeFromFavorite: (productId) => set((state) => ({
          favoriteProduct: state.favoriteProduct.filter((product) => product._id !== productId),
      })),
      resetFavorite: () => set({ favoriteProduct: [] }),
}), {
    name: "cart-store",
})
);

export default useStore;