import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ["organic", "recyclable", "general", "electronics", "furniture", "clothing", "other"],
      default: "general",
    },
    listingType: {
      type: String,
      enum: ["sale", "donate"],
      required: true,
    },
    price: {
      type: Number,
      required: function() {
        return this.listingType === "sale";
      },
      min: 0,
    },
        condition: { // ✅ Added this field
      type: String,
    },
    images: [{
      type: String, // Cloudinary URLs
    }],
    condition: {
      type: String,
      enum: ["fair", "poor"],
      default: "good",
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    location: {
      type: String,
      trim: true,
    },
    ward_no: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1, status: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;