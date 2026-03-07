import express from "express";
import { getClients, getClientById, createClient, updateClient, deleteClient} from "../controllers/clientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// /api/clients
router.route("/")
  .get(protect, getClients)
  .post(protect, createClient);

// /api/clients/:id
router.route("/:id")
  .get(protect, getClientById)
  .put(protect, updateClient)
  .delete(protect, deleteClient);

export default router;
