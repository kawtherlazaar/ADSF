import express from "express";
import {
  registerAdmin,
  login,
} from "../controllers/auth.controller.js";

const router = express.Router();

/* 🟢 Authentification */
router.post("/register-admin", registerAdmin);
router.post("/login", login);

export default router;
