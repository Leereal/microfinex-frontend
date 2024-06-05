import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserType | null;
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<UserType | null | undefined>) => {
      state.isAuthenticated =
        action.payload !== null && action.payload !== undefined;
      state.user = action.payload || null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
  },
});

export const { setAuth, logout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;
