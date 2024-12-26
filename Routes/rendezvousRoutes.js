import express from 'express';
import {
     prendreRendezvous,
     confirmerRendezvous,  
     annulerRendezvous,
     listerRendezvous,
     listerRendezvousRecus,
} from '../Controllers/rendez-vousController.js';
import authArtisan from '../middleware/authArtisan.js';
import authClient from '../middleware/authClients.js';
const router = express.Router();

// Route pour prendre un rendez-vous
/**
 * @swagger
 * /rendez-vous/prendre-rendezvous/{clientId}/avec/{artisanId}:
 *   post:
 *     summary: Schedule a new appointment
 *     tags: [Rendez-vous]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client
 *       - in: path
 *         name: artisanId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - heure
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               heure:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment scheduled successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/prendre-rendezvous/:clientId/avec/:artisanId', authClient, prendreRendezvous);


// Route pour confirmer un rendez-vous
/**
 * @swagger
 * /rendez-vous/confirmer-rendezvous/{id}:
 *   patch:
 *     summary: Confirm an appointment by ID
 *     tags: [Rendez-vous]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment to be confirmed
 *     responses:
 *       200:
 *         description: Appointment confirmed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.patch('/confirmer-rendezvous/:id', authArtisan, confirmerRendezvous);


// Route pour annuler un rendez-vous par l'artisan
/**
 * @swagger
 * /rendez-vous/annuler-rendezvous/{id}:
 *   post:
 *     summary: Cancel an appointment by ID (artisan)
 *     tags: [Rendez-vous]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment to be cancelled
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.post('/annuler-rendezvous/:id', authArtisan, annulerRendezvous);


// Route pour annuler un rendez-vous par le client
/**
 * @swagger
 * /rendez-vous/annuler-rendezvous/{id}:
 *   delete:
 *     summary: Cancel an appointment by ID (client)
 *     tags: [Rendez-vous]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the appointment to be cancelled
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */
router.delete('/annuler-rendezvous/:id', authClient, annulerRendezvous);


// Route pour lister les rendez-vous d'un client
/**
 * @swagger
 * /rendez-vous/lister-rendezvous:
 *   get:
 *     summary: List all appointments for the logged-in client
 *     tags: [Rendez-vous]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointments listed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/lister-rendezvous', authClient, listerRendezvous);


// Route pour lister les rendez-vous d'un artisan
/**
 * @swagger
 * /rendez-vous/lister-rendezvous-par-artisan/{artisanId}:
 *   get:
 *     summary: List all appointments for a specific artisan by ID
 *     tags: [Rendez-vous]
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
 *         description: Appointments listed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/lister-rendezvous-par-artisan/:artisanId', authArtisan, listerRendezvousRecus);


export default router;
