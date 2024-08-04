import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

let clientsSchema = mongoose.Schema({
  nomClient: {
    type: String,
    required: [true, "Veuillez entrer votre nom !"],
  },
  prenomClient: {
    type: String,
    required: [true, "Veuillez entrer votre prenom !"],
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
  confirmPassword: { type: String, required: true },
  roleClient: { type: String, required: false, default: "client" },
  statusClient: { type: Boolean, required: true, default: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});
clientsSchema.plugin(uniqueValidator);
export default clientsSchema = mongoose.model("Clients", clientsSchema);
