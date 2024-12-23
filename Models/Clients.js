import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

let clientsSchema = mongoose.Schema({
  nomClient: {
    type: String,
    required: [true, "Veuillez entrer votre nom !"],
  },
  prenomClient: {
    type: String,
    required: [true, "Veuillez entrer votre prénom !"],
  },
  telClient: {
    type: String,
    required: true,
    unique: true,
  },
  emailClient: {
    type: String,
    required: [true, "Veuillez entrer votre email !"],
    unique: true,
  },
  passwordClient: { type: String, required: true },
  confirmPassword: { type: String, required: false },
  roleClient: { type: String, required: false, default: "client" },
  statusClient: { type: Boolean, required: true, default: true },
  profileImage: { 
    type: String, 
    default: null // Si aucun upload d'image, la valeur sera `null` 
  },
  language: { type: String, default: 'fr' },
  dateDerniereConnexion: { type: Date, default: Date.now() },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

clientsSchema.plugin(uniqueValidator);

export default mongoose.model("Clients", clientsSchema);
