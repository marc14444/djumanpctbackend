import mongoose from "mongoose";

const commentaireSchema = mongoose.Schema({
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client", // Référence à l'utilisateur (client) qui a commenté
    required: true,
  },
  idPublication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publications", // Référence à la publication sur laquelle le commentaire est fait
    required: true,
  },
  commentaire: {
    type: String,
    required: true, // Le contenu du commentaire
  },
  createdAt: {
    type: Date,
    default: Date.now, // Date de création du commentaire
  },
});

const Commentaire = mongoose.model("Commentaire", commentaireSchema);

export default Commentaire;
