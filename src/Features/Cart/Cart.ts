import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../Inventory/Inventory";
import { RootState } from "../../app/store";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  cartItems: CartItem[];
  totalAmount: number;
  totalItems: number;
}

const initialState: Cart = {
  cartItems: [],
  totalAmount: 0,
  totalItems: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    itemAddedToCart: (state, action: PayloadAction<CartItem>) => {
      const cartItem = action.payload;

      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === cartItem.id
      );

      if (existingItemIndex !== -1) {
        state.cartItems[existingItemIndex].quantity += cartItem.quantity;
      } else {
        const newCartItem: CartItem = {
          id: cartItem.id,
          product: cartItem.product,
          quantity: 1,
        };
        state.cartItems.push(newCartItem);
      }
      state.totalAmount += cartItem.product.price * cartItem.quantity;
      state.totalItems += cartItem.quantity;
    },

    itemDeletedFromCart: (state, action: PayloadAction<number>) => {
      const cartItemId = action.payload;

      const itemToRemove = state.cartItems.find(
        (cartItem) => cartItem.id === cartItemId
      );

      if (itemToRemove) {
        state.totalItems -= itemToRemove.quantity;
        state.totalAmount -= itemToRemove.product.price * itemToRemove.quantity;

        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== cartItemId
        );
      }
    },
  },
});

export default cartSlice.reducer;

export const { itemAddedToCart, itemDeletedFromCart } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart;

export const selectAllCartItems = (state: RootState) => state.cart.cartItems;

export const selectCartItemsQuantity = (state: RootState) =>
  state.cart.totalItems;
