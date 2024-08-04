import express from "express";
import multer from "multer";
import {
  createLocalite,
  getAllLocalites,
} from "../Controllers/localitesController.js";

const router = express.Router();
const upload = multer();

router.post("/create-localite", upload.any(), createLocalite);
router.get("/get-all-localites", getAllLocalites);

export default router;