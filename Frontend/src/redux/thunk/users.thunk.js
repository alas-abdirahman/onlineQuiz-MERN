import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// CREATE OR UPDATE USER IN CREATEASYNCTHUNK Fucntion
export const createUser = createAsyncThunk(
  "user/create-user",
  async ({ user, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/admins`,
        user,
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

export const updateUser = createAsyncThunk(
  "user/update-user",
  async ({ _id, user, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_API}/admins/${_id}`,
        user,
        { headers }
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// delete user
export const deleteUser = createAsyncThunk(
  "user/delete-user",
  async ({ _id, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_API}/admins/${_id}`,
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
