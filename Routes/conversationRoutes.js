import express from "express";
import {
  createConversation,
  getConversation,
  deleteConversation,
} from "../Controllers/conversationController.js";

const router = express.Router();

// Route pour créer une conversation
/**
 * @swagger
 * /conversations/create-conversation:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - members
 *             properties:
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/create-conversation", createConversation);


// Route pour récupérer une conversation
/**
 * @swagger
 * /conversations/get-conversation/{conversationId}:
 *   get:
 *     summary: Get a conversation by ID
 *     tags: [Conversation]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the conversation
 *     responses:
 *       200:
 *         description: Conversation retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Server error
 */
router.get("/get-conversation/:conversationId", getConversation);

// Route pour supprimer une conversation
/**
 * @swagger
 * /conversations/delete-conversation/{conversationId}:
 *   delete:
 *     summary: Delete a conversation by ID
 *     tags: [Conversation]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the conversation to be deleted
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Conversation not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-conversation/:conversationId", deleteConversation);


export default router;