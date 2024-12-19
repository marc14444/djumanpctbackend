import express from "express";
import {
  createConversation,
  getConversation,
  deleteConversation,
} from "../Controllers/conversationController.js";

const router = express.Router();

router.post("/create-conversation", createConversation);

router.get("/get-conversation/:conversationId", getConversation);

router.delete("/delete-conversation/:conversationId", deleteConversation);

export default router;