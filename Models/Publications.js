import mongoose from "mongoose";

const publicationSchema = mongoose.Schema({
  idArtisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artisan",
    required: true,
  },
  libPub: { type: String, required: true },
  createdAtPub: { type: Date, default: Date.now() },
  image: [{ type: String, required: false }], //Pour ajouter plusieurs images
  video: [{ type: String, required: false }], //Pour ajouter plusieurs vidéos
  modifPub: { type: Boolean, default: false },
  //   commentaires: [{ type: mongoose.Schema.Types.ObjectId, ref: "Commentaires" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "LikePub" }],
});

const Publication = mongoose.model("Publications", publicationSchema);

export default Publication;
