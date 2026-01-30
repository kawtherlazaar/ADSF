import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from "../controllers/project.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { uploadProjetImage } from "../middleware/uploads/UploadProjet.js";

const router = express.Router();

/* =========================
   🌍 Public routes
========================= */
router.get("/", getProjects);
router.get("/:id", getProjectById);

/* =========================
   🔐 Admin routes
========================= */
router.post(
  "/",
  protect,
  isAdmin,
  uploadProjetImage.single("image"), // multer جاهز باش يستقبل الملف
  createProject
);


router.put(
  "/:id",
  protect,
  isAdmin,
  uploadProjetImage.single("image"), // ✅ ajout multer
  updateProject
);

router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteProject
);

export default router;
