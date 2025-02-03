import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the auth slice
const initialState = {
  user: null, // Stores user details (e.g., username, role, etc.)
  token: null, // Stores the JWT token
  isAuthenticated: false, // Tracks if the user is logged in
  loading: false, // Tracks if an authentication request is in progress
  error: null, // Stores any authentication error
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Thunks
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(
      "http://localhost:8000/api/users/login",
      credentials
    );
    const { user, token } = response.data;

    // Save token to localStorage
    localStorage.setItem("token", token);
    console.log("Successfully logged in");

    // Dispatch login success action
    dispatch(loginSuccess({ user, token }));
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Login failed. Please try again.";
    dispatch(loginFailure(errorMessage));
  }
};

export const logoutUser = () => (dispatch) => {
  // Clear token from localStorage
  localStorage.removeItem("token");
  dispatch(logout());
};

export const initializeAuth = () => (dispatch) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Decode the token if necessary and retrieve user info (optional)
    axios
      .get("http://localhost:8000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        dispatch(
          loginSuccess({
            user: response.data,
            token,
          })
        );
      })
      .catch(() => {
        // If token is invalid, clear it
        localStorage.removeItem("token");
        dispatch(logout());
      });
  }
};
