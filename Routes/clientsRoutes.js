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

// Route pour inscription d'un client
/**
 * @swagger
 * tags:
 *   name: clients
 *   description: API for managing clients
 */

/**
 * @swagger
 * /clients/signinClient:
 *   post:
 *     summary: Signin a new client
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nomClient
 *               - prenomClient
 *               - telClient
 *               - emailClient
 *               - passwordClient
 *               - confirmPassword
 *               - profileImage
 *             properties:
 *               nomClient:
 *                 type: string
 *               prenomClient:
 *                 type: string
 *               telClient:
 *                 type: string
 *               emailClient:
 *                 type: string
 *               passwordClient:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Invalid redirect
 *       500:
 *         description: Server error
 */
router.post("/signinClient", upload.single("profileImage"), signupClient);

/*
* Route pour se connecter un client
 * @swagger
 * /clients/loginClient:
 *   post:
 *     summary: Login a client
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - telClient
 *               - passwordClient
 *             properties:
 *               telClient:
 *                 type: string
 *               passwordClient:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client connected successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Invalid redirect
 *       500:
 *         description: Server error
*/
router.post("/loginClient", loginClient);

// Route pour récupérer le client connecté
/*
* @swagger
 * /clients/get-client-connected:
 *   get:
 *     summary: Get the connected client
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: Client connected successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Invalid redirect
 *       500:
 *         description: Server error
*/
router.get("/get-client-connected", authClients, getClientConnected);

// Route pour mettre à jour le profil du client
/**
 * @swagger
 * /clients/update-client-profile:
 *   put:
 *     summary: Update the profile of the connected client
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nomClient:
 *                 type: string
 *               prenomClient:
 *                 type: string
 *               telClient:
 *                 type: string
 *               emailClient:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.put("/update-client-profile", validateClientUpdate, upload.single("profileImage"), authClients, updateClientProfil);


// Route pour mettre à jour le mot de passe du client
/**
 * @swagger
 * /clients/update-password-client:
 *   post:
 *     summary: Update the password of the connected client
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.post("/update-password-client", upload.any(), authClients, updatePasswordClient);


// Route pour supprimer le compte du client
/**
 * @swagger
 * /clients/deleted-client-account:
 *   delete:
 *     summary: Delete the account of the connected client
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.delete("/deleted-client-account", upload.any(), authClients, deletedClientAccount);


// Route pour noter un artisan
/**
 * @swagger
 * /clients/note-artisan/{idArtisan}:
 *   post:
 *     summary: Rate an artisan
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: idArtisan
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan to be rated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artisan rated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.post("/note-artisan/:idArtisan", upload.any(), authClients, noteArtisan);

// Route pour demander un e-mail de réinitialisation du mot de passe
/**
 * @swagger
 * /clients/demande-reinitialisation:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Client]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailClient
 *             properties:
 *               emailClient:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.post("/demande-reinitialisation", demandeReinitialisationMotDePasse);

// Route pour réinitialiser le mot de passe
/**
 * @swagger
 * /clients/reinitialiser-mot-de-passe/{token}:
 *   post:
 *     summary: Reset the password using the provided token
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
router.post("/reinitialiser-mot-de-passe/:token", reinitialiserMotDePasse);


// Route pour récupérer un artisan par son ID
/**
 * @swagger
 * /clients/get-artisan-by-id/{id}:
 *   get:
 *     summary: Get artisan by ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan
 *     responses:
 *       200:
 *         description: Artisan retrieved successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.get("/get-artisan-by-id/:id", authClients, getArtisanById);

export default router;
