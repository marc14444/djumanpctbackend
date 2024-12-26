// routes/languageRoutes.js
import express from 'express';
import { updateLanguage } from '../Controllers/languageController.js';
const router = express.Router();

// Route pour obtenir un message traduit
/**
 * @swagger
 * /language/someRoute:
 *   get:
 *     summary: Get a translated message
 *     tags: [Language]
 *     responses:
 *       200:
 *         description: Message translated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/someRoute', (req, res) => {
  const detectedLanguage = req.language;
  const t = req.t; // Fonction de traduction
  const translatedMessage = t('welcome'); // Utilisation correcte de la traduction

  res.json({ message: translatedMessage }); // Envoi de la réponse
});

// Route pour tester la langue explicitement
/**
 * @swagger
 * /language/testLanguage:
 *   get:
 *     summary: Test translation with an explicitly defined language
 *     tags: [Language]
 *     responses:
 *       200:
 *         description: Message translated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/testLanguage', (req, res) => {
  const testLanguage = 'es'; // Définir explicitement la langue espagnole pour tester
  const t = req.t; // Fonction de traduction
  const translatedMessage = t('welcome', { lng: testLanguage }); // Utilisation de la langue de test

  res.json({ message: translatedMessage }); // Envoi de la réponse
});

// Route pour mettre à jour la langue
/**
 * @swagger
 * /language/traductions:
 *   post:
 *     summary: Update the language settings
 *     tags: [Language]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *             properties:
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: Language updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/traductions', updateLanguage);


export default router;
