import Localites from "../Models/Localites.js";

export const createLocalite = async (req, res) => {
  try {
    const { ville, commune } = req.body;

    if (!ville || !commune) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs",
        status: false,
      });
    }

    const localiteExist = await Localites.findOne({ ville, commune });
    if (localiteExist) {
      return res.status(400).json({
        message: "Localite existante",
        status: false,
      });
    }
    

    const localite = await Localites.create({
      ville,
      commune,
    });
    res.status(201).json({
      data: localite,
      message: "Localite creer avec succes",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Une erreur est survenue", status: false });
  }
};

export const getAllLocalites = async (req, res) => {
  try {
    const localites = await Localites.find();
    res.status(200).json({
      data: localites,
      message: "Localites recuperées avec succes",
      status: true,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};