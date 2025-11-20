import mongoose from "mongoose";
const truckSchema = new mongoose.Schema(
  {
    driver_name: {
      type: String,
      required: true,
    },
    driver_contact: {
      type: String,
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    }, 
  },
  { timestamps: true }
);

const Truck = new mongoose.model("Truck", truckSchema);
export default Truck ; 