import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

   


    statut: {
      type: String,
      enum: ["actif", "inactif"],
      default: "actif",
    },
     logo: {
       type: String,
       required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Partner", partnerSchema);
