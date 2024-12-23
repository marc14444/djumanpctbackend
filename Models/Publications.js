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
  image: [{ type: String }], // URLs des images stockées (ex : sur S3)
  video: [{ type: String }], // URLs des vidéos stockées
  modifPub: { type: Boolean, default: false },
  commentaires: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commentaire",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LikePub",
    },
  ],
  // Nouveau champ pour l'e-commerce
  price: { type: Number, required: false }, // Prix de l'article
  currency: { type: String, default: "FCFA" }, // Devise de l'article
  available: { type: Boolean, default: true }, // Disponibilité de l'article
  stock: { type: Number, default: 1 }, // Stock disponible pour l'article
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Références aux commandes associées à cette publication
    },
  ],
});

const Publication = mongoose.model("Publications", publicationSchema);

export default Publication;
