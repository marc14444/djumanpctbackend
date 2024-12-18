import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../Models/Admin.js";
import Clients from "../Models/Clients.js";
import Artisans from "../Models/Artisans.js";

// Ajouter un administrateur
export const addAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation des données
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Le nom d'utilisateur et le mot de passe sont obligatoires." });
    }

    // Vérifier le nombre d'administrateurs existants
    const adminCount = await Admin.countDocuments();
    if (adminCount >= 2) {
      return res.status(403).json({
        message: "La limite de 2 administrateurs est atteinte. Aucun autre administrateur ne peut être ajouté.",
      });
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Ce nom d'utilisateur est déjà utilisé.",
      });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'administrateur
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Administrateur créé avec succès.",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
//connexion d'un administrateur
export const signinAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs",
        status: false,
      });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({
        message: "Admin introuvable",
        status: false,
      });
    }
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Mot de passe invalide",
        status: false,
      });
    }
    const token = jwt.sign({ adminId: admin._id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Connexion reussie", token, status: true , data: admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", status: false });
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const admin = await Admin.find();

    res
      .status(200)
      .json({ message: "Recuperation reussie", data: admin, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", status: false });
  }
};

export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.auth.adminId);

    res
      .status(200)
      .json({ message: "Recuperation reussie", data: admin, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", status: false });
  }
};

export const disableArtisan = async (req, res) => {
  try {
    const idArtisan = req.params.idArtisan;
    const artisan = await Artisans.findById(idArtisan);
    if (!artisan) {
      return res.status(404).json({
        message: "Artisan introuvable",
        status: false,
      });
    }

    if (artisan.statusArtisan === false) {
      return res.status(400).json({
        message: `Le compte de l'artisan ${artisan.artisanUsername} est deja desactivé`,
        status: false,
      });
    } else {
      artisan.statusArtisan = false;
      await artisan.save();
      res.status(200).json({
        message: `Artisan ${artisan.artisanUsername} a été desactivé avec succes `,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const activateArtisan = async (req, res) => {
  try {
    const idArtisan = req.params.idArtisan;
    const artisan = await Artisans.findById(idArtisan);

    if (!artisan) {
      return res.status(404).json({
        message: "Artisan introuvable",
        status: false,
      });
    }

    if (artisan.statusArtisan === true) {
      return res.status(400).json({
        message: `Le compte de l'artisan ${artisan.artisanUsername} est deja activé`,
        status: false,
      });
    } else {
      artisan.statusArtisan = true;
      await artisan.save();
      res.status(200).json({
        message: `Artisan ${artisan.artisanUsername} a été activé avec succes `,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const disableClient = async (req, res) => {
  try {
    const idClient = req.params.idClient;
    const client = await Clients.findById(idClient);
    if (!client) {
      return res.status(404).json({
        message: "Client introuvable",
        status: false,
      });
    }

    if (client.statusClient === false) {
      return res.status(400).json({
        message: `Le compte de l'artisan ${client.clientUsername} est deja desactivé`,
        status: false,
      });
    } else {
      client.statusClient = false;
      await client.save();
      res.status(200).json({
        message: `Le compte de client ${client.clientUsername} a été desactivé avec succes `,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const activateClient = async (req, res) => {
  try {
    const idClient = req.params.idClient;
    const client = await Clients.findById(idClient);

    if (!client) {
      return res.status(404).json({
        message: "Client introuvable",
        status: false,
      });
    }

    if (client.statusClient === true) {
      return res.status(400).json({
        message: `Le compte du client ${client.clientUsername} est deja activé`,
        status: false,
      });
    } else {
      client.statusClient = true;
      await client.save();
      res.status(200).json({
        message: `Artisan ${client.clientUsername} a été activé avec succes `,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const getAllClientDisabled = async (req, res) => {
  try {
    const allClients = await Clients.find({ statusClient: false });
    if (!allClients || allClients.length === 0) {
      return res.status(404).json({
        message: "Aucun compte client n'est desactive",
        status: false,
      });
    }
    res.status(200).json({ message: "Recuperation reussie", data: allClients });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const getAllArtisanDisabled = async (req, res) => {
  try {
    const allArtisan = await Artisans.find({ statusArtisan: false });
    if (!allArtisan || allArtisan.length === 0) {
      return res.status(404).json({
        message: "Aucun compte client n'est desactive",
        status: false,
      });
    }
    res.status(200).json({ message: "Recuperation reussie", data: allArtisan });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const getAllClientActivated = async (req, res) => {
  try {
    const allClients = await Clients.find({ statusClient: true });
    if (!allClients || allClients.length === 0) {
      return res.status(404).json({
        message: "Aucun compte client n'est activé",
        status: false,
      });
    }
    res.status(200).json({ message: "Recuperation reussie", data: allClients });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const getAllArtisanActivated = async (req, res) => {
  try {
    const allArtisan = await Artisans.find({ statusArtisan: true });
    if (!allArtisan || allArtisan.length === 0) {
      return res.status(404).json({
        message: "Aucun compte artisan n'est activé",
        status: false,
      });
    }
    res.status(200).json({ message: "Recuperation reussie", data: allArtisan });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

export const deletedArtisanAccount = async (req, res) => {
  const idArtisan = req.params.idArtisan;
  try {
    const artisan = await Artisans.findById(idArtisan);
    if (!artisan) {
      return res.status(404).json({
        message: "Artisan introuvable",
        status: false,
      });
    }
    await Artisans.findByIdAndDelete(idArtisan);
    res.status(200).json({
      message: `Artisan ${artisan.artisanUsername} supprimé avec succes`,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const deletedClientAccount = async (req, res) => {
  const idClient = req.params.idClient;
  try {
    const client = await Clients.findById(idClient);
    if (!client) {
      return res.status(404).json({
        message: "Client introuvable",
        status: false,
      });
    }
    await Clients.findByIdAndDelete(idClient);
    res.status(200).json({
      message: `Client ${client.clientUsername} supprimé avec succes`,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};
