// src/models/projet.model.js
import mongoose from "mongoose";

const projetSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    description: String,

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
