import mongoose from "mongoose";

const membreSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },

    prenom: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    telephone: {
      type: String,
      required: true,
      trim: true,
    },

    competences: {
      type: [String],
      default: [],
    },

    disponibilite: {
      type: String,
      enum: [
        "A temps partiel",
        "A temps plein",
        "Occasionnel",
      
        "À distance"
      ],
      default: "A temps partiel",
    },

    role: {
      type: String,
      default: "Bénévole",
    },

    statut: {
      type: String,
      enum: ["en_attente", "approuve", "rejete"],
      default: "en_attente",
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

export default mongoose.model("Membre", membreSchema);  