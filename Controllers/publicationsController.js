import Publications from "../Models/Publications.js";
import LikePub from "../Models/LikePub.js";
import Artisans from "../Models/Artisans.js";

// Ajouter une publication
export const addPublication = async (req, res) => {
  try {
    const { artisanId } = req.auth;
    const { libPub } = req.body;
    const { image, video } = req.files;

    const verifArtisan = await Artisans.findOne({ _id: artisanId });
    if (!verifArtisan) {
      return res
        .status(404)
        .json({ message: "Artisan introuvable", status: false });
    }

    // Construction des chemins des fichiers
    const imagePath = image
      ? `${req.protocol}://${req.get("host")}/assets/photos_artisans/${image[0].filename}`
      : null;
    const videoPath = video
      ? `${req.protocol}://${req.get("host")}/assets/photos_artisans/${video[0].filename}`
      : null;

    // Création de la publication
    const publication = new Publications({
      idArtisan: artisanId,
      libPub,
      image: imagePath,
      video: videoPath,
    });

    const result = await publication.save();

    if (!result) {
      return res
        .status(500)
        .json({ message: "Une erreur est survenue", status: false });
    }
    res.status(200).json({
      data: result,
      message: "Publication ajoutée avec succès",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

// Récupérer une publication par ID
export const getOnePublication = async (req, res) => {
  try {
    const { idPub } = req.params;

    const publication = await Publications.findOne({ _id: idPub }).populate(
      "idArtisan"
    );

    if (!publication) {
      return res
        .status(404)
        .json({ message: "Publication introuvable", status: false });
    }
    res.status(200).json({
      data: publication,
      message: "Récupération réussie",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

// Récupérer toutes les publications d'un artisan spécifique
export const getAllArtisansPublications = async (req, res) => {
  try {
    const { artisanId } = req.auth;  // Assurez-vous que req.auth contient bien artisanId
    const artisan = await Artisans.findOne({ _id: artisanId });
    if (!artisan) {
      return res
        .status(404)
        .json({ message: "Artisan introuvable", status: false });
    }

    // Filtrage des publications par artisanId
    const publications = await Publications.find({
      idArtisan: artisanId,
    }).populate("idArtisan");

    // Ajout des likes aux publications
    for (const publication of publications) {
      const likes = await LikePub.find({
        idPub: publication._id.toString(),
      }).populate("idNanien");
      publication.likes = likes;
    }

    res.status(200).json({ data: publications, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

// Récupérer toutes les publications (optionnellement filtrées par artisanId)
export const getAllPublications = async (req, res) => {
  try {
    const { artisanId } = req.query;  // Permettre un filtrage optionnel par artisanId
    let query = {};

    if (artisanId) {
      query = { idArtisan: artisanId };
    }

    const publications = await Publications.find(query).populate("idArtisan");

    for (const publication of publications) {
      const likes = await LikePub.find({
        idPub: publication._id.toString(),
      }).populate("idNanien");
      publication.likes = likes;
    }

    res
      .status(200)
      .json({
        data: publications,
        status: true,
        message: "Récupération réussie",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const getAllPublicationsByArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;

    const publications = await Publications.find({ idArtisan: artisanId }).populate("idArtisan");

    if (!publications || publications.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune publication trouvée pour cet artisan.", status: false });
    }

    res.status(200).json({ data: publications, status: true, message: "Récupération réussie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};
