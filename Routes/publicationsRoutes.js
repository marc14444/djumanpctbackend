import express from "express";
import upload from "../middleware/multer-config.js";
import authArtisan from "../middleware/authArtisan.js";
import {
  addPublication,
  getAllArtisansPublications,
  getAllPublications,
  getOnePublication,
} from "../Controllers/publicationsController.js";

const router = express.Router();

router.post("/add-publication", upload, authArtisan, addPublication);

router.get(
  "/get-one-publication/:idPub",
  upload,
  authArtisan,
  getOnePublication
);

router.get(
  "/get-all-publications-artisan-connected",
  upload,
  authArtisan,
  getAllArtisansPublications
);

router.get("/get-all-publications", upload, getAllPublications);

export default router;
