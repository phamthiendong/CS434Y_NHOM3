import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productApi from '../services/productApi'; 

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
    try { return await productApi.getAllProducts(params); } catch (error) { return rejectWithValue(error.toString()); }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (productId, { rejectWithValue }) => {
    try { return await productApi.getProductById(productId); } catch (error) { return rejectWithValue(error.toString()); }
});

export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
    try { return await productApi.createProduct(productData); } catch (error) { return rejectWithValue(error.toString()); }
});

export const updateProduct = createAsyncThunk('products/update', async ({ productId, productData }, { rejectWithValue }) => {
    try { return await productApi.updateProduct(productId, productData); } catch (error) { return rejectWithValue(error.toString()); }
});

export const deleteProduct = createAsyncThunk('products/delete', async (productId, { rejectWithValue }) => {
    try { 
        await productApi.deleteProduct(productId);
        return productId;
    } catch (error) { 
        return rejectWithValue(error.toString()); 
    }
});

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelated',
  async (productId, { rejectWithValue }) => {
    try { 
        const data = await productApi.getRelatedProducts(productId);
        return data;
    } catch (error) { 
        return rejectWithValue(error.toString()); 
    }
  }
);

const initialState = {
  products: [],
  status: 'idle', 
  error: null,
  productDetails: null, 
  status_single: 'idle', 
  error_single: null,
  createStatus: 'idle',
  updateStatus: 'idle', 
  deleteStatus: 'idle',
  relatedProducts: [],
  relatedStatus: 'idle', 
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => { state.productDetails = null; state.status_single = 'idle'; },
    resetCreateStatus: (state) => { state.createStatus = 'idle'; },
    resetUpdateStatus: (state) => { state.updateStatus = 'idle'; },
    resetDeleteStatus: (state) => { state.deleteStatus = 'idle'; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.status = 'succeeded'; state.products = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      
      .addCase(fetchProductById.pending, (state) => { state.status_single = 'loading'; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.status_single = 'succeeded'; state.productDetails = action.payload; })
      .addCase(fetchProductById.rejected, (state, action) => { state.status_single = 'failed'; state.error_single = action.payload; })

      .addCase(createProduct.pending, (state) => { state.createStatus = 'loading'; })
      .addCase(createProduct.fulfilled, (state, action) => { state.createStatus = 'succeeded'; state.products.unshift(action.payload); })
      .addCase(createProduct.rejected, (state, action) => { state.createStatus = 'failed'; state.error = action.payload; })

      .addCase(updateProduct.pending, (state) => { state.updateStatus = 'loading'; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.productDetails = action.payload;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) { state.products[index] = action.payload; }
      })
      .addCase(updateProduct.rejected, (state, action) => { state.updateStatus = 'failed'; state.error = action.payload; })
      
      .addCase(deleteProduct.pending, (state) => { state.deleteStatus = 'loading'; })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.products = state.products.filter(p => p._id !== action.payload);
      }) 
      .addCase(deleteProduct.rejected, (state, action) => { state.deleteStatus = 'failed'; state.error = action.payload; })

      .addCase(fetchRelatedProducts.pending, (state) => { state.relatedStatus = 'loading'; })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => { state.relatedStatus = 'succeeded'; state.relatedProducts = action.payload; })
      .addCase(fetchRelatedProducts.rejected, (state, action) => { state.relatedStatus = 'failed'; });
  },
});

export const { clearSelectedProduct, resetCreateStatus, resetUpdateStatus, resetDeleteStatus } = productSlice.actions;
export default productSlice.reducer;