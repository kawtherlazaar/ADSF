
import mongoose from "mongoose";

const projetSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    // 🔹 image du projet (path ou filename)
    image: {
      type: String,
      default: "", // مثال: "uploads/projets/image.jpg"
    },

    categorie: {
      type: String,
      enum: ["Education", "Environnement", "Développement"],
      required: true,
    },

    statut: {
      type: String,
      enum: ["en_cours", "termine", "archive"],
      default: "en_cours",
    },

    dateDebut: Date,
    dateFin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Projet", projetSchema);
