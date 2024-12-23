import express from 'express';
import { createOrder, getOrderById, updateOrderStatus, getOrdersByArtisan } from '../Controllers/orderController.js';
import authClient from '../middleware/authClients.js';
import authArtisan from '../middleware/authArtisan.js';
const router = express.Router();

router.post('/create', authClient, createOrder);
router.get('/:id',authClient, getOrderById);
router.put('/update/:id',authClient, updateOrderStatus);
router.get('/artisan/:artisanId',authArtisan, getOrdersByArtisan);

export default router;
