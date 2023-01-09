import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// CREATE OR UPDATE USER IN CREATEASYNCTHUNK Fucntion
export const createQuestion = createAsyncThunk(
  "question/create-question",
  async ({ question, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/questions`,
        question,
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

export const updateQuestion = createAsyncThunk(
  "question/update-question",
  async ({ _id, question, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_API}/questions/${_id}`,
        question,
        { headers }
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// delete question
export const deleteQuestion = createAsyncThunk(
  "question/delete-question",
  async ({ _id, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_API}/questions/${_id}`,
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
