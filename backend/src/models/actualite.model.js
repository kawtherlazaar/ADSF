import mongoose from "mongoose";

const actualiteSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
    },

    resume: {
      type: String,
      required: true,
    },

    contenu: {
      type: String,
    },

    categorie: {
      type: String,
      enum: ["Communiqué", "Projet", "Événement"],
      default: "Communiqué",
    },

    datePublication: {
      type: Date,
      required: true,
    },

    image: {
      type: String,
    },

    statut: {
      type: String,
      enum: ["actif", "archive"],
      default: "actif",
    },

    supprime: {
      type: Boolean,
      default: false, // ✅ SOFT DELETE
    },
  },
  { timestamps: true }
);

export default mongoose.model("Actualite", actualiteSchema);
