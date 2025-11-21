import { createSlice } from "@reduxjs/toolkit";

const complaintSlice = createSlice({
  name: "complaint",
  initialState: {
    complaints: [],       // user's complaints
    allComplaints: [],    // admin view
  },
  reducers: {
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },
    setAllComplaints: (state, action) => {
      state.allComplaints = action.payload;
    },
    addComplaint: (state, action) => {
      // Add new complaint to the beginning
      state.complaints.unshift(action.payload);
    },
    updateComplaintStatusInStore: (state, action) => {
      const { id, status } = action.payload;
      // Update in allComplaints
      const index = state.allComplaints.findIndex(c => c._id === id);
      if (index !== -1) {
        state.allComplaints[index].status = status;
        // Move updated complaint to top
        const updated = state.allComplaints.splice(index, 1)[0];
        state.allComplaints.unshift(updated);
      }
    },
  },
});

export const { setComplaints, setAllComplaints, addComplaint, updateComplaintStatusInStore } = complaintSlice.actions;
export default complaintSlice.reducer;
