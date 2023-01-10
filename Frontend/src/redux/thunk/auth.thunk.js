import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/login-user",
  async (user, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/admins/login`,
        user,
        { headers }
      );
      return res.data;
    } catch (error) {
      if (error.respose && error.respose.data.error) {
        return rejectWithValue(error.respose.data.error);
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout-user",
  async ({ email, accessToken }) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: accessToken,
    };
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_API}/logout`,
      { email },
      { headers }
    );
    return res;
  }
);

export const checkToken = createAsyncThunk(
  "auth/token-check",
  async (token, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/check-token`,
        {},
        {
          headers,
        }
      );
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/update-password",
  async ({ user, accessToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: accessToken,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_API}/update-password`,
        { user },
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

export const forgetPassword = createAsyncThunk(
  "auth/forget-password",
  async (email, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/auth/forget-password`,
        { email },
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

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async ({ password, resetToken }, { rejectWithValue }) => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/auth/reset-password`,
        { password, resetToken },
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
