import{ createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
}

interface AuthState {
  currentUser: User | null;
  token: string;
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  token: localStorage.getItem('token') || '',
  loading: true,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; token: string }>) {
      const { user, token } = action.payload;

      state.currentUser = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;

      localStorage.setItem('token', token);
      const expiryTime = new Date().getTime() + 15 * 60 * 1000;
      localStorage.setItem('tokenExpiry', expiryTime.toString());
    },

    logout(state) {
      state.currentUser = null;
      state.token = '';
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
