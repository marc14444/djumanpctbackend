// routes/projets.js
import express from 'express';
import { 
    soumettreProjet, 
    getProjets, 
    getProjetById, 
    getProjetsByClientId,

} from '../Controllers/projetController.js';

const router = express.Router();

//Routes for send projets
router.post('/send-projets', soumettreProjet);

//Routes for get all projets
router.get('/get-projets', getProjets);

//Routes for get projet by id
router.get('/projets/:projetId', getProjetById);

//Routes for get projets by client
router.get('/get-projets-by-client/:clientId', getProjetsByClientId);

export default router;
