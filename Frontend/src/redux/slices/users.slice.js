import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: {
    data: [],
    currentPage: 0,
    numberOfPages: 0,
  },
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUserSuccess: (state, { payload }) => {
      state.users = payload;
      state.loading = false;
    },
    startLoadingUser: (state) => {
      state.loading = true;
    },
    hasError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export default slice.reducer;

export const getUsers = ({ accessToken, page }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoadingUser());
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/admins`,
        { headers }
      );
      dispatch(slice.actions.getUserSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
};

export const getAllUsers = async ({ accessToken }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  const res = await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/get-all-users`,
    { headers }
  );
  return res.data;
};
