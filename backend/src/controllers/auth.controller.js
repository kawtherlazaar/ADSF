import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    const { nom, email, motDePasse } = req.body;

    if (!nom || !email || !motDePasse) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        message: "Cet utilisateur existe déjà",
      });
    }

    const admin = await User.create({
      nom,
      email,
      motDePasse,
      role: "admin",
    });

    res.status(201).json({
      message: "Administrateur créé avec succès",
      admin: {
        id: admin._id,
        nom: admin.nom,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🟢 CONNEXION */
export const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    console.log("BODY:", req.body);

    if (!email || !motDePasse) {
      return res.status(400).json({
        message: "Email ou mot de passe manquant",
      });
    }

    const utilisateur = await User.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
      });
    }

    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse
    );

    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Identifiants incorrects",
      });
    }

    const token = jwt.sign(
      {
        id: utilisateur._id,
        role: utilisateur.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Connexion réussie",
      token,
      utilisateur: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
