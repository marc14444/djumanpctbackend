import Clients from "../Models/Clients.js";
import Artisans from "../Models/Artisans.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRandomCode } from "../utils/generateRandomCode.js";
import dotenv from "dotenv";
import theDate from "../utils/generateDate.js";

dotenv.config();

const code = generateRandomCode();

// Creer un client
export const signupClient = async (req, res) => {
  try {
    const {
      nomClient,
      prenomClient,
      telClient,
      emailClient,
      passwordClient,
      confirmPassword,
    } = req.body;

    // Vérification des champs
    if (
      !nomClient ||
      !prenomClient ||
      !telClient ||
      !emailClient ||
      !passwordClient ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs",
        status: false,
      });
    }

    //Verification nombre de caractères du telephone
    if (telClient.length !== 10) {
      return res.status(400).json({
        message: "Le numéro de telephone doit contenir 10 caractères",
        status: false,
      });
    }

    // Vérification de la longueur du mot de passe
    if (passwordClient.length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 6 caractères",
        status: false,
      });
    }

    // Vérification de la confirmation du mot de passe
    if (passwordClient !== confirmPassword) {
      return res.status(400).json({
        message: "Les mots de passe ne sont pas identiques",
        status: false,
      });
    }

    // Vérification de l'existence de l'utilisateur
    const existingClient = await Clients.findOne({
      $or: [{ emailClient }, { telClient }],
    });
    console.log(existingClient);
    if (existingClient) {
      return res.status(401).json({
        message: "Utilisateur Existant !",
        error: "Utilisateur existant",
        status: false,
      });
    }
    console.log(theDate());

    //Extenciation de la classe Clients
    const newClient = new Clients({
      nomClient,
      prenomClient,
      telClient,
      emailClient,
      passwordClient,
      confirmPassword
    });

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(passwordClient, 10);
    newClient.passwordClient = hashedPassword;

    // Enregistrement du client
    const savedClient = await newClient.save();

    // Enregistrement de l'email de confirmation
    /*  const confirmationEmail = new ConfirmationEmail({
      email: emailClient,
      code: code,
    });
    await confirmationEmail.save(); */

    // Envoi du mail de confirmation
    /* const envoyerEmail = await codeEmail(emailClient, code);
    envoyerEmail;
    console.log("email envoyé: ", envoyerEmail.response); */

    res.status(201).json({
      data: savedClient,
      message: `Vous avez été enregistré avec succes `,
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

// Connexion
export const loginClient = async (req, res) => {
  try {
    const { telClient, passwordClient } = req.body;
    // Vérification des champs
    if (!telClient || !passwordClient) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs",
        status: false,
      });
    }

    const client = await Clients.findOne({ telClient });
    if (!client) {
      return res.status(400).json({
        message: "Email ou Mot de passe incorrect !",
        status: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      passwordClient,
      client.passwordClient
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Mot de passe incorrect !",
        status: false,
      });
    }

    const token = jwt.sign({ clientId: client._id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    });
    res.status(200).json({
      data: client,
      message: "Connexion reussie !",
      token,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

// Afficher le client connecté
export const getClientConnected = async (req, res) => {
  try {
    const client = await Clients.findById(req.auth.clientId);
    if (!client) {
      return res.status(404).json({
        error: "Compte introuvable",
        message: "Compte introuvable",
        status: false,
      });
    }
    res.status(200).json({
      client,
      message: "Client recupéré avec succes",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

// Afficher le client by son id
export const getClientById = async (req, res) => {
  try {
    const idClient = req.params.id;
    const client = await Clients.findById(idClient);
    if (!client) {
      return res.status(404).json({
        error: "Client introuvable",
        message: "Client introuvable",
        status: false,
      });
    }
    res.status(200).json({
      client,
      message: "Client recupéré avec succes",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

// Mettre à jour le profil
export const updateClientProfil = async (req, res) => {
  try {
    const idClient = req.auth.clientId;
    const updatedClient = await Clients.findByIdAndUpdate(idClient, req.body, {
      new: true,
    });

    if (!updatedClient) {
      return res.status(404).json({
        error: "Client introuvable",
        message: "Client introuvable",
        status: false,
      });
    }

    const verifClient = await Clients.find({ _id: idClient });

    if (!verifClient) {
      return res.status(404).json({
        error: "Vous ne pouvez pas modifier ce profil",
        message: "Vous ne pouvez pas modifier ce profil",
        status: false,
      });
    }

    res.status(200).json({
      updatedClient,
      message: "Profil mis à jour avec succes",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

// Afficher tous les clients
export const getAllClients = async (req, res) => {
  try {
    const clients = await Clients.find();
    res
      .status(200)
      .json({ clients, message: "Clients récupérés", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

// Mettre à jour le mot de passe
export const updatePasswordClient = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const idClient = req.auth.clientId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    const client = await Clients.findById(idClient);
    if (!client) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé", status: false });
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      client.passwordClient
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Ancien mot de passe incorrect", status: false });
    }

    if (newPassword.length < 6 || newPassword.length > 10) {
      return res.status(400).json({
        message: "Le nouveau mot de passe doit être entre 6 et 10 caractères",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Clients.findByIdAndUpdate(idClient, {
      passwordClient: hashedPassword,
    });
    res
      .status(200)
      .json({ message: "Mot de passe mis à jour avec succes", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error,
      message: "Une erreur est survenue",
      status: false,
    });
  }
};

// Supprimer le compte
export const deletedClientAccount = async (req, res) => {
  try {
    const clientId = req.auth.clientId;

    const client = await Clients.findById(clientId);
    if (!client) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé", status: false });
    }
    await Clients.findByIdAndDelete(clientId);
    res.status(200).json({
      message: "Compte supprimé avec succes",
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

export const noteArtisan = async (req, res) => {
  try {
    const idArtisan = req.params.idArtisan;
    const { note } = req.body;
    const userId = req.auth.clientId; // Assurez-vous que vous avez défini le middleware pour extraire l'ID utilisateur

    // Vérifiez si l'artisan existe
    const artisan = await Artisans.findById(idArtisan);
    if (!artisan) {
      return res.status(404).json({
        error: "Artisan introuvable",
        message: "Artisan introuvable",
        status: false,
      });
    }

    // Valider la valeur de la note
    if (note < 0 || note > 10) {
      return res.status(400).json({
        error: "Veuillez renseigner une note entre 0 et 10",
        message: "Veuillez renseigner une note entre 0 et 10",
        status: false,
      });
    }

    // Vérifiez si l'utilisateur a déjà noté l'artisan
    const existingNote = artisan.notes.find(
      (note) => note.userId.toString() === userId.toString()
    );

    if (existingNote) {
      // Mettre à jour la note existante
      existingNote.note = note;
    } else {
      // Ajouter une nouvelle note
      artisan.notes.push({ note, userId });
      artisan.noteCount++;
    }

    // Recalculer la note moyenne
    const totalNotes = artisan.notes.reduce(
      (sum, currentNote) => sum + currentNote.note,
      0
    );
    artisan.averageNote = totalNotes / artisan.noteCount;

    await artisan.save();

    res.status(200).json({
      artisan,
      message: "Artisan noté avec succès",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur est survenue",
      status: false,
    });
  }
};
