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
/**
 * @swagger
 * /artisans/signup-artisan:
 *   post:
 *     summary: Signup a new artisan
 *     tags: [Artisan]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nomArtisan
 *               - prenomArtisan
 *               - nomEntreprise
 *               - telArtisan
 *               - emailArtisan
 *               - passwordArtisan
 *               - confirmPasswordArtisan
 *               - recto
 *               - verso
 *               - selfie
 *               - adresseArtisan
 *               - local
 *               - experience
 *               - fermeture
 *               - ouverture
 *               - metier
 *               - latitude
 *               - longitude
 *               - alphabetisation
 *             properties:
 *               nomArtisan:
 *                 type: string
 *               prenomArtisan:
 *                 type: string
 *               nomEntreprise:
 *                 type: string
 *               telArtisan:
 *                 type: string
 *               emailArtisan:
 *                 type: string
 *               passwordArtisan:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               recto:
 *                 type: string
 *                 format: binary
 *               verso:
 *                 type: string
 *                 format: binary
 *               selfie:
 *                 type: string
 *                 format: binary
 *               adresseArtisan:
 *                 type: string
 *                 format: binary
 *               local:
 *                 type: string
 *                 format: binary
 *               experience:
 *                  type: number
 *                  format: double
 *               fermeture:
 *                 type: string
 *               ouverture:
 *                 type: string
 *               metier:
 *                 type: string
 *               latitude:
 *                 type: number
 *                 format: double
 *               longitude:
 *                 type: number
 *                 format: double
 *               alphabetisation:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artisan created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/signup-artisan", uploader.fields([{ name: "recto" }, { name: "verso" }, { name: "selfie" }]), signupArtisan);


// Route pour la connexion des artisans sans téléchargement de fichiers
/**
 * @swagger
 * /artisans/login-artisan:
 *   post:
 *     summary: Login an artisan
 *     tags: [Artisan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - telArtisan
 *               - passwordArtisan
 *             properties:
 *               telArtisan:
 *                 type: string
 *               passwordArtisan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artisan connected successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/login-artisan", loginArtisan);


// Route pour obtenir l'artisan connecté
/**
 * @swagger
 * /artisans/get-artisan-connected:
 *   get:
 *     summary: Get the connected artisan
 *     tags: [Artisan]
 *     responses:
 *       200:
 *         description: Artisan connected successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/get-artisan-connected", authArtisan, getArtisanConnected);


// Route pour mettre à jour le profil de l'artisan avec téléchargement de fichiers
/**
 * @swagger
 * /artisans/update-artisan-profil:
 *   put:
 *     summary: Update the profile of the connected artisan
 *     tags: [Artisan]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nomArtisan:
 *                 type: string
 *               prenomArtisan:
 *                 type: string
 *               nomEntreprise:
 *                 type: string
 *               telArtisan:
 *                 type: string
 *               emailArtisan:
 *                 type: string
 *               passwordArtisan:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               recto:
 *                 type: string
 *                 format: binary
 *               verso:
 *                 type: string
 *                 format: binary
 *               selfie:
 *                 type: string
 *                 format: binary
 *               adresseArtisan:
 *                 type: string
 *                 format: binary
 *               local:
 *                 type: string
 *                 format: binary
 *               experience:
 *                  type: number
 *                  format: double
 *               fermeture:
 *                 type: string
 *               ouverture:
 *                 type: string
 *               metier:
 *                 type: string
 *               latitude:
 *                 type: number
 *                 format: double
 *               longitude:
 *                 type: number
 *                 format: double
 *               alphabetisation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.put("/update-artisan-profil", authArtisan, uploader.fields([{ name: "recto" }, { name: "verso" }, { name: "selfie" }]), updateArtisanProfil);


// Route pour mettre à jour le mot de passe de l'artisan sans téléchargement de fichiers
/**
 * @swagger
 * /artisans/update-password-artisan:
 *   put:
 *     summary: Update the password of the connected artisan
 *     tags: [Artisan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.put("/update-password-artisan", authArtisan, updatePasswordArtisan);

// Route pour supprimer le compte de l'artisan
/**
 * @swagger
 * /artisans/deleted-artisan-account:
 *   delete:
 *     summary: Delete the account of the connected artisan
 *     tags: [Artisan]
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.delete("/deleted-artisan-account", authArtisan, deletedArtisanAccount);

// Route pour demander un e-mail de réinitialisation
/**
 * @swagger
 * /artisans/demande-reinitialisation:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Artisan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emailArtisan
 *             properties:
 *               emailArtisan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.post("/demande-reinitialisation", demandeReinitialisationMotDePasse);

// Route pour réinitialiser le mot de passe
/**
 * @swagger
 * /artisans/reinitialiser-mot-de-passe/{token}:
 *   post:
 *     summary: Reset the password using the provided token
 *     tags: [Artisan]
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


// Route pour ajouter des disponibilités
/**
 * @swagger
 * /artisans/ajouter-disponibilites:
 *   post:
 *     summary: Add availabilities for the artisan
 *     tags: [Artisan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jour:
 *                 type: string
 *               heureDebut:
 *                 type: string
 *               heureFin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Availabilities added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/ajouter-disponibilites", authArtisan, ajouterDisponibilites);

// Route pour mettre à jour les disponibilités
/**
 * @swagger
 * /artisans/update-disponibilites:
 *   put:
 *     summary: Update availabilities for the artisan
 *     tags: [Artisan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jour:
 *                 type: string
 *               heureDebut:
 *                 type: string
 *               heureFin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Availabilities updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/update-disponibilites", authArtisan, updateDisponibilites);

// Route pour obtenir les disponibilités
/**
 * @swagger
 * /artisans/get-disponibilites:
 *   get:
 *     summary: Get availabilities of the artisan
 *     tags: [Artisan]
 *     responses:
 *       200:
 *         description: Availabilities retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/get-disponibilites", authArtisan, getDisponibilites);


// Route pour supprimer une disponibilité
/**
 * @swagger
 * /artisans/disponibilites/{id}:
 *   delete:
 *     summary: Delete availability by ID
 *     tags: [Artisan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the availability to be deleted
 *     responses:
 *       200:
 *         description: Availability deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Availability not found
 *       500:
 *         description: Server error
 */
router.delete("/disponibilites/:id", authArtisan, deleteDisponibiliteById);

// Route pour ajouter une publication
/**
 * @swagger
 * /artisans/add-publication:
 *   post:
 *     summary: Add a new publication
 *     tags: [Publication]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Publication added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/add-publication", authArtisan, uploadpub, createPublication);

// Route pour récupérer une publication
/**
 * @swagger
 * /artisans/get-publication/{idPublication}:
 *   get:
 *     summary: Get a publication by ID
 *     tags: [Publication]
 *     parameters:
 *       - in: path
 *         name: idPublication
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the publication
 *     responses:
 *       200:
 *         description: Publication retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Server error
 */
router.get("/get-publication/:idPublication", authArtisan, getPublication);

// Route pour récupérer toutes les publications d'un artisan
/**
 * @swagger
 * /artisans/get-all-publications-by-artisan:
 *   get:
 *     summary: Get all publications by the connected artisan
 *     tags: [Publication]
 *     responses:
 *       200:
 *         description: Publications retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/get-all-publications-by-artisan", authArtisan, getAllPublicationsByArtisan);


// Route pour modifier une publication
/**
 * @swagger
 * /artisans/publications/{idPublication}:
 *   put:
 *     summary: Update a publication by ID
 *     tags: [Publication]
 *     parameters:
 *       - in: path
 *         name: idPublication
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the publication to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Publication updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Server error
 */
router.put('/publications/:idPublication', authArtisan, updatePublication);


// Route pour supprimer une publication
/**
 * @swagger
 * /artisans/publications/{idPublication}:
 *   delete:
 *     summary: Delete a publication by ID
 *     tags: [Publication]
 *     parameters:
 *       - in: path
 *         name: idPublication
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the publication to be deleted
 *     responses:
 *       200:
 *         description: Publication deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Server error
 */
router.delete('/publications/:idPublication', authArtisan, deletePublication);

export default router;