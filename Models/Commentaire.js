import mongoose from "mongoose";

const commentairePubSchema = mongoose.Schema({
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clients", // Référence à l'utilisateur (client) qui a commenté
    required: true,
  },
  idPublication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publications", // Référence à la publication commentée
    required: true,
  },
  texte: {
    type: String, // Contenu du commentaire
    required: [true, "Le texte du commentaire est obligatoire."],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Date du commentaire
  },
});

const CommentairePub = mongoose.model("Commentaire", commentairePubSchema);

export default CommentairePub;
