export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); //  Accès autorisé (Admin)
  } else {
    return res
      .status(403)
      .json({ message: "Accès réservé aux administrateurs" });
  }
};
