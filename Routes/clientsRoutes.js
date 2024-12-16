import express from "express";
import multer from "multer";
import {
  signupClient,
  loginClient,
  getClientConnected,
  updateClientProfil,
  updatePasswordClient,
  deletedClientAccount,
  noteArtisan,
  demandeReinitialisationMotDePasse,
  reinitialiserMotDePasse,
  getArtisanById,
} from "../Controllers/clientsController.js";
import authClients from "../middleware/authClients.js";
import authAdmin from "../middleware/authAdmin.js";
import { validateClientUpdate } from "../middleware/clientValidator.js";

const upload = multer();
const router = express.Router();

//
router.post("/signinClient", upload.single("profileImage"), signupClient);

router.post("/loginClient", loginClient);

router.get("/get-client-connected", authClients, getClientConnected);

router.put("/update-client-profile", validateClientUpdate, upload.single("profileImage"),authClients, updateClientProfil);

router.post(
  "/update-password-client",
  upload.any(),
  authClients,
  updatePasswordClient
);

router.delete(
  "/deleted-client-account",
  upload.any(),
  authClients,
  deletedClientAccount
);

router.post("/note-artisan/:idArtisan", upload.any(), authClients, noteArtisan);

// Route pour demander un e-mail de réinitialisation
router.post("/demande-reinitialisation", demandeReinitialisationMotDePasse);

// Route pour réinitialiser le mot de passe
router.post("/reinitialiser-mot-de-passe/:token", reinitialiserMotDePasse);

// Route pour récupérer un artisan par son ID
router.get("/get-artisan-by-id/:id", authClients, getArtisanById);
export default router;
