import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// CREATE OR UPDATE USER IN CREATEASYNCTHUNK Fucntion
export const createQuiz = createAsyncThunk(
  "quiz/create-quiz",
  async ({ quiz, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/quizes`,
        quiz,
        { headers }
      );
      return res;
    } catch (error) {
      if (error.respose && error.respose.data.error) {
        return rejectWithValue(error.respose.data.error);
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "quiz/update-quiz",
  async ({ _id, quiz, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_API}/quizes/${_id}`,
        quiz,
        { headers }
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// delete quiz
export const deleteQuiz = createAsyncThunk(
  "quiz/delete-quiz",
  async ({ _id, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_API}/quizes/${_id}`,
        { headers }
      );
      return res;
    } catch (error) {
      if (error.respose && error.respose.data.error) {
        return rejectWithValue(error.respose.data.error);
      }
      return rejectWithValue(error.response.data);
    }
  }
);
