import Artisans from "../Models/Artisans.js";
import Clients from "../Models/Clients.js";
// Noter un artisan par son ID
export const noterArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { clientId, note, commentaire } = req.body;

    // Vérification des données
    if (!note || note < 1 || note > 5) {
      return res
        .status(400)
        .json({ message: "La note doit être entre 1 et 5." });
    }

    // Récupérer l'artisan
    const artisan = await Artisans.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan introuvable." });
    }

    // Vérifier si le client a déjà noté cet artisan
    const alreadyReviewed = artisan.reviews.find(
      (review) => review.clientId.toString() === clientId
    );
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "Vous avez déjà noté cet artisan." });
    }

    // Ajouter la nouvelle note
    const newReview = {
      clientId,
      commentaire,
      note,
    };
    artisan.reviews.push(newReview);

    // Mettre à jour la moyenne des notes
    artisan.noteCount = artisan.reviews.length;
    artisan.averageNote =
      artisan.reviews.reduce((sum, review) => sum + review.note, 0) /
      artisan.noteCount;

    // Sauvegarder l'artisan
    await artisan.save();

    res.status(200).json({
      message: "Votre note et commentaire ont été ajoutés avec succès.",
      artisan,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

export const getArtisanDetails = async (req, res) => {
  try {
    const { artisanId } = req.params;

    const artisan = await Artisans.findById(artisanId).populate(
      "reviews.clientId",
      "nomClient prenomClient" // Affiche les infos des clients dans les commentaires
    );

    if (!artisan) {
      return res.status(404).json({ message: "Artisan introuvable." });
    }

    res.status(200).json({
      message: "Détails de l'artisan récupérés avec succès.",
      artisan,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
