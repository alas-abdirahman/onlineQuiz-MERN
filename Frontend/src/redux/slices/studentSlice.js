import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  students: {
    data: [],
    currentPage: 0,
    numberOfPages: 0,
  },
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "student",
  initialState,
  reducers: {
    getStudentSuccess: (state, { payload }) => {
      state.students = payload;
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

export const getStudents = ({ accessToken, page }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoadingUser());
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/students`,
        { headers }
      );
      dispatch(slice.actions.getStudentSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
};

export const getAllStudents = async ({ accessToken }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  const res = await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/students`,
    { headers }
  );
  return res.data;
};
