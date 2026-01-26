import express from "express";
import { getStatistiquesDashboard } from "../controllers/dashbord.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/* 🔐 ADMIN : dashboard */
router.get("/", protect, isAdmin, getStatistiquesDashboard);

export default router;
