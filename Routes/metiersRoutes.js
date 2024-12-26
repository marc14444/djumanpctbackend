import express from "express";
import multer from "multer";
import {
  createMetier,
  getAllMetiers,
} from "./../Controllers/metiersController.js";

const router = express.Router();

const upload = multer();

import authAdmin from "../middleware/authAdmin.js";

// Route pour créer un métier
/**
 * @swagger
 * /metiers/create-metier:
 *   post:
 *     summary: Create a new métier
 *     tags: [Métier]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nomMetier
 *             properties:
 *               nomMetier:
 *                 type: string
 *     responses:
 *       201:
 *         description: Métier created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/create-metier", upload.any(), authAdmin, createMetier);


// Route pour obtenir tous les métiers
/**
 * @swagger
 * /metiers/get-all-metiers:
 *   get:
 *     summary: Get all métiers
 *     tags: [Métier]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métier retrieved successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get("/get-all-metiers", authAdmin, getAllMetiers);

export default router;
