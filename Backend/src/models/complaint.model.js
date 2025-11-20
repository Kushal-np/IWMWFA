import mongoose from "mongoose";
const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "resolved"],
      default: "pending",
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const Complaint = new mongoose.model("Complaint" , complaintSchema);
export default Complaint;