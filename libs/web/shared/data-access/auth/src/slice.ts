import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';

export interface AuthState {
  profile: User | null;
}

const initialState: AuthState = {
  profile: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfile(state, { payload }: PayloadAction<AuthState['profile']>) {
      state.profile = payload;
    },
  },
  selectors: {
    profile: (state) => state.profile,
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authReducerPath = authSlice.name;
export const authSelectors = authSlice.selectors;
