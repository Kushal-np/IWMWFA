import { createSlice } from "@reduxjs/toolkit";

const complaintSlice = createSlice({
  name: "complaint",
  initialState: {
    complaints: [],
    allComplaints: [],
  },
  reducers: {
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },
    setAllComplaints: (state, action) => {
      state.allComplaints = action.payload;
    },
    addComplaint: (state, action) => {
      state.complaints.unshift(action.payload);
    },
  },
});

export const { setComplaints, setAllComplaints, addComplaint } = complaintSlice.actions;
export default complaintSlice.reducer;