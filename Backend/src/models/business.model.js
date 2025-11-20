import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },

    wasteType: {
      type: String,
      enum: ["Bio-waste", "Plastic-waste", "Electronic-waste", "Metal-waste"],
      default: "Bio-waste",
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

export default mongoose.model("BusinessRequest", businessSchema);
