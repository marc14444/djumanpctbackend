import express from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  updateMessage,
} from "../Controllers/messageController.js";

const router = express.Router();

router.post("/send-message", sendMessage);

router.get("/get-messages", getMessages);

router.delete("/delete-message/:messageId", deleteMessage);
router.put("/update-message/:messageId", updateMessage);

export default router;