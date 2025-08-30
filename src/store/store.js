import {configureStore} from "@reduxjs/toolkit";
import cartSlice from "./slice"



export const store = configureStore({
    reducer: {cart: cartSlice}
})  