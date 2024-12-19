import mongoose from "mongoose";

const projetSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Clients", required: true },
  titre: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  status: { type: String, enum: ["Ouvert", "En cours", "Terminé"], default: "Ouvert" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Projet = mongoose.model("Projet", projetSchema);

export default Projet;
