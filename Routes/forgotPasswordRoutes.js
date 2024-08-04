import express from "express";
import {
  forgotPassword,
  verifyCode,
  resetPassword,
} from "../Controllers/forgotPasswordController.js";
import multer from "multer";

const router = express.Router();

const upload = multer();

router.post("/verify-email", upload.any(), forgotPassword);

router.post("/verify-code", upload.any(), verifyCode);

router.post("/reset-password", upload.any(), resetPassword);

export default router;
