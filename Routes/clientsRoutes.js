import express from "express";
import multer from "multer";
import {
  signupClient,
  loginClient,
  getClientConnected,
  getClientById,
  updateClientProfil,
  updatePasswordClient,
  deletedClientAccount,
  getAllClients,
  noteArtisan,
} from "../Controllers/clientsController.js";
import authClients from "../middleware/authClients.js";
import authAdmin from "../middleware/authAdmin.js";
// import { clientCheckEmail } from "../middleware/checkEmail.js";

// import authClient from "../middleware/authClient.js";

const upload = multer();
const router = express.Router();

//
router.post("/signinClient", upload.any(), signupClient);

router.post("/loginClient", upload.any(), /* clientCheckEmail, */ loginClient);

router.get("/get-client-connected", authClients, getClientConnected);

router.get("/get-client-by-id/:id", authAdmin, getClientById);

router.get("/get-all-clients", authAdmin, getAllClients);

router.post(
  "/update-client-profile",
  upload.any(),
  authClients,
  updateClientProfil
);

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
export default router;
