import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { aiChat } from "../controllers/aiChatController.js";

const router = express.Router();

router.post("/chat", protect, aiChat);

export default router;
