
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const { id, variantKey } = action.payload;
      const existing = state.find(
        item => item.id === id && item.variantKey === variantKey
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    increaseQuantity: (state, action) => {
      const { id, variantKey } = action.payload;
      const item = state.find(i => i.id === id && i.variantKey === variantKey);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const { id, variantKey } = action.payload;
      const item = state.find(i => i.id === id && i.variantKey === variantKey);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeFromCart: (state, action) => {
      const { id, variantKey } = action.payload;
      return state.filter(
        item => !(item.id === id && item.variantKey === variantKey)
      );
    },
    setCart: (state, action) => {
      state.splice(0, state.length, ...action.payload);
    },
    clearCart: () => []
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  setCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
