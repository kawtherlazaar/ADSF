import express from "express";
import {
  createMedia,
  getMedias,
  updateMedia,
  deleteMedia,
  getMediaById,
} from "../controllers/media.controller.js";

import { uploadMedia } from "../middleware/uploads/mediaUpload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/* 🟢 PUBLIC : liste médias avec filtre + pagination */
router.get("/", getMedias);
router.get("/:id", getMediaById);
/* 🔐 ADMIN : ajouter média (image / vidéo upload ou lien) */
router.post(
  "/",
  protect,
  isAdmin,
  uploadMedia.single("fichier"),
  createMedia
);

/* 🔐 ADMIN : modifier média */
router.put(
  "/:id",
  protect,
  isAdmin,
  uploadMedia.single("fichier"),
  updateMedia
);

/* 🔐 ADMIN : supprimer média */
router.delete("/:id", protect, isAdmin, deleteMedia);

export default router;
