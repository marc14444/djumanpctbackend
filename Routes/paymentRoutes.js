// routes/paymentRoutes.js
import express from 'express';
import { createPaymentSession, handlePaymentWebhook } from '../Controllers/paymentController.js';
import authClients from '../middleware/authClients.js';

const router = express.Router();

// Route pour créer une session de paiement
/**
 * @swagger
 * /payments/create-session:
 *   post:
 *     summary: Create a new payment session
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *     responses:
 *       200:
 *         description: Payment session created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/create-session', authClients, createPaymentSession);


// Route pour gérer les webhooks de paiement
/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Handle payment webhook
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook handled successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/webhook', authClients, handlePaymentWebhook);

export default router;
