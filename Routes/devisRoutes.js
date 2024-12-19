// routes/projets.js
import express from 'express';

import { 
        proposerDevis,
        getDevisByProjetId,
        accepterDevis,
        refuserDevis,
        modifierDevis,
        supprimerDevis,
    } from '../controllers/devisController.js';
const router = express.Router();

// POST - proposer un devis pour un projet
router.post('/faire-devis', proposerDevis);

// GET - récupérer les devis d'un projet par son ID
router.get('/recup-devis/:projetId', getDevisByProjetId);

// PUT - accepter, refuser ou modifier un devis
router.put('/accepter-devis/:devisId', accepterDevis);

// PUT - accepter, refuser ou modifier un devis
router.put('/refuser-devis/:devisId', refuserDevis);

// PUT - accepter, refuser ou modifier un devis
router.put('/modifier-devis/:devisId', modifierDevis);

// DELETE - supprimer un devis
router.delete('/supprimer-devis/:devisId', supprimerDevis);

export default router;
