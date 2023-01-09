import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  quizes: {
    data: [],
    currentPage: 0,
    numberOfPages: 0,
  },
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    getQuizSuccess: (state, { payload }) => {
      state.quizes = payload;
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

export const getQuizes = ({ accessToken, page }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoadingUser());
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/quizes`,
        { headers }
      );
      dispatch(slice.actions.getQuizSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
};

export const getAllQuizes = async ({ accessToken }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  const res = await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/quizes`,
    { headers }
  );
  return res.data;
};
