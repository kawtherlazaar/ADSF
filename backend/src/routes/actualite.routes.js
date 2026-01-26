import express from "express";
import {
  getActualites,
  createActualite,
  updateActualite,
  deleteActualite,
} from "../controllers/actualite.controller.js";

import { uploadActualiteImage } from "../middleware/uploads/actualiteUpload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getActualites);

/* ADMIN */
router.post(
  "/",
  protect,
  isAdmin,
  uploadActualiteImage.single("image"),
  createActualite
);

router.put(
  "/:id",
  protect,
  isAdmin,
  uploadActualiteImage.single("image"),
  updateActualite
);

router.delete("/:id", protect, isAdmin, deleteActualite);



export default router;
