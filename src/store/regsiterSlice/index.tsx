import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URL
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_ACCESS_KEY;

import type { RegisterFormData } from "../../types";

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    surname: string;
  };
}

interface AuthState {
  user: RegisterResponse["user"] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData: RegisterFormData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        formData,
        {
          headers: {
            "request-access-key": `${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return thunkAPI.rejectWithValue(error.response.data.message || "An error occurred");
        } else {
          return thunkAPI.rejectWithValue("Network error. Please check your internet connection.");
        }
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;