import Clients from "../Models/Clients.js";
import Artisans from "../Models/Artisans.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRandomCode } from "../utils/generateRandomCode.js";
import dotenv from "dotenv";
import { s3Uploadv2 } from "../services/s3service.js"; // Importez votre service S3
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // Pour générer un identifiant unique
import crypto from "crypto";
dotenv.config();

const code = generateRandomCode();

// Création d'un nouveau client
export const signupClient = async (req, res) => {
  try {
    const {
      nomClient,
      prenomClient,
      telClient,
      emailClient,
      passwordClient,
      confirmPassword, // Utilisé pour validation, mais pas stocké
    } = req.body;

    // Vérification des champs obligatoires
    if (
      !nomClient ||
      !prenomClient ||
      !telClient ||
      !emailClient ||
      !passwordClient ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires.",
        status: false,
      });
    }

    // Validation du numéro de téléphone
    if (telClient.length !== 10) {
      return res.status(400).json({
        message: "Le numéro de téléphone doit contenir 10 caractères.",
        status: false,
      });
    }

    // Validation du mot de passe
    if (passwordClient.length < 6 || passwordClient.length > 10) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir entre 6 et 10 caractères.",
        status: false,
      });
    }

    // Vérification de la correspondance des mots de passe
    if (passwordClient !== confirmPassword) {
      return res.status(400).json({
        message: "Les mots de passe ne correspondent pas.",
        status: false,
      });
    }

    // Vérification si l'email ou le numéro de téléphone existe déjà
    const existingClient = await Clients.findOne({
      $or: [{ emailClient }, { telClient }],
    });
    if (existingClient) {
      return res.status(400).json({
        message: "Cet utilisateur existe déjà (email ou téléphone).",
        status: false,
      });
    }

    // Téléchargement de l'image vers S3 (si fournie)
    let profileImage = null;
    if (req.file) {
      const file = req.file;
      const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
      const s3Response = await s3Uploadv2(file, fileName);
      profileImage = s3Response.Location; // URL de l'image
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(passwordClient, 10);

    // Création du nouvel utilisateur
    const newClient = new Clients({
      nomClient,
      prenomClient,
      telClient,
      emailClient,
      passwordClient: hashedPassword,
      profileImage, // URL de l'image (ou null si pas d'image)
    });

    // Sauvegarde dans la base de données
    const savedClient = await newClient.save();

    // Envoi d'un e-mail de bienvenue (facultatif)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: emailClient,
      subject: "Akwaba sur DJUMAN !",
      html: `
        <h1>Bienvenue ${nomClient} !</h1>
        <p>Votre compte sur DJUMAN a été créé avec succès.</p>
        <p>Explorez notre plateforme et découvrez les meilleurs artisans de votre région.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Réponse
    res.status(201).json({
      data: savedClient,
      message: "Vous avez été enregistré avec succès.",
      status: true,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({
      message: "Une erreur interne est survenue.",
      status: false,
    });
  }
};

export const updateClientProfil = async (req, res) => {
  try {
    const idClient = req.auth.clientId; // ID du client connecté
    const { passwordClient, confirmPassword, ...rest } = req.body;

    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Erreur de validation des données",
        errors: errors.array(),
        status: false,
      });
    }

    // Gestion des mots de passe
    if (passwordClient || confirmPassword) {
      if (passwordClient !== confirmPassword) {
        return res.status(400).json({
          message: "Les mots de passe ne sont pas identiques",
          status: false,
        });
      }

      if (passwordClient.length < 6 || passwordClient.length > 10) {
        return res.status(400).json({
          message: "Le mot de passe doit être entre 6 et 10 caractères",
          status: false,
        });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(passwordClient, 10);
      rest.passwordClient = hashedPassword;
    }

    // Gestion de l'image de profil
    if (req.file) {
      const file = req.file;
      const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
      
      // Téléchargement de l'image vers S3
      const s3Response = await s3Uploadv2(file, fileName);
      rest.profileImage = s3Response.Location; // URL de la nouvelle image
    }

    // Mise à jour des données du client
    const updatedClient = await Clients.findByIdAndUpdate(
      idClient,
      { ...rest, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({
        message: "Client introuvable",
        status: false,
      });
    }

    // Récupération du nom et de l'email du client mis à jour
    const { nomClient, emailClient } = updatedClient;

    // Envoi d'un e-mail de mise à jour du profil
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: emailClient,
      subject: "DJUMAN !",
      html: `
        <h1>Content de vous revoir ${nomClient} !</h1>
        <p>Votre Profil sur DJUMAN a été mis à jour avec succès.</p>
        <p>Merci de nous faire confiance pour vos artisans de qualité dans votre région.</p>
        <p>Avec DJUMAN, ton bara est toujours bien fait !</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Réponse après la mise à jour
    res.status(200).json({
      updatedClient,
      message: "Profil mis à jour avec succès",
      status: true,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({
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


// Envoyer l'email de réinitialisation
export async function demandeReinitialisationMotDePasse(req, res) {
  const { emailClient } = req.body;

  try {
    // Rechercher l'utilisateur par email
    const client = await Clients.findOne({ emailClient });
    if (!client) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Générer un token de réinitialisation
    const token = crypto.randomBytes(20).toString("hex");

    // Définir le token et l'expiration dans le modèle
    client.resetPasswordToken = token;
    client.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await client.save();

    // Créer le lien de réinitialisation
    const resetURL = `http://localhost:3000/api/clients/reinitialiser-mot-de-passe/${token}`;

    // Configurer les options de l'e-mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: client.emailClient,
      subject: "Réinitialisation de mot de passe",
      html: `
        <p>Bonjour ${client.nomClient},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour le faire :</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>Ce lien est valide pendant une heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail.</p>
        <p>Cordialement,<br>L'équipe DJUMAN</p>
      `,
    };

    // Envoyer l'e-mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "E-mail de réinitialisation envoyé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation :", error);
    res.status(500).json({ message: "Erreur lors de la demande de réinitialisation." });
  }
}

// Réinitialiser le mot de passe
export async function reinitialiserMotDePasse(req, res) {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Vérifier si le nouveau mot de passe est valide
    if (!newPassword) {
      return res.status(400).json({ message: "Le mot de passe est requis." });
    }

    if (newPassword.length < 6 || newPassword.length > 10) {
      return res.status(400).json({
        message: "Le mot de passe doit être entre 6 et 10 caractères.",
      });
    }

    // Rechercher l'utilisateur par token et vérifier la date d'expiration
    const client = await Clients.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!client) {
      return res.status(400).json({
        message: "Le lien de réinitialisation est invalide ou a expiré.",
      });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    client.passwordClient = hashedPassword;
    client.resetPasswordToken = undefined;
    client.resetPasswordExpires = undefined;

    await client.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", error);
    res.status(500).json({
      message: "Erreur lors de la réinitialisation du mot de passe.",
    });
  }
}

// Récupérer un artisan par son ID
export async function getArtisanById(req, res) {
  try {
    const id = req.params.id;
    const artisan = await Artisans.findById(id);
    if (!artisan) {
      return res.status(404).json({
        error: "Artisan introuvable",
        message: "Artisan introuvable",
        status: false,
      });
    }
    return res.status(200).json({
      artisan,
      message: "Artisan récupéré avec succès",
      status: true,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'artisan:", error);
    return res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
}
