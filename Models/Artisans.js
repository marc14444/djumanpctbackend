import mongoose from "mongoose";

const artisanSchema = new mongoose.Schema({
  nomArtisan: {
    type: String,
    required: [true, "Veuillez entrer votre nom !"],
  },
  prenomArtisan: {
    type: String,
    required: [true, "Veuillez entrer votre prenom !"],
  },
  nomEntreprise:{
    type: String,
    required: [true, "Veuillez entrer le nom de votre entreprise"],
  },
  /* artisanUsername: {
    type: String,
    required: [true, "Veuillez enter un nom d'utilisateur"],
    unique: [true, "Ce nom d'utilisateur existe déja !"],
  }, */
  telArtisan: {
    type: String,
    required: true,
  },
  local: { type: String, required: true },
  emailArtisan: {
    type: String,
    required: [true, "Veuillez entrer votre email !"],
    unique: true,
  },
  cni: {
    recto: { type: String, required: true },
    verso: { type: String, required: true },
  },
  selfie: { type: String, required: true },
  adresseArtisan: { type: String, required: true },
  metier: { type: String, required: true },
  passwordArtisan: { type: String, required: true },
  roleArtisan: { type: String, required: false, default: "artisan" },
  alphabetisation: { type: String, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  notes: [
    {
      note: { type: Number, required: false, default: 0 },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
      },
    },
  ],
  noteCount: { type: Number, required: false, default: 0 },
  averageNote: { type: Number, required: false, default: 0 },
  // createdAt: { type: String, required: true },
  statusArtisan: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Artisans = mongoose.model("Artisan", artisanSchema);

export default Artisans;
