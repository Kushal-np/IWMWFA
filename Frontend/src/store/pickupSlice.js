import { createSlice } from "@reduxjs/toolkit";

const pickupSlice = createSlice({
  name: "pickup",
  initialState: {
    pickups: [],
    allPickups: [],
  },
  reducers: {
    setPickups: (state, action) => {
      state.pickups = action.payload;
    },
    setAllPickups: (state, action) => {
      state.allPickups = action.payload;
    },
    addPickup: (state, action) => {
      state.pickups.unshift(action.payload);
    },
    updatePickupStatus: (state, action) => {
      const { id, status } = action.payload;
      const pickup = state.pickups.find(p => p._id === id);
      if (pickup) pickup.status = status;
      const allPickup = state.allPickups.find(p => p._id === id);
      if (allPickup) allPickup.status = status;
    },
  },
});

export const { setPickups, setAllPickups, addPickup, updatePickupStatus } = pickupSlice.actions;
export default pickupSlice.reducer;