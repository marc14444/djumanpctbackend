import multer from "multer";

// Configuration de multer pour les fichiers uploadés
const storage = multer.memoryStorage();  // Utilise la mémoire pour stocker les fichiers temporairement

const uploadpub = multer({ storage }).fields([
  { name: 'image', maxCount: 5 },  // Limite à 5 images
  { name: 'video', maxCount: 1 }   // Limite à 1 vidéo
]);

export default uploadpub;
