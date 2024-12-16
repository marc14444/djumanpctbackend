import CommentairePub from "../Models/Commentaire.js";
import Publications from "../Models/Publications.js"; // Si nécessaire

// Ajouter un commentaire
export const addComment = async (req, res) => {
  try {
    const { idClient, idPublication, texte } = req.body;

    // Vérifier si le texte du commentaire est fourni
    if (!texte) {
      return res.status(400).json({ message: "Le texte du commentaire est requis." });
    }

    // Créer un nouveau commentaire
    const newComment = new CommentairePub({ idClient, idPublication, texte });
    await newComment.save();

    // Optionnel : Ajouter le commentaire à la liste des commentaires de la publication
    await Publications.findByIdAndUpdate(
      idPublication,
      { $push: { commentaires: newComment._id } }, // Ajout de l'ID du commentaire
      { new: true }
    );

    res.status(201).json({ message: "Commentaire ajouté avec succès.", commentaire: newComment });
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du commentaire.", error });
  }
};

// Supprimer un commentaire
export const removeComment = async (req, res) => {
  try {
    const { idCommentaire, idPublication } = req.body;

    // Supprimer le commentaire
    const deletedComment = await CommentairePub.findByIdAndDelete(idCommentaire);

    if (!deletedComment) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    // Optionnel : Retirer le commentaire de la liste des commentaires de la publication
    await Publications.findByIdAndUpdate(
      idPublication,
      { $pull: { commentaires: idCommentaire } }, // Retirer l'ID du commentaire
      { new: true }
    );

    res.status(200).json({ message: "Commentaire supprimé avec succès.", commentaire: deletedComment });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
    res.status(500).json({ message: "Erreur lors de la suppression du commentaire.", error });
  }
};

// Récupérer les commentaires d'une publication
export const getCommentsByPublication = async (req, res) => {
  try {
    const { idPublication } = req.params;

    // Récupérer les commentaires associés à la publication
    const comments = await CommentairePub.find({ idPublication }).populate("idClient", "nom prenom");

    res.status(200).json({ message: "Commentaires récupérés avec succès.", commentaires: comments });
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des commentaires.", error });
  }
};
