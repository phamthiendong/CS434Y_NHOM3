import { configureStore } from '@reduxjs/toolkit';

import cartReducer from './store/cartSlice.js';
import userReducer from './store/userSlice.js';
import productReducer from './store/productSlice.js';
import orderReducer from './store/orderSlice.js';
import categoryReducer from './store/categorySlice.js';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    
  },
});