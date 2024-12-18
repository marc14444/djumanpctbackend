import express from "express";
import {
  signupArtisan,
  loginArtisan,
  getArtisanConnected,
  updateArtisanProfil,
  updatePasswordArtisan,
  deletedArtisanAccount,
  demandeReinitialisationMotDePasse,
  reinitialiserMotDePasse,
  ajouterDisponibilites,
  updateDisponibilites,
  getDisponibilites,
  deleteDisponibiliteById,
} from "../Controllers/artisanController.js";
import authArtisan from "../middleware/authArtisan.js";
import { uploader } from "../middleware/multerArtisan.js";
import uploadpub from "../middleware/multerPublication.js";
import { 
  createPublication,
  getPublication,
  getAllPublicationsByArtisan,
  updatePublication,
  deletePublication
} from "../Controllers/publicationsController.js";

const router = express.Router();

// Route pour l'inscription des artisans avec téléchargement de fichiers
router.post("/signup-artisan", uploader.fields([{ name: "recto" }, { name: "verso" }, { name: "selfie" }]), signupArtisan);

// Route pour la connexion des artisans sans téléchargement de fichiers
router.post("/login-artisan", loginArtisan);

// Route pour obtenir l'artisan connecté
router.get("/get-artisan-connected", authArtisan, getArtisanConnected);

// Route pour mettre à jour le profil de l'artisan avec téléchargement de fichiers
router.put("/update-artisan-profil", authArtisan, uploader.fields([{ name: "recto" }, { name: "verso" }, { name: "selfie" }]), updateArtisanProfil);

// Route pour mettre à jour le mot de passe de l'artisan sans téléchargement de fichiers
router.put("/update-password-artisan", authArtisan, updatePasswordArtisan);

// Route pour supprimer le compte de l'artisan
router.delete("/deleted-artisan-account", authArtisan, deletedArtisanAccount);

// Route pour demander un e-mail de réinitialisation
router.post("/demande-reinitialisation", demandeReinitialisationMotDePasse);

// Route pour réinitialiser le mot de passe
router.post("/reinitialiser-mot-de-passe/:token", reinitialiserMotDePasse);

// Route pour ajouter des disponibilités
router.post("/ajouter-disponibilites", authArtisan, ajouterDisponibilites);

// Route pour mettre à jour les disponibilités
router.put("/update-disponibilites", authArtisan, updateDisponibilites);

// Route pour obtenir les disponibilités
router.get("/get-disponibilites", authArtisan, getDisponibilites);

// Route pour supprimer les disponibilités
router.delete("/disponibilites/:id", authArtisan, deleteDisponibiliteById);

// Route pour ajouter une publication (avec upload de fichiers)
router.post("/add-publication", authArtisan, uploadpub, createPublication);

// Route pour récupérer une publication
router.get("/get-publication/:idPublication", authArtisan, getPublication);

// Route pour récupérer toutes les publications d'un artisan
router.get("/get-all-publications-by-artisan", authArtisan, getAllPublicationsByArtisan);

// Route pour modifier une publication
router.put('/publications/:idPublication', authArtisan, updatePublication);

// Route pour supprimer une publication
router.delete('/publications/:idPublication', authArtisan, deletePublication);

export default router;
