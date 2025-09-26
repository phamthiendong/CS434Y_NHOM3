import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../services/orderApi';


export const createOrder = createAsyncThunk(
    'orders/create', 
    async (orderData, { rejectWithValue }) => {
        try {
            return await orderApi.createOrder(orderData);
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAll', 
    async (_, { rejectWithValue }) => {
        try {
            return await orderApi.getAllOrders();
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMy', 
    async (_, { rejectWithValue }) => {
        try {
            return await orderApi.getMyOrders();
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

export const updateOrderAdmin = createAsyncThunk(
    'orders/updateAdmin', 
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            return await orderApi.updateOrderStatus(orderId, status);
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

export const fetchOrderDetails = createAsyncThunk(
    'orders/fetchDetails', 
    async (orderId, { rejectWithValue }) => {
        try {
            return await orderApi.getOrderById(orderId); 
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);


const initialState = {
  order: null,      
  orders: [],
  orderDetails: null, 
  status: 'idle',  
  updateStatus: 'idle',
  error: null,     
};


const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.status = 'idle';
      state.order = null;
      state.error = null;
    },
    resetUpdateStatus: (state) => {
        state.updateStatus = 'idle';
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.status = 'loading'; })
      .addCase(createOrder.fulfilled, (state, action) => { state.status = 'succeeded'; state.order = action.payload; })
      .addCase(createOrder.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(fetchAllOrders.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMyOrders.pending, (state) => { state.status = 'loading'; })

      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.status = 'succeeded'; state.orders = action.payload; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.status = 'succeeded'; state.orders = action.payload; })
      
      .addCase(fetchAllOrders.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; state.orders = []; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; state.orders = []; })

      .addCase(updateOrderAdmin.pending, (state) => { state.updateStatus = 'loading'; })
      .addCase(updateOrderAdmin.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) { state.orders[index] = action.payload; }
      })
      .addCase(updateOrderAdmin.rejected, (state, action) => { state.updateStatus = 'failed'; state.error = action.payload; })

      .addCase(fetchOrderDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetOrder, resetUpdateStatus } = orderSlice.actions;
export default orderSlice.reducer;