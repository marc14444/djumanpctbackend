import express from 'express';
import { createOrder, getOrderById, updateOrderStatus, getOrdersByArtisan } from '../Controllers/orderController.js';
import authClient from '../middleware/authClients.js';
import authArtisan from '../middleware/authArtisan.js';
const router = express.Router();

// Route pour créer une commande
/**
 * @swagger
 * /orders/create-order:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - buyer
 *               - artisan
 *               - items
 *               - totalAmount
 *             properties:
 *               buyer:
 *                 type: string
 *               artisan:
 *                 type: string
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
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/create-order', authClient, createOrder);

// Route pour récupérer une commande par ID
/**
 * @swagger
 * /orders/order/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/order/:id', authClient, getOrderById);

// Route pour mettre à jour le statut d'une commande
/**
 * @swagger
 * /orders/update-order/{id}:
 *   put:
 *     summary: Update order status by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put('/update-order/:id', authClient, updateOrderStatus);


// Route pour récupérer les commandes d'un artisan
/**
 * @swagger
 * /orders/artisan-orders/{artisanId}:
 *   get:
 *     summary: Get orders for an artisan by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artisanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.get('/artisan-orders/:artisanId', authArtisan, getOrdersByArtisan);

export default router;
