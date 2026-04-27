import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // device fingerprint — bir qurilmadan bir marta reyting
    device_id: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    collection: "ratings",
    timestamps: true,
    versionKey: false,
  }
);

// Bir qurilma bir mahsulotga faqat bir marta reyting bera oladi
RatingSchema.index({ product_id: 1, device_id: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", RatingSchema);
