import express from 'express';
import {
  ajouterTemoignage,
  modifierTemoignage,
  supprimerTemoignage,
  getTemoignages
} from '../Controllers/temoignageController.js';
import authAdmin from '../middleware/authAdmin.js';

const router = express.Router();

// Route pour ajouter un témoignage
/**
 * @swagger
 * /temoignages/add-temoignages:
 *   post:
 *     summary: Add a new testimonial
 *     tags: [Témoignage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - artisanId
 *               - contenu
 *             properties:
 *               clientId:
 *                 type: string
 *               artisanId:
 *                 type: string
 *               contenu:
 *                 type: string
 *     responses:
 *       201:
 *         description: Testimonial added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/add-temoignages', ajouterTemoignage);


// Route pour modifier un témoignage
/**
 * @swagger
 * /temoignages/modif-temoignages/{idTemoignage}:
 *   put:
 *     summary: Modify a testimonial by ID
 *     tags: [Témoignage]
 *     parameters:
 *       - in: path
 *         name: idTemoignage
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the testimonial to be modified
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contenu:
 *                 type: string
 *     responses:
 *       200:
 *         description: Testimonial modified successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Testimonial not found
 *       500:
 *         description: Server error
 */
router.put('/modif-temoignages/:idTemoignage', modifierTemoignage);


// Route pour supprimer un témoignage
/**
 * @swagger
 * /temoignages/del-temoignages/{idTemoignage}:
 *   delete:
 *     summary: Delete a testimonial by ID
 *     tags: [Témoignage]
 *     parameters:
 *       - in: path
 *         name: idTemoignage
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the testimonial to be deleted
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Testimonial not found
 *       500:
 *         description: Server error
 */
router.delete('/del-temoignages/:idTemoignage', supprimerTemoignage);


// Route pour récupérer tous les témoignages
/**
 * @swagger
 * /temoignages/get-temoignages:
 *   get:
 *     summary: Get all testimonials
 *     tags: [Témoignage]
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/get-temoignages', getTemoignages);

export default router;
