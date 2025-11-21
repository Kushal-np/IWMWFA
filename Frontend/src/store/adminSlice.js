import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    complaints: [],   // ✅ MUST exist
  },
  reducers: {
    setAllComplaints: (state, action) => {
      state.complaints = action.payload;   // ✅ FIXED
    },
  },
});

export const { setAllComplaints } = adminSlice.actions;
export default adminSlice.reducer;
