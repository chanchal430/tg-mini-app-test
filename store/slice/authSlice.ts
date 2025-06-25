import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { telegramLogin } from '../../services/authApi';

interface AuthState {
  token: string;
  user: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AuthState = {
  token: '',
  user: null,
  status: 'idle',
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ raw }: { raw: any }, thunkAPI) => {
    try {
      const res = await telegramLogin(raw);
        console.log('raw', raw)
      console.log('Res', res)
      localStorage.setItem('token', res.data.token);
      return { token: res.data.token, user: res.data.user };
    } catch (err) {
      return thunkAPI.rejectWithValue('Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = '';
      state.user = null;
      state.status = 'idle';
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
