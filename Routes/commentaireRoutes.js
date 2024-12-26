import express from "express";
import {
  addComment,
  removeComment,
  getCommentsByPublication,
} from "../Controllers/commentairePubController.js";

const router = express.Router();

// Route pour ajouter un commentaire
/**
 * @swagger
 * /commentaires/add-comment:
 *   post:
 *     summary: Add a comment to a publication
 *     tags: [Commentaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicationId
 *               - userId
 *               - commentaire
 *             properties:
 *               publicationId:
 *                 type: string
 *               userId:
 *                 type: string
 *               commentaire:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Server error
 */
router.post("/add-comment", addComment);

// Route pour supprimer un commentaire
/**
 * @swagger
 * /commentaires/delete-comment:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Commentaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentId
 *             properties:
 *               commentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-comment", removeComment);

// Route pour récupérer les commentaires d'une publication
/**
 * @swagger
 * /commentaires/get-comments-by-publication/{idPublication}:
 *   get:
 *     summary: Get comments for a publication
 *     tags: [Commentaire]
 *     parameters:
 *       - in: path
 *         name: idPublication
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the publication
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Server error
 */
router.get("/get-comments-by-publication/:idPublication", getCommentsByPublication);

export default router;