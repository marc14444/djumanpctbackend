import express from "express";
import autClient from "../middleware/authClients.js";
import { searchArtisans } from "../Controllers/searchController.js";

const router = express.Router();

// Route pour rechercher les artisans
/**
 * @swagger
 * /search/get-artisans-by-search:
 *   get:
 *     summary: Search for artisans based on criteria
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the location
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the location
 *       - in: query
 *         name: metier
 *         required: true
 *         schema:
 *           type: string
 *         description: The profession of the artisan
 *       - in: query
 *         name: rayon
 *         required: true
 *         schema:
 *           type: number
 *         description: Radius for the search in kilometers
 *       - in: query
 *         name: mode
 *         required: true
 *         schema:
 *           type: string
 *         description: Mode of transportation (e.g., voiture, marche)
 *     responses:
 *       200:
 *         description: Artisans found successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/get-artisans-by-search", searchArtisans);


//exemple de requête : http://localhost:3000/search?latitude=48.8566140&longitude=2.3522219&metier=tailleur&rayon=10&mode=voiture

export default router;
