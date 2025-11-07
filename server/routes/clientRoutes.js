import express from "express";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧾 /api/clients
router.route("/")
  .get(protect, getClients)      // GET all clients (for logged-in user)
  .post(protect, createClient);  // POST create new client

// 🧍 /api/clients/:id
router.route("/:id")
  .get(protect, getClientById)   // GET single client
  .put(protect, updateClient)    // PUT update client
  .delete(protect, deleteClient);// DELETE client

export default router;
