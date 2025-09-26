import { createSlice } from '@reduxjs/toolkit';


const saveCartToLocalStorage = (cartItems) => {
    try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
        console.error("Không thể lưu giỏ hàng vào localStorage:", e);
    }
};

const loadCartFromLocalStorage = () => {
    try {
        const serializedCart = localStorage.getItem('cartItems');
        if (serializedCart === null) {
            return []; 
        }
        return JSON.parse(serializedCart);
    } catch (e) {
        console.error("Không thể tải giỏ hàng từ localStorage:", e);
        return [];
    }
};

const initialState = {
    cartItems: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            
            const existItem = state.cartItems.find(
                (x) => x._id === newItem._id && x.size === newItem.size
            );

            if (existItem) {
                existItem.qty += newItem.qty;
            } else {
                state.cartItems.push(newItem);
            }
            
            saveCartToLocalStorage(state.cartItems);
        },

        updateCartQuantity: (state, action) => {
            const { _id, size, qty } = action.payload;
            const itemToUpdate = state.cartItems.find(
                (x) => x._id === _id && x.size === size
            );
            if (itemToUpdate) {
                itemToUpdate.qty = qty;
            }
            
            saveCartToLocalStorage(state.cartItems);
        },

        removeFromCart: (state, action) => {
            const { _id, size } = action.payload;
            
            state.cartItems = state.cartItems.filter(
                (item) => !(item._id === _id && item.size === size)
            );

            saveCartToLocalStorage(state.cartItems);
        },

        clearCart: (state) => {
            state.cartItems = [];
            saveCartToLocalStorage(state.cartItems); 
        },
    },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;