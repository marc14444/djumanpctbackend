import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  suggestion: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: String, required: true },
});

const Suggestions = mongoose.model("Suggestions", suggestionSchema);

export default Suggestions;
