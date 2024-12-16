import express from "express";
import { searchArtisans } from "../controllers/searchController.js";

const router = express.Router();

// Route pour rechercher les artisans
router.get("/get-artisans-by-search", searchArtisans);

export default router;
