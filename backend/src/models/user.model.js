import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    motDePasse: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "observateur"],
      default: "observateur",
    },
  },
  { timestamps: true }
);

/* 🔐 Hash du mot de passe avant sauvegarde */
userSchema.pre("save", async function () {
  if (!this.isModified("motDePasse")) return;
  this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
});

const User = mongoose.model("User", userSchema);
export default User;
