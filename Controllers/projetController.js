// controllers/projetController.js
import Projet from "../Models/Projet.js";

// Soumettre un projet
export const soumettreProjet = async (req, res) => {
  try {
    const { clientId, titre, description, budget, dateDebut, dateFin } = req.body;

    const projet = new Projet({ clientId, titre, description, budget, dateDebut, dateFin });
    await projet.save();

    res.status(201).json({
      message: "Projet soumis avec succès",
      projet,
    });
  } catch (error) {
    console.error("Erreur lors de la soumission du projet:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Récupérer tous les projets
export const getProjets = async (req, res) => {
  try {
    const projets = await Projet.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Projets récupérés avec succès",
      projets,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Récupérer un projet par ID
export const getProjetById = async (req, res) => {
  try {
    const { projetId } = req.params;

    const projet = await Projet.findById(projetId);
    if (!projet) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    res.status(200).json({
      message: "Projet récupéré avec succès",
      projet,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du projet:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

//recupérer les projets d'un client
export const getProjetsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const projets = await Projet.find({ clientId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Projets récupérés avec succès",
      projets,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};