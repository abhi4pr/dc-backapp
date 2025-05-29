import express from "express";
import {
  getContactsByUser,
  updateContacts,
  getAllContacts,
  deleteContactsByUser,
  addContacts,
} from "../controllers/contactController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-contact", authMiddleware, addContacts);
router.get("/", authMiddleware, getAllContacts);
router.get("/:userId", authMiddleware, getContactsByUser);
router.post("/", authMiddleware, updateContacts);
router.delete("/:userId", authMiddleware, deleteContactsByUser);

export default router;
