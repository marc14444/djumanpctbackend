import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import multer from "multer";
import {
  deleteOneSearchAdmin,
  deleteOneSearchClient,
  getAllSearchByAdmin,
  getAllSearchByClient,
  getAllSearchInDB,
  makeSearchArtisanForAdmin,
  makeSearchArtisanForClient,
  makeSearchClient,
} from "../Controllers/searchController.js";
import authClients from "../middleware/authClients.js";

const router = express.Router();

const upload = multer();

//Routes pour rechercher des clients
router.get("/client/", upload.any(), authAdmin, makeSearchClient);

router.post(
  "/search-artisan-for-client/",
  upload.any(),
  authClients,
  makeSearchArtisanForClient
);

router.get(
  "/search-artisan-for-admin",
  upload.any(),
  authAdmin,
  makeSearchArtisanForAdmin
);

//Routes pour recupérer toutes les recherches de l'admin
router.get("/get-all-search-admin", authAdmin, getAllSearchByAdmin);

router.get("/get-all-search-client", authClients, getAllSearchByClient);

router.get("/get-all-search/", authAdmin, getAllSearchInDB);

router.delete(
  "/delete-one-search-admin/:idSearch",
  authAdmin,
  deleteOneSearchAdmin
);

router.delete(
  "/delete-one-search-client/:idSearch",
  authClients,
  deleteOneSearchClient
);

export default router;