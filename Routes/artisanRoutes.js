import express from "express";
import upload from "../middleware/multer-config.js";
import {
  signupArtisan,
  loginArtisan,
  getArtisanConnected,
  getAllArtisans,
  getArtisanById,
  updateArtisanProfil,
  updatePasswordArtisan,
  deletedArtisanAccount,
} from "../Controllers/artisanController.js";
import authArtisan from "../middleware/authArtisan.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Route pour l'inscription des artisans avec téléchargement de fichiers
router.post("/signup-artisan", upload, signupArtisan);

// Route pour la connexion des artisans sans téléchargement de fichiers
router.post("/login-artisan", loginArtisan);

// Route pour obtenir l'artisan connecté
router.get("/get-artisan-connected", authArtisan, getArtisanConnected);

// Route pour obtenir tous les artisans
router.get("/get-all-artisan", authAdmin, getAllArtisans);

// Route pour obtenir un artisan par ID
router.get("/get-artisan-by-id/:id", authAdmin, getArtisanById);

// Route pour mettre à jour le profil de l'artisan avec téléchargement de fichiers
router.post("/update-artisan-profil", authArtisan, upload, updateArtisanProfil);

// Route pour mettre à jour le mot de passe de l'artisan sans téléchargement de fichiers
router.put("/update-password-artisan", authArtisan, updatePasswordArtisan);

// Route pour supprimer le compte de l'artisan
router.delete("/deleted-artisan-account", authArtisan, deletedArtisanAccount);

export default router;
