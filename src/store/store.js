
import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slice";

// Load the saved cart when the application starts
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem("daraHairCart");

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        return parsedCart;
      }
    }

    return [];
  } catch (error) {
    console.error("Error loading saved cart:", error);
    return [];
  }
};

export const store = configureStore({
  reducer: {
    cart: cartSlice,
  },

  preloadedState: {
    cart: loadCart(),
  },
});

// Save the cart whenever Redux state changes
store.subscribe(() => {
  try {
    const cart = store.getState().cart;

    localStorage.setItem("daraHairCart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
});