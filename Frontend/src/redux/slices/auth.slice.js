import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../thunk/auth.thunk";

const initialState = {
  user: {},
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.user = {};
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.accessToken = null;
    },
  },
  extraReducers: {
    [loginUser.pending]: (state) => {
      state.loading = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.user = payload.user;
      state.isAuthenticated = true;
      state.accessToken = payload.token;
    },
    [loginUser.rejected]: (state, { error }) => {
      state.error = error.message;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = initialState.user;
      state.accessToken = null;
    },
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
