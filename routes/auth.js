import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forget_password", authController.forgotPassword);

export default router;
