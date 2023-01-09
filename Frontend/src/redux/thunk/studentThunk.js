import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// CREATE OR UPDATE USER IN CREATEASYNCTHUNK Fucntion
export const createStudent = createAsyncThunk(
  "student/create-student",
  async ({ student, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/students`,
        student,
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

export const updateStudent = createAsyncThunk(
  "student/update-student",
  async ({ _id, student, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_API}/students/${_id}`,
          student,
        { headers }
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// delete student
export const deleteStudent = createAsyncThunk(
  "student/delete-student",
  async ({ _id, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_API}/students/${_id}`,
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
