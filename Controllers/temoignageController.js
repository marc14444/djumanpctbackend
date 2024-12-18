import Temoignage from "../Models/Temoignage.js";
import Clients from "../Models/Clients.js";
import Artisans from "../Models/Artisans.js";

// Ajouter un témoignage
export const ajouterTemoignage = async (req, res) => {
  try {
    const { utilisateurId, role, commentaire } = req.body;

    // Vérifier si le client ou l'artisan existe
    if (role === 'client') {
      const client = await Clients.findById(utilisateurId);
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
    } else if (role === 'artisan') {
      const artisan = await Artisans.findById(utilisateurId);
      if (!artisan) {
        return res.status(404).json({ message: "Artisan non trouvé" });
      }
    }

    // Créer un nouveau témoignage
    const temoignage = new Temoignage({ utilisateurId, role, commentaire });
    await temoignage.save();

    res.status(201).json({
      message: "Témoignage ajouté avec succès",
      temoignage,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du témoignage:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


// Modifier un témoignage
export const modifierTemoignage = async (req, res) => {
  try {
    const { idTemoignage } = req.params; // Récupérer l'ID du témoignage depuis les paramètres de l'URL
    const { role, commentaire } = req.body;

    // Vérifier si le témoignage existe
    const temoignage = await Temoignage.findById(idTemoignage);
    if (!temoignage) {
      return res.status(404).json({ message: "Témoignage introuvable" });
    }

    // Mettre à jour le témoignage
    temoignage.role = role;
    temoignage.commentaire = commentaire;
    await temoignage.save();

    res.status(200).json({
      message: "Témoignage modifié avec succès",
      temoignage,
    });
  } catch (error) {
    console.error("Erreur lors de la modification du témoignage:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


  export const supprimerTemoignage = async (req, res) => {
    try {
      const { idTemoignage } = req.params;
  
      // Vérifier si le témoignage existe
      const temoignage = await Temoignage.findById(idTemoignage);
      if (!temoignage) {
        return res.status(404).json({ message: "Témoignage introuvable" });
      }
  
      // Supprimer le témoignage
      await temoignage.deleteOne();
  
      res.status(200).json({
        message: "Témoignage supprimé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du témoignage:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  };

  // Middleware pour vérifier le rôle d'administrateur
/*   const verifyAdmin = (req, res, next) => {
    if (req.auth.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : vous devez être administrateur pour accéder à cette ressource.' });
    }
    next();
  }; */
  
  // Récupérer les témoignages
  export const getTemoignages = async (req, res) => {
    try {
      // Récupérer les témoignages du plus récent au plus ancien
      const temoignages = await Temoignage.find()
        .sort({ date: -1 })
        .populate({
          path: 'utilisateurId',
          select: 'nom email'
        });
  
      res.status(200).json({
        message: "Témoignages récupérés avec succès",
        temoignages,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des témoignages:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  };
  