import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  questions: {
    data: [],
    currentPage: 0,
    numberOfPages: 0,
  },
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "question",
  initialState,
  reducers: {
    getQuestionSuccess: (state, { payload }) => {
      state.questions = payload;
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

export const getQuestions = ({ accessToken, page }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoadingUser());
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API}/questions`,
        { headers }
      );
      dispatch(slice.actions.getQuestionSuccess(res.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
    }
  };
};

export const getAllQuestions = async ({ accessToken }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: accessToken,
  };
  const res = await axios.get(
    `${process.env.REACT_APP_BACKEND_API}/questions`,
    { headers }
  );
  return res.data;
};
