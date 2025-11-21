import mongoose from "mongoose";
const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title:{
        type:String , 
        required:true
    },
    location:{
        type:String ,
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
    category:{
              type: String,
      enum: ["Missed Pickup" , "Overflow-Waste" , "Illegal-Dumping" , "Damaged-Bin" , "Other-Issue"],
      default: "Illegal-Dumping",
    }
  },
  { timestamps: true }
);

const Complaint = new mongoose.model("Complaint" , complaintSchema);
export default Complaint;