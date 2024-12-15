import mongoose from "mongoose";

const publicationSchema = mongoose.Schema({
  idArtisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artisan",
    required: true,
  },
  titre: { type: String, required: true },
  description: { type: String, required: true },
  createdAtPub: { type: Date, default: Date.now() },
  image: [{ type: String }], // Pour ajouter plusieurs images (les URLs seront stockées après l'upload sur S3)
  video: [{ type: String }], // Pour ajouter plusieurs vidéos (les URLs seront stockées après l'upload sur S3)
  modifPub: { type: Boolean, default: false },
  commentaires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commentaire",
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "LikePub",
  }],
});

const Publication = mongoose.model("Publications", publicationSchema);

export default Publication;
