import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../services/userApi';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await userApi.login(credentials);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await userApi.register(userData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        return rejectWithValue(message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
    'user/getAll',
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().user.userInfo.token;
            const data = await userApi.getAllUsers(token);
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            return rejectWithValue(message);
        }
    }
)

const initialState = {
  userInfo: userInfoFromStorage,
  users: [], 
  status: 'idle', 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
      state.status = 'idle';
      state.error = null;
    },
    clearUserState: (state) => {
        state.status = 'idle';
        state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { state.status = 'succeeded'; state.userInfo = action.payload; })
      .addCase(loginUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.status = 'succeeded'; state.userInfo = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(getAllUsers.pending, (state) => {
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
          state.users = action.payload; 
      })
      .addCase(getAllUsers.rejected, (state, action) => {
          console.error("Lỗi khi lấy danh sách user:", action.payload);
      });
  },
});

export const { logout, clearUserState } = userSlice.actions;
export default userSlice.reducer;