// controllers/devisController.js
import Devis from "../Models/Devis.js";

// Proposer un devis
export const proposerDevis = async (req, res) => {
  try {
    const { projetId, artisanId, montant, description } = req.body;

    const devis = new Devis({ projetId, artisanId, montant, description });
    await devis.save();

    res.status(201).json({
      message: "Devis proposé avec succès",
      devis,
    });
  } catch (error) {
    console.error("Erreur lors de la proposition du devis:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Accepter un devis
export const accepterDevis = async (req, res) => {
  try {
    const { devisId } = req.params;

    const devis = await Devis.findByIdAndUpdate(devisId, { status: "Accepté" });

    res.status(200).json({
      message: "Devis accepté avec succès",
      devis,
    });
  } catch (error) {
    console.error("Erreur lors de l'acceptation du devis:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Refuser un devis
export const refuserDevis = async (req, res) => {
  try {
    const { devisId } = req.params;

    const devis = await Devis.findByIdAndUpdate(devisId, { status: "Refusé" });

    res.status(200).json({
      message: "Devis refusé avec succès",
      devis,
    });
  } catch (error) {
    console.error("Erreur lors de la refus du devis:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// modifier un devis
export const modifierDevis = async (req, res) => {
  try {
    const { devisId } = req.params;
    const { montant, description } = req.body;

    const devis = await Devis.findByIdAndUpdate(devisId, { montant, description });

    res.status(200).json({
      message: "Devis modifié avec succès",
      devis,
    });
  } catch (error) {
    console.error("Erreur lors de la modification du devis:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

//supprimer un devis
export const supprimerDevis = async (req, res) => {
  try {
    const { devisId } = req.params;

    const devis = await Devis.findByIdAndDelete(devisId);

    res.status(200).json({
      message: "Devis supprimé avec succès",
      devis,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du devis:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Récupérer les devis pour un projet
export const getDevisByProjetId = async (req, res) => {
  try {
    const { projetId } = req.params;

    const devis = await Devis.find({ projetId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Devis récupérés avec succès",
      devis,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
