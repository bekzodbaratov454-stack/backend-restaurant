import mongoose  from "mongoose";

const CategorySchema = new mongoose.Schema(
  {

    name: {
      type: String,
      required: true,
      minlength: 2,
    },


    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


  },

  {
    collection: "categories",
    timestamps: true,
    versionKey: false,
  }

);

export const Category = mongoose.model("Category", CategorySchema);