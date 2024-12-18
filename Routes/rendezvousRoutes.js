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
router.post('/prendre-rendezvous/:clientId/avec/:artisanId', authClient, prendreRendezvous);

// Route pour confirmer un rendez-vous
router.patch('/confirmer-rendezvous/:id', authArtisan, confirmerRendezvous);

// Route pour annuler un rendez-vous par l'artisan
router.post('/annuler-rendezvous/:id', authArtisan, annulerRendezvous);

// Route pour annuler un rendez-vous par le client
router.delete('/annuler-rendezvous/:id', authClient, annulerRendezvous);

// Route pour lister les rendez-vous d'un client
router.get('/lister-rendezvous', authClient, listerRendezvous);

// Route pour lister les rendez-vous d'un artisan
router.get('/lister-rendezvous-par-artisan/:artisanId', authArtisan, listerRendezvousRecus);

export default router;
