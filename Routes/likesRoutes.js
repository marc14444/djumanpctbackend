import express from "express";
import { addLike, removeLike, countLikes } from "../Controllers/likeController.js";

const router = express.Router();

router.post("/add-like", addLike); // Ajouter un like
router.delete("/delete-like", removeLike); // Supprimer un like
router.get("/get-like/count/:idPublication", countLikes); // Compter les likes d'une publication

export default router;
