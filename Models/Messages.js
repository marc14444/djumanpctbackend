import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Conversations",
  },
  sender: {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "sender.role",
    },
    role: {
      type: String,
      required: true,
      enum: ["client", "artisan", "admin"],
    },
  },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Messages", messageSchema);
