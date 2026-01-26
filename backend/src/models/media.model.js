import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },

    type: {
      type: String,
      enum: ["photo", "video"],
      required: true,
    },

    fichier: {
      type: String, // image path OR video path OR video URL
      required: false,
    },

    sourceVideo: {
      type: String,
      enum: ["upload", "lien"],
    },

    statut: {
      type: String,
      enum: ["actif", "inactif"],
      default: "actif",
    },

    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
