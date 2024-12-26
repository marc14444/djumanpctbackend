import express from "express";
import multer from "multer";
import {
  createLocalite,
  getAllLocalites,
} from "../Controllers/localitesController.js";

const router = express.Router();
const upload = multer();

// Route pour créer une localité
/**
 * @swagger
 * /localites/create-localite:
 *   post:
 *     summary: Create a new localité
 *     tags: [Localité]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nomLocalite
 *             properties:
 *               nomLocalite:
 *                 type: string
 *     responses:
 *       201:
 *         description: Localité created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/create-localite", upload.any(), createLocalite);

// Route pour obtenir toutes les localités
/**
 * @swagger
 * /localites/get-all-localites:
 *   get:
 *     summary: Get all localités
 *     tags: [Localité]
 *     responses:
 *       200:
 *         description: Localités retrieved successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get("/get-all-localites", getAllLocalites);


export default router;