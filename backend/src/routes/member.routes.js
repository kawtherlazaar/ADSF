import express from "express";
import {
  inscrireMembre,
  getMembres,
  exportExcel,
  exportPDF,
  approuverMembre,
  rejeterMembre,
} from "../controllers/member.controller.js";


import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/* =====================================================
   🟢 PUBLIC : inscription bénévole
===================================================== */
router.post(
  "/",
  inscrireMembre
);

/* =====================================================
   🔐 ADMIN : gestion des membres
===================================================== */
router.get("/", protect, isAdmin, getMembres);

router.get("/export/excel", protect, isAdmin, exportExcel);
router.get("/export/pdf", protect, isAdmin, exportPDF);

router.put(
  "/:id/approuver",
  protect,
  isAdmin,
  approuverMembre
);

router.put(
  "/:id/rejeter",
  protect,
  isAdmin,
  rejeterMembre
);

export default router;
