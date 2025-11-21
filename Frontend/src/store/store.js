import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import complaintReducer from "./complaintSlice";
import pickupReducer from "./pickupSlice";
import adminReducer from "./adminSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaint: complaintReducer,
    pickup: pickupReducer,
      admin: adminReducer,
  },
  
});
