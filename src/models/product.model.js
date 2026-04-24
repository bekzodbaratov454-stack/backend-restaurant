import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {


    name: {
      type: String,
      required: true,
      minlength: 3,
    },

    description: {
      type: String,
      default: "",
    },



    price: {
      type: Number,
      required: true,
    },

    image: {
    type: String,
    default: null,
    },



    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },


    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },



  {
    collection: "products",
    timestamps: true,
    versionKey: false,
  }
  
);

export const Product = mongoose.model("Product", ProductSchema);



// 3. Product model
// name
// price
// category_id
// image (optional)
// 4. Feedback model (GLOBAL)
// type (review | complaint)
// message
// device_info
// created_at


