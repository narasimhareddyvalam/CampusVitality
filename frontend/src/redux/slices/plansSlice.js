import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all plans
export const fetchPlans = createAsyncThunk(
  "plans/fetchPlans",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token; // Get token from Redux store
    try {
      const response = await axios.get("http://localhost:8000/api/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Return the plans data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch plans."
      );
    }
  }
);

// Async thunk to fetch details of a specific plan
export const fetchPlanDetails = createAsyncThunk(
  "plans/fetchPlanDetails",
  async (planId, { getState, rejectWithValue }) => {
    const token = getState().auth.token; // Get token from Redux store
    try {
      const response = await axios.get(
        `http://localhost:8000/api/plans/getPlanStudent/${planId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Return the plan details
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch plan details."
      );
    }
  }
);

const plansSlice = createSlice({
  name: "plans",
  initialState: {
    plans: [],
    plan: null, // Store details of a single plan
    status: "idle", // Status for fetching all plans
    planStatus: "idle", // Status for fetching a single plan
    error: null,
    planError: null, // Separate error for fetching a single plan
  },
  reducers: {
    // Optional additional reducers for synchronous actions
    clearPlanDetails(state) {
      state.plan = null;
      state.planStatus = "idle";
      state.planError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all plans
      .addCase(fetchPlans.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch single plan details
      .addCase(fetchPlanDetails.pending, (state) => {
        state.planStatus = "loading";
        state.planError = null;
      })
      .addCase(fetchPlanDetails.fulfilled, (state, action) => {
        state.planStatus = "succeeded";
        state.plan = action.payload;
      })
      .addCase(fetchPlanDetails.rejected, (state, action) => {
        state.planStatus = "failed";
        state.planError = action.payload;
      });
  },
});

export const { clearPlanDetails } = plansSlice.actions;

export const selectPlans = (state) => state.plans.plans;
export const selectPlansStatus = (state) => state.plans.status;
export const selectPlansError = (state) => state.plans.error;

export const selectPlan = (state) => state.plans.plan;
export const selectPlanStatus = (state) => state.plans.planStatus;
export const selectPlanError = (state) => state.plans.planError;

export default plansSlice.reducer;
