import mongoose from "mongoose";

const pickUpRequest = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },

    wasteType: {
      type: String,
      enum: ["Organic-Waste" , "Recycleable-Waste" , "General-waste"],
      default: "General-waste",
    },

    estimatedQuantity: {
      type: Number,
      required: true,
      min: 1,
    },

    preferredDate: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const PickUpRequest = new mongoose.model("PickUpRequest" , pickUpRequest);
export default PickUpRequest;
