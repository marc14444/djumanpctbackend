import express from "express";
import {
  noterArtisan,
  getArtisanDetails,
} from "../Controllers/noteController.js";
import authArtisan from "../middleware/authArtisan.js";

const router = express.Router();

// Route pour noter un artisan
router.post("/artisans/:artisanId/note", noterArtisan);

// Route pour récupérer les détails d'un artisan
router.get("/get-artisan-details/:artisanId", getArtisanDetails);

export default router;