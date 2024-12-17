import express from "express";
import authArtisan from "../middleware/authArtisan.js";
import { searchArtisans } from "../Controllers/searchController.js";

const router = express.Router();

// Route pour rechercher les artisans
router.get("/get-artisans-by-search",authArtisan, searchArtisans);

//exemple de requête : http://localhost:3000/search?latitude=48.8566140&longitude=2.3522219&metier=tailleur&rayon=10&mode=voiture

export default router;
