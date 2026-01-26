import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    /* 1️⃣ Récupérer le token depuis le header */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    /* 2️⃣ Vérifier si le token existe */
    if (!token) {
      return res
        .status(401)
        .json({ message: "Accès refusé, token manquant" });
    }

    /* 3️⃣ Vérifier le token */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* 4️⃣ Récupérer l'utilisateur depuis la base de données */
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Utilisateur non autorisé" });
    }

    /* 5️⃣ Passer au middleware suivant */
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token invalide ou expiré" });
  }
};
