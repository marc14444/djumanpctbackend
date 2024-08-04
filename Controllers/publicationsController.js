import Publications from "../Models/Publications.js";
import LikePub from "../Models/LikePub.js";
import Artisans from "../Models/Artisans.js";

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
    const imagePath = image
      ? `${req.protocol}://${req.get("host")}/assets/${image[0].filename}`
      : null;
    const videoPath = video
      ? `${req.protocol}://${req.get("host")}/assets/${video[0].filename}`
      : null;

    const publication = new Publications({
      idArtisan: artisanId,
      libPub,
      //   createdAtPub: theDate(),
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
      message: "publication ajouter avec succes",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

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
      message: "Recuperation reussie",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const getAllArtisansPublications = async (req, res) => {
  try {
    const { artisanId } = req.auth;
    const artisan = await Artisans.findOne({ _id: artisanId });
    if (!artisan) {
      return res
        .status(404)
        .json({ message: "Artisan introuvable", status: false });
    }
    const publications = await Publications.find({
      idArtisan: artisanId,
    }).populate("idArtisan");

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

export const getAllPublications = async (req, res) => {
  try {
    const publications = await Publications.find().populate("idArtisan");

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
        message: "Recuperation reussie",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};
