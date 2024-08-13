import express from "express";
import upload from "../middleware/multer-config.js";
import authArtisan from "../middleware/authArtisan.js";
import {
  addPublication,
  getAllArtisansPublications,
  getAllPublications,
  getOnePublication,
  getAllPublicationsByArtisan
} from "../Controllers/publicationsController.js";

const router = express.Router();

// Route pour ajouter une publication (avec upload de fichiers)
router.post("/add-publication", authArtisan, upload, addPublication);

// Route pour obtenir une seule publication par ID
router.get("/get-one-publication/:idPub", authArtisan, getOnePublication);

// Route pour obtenir toutes les publications d'un artisan connecté
router.get("/get-all-publications-artisan-connected", authArtisan, getAllArtisansPublications);

// Route pour obtenir toutes les publications (avec option de filtrer par artisanId)
router.get("/get-all-publications", getAllPublications);

router.get("/get-publications-by-artisan/:artisanId", getAllPublicationsByArtisan);

export default router;
