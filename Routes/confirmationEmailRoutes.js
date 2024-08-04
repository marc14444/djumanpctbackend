import expresse from "express";
import multer from "multer";
import { verifyCode } from "../Controllers/confirmationEmailController.js";

const upload = multer();

const router = expresse.Router();


router.post("/verifyCode", upload.any(), verifyCode);
export default router;
