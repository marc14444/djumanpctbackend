import mongoose from "mongoose";

const temoignageSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, required: true },
  role: { type: String, enum: ["client", "artisan"], required: true },
  commentaire: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Temoignage = mongoose.model("Temoignage", temoignageSchema);

export default Temoignage;
