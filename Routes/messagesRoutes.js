import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  updateMessage,
} from "../Controllers/messageController.js";

const router = express.Router();

//Routes pour envoyer le message
router.post("/send-message", sendMessage);

//Routes pour récupérer les messages
router.get("/get-messages", getMessages);

//Routes pour supprimer un message
router.delete("/delete-message/:messageId", deleteMessage);

//Routes pour modifier un message
router.put("/update-message/:messageId", updateMessage);

export default router;