import express from "express";
import multer from "multer";
import {
  addAdmin,
  signinAdmin,
  getAllAdmin,
  getAdmin,
  disableArtisan,
  activateArtisan,
  disableClient,
  activateClient,
  deletedArtisanAccount,
  deletedClientAccount,
  getAllClientDisabled,
  getAllArtisanDisabled,
  getAllClientActivated,
  getAllArtisanActivated,
} from "../Controllers/adminController.js";
import authAdmin from "../middleware/authAdmin.js";

const upload = multer();
const router = express.Router();

// Route pour ajouter un administrateur
/**
 * @swagger
 * /admin/addAdmin:
 *   post:
 *     summary: Add a new administrator
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrator added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/addAdmin", addAdmin);

// Route pour se connecter en tant qu'administrateur
/**
 * @swagger
 * /admin/signinAdmin:
 *   post:
 *     summary: Signin an administrator
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Administrator signed in successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/signinAdmin", upload.any(), signinAdmin);


// Route pour obtenir tous les administrateurs
/**
 * @swagger
 * /admin/getAllAdmin:
 *   get:
 *     summary: Get all administrators
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Administrators retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/getAllAdmin", upload.any(), authAdmin, getAllAdmin);


// Route pour obtenir un administrateur
/**
 * @swagger
 * /admin/getAdmin:
 *   get:
 *     summary: Get an administrator by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Administrator retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/getAdmin", upload.any(), authAdmin, getAdmin);


// Route pour désactiver un artisan
/**
 * @swagger
 * /admin/disable-artisan/{idArtisan}:
 *   put:
 *     summary: Disable an artisan by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idArtisan
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan to be disabled
 *     responses:
 *       200:
 *         description: Artisan disabled successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.put("/disable-artisan/:idArtisan", authAdmin, disableArtisan);

// Route pour activer un artisan
/**
 * @swagger
 * /admin/activate-artisan/{idArtisan}:
 *   put:
 *     summary: Activate an artisan by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idArtisan
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan to be activated
 *     responses:
 *       200:
 *         description: Artisan activated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.put("/activate-artisan/:idArtisan", authAdmin, activateArtisan);


// Route pour désactiver un client
/**
 * @swagger
 * /admin/disable-client/{idClient}:
 *   put:
 *     summary: Disable a client by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idClient
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client to be disabled
 *     responses:
 *       200:
 *         description: Client disabled successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.put("/disable-client/:idClient", authAdmin, disableClient);


// Route pour activer un client
/**
 * @swagger
 * /admin/activate-client/{idClient}:
 *   put:
 *     summary: Activate a client by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idClient
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client to be activated
 *     responses:
 *       200:
 *         description: Client activated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.put("/activate-client/:idClient", authAdmin, activateClient);


// Route pour supprimer un compte artisan
/**
 * @swagger
 * /admin/delete-artisan/{idArtisan}:
 *   delete:
 *     summary: Delete an artisan account by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idArtisan
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the artisan to be deleted
 *     responses:
 *       200:
 *         description: Artisan account deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Artisan not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-artisan/:idArtisan", authAdmin, deletedArtisanAccount);


// Route pour supprimer un compte client
/**
 * @swagger
 * /admin/delete-client/{idClient}:
 *   delete:
 *     summary: Delete a client account by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idClient
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the client to be deleted
 *     responses:
 *       200:
 *         description: Client account deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.delete("/delete-client/:idClient", authAdmin, deletedClientAccount);


// Route pour obtenir tous les clients désactivés
/**
 * @swagger
 * /admin/get-all-client-disabled:
 *   get:
 *     summary: Get all disabled clients
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Disabled clients retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/get-all-client-disabled", authAdmin, getAllClientDisabled);


// Route pour obtenir tous les artisans désactivés
/**
 * @swagger
 * /admin/get-all-artisan-disabled:
 *   get:
 *     summary: Get all disabled artisans
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Disabled artisans retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/get-all-artisan-disabled", authAdmin, getAllArtisanDisabled);


// Route pour obtenir tous les clients activés
/**
 * @swagger
 * /admin/get-all-client-activated:
 *   get:
 *     summary: Get all activated clients
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activated clients retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/get-all-client-activated", authAdmin, getAllClientActivated);

// Route pour obtenir tous les artisans activés
/**
 * @swagger
 * /admin/get-all-artisan-activated:
 *   get:
 *     summary: Get all activated artisans
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activated artisans retrieved successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/get-all-artisan-activated", authAdmin, getAllArtisanActivated);

export default router;
