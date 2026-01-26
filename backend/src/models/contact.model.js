import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    telephone: {
      type: String,
      required: true,
      trim: true,
    },

    sujet: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    lu: {
      type: Boolean,
      default: false, // message non lu
    },

    supprime: {
      type: Boolean,
      default: false, // soft delete
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
