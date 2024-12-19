import mongoose from "mongoose";

const devisSchema = new mongoose.Schema({
  projetId: { type: mongoose.Schema.Types.ObjectId, ref: "Projet", required: true },
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
  montant: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Proposé", "Accepté", "Refusé"], default: "Proposé" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Devis = mongoose.model("Devis", devisSchema);

export default Devis;
