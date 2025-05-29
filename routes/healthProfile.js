import express from "express";
import {
  addHealthProfile,
  updateHealthProfile,
  getMyHealthProfiles,
  getHealthProfileById,
  getAllHealthProfiles,
  deleteHealthProfile,
} from "../controllers/healthProfileController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.fields([{ name: "reports" }, { name: "doctorFiles" }]),
  addHealthProfile
);
router.put(
  "/:id",
  authMiddleware,
  upload.fields([{ name: "reports" }, { name: "doctorFiles" }]),
  updateHealthProfile
);
router.get("/me", authMiddleware, getMyHealthProfiles);
router.get("/:id", authMiddleware, getHealthProfileById);
router.get("/", authMiddleware, getAllHealthProfiles);
router.delete("/:id", authMiddleware, deleteHealthProfile);

export default router;
