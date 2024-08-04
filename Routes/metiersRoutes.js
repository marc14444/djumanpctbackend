import express from "express";
import multer from "multer";
import {
  createMetier,
  getAllMetiers,
} from "./../Controllers/metiersController.js";

const router = express.Router();

const upload = multer();

import authAdmin from "../middleware/authAdmin.js";

router.post("/create-metier", upload.any(), authAdmin, createMetier);
router.get("/get-all-metiers", authAdmin, getAllMetiers);

export default router;
