import express from "express";
import {
  sendMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} from "../controllers/contact.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

/* 🟢 PUBLIC */
router.post("/", sendMessage);

/* 🔐 ADMIN */
router.get("/", protect, isAdmin, getMessages);
router.put("/:id/read", protect, isAdmin, markAsRead);
router.delete("/:id", protect, isAdmin, deleteMessage);

export default router;
