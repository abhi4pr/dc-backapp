import express from "express";
import { repertory } from "../controllers/repertoryController.js";
import { patientdata } from "../controllers/patientController.js";
import { meteria } from "../controllers/meteriaController.js";
import { medicine } from "../controllers/medicineController.js";
import { expert } from "../controllers/expertController.js";
// import { lab } from "../controllers/labController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/send_patient_data/", authMiddleware, patientdata);
router.post("/send_repertory/", authMiddleware, repertory);
router.post("/send_expert/", authMiddleware, expert);
router.post("/send_meteria/", authMiddleware, meteria);
router.post("/send_medicine/", authMiddleware, medicine);
// router.post("/send_lab/", authMiddleware, lab);

export default router;
