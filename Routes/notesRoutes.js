import express from "express";
import {
  noterArtisan,
  getArtisanDetails,
} from "../Controllers/noteController.js";
import authArtisan from "../middleware/authArtisan.js";

const router = express.Router();

// Route pour noter un artisan
/**
 * @swagger
 * /notes/artisans/{artisanId}/note:
 *   post:
 *     summary: Rate an artisan
 *     tags: [Note]
 *     parameters:
 *       - in: path
 *         name: artisanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan to be rated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - note
 *               - commentaire
 *             properties:
 *               note:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               commentaire:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artisan rated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.post("/artisans/:artisanId/note", noterArtisan);

// Route pour récupérer les détails d'un artisan
/**
 * @swagger
 * /notes/get-artisan-details/{artisanId}:
 *   get:
 *     summary: Get details of an artisan
 *     tags: [Note]
 *     parameters:
 *       - in: path
 *         name: artisanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan
 *     responses:
 *       200:
 *         description: Artisan details retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.get("/get-artisan-details/:artisanId", getArtisanDetails);


export default router;