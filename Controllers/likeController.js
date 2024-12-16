import LikePub from "../Models/LikePub.js";
import Publications from "../Models/Publications.js"; // Assurez-vous que le modèle Publications est bien importé

// Ajouter un like
export const addLike = async (req, res) => {
  try {
    const { idClient, idPublication } = req.body;

    // Vérifier si le like existe déjà
    const existingLike = await LikePub.findOne({ idClient, idPublication });
    if (existingLike) {
      return res.status(400).json({ message: "Vous avez déjà liké cette publication." });
    }

    // Créer un nouveau like
    const newLike = new LikePub({ idClient, idPublication });
    await newLike.save();

    // Optionnel : mettre à jour le nombre de likes dans le modèle Publication
    await Publications.findByIdAndUpdate(
      idPublication,
      { $addToSet: { likes: idClient } }, // Ajoute le client à la liste des likes
      { new: true }
    );

    res.status(201).json({ message: "Like ajouté avec succès.", like: newLike });
  } catch (error) {
    console.error("Erreur lors de l'ajout du like:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du like.", error });
  }
};

// Supprimer un like
export const removeLike = async (req, res) => {
  try {
    const { idClient, idPublication } = req.body;

    // Supprimer le like
    const deletedLike = await LikePub.findOneAndDelete({ idClient, idPublication });

    if (!deletedLike) {
      return res.status(404).json({ message: "Like non trouvé." });
    }

    // Optionnel : mettre à jour le nombre de likes dans le modèle Publication
    await Publications.findByIdAndUpdate(
      idPublication,
      { $pull: { likes: idClient } }, // Retire le client de la liste des likes
      { new: true }
    );

    res.status(200).json({ message: "Like supprimé avec succès.", like: deletedLike });
  } catch (error) {
    console.error("Erreur lors de la suppression du like:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du like.", error });
  }
};

// Compter les likes d'une publication
export const countLikes = async (req, res) => {
  try {
    const { idPublication } = req.params;

    // Compter les likes pour la publication donnée
    const likeCount = await LikePub.countDocuments({ idPublication });

    res.status(200).json({ message: "Nombre de likes récupéré avec succès.", count: likeCount });
  } catch (error) {
    console.error("Erreur lors du comptage des likes:", error);
    res.status(500).json({ message: "Erreur lors du comptage des likes.", error });
  }
};
