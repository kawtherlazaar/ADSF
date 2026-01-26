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

const router = express.Router();
//public 
router.get("/", getProjects);
router.get("/:id", getProjectById);
//only admin
router.post("/", protect, isAdmin, createProject);
router.put("/:id", protect, isAdmin, updateProject);
router.delete("/:id", protect, isAdmin, deleteProject);

export default router;
