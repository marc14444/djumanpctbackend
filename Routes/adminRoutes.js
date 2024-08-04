import express from "express";
import multer from "multer";
import {
  addAmin,
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

//Routes for add administrator
router.post("/addAdmin", upload.any(), addAmin);

//Routes for signin administrator
router.post("/signinAdmin", upload.any(), signinAdmin);

router.get("/getAllAdmin", upload.any(), authAdmin, getAllAdmin);

router.get("/getAdmin", upload.any(), authAdmin, getAdmin);

router.put("/disable-artisan/:idArtisan", authAdmin, disableArtisan);

router.put("/activate-artisan/:idArtisan", authAdmin, activateArtisan);

router.put("/disable-client/:idClient", authAdmin, disableClient);

router.put("/activate-client/:idClient", authAdmin, activateClient);

router.delete("/delete-artisan/:idArtisan", authAdmin, deletedArtisanAccount);

router.delete("/delete-client/:idClient", authAdmin, deletedClientAccount);

router.get("/get-all-client-disabled", authAdmin, getAllClientDisabled);

router.get("/get-all-artisan-disabled", authAdmin, getAllArtisanDisabled);

router.get("/get-all-client-activated", authAdmin, getAllClientActivated);

router.get("/get-all-artisan-activated", authAdmin, getAllArtisanActivated);

export default router;
