import { createSlice } from "@reduxjs/toolkit";

const complaintSlice = createSlice({
  name: "complaint",
  initialState: {
    complaints: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },
    addComplaint: (state, action) => {
      state.complaints.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
});

export const { setComplaints, addComplaint, setLoading, setError, setSuccess, clearSuccess } = complaintSlice.actions;
export default complaintSlice.reducer;