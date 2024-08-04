import Search from "../Models/Search.js";
import Clients from "../Models/Clients.js";
import Artisans from "../Models/Artisans.js";
import theDate from "../utils/generateDate.js";

export const makeSearchClient = async (req, res) => {
  const { terms } = req.body;
  const adminId = req.auth.adminId;

  try {
    if (!terms) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs",
        status: false,
      });
    }
    const searchResults = await Clients.find({
      $or: [
        { nomClient: { $regex: terms, $options: "i" } },
        { prenomClient: { $regex: terms, $options: "i" } },
        { telClient: { $regex: terms, $options: "i" } },
      ],
    });

    if (!searchResults || searchResults.length === 0) {
      return res.status(404).json({
        message: "Aucun resultat",
        status: false,
      });
    }
    const search = new Search({
      terms,
      userId: adminId,
      createdAt: theDate(),
    });
    await search.save();
    res.status(200).json({
      searchResults,
      message: "Recherche reussie",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const makeSearchArtisanForClient = async (req, res) => {
  const { terms, adresse } = req.body;

  try {
    const userId = req.auth.clientId;
    if (!userId) {
      return res.status(400).json({
        message: "Veuillez vous connecter",
        status: false,
      });
    }
    console.log(terms, adresse);

    if (!terms || !adresse) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs",
        status: false,
      });
    }

    const searchResults = await Artisans.find({
      local: { $regex: adresse, $options: "i" },
      $or: [{ metier: { $regex: terms, $options: "i" } }],
    });

    if (!searchResults || searchResults.length === 0) {
      return res.status(404).json({
        searchResults,
        message: "Aucun resultat",
        status: false,
      });
    }
    const search = new Search({
      terms,
      userId: userId,
      createdAt: theDate(),
    });
    await search.save();
    res.status(200).json({
      searchResults,
      message: "Recherche reussie",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const makeSearchArtisanForAdmin = async (req, res) => {
  let { terms } = req.body;
  terms = terms.toLowerCase();
  const userId = req.auth.adminId;

  try {
    if (!terms) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs",
        status: false,
      });
    }

    const searchResults = await Artisans.find({
      $or: [
        { nomArtisan: { $regex: terms, $options: "i" } },
        { prenomArtisan: { $regex: terms, $options: "i" } },
        { telArtisan: { $regex: terms, $options: "i" } },
        { metier: { $regex: terms, $options: "i" } },
      ],
    });

    if (!searchResults || searchResults.length === 0) {
      return res.status(404).json({
        searchResults,
        message: "Aucun resultat",
        status: false,
      });
    }
    const search = new Search({
      terms,
      userId: userId,
      createdAt: theDate(),
    });
    await search.save();
    res.status(200).json({
      searchResults,
      message: "Recherche reussie",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const getAllSearchByAdmin = async (req, res) => {
  try {
    const userId = req.auth.adminId;

    if (!userId) {
      return res.status(400).json({
        message: "Veuillez vous connecter",
        status: false,
      });
    }

    const searches = await Search.find({ userId: userId });

    if (!searches || searches.length === 0) {
      return res
        .status(401)
        .json({ searches, message: "Aucun historique de recherche !" });
    }

    res.status(200).json({
      searches,
      message: "Recherche reussie",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const getAllSearchByClient = async (req, res) => {
  try {
    const userId = req.auth.clientId;

    if (!userId) {
      return res.status(400).json({
        message: "Veuillez vous connecter",
        status: false,
      });
    }

    const searches = await Search.find({ userId: userId });

    if (!searches || searches.length === 0) {
      return res
        .status(401)
        .json({ searches, message: "Aucun historique de recherche !" });
    }

    res.status(200).json({
      searches,
      message: "Recherche reussie",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const getAllSearchInDB = async (req, res) => {
  try {
    const searches = await Search.find();

    if (!searches || searches.length === 0) {
      res.status(404).json({ message: "Aucune donnée", status: false });
    }

    res.status(200).json({
      data: searches,
      message: "Donnée recupérées avec succès",
      status: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const deleteOneSearchAdmin = async (req, res) => {
  const { idSearch } = req.params;
  const adminId = req.auth.adminId;
  try {
    const search = await Search.findById(idSearch);
    if (!search) {
      return res.status(404).json({
        message: "Cet historique de recherche n'existe pas",
        status: false,
      });
    }
    if (search.userId !== adminId) {
      return res.status(401).json({
        message:
          "Veuillez vous n'êtes pas autorisé à supprimer cet historique de recherche",
        status: false,
      });
    }
    await Search.findByIdAndDelete(idSearch);
    res.status(200).json({
      search,
      message: `Historique de recherche ${search.terms} a été supprimé avec succès !`,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const deleteOneSearchClient = async (req, res) => {
  const { idSearch } = req.params;
  const clientId = req.auth.clientId;
  try {
    const search = await Search.findById(idSearch);
    if (!search) {
      return res.status(404).json({
        message: "Cet historique de recherche n'existe pas",
        status: false,
      });
    }
    if (search.userId !== clientId) {
      return res.status(401).json({
        message:
          "Veuillez vous n'êtes pas autorisé à supprimer cet historique de recherche",
        status: false,
      });
    }
    await Search.findByIdAndDelete(idSearch);
    res.status(200).json({
      search,
      message: `Historique de recherche ${search.terms} a été supprimé avec succès !`,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};
