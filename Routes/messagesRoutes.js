import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  updateMessage,
} from "../Controllers/messageController.js";

const router = express.Router();

// Route pour envoyer un message
/**
 * @swagger
 * /messages/send-message:
 *   post:
 *     summary: Send a new message
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - senderId
 *               - content
 *             properties:
 *               conversationId:
 *                 type: string
 *               senderId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/send-message", sendMessage);


// Route pour récupérer les messages
/**
 * @swagger
 * /messages/get-messages:
 *   get:
 *     summary: Get all messages
 *     tags: [Message]
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get("/get-messages", getMessages);


// Route pour supprimer un message
/**
 * @swagger
 * /messages/delete-message/{messageId}:
 *   delete:
 *     summary: Delete a message by ID
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to be deleted
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-message/:messageId", deleteMessage);


// Route pour modifier un message
/**
 * @swagger
 * /messages/update-message/{messageId}:
 *   put:
 *     summary: Update a message by ID
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */
router.put("/update-message/:messageId", updateMessage);

export default router;