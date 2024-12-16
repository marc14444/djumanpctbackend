import express from "express";
import {
  addComment,
  removeComment,
  getCommentsByPublication,
} from "../Controllers/commentairePubController.js";

const router = express.Router();

router.post("/add-comment", addComment); // Ajouter un commentaire
router.delete("/delete-comment", removeComment); // Supprimer un commentaire
router.get("/get-comments-by-publication/:idPublication", getCommentsByPublication); // Récupérer les commentaires d'une publication

export default router;
