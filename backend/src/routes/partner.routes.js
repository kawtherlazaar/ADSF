import express from "express";
import {
  getPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from "../controllers/partner.controller.js";

import { uploadLogo } from "../middleware/uploads/logoUpload.middleware.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getPartners);

/* ADMIN */
router.post(
  "/",
  protect,
  isAdmin,
  uploadLogo.single("logo"),
  createPartner
);


router.put(
  "/:id",
  protect,
  isAdmin,
  uploadLogo.single("logo"),
  updatePartner
);

router.delete("/:id", protect, isAdmin, deletePartner);

export default router;
