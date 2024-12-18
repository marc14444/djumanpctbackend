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
  experience: { type: Number, required: true },
  fermeture: { type: String, required: true },
  ouverture: { type: String, required: true },
  reviews: [
    {
      clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clients",
        required: true,
      },
      commentaire: { type: String, default: "" },
      note: { type: Number, required: true, min: 1, max: 5 },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  averageNote: { type: Number, default: 0 }, // Calculée dynamiquement
  noteCount: { type: Number, default: 0 }, // Nombre total de notes
  disponibilites: [
    {
      jour: { type: String, required: false }, // ex: 'Lundi', 'Mardi', etc.
      heureDebut: { type: String, required: false }, // ex: '09:00'
      heureFin: { type: String, required: false }, // ex: '17:00'
    }
  ],
  publications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publications",
    },
  ],  
  // Champ pour activer l'artisan après confirmation par email
  isActive: { type: Boolean, default: true },
  // Token pour l'activation du compte via l'email
  activationToken: { type: String, required: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  averageNote: { type: Number, required: false, default: 0 },
  statusArtisan: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Artisans = mongoose.model("Artisan", artisanSchema);

export default Artisans;
