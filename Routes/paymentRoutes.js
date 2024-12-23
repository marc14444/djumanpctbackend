// routes/paymentRoutes.js
import express from 'express';
import { createPaymentSession, handlePaymentWebhook } from '../Controllers/paymentController.js';
import authClients from '../middleware/authClients.js';

const router = express.Router();

router.post('/create-session',authClients, createPaymentSession);
router.post('/webhook',authClients, handlePaymentWebhook);

export default router;
