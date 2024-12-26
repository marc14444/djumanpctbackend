import express from "express";
import { addLike, removeLike, countLikes } from "../Controllers/likeController.js";

const router = express.Router();

// Route pour ajouter un like
/**
 * @swagger
 * /likes/add-like:
 *   post:
 *     summary: Add a like to a publication
 *     tags: [Like]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicationId
 *               - userId
 *             properties:
 *               publicationId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Like added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/add-like", addLike);

// Route pour supprimer un like
/**
 * @swagger
 * /likes/delete-like:
 *   delete:
 *     summary: Remove a like from a publication
 *     tags: [Like]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicationId
 *               - userId
 *             properties:
 *               publicationId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Like not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-like", removeLike);

// Route pour compter les likes d'une publication
/**
 * @swagger
 * /likes/get-like/count/{idPublication}:
 *   get:
 *     summary: Count the likes of a publication
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: idPublication
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the publication
 *     responses:
 *       200:
 *         description: Like count retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Server error
 */
router.get("/get-like/count/:idPublication", countLikes);


export default router;
