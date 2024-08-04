import mongoose from "mongoose";

const localiteSchema = new mongoose.Schema({
  ville: { type: String, required: true },
  commune: { type: String, required: true },
  quartier: { type: String, required: false },
  longitude: { type: String, required: false },
  latitude: { type: String, required: false },
});

const Localites = mongoose.model("Localite", localiteSchema);

export default Localites;