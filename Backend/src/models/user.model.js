const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "business", "admin"],
      default: "user",
    },
    address: { type: String },
    ward_no: { type: Number },
  },
  { timestamps: true }
);
 

const User = new mongoose.model("User", userSchema);
export default User ; 