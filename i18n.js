import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialisation de i18next pour les traductions
i18next.use(Backend).use(middleware.LanguageDetector).init({
  backend: {
    loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json'),
  },
  fallbackLng: 'fr', // Langue par défaut
  preload: ['en', 'fr', 'es'], // Charger les langues par défaut
  detection: {
    order: ['querystring', 'header', 'cookie'], // Priorité aux en-têtes avant les cookies
    caches: ['cookie'],
  },
});

export default i18next;
