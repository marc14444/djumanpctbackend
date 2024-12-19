import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      participantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "participants.role",
      },
      role: {
        type: String,
        required: true,
        enum: ["client", "artisan", "admin"],
      },
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Messages",
    default: null,
  },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Conversations", conversationSchema);