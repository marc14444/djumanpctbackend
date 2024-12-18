import express from 'express';
import {
  ajouterTemoignage,
  modifierTemoignage,
  supprimerTemoignage,
  getTemoignages
} from '../Controllers/temoignageController.js';
import authAdmin from '../middleware/authAdmin.js';

const router = express.Router();

//Route pour ajouter temoignage
router.post('/add-temoignages', ajouterTemoignage);

//Routes pour modifier un temoignage
router.put('/modif-temoignages/:idTemoignage', modifierTemoignage);

//Route pour supprimer un temoignage
router.delete('/del-temoignages/:idTemoignage', supprimerTemoignage);

//Route pour récupérer tous les temoignages
router.get('/get-temoignages', getTemoignages);

export default router;
