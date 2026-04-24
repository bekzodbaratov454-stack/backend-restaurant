import mongoose from "mongoose";


const FeedbackSchema = new mongoose.Schema(


  {
    type: {
      type: String,
      enum: ["review", "complaint"],
      required: true,
    },


    message: {
      type: String,
      required: true,
      minlength: 3,
    },


    device_info: {
      type: String,
      default: "unknown",
    },


  },

  {
    collection: "feedbacks",
    timestamps: true,
    versionKey: false,
  }

  
);

export const Feedback = mongoose.model("Feedback", FeedbackSchema);