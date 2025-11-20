const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    ward_no: { type: Number, required: true },
    pickup_days: [
      {
        type: String,
        enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
    ],
    pickup_time: { type: String },
  },
  { timestamps: true }
);

const Route = new mongoose.model("Route", routeSchema);
export default Router ; 
