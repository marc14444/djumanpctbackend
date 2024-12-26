// routes/projets.js
import express from 'express';
import { 
    soumettreProjet, 
    getProjets, 
    getProjetById, 
    getProjetsByClientId,

} from '../Controllers/projetController.js';

const router = express.Router();

// Route pour soumettre un projet
/**
 * @swagger
 * /projets/send-projets:
 *   post:
 *     summary: Submit a new project
 *     tags: [Projet]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - titre
 *               - description
 *               - budget
 *               - deadline
 *             properties:
 *               clientId:
 *                 type: string
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               budget:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Project submitted successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/send-projets', soumettreProjet);


// Route pour récupérer tous les projets
/**
 * @swagger
 * /projets/get-projets:
 *   get:
 *     summary: Get all projects
 *     tags: [Projet]
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/get-projets', getProjets);


// Route pour récupérer un projet par ID
/**
 * @swagger
 * /projets/projets/{projetId}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Projet]
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/projets/:projetId', getProjetById);


// Route pour récupérer les projets par client
/**
 * @swagger
 * /projets/get-projets-by-client/{clientId}:
 *   get:
 *     summary: Get projects by client ID
 *     tags: [Projet]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.get('/get-projets-by-client/:clientId', getProjetsByClientId);

export default router;
