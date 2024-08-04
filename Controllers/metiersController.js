import Metiers from "../Models/Metiers.js";

export const createMetier = async (req, res) => {
  const { ville, commune, quartier, activite } = req.body;
  console.log(ville, commune, quartier, activite);
  try {
    if (!ville || !commune || !quartier || !activite) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs",
        status: false,
      });
    }

    const metier = await Metiers.create({
      ville,
      commune,
      quartier,
      activite,
    });
    res
      .status(201)
      .json({ metier, message: "Metier creer avec succes", status: true });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message, status: false });
  }
};

export const getAllMetiers = async (req, res) => {
  try {
    const metiers = await Metiers.find();
    if (!metiers || metiers.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucun metier n'est disponible", status: false });
    }
    res
      .status(200)
      .json({ metiers, message: "Recuperation reussie", status: true });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Une erreur est survenue", status: false });
  }
};
