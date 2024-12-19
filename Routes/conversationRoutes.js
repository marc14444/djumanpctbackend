import express from "express";
import {
  createConversation,
  getConversation,
  deleteConversation,
} from "../Controllers/conversationController.js";

const router = express.Router();

//ROutes pour creer une conversation
router.post("/create-conversation", createConversation);

//Routes pour récupérer une conversation
router.get("/get-conversation/:conversationId", getConversation);

//Routes pour supprimer une conversation
router.delete("/delete-conversation/:conversationId", deleteConversation);

export default router;