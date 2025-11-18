import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getEvents, addEvent, updateEvent, deleteEvent,} from "../controllers/calendarController.js";

const router = express.Router();

router.get("/", protect, getEvents);
router.post("/", protect, addEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

export default router;
