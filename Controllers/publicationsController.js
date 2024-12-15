import path from "path";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Publication from "../Models/Publications.js";
import Artisans from "../Models/Artisans.js";
import { s3Uploadv2 } from "../services/s3service.js";  // Ton service S3 pour l'upload

// Route pour la création d'une publication
export const createPublication = async (req, res) => {
  try {
    const { titre, description } = req.body;
    const idArtisan = req.auth.artisanId;
    // Vérifier si des images sont uploadées
    let imageUrls = [];
    if (req.files && req.files.image) {
      // Récupérer l'URL de chaque image téléchargée
      imageUrls = await Promise.all(req.files.image.map(async (file) => {
        // Générer un nom unique pour chaque fichier
        const fileExtension = path.extname(file.originalname);  // Obtenez l'extension du fichier
        const uniqueFileName = `${uuidv4()}-${Date.now()}${fileExtension}`;  // Crée un nom de fichier unique
        const uploadResult = await s3Uploadv2(file, uniqueFileName);
        return uploadResult.Location;  // Extrait seulement l'URL
      }));
    }

    // Créer la publication avec les données reçues et les URL des images
    const publication = new Publication({
      titre,
      description,
      image: imageUrls,
      idArtisan: idArtisan, // Envoie uniquement les URLs des images
    });

    // Sauvegarder la publication dans la base de données
    await publication.save();
    res.status(200).json({ message: "Publication créée avec succès", publication });
  } catch (error) {
    console.error("Erreur lors de la création de la publication:", error);
    res.status(500).json({ error: "Erreur lors de la création de la publication" });
  }
};

//Recuperer une publication
export const getPublication = async (req, res) => {
  try {
    const { idPublication } = req.params;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(idPublication)) {
      return res.status(400).json({ message: "ID de publication invalide" });
    }

    // Récupérer la publication directement en utilisant l'ID
    const publication = await Publication.findById(idPublication).populate('idArtisan', 'nomClient prenomClient telClient emailClient');

    if (!publication) {
      return res.status(404).json({ message: "Publication non trouvée" });
    }

    res.status(200).json({ message: "Publication récupérée avec succès", publication });
  } catch (error) {
    console.error("Erreur lors de la récupération de la publication:", error);
    res.status(500).json({ error: "Erreur lors de la récupération de la publication" });
  }
};

export const getAllPublicationsByArtisan = async (req, res) => {
  try {
    const idArtisan = req.auth.artisanId; // Récupérer l'ID de l'artisan connecté

    // Récupérer toutes les publications de cet artisan
    const publications = await Publication.find({ idArtisan })
      .populate('idArtisan', 'nomClient prenomClient telClient emailClient'); // Peupler les informations de l'artisan

    if (publications.length === 0) {
      return res.status(404).json({ message: "Aucune publication trouvée pour cet artisan" });
    }

    res.status(200).json({
      message: "Publications de l'artisan récupérées avec succès",
      publications,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des publications de l'artisan:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des publications" });
  }
};

// Mise à jour d'une publication
export const updatePublication = async (req, res) => {
  try {
    const { idPublication } = req.params;
    const { titre, description } = req.body;
    const idArtisan = req.auth.artisanId; // Assurez-vous que l'authentification est correctement configurée

    console.log("ID de la publication:", idPublication);
    console.log("Nouvelles données reçues:", titre, description);
    console.log("Fichiers reçus:", req.files);

    const publication = await Publication.findById(idPublication);

    if (!publication) {
      return res.status(404).json({ message: "Publication non trouvée" });
    }

    if (publication.idArtisan.toString() !== idArtisan) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette publication" });
    }

    publication.titre = titre || publication.titre;
    publication.description = description || publication.description;

    if (req.files && req.files.length > 0) {
      const imageUrls = await Promise.all(req.files.map(async (file) => {
        const fileExtension = path.extname(file.originalname);
        const uniqueFileName = `${uuidv4()}-${Date.now()}${fileExtension}`;
        const uploadResult = await s3Uploadv2(file, uniqueFileName);
        return uploadResult.Location;
      }));

      publication.image = imageUrls;
    }

    await publication.save();
    console.log("Publication mise à jour:", publication);

    res.status(200).json({
      message: "Publication mise à jour avec succès",
      publication
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la publication:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la publication" });
  }
};



// Route pour supprimer une publication
export const deletePublication = async (req, res) => {
  try {
    const { idPublication } = req.params;  // ID de la publication à supprimer
    const idArtisan = req.auth.artisanId;  // ID de l'artisan authentifié

    // Trouver la publication dans la base de données
    const publication = await Publication.findById(idPublication);
    
    // Vérifier si la publication existe
    if (!publication) {
      return res.status(404).json({ message: "Publication non trouvée" });
    }

    // Vérifier si l'artisan authentifié est celui qui a créé la publication
    if (publication.idArtisan.toString() !== idArtisan) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette publication" });
    }

    // Supprimer la publication de la base de données
    await Publication.deleteOne({ _id: idPublication });

    // Retourner un message de succès
    res.status(200).json({
      message: "Publication supprimée avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la publication:", error);
    res.status(500).json({ error: "Erreur lors de la suppression de la publication" });
  }
};
