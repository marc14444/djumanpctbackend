import mongoose from "mongoose";

const likePubSchema = mongoose.Schema({
  idClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client", // Référence à l'utilisateur (client) qui a aimé la publication
    required: true,
  },
  idPublication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publications", // Référence à la publication qui a été likée
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Date du like
  },
});

const LikePub = mongoose.model("LikePub", likePubSchema);

export default LikePub;
