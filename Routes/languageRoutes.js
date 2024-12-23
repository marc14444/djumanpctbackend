// routes/languageRoutes.js
import express from 'express';
import { updateLanguage } from '../Controllers/languageController.js';
const router = express.Router();

router.get('/someRoute', (req, res) => {
  const detectedLanguage = req.language;
  const t = req.t; // Fonction de traduction
  const translatedMessage = t('welcome'); // Utilisation correcte de la traduction

  res.json({ message: translatedMessage }); // Envoi de la réponse
});

// Route spécifique pour tester la langue explicitement
router.get('/testLanguage', (req, res) => {
  const testLanguage = 'es'; // Définir explicitement la langue espagnole pour tester
  const t = req.t; // Fonction de traduction
  const translatedMessage = t('welcome', { lng: testLanguage }); // Utilisation de la langue de test

  res.json({ message: translatedMessage }); // Envoi de la réponse
});

router.post('/traductions', updateLanguage);

export default router;
