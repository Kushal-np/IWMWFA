import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    complaints: [],       // For complaints
    pickupRequests: [],   // For pickup requests
    users: [],            // For all users
    trucks: [],           // For truck management
    routes: [],           // For route management
    schedules: [],        // For schedules
  },
  reducers: {
    setAllComplaints: (state, action) => {
      state.complaints = action.payload;
    },
    setAllPickupRequests: (state, action) => {
      state.pickupRequests = action.payload;
    },
    setAllUsers: (state, action) => {
      state.users = action.payload;
    },
    setAllTrucks: (state, action) => {
      state.trucks = action.payload;
    },
    setAllRoutes: (state, action) => {
      state.routes = action.payload;
    },
    setAllSchedules: (state, action) => {
      state.schedules = action.payload;
    },
  },
});

export const {
  setAllComplaints,
  setAllPickupRequests,
  setAllUsers,
  setAllTrucks,
  setAllRoutes,
  setAllSchedules,
} = adminSlice.actions;

export default adminSlice.reducer;
