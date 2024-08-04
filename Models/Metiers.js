import mongoose from "mongoose";

const metiersSchema = new mongoose.Schema({
  ville: { type: String, required: true },
  commune: { type: String, required: true },
  quartier: { type: String, required: true },
  activite: { type: String, required: true },
  longitude: { type: String, required: false },
  latitude: { type: String, required: false },
});

const Metiers = mongoose.model("Metiers", metiersSchema);

export default Metiers;
