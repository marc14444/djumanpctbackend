// routes/projets.js
import express from 'express';

import { 
        proposerDevis,
        getDevisByProjetId,
        accepterDevis,
        refuserDevis,
        modifierDevis,
        supprimerDevis,
    } from '../Controllers/devisController.js';
const router = express.Router();

// Route pour proposer un devis pour un projet
/**
 * @swagger
 * /devis/faire-devis:
 *   post:
 *     summary: Propose a new quotation for a project
 *     tags: [Devis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projetId
 *               - artisanId
 *               - montant
 *               - description
 *             properties:
 *               projetId:
 *                 type: string
 *               artisanId:
 *                 type: string
 *               montant:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quotation proposed successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/faire-devis', proposerDevis);


// Route pour récupérer les devis d'un projet par son ID
/**
 * @swagger
 * /devis/recup-devis/{projetId}:
 *   get:
 *     summary: Get quotations for a project by ID
 *     tags: [Devis]
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     responses:
 *       200:
 *         description: Quotations retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/recup-devis/:projetId', getDevisByProjetId);


// Route pour accepter un devis
/**
 * @swagger
 * /devis/accepter-devis/{devisId}:
 *   put:
 *     summary: Accept a quotation by ID
 *     tags: [Devis]
 *     parameters:
 *       - in: path
 *         name: devisId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quotation to be accepted
 *     responses:
 *       200:
 *         description: Quotation accepted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
router.put('/accepter-devis/:devisId', accepterDevis);


// Route pour refuser un devis
/**
 * @swagger
 * /devis/refuser-devis/{devisId}:
 *   put:
 *     summary: Refuse a quotation by ID
 *     tags: [Devis]
 *     parameters:
 *       - in: path
 *         name: devisId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quotation to be refused
 *     responses:
 *       200:
 *         description: Quotation refused successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
router.put('/refuser-devis/:devisId', refuserDevis);


// Route pour modifier un devis
/**
 * @swagger
 * /devis/modifier-devis/{devisId}:
 *   put:
 *     summary: Modify a quotation by ID
 *     tags: [Devis]
 *     parameters:
 *       - in: path
 *         name: devisId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quotation to be modified
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               montant:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quotation modified successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
router.put('/modifier-devis/:devisId', modifierDevis);


// Route pour supprimer un devis
/**
 * @swagger
 * /devis/supprimer-devis/{devisId}:
 *   delete:
 *     summary: Delete a quotation by ID
 *     tags: [Devis]
 *     parameters:
 *       - in: path
 *         name: devisId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quotation to be deleted
 *     responses:
 *       200:
 *         description: Quotation deleted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Quotation not found
 *       500:
 *         description: Server error
 */
router.delete('/supprimer-devis/:devisId', supprimerDevis);


export default router;
