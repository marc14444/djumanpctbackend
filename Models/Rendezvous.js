import mongoose from "mongoose";

const rendezvousSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["En attente", "Confirmé", "Refusé"], default: "En attente" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Rendezvous = mongoose.model("Rendezvous", rendezvousSchema);

export default Rendezvous;
