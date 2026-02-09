
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: Record<string, any> | null; 
  }

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};
 
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token; 
    },
    logout: () => initialState,
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
