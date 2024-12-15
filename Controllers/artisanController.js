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
import fs from 'fs';

dotenv.config();

const code = generateRandomCode();

export const signupArtisan = async (req, res) => {
  try {
    const {
      nomArtisan,
      prenomArtisan,
      telArtisan,
      local,
      emailArtisan,
      adresseArtisan,
      metier,
      passwordArtisan,
      confirmPasswordArtisan,
      alphabetisation,
      nomEntreprise,
      longitude,
      latitude,
      ouverture,
      fermeture,
      experience,
    } = req.body;

    const { recto, verso, selfie } = req.files;

    // Vérification des champs obligatoires
    if (
      !nomArtisan ||
      !prenomArtisan ||
      !nomEntreprise ||
      !longitude ||
      !latitude ||
      !telArtisan ||
      !local ||
      !emailArtisan ||
      !adresseArtisan ||
      !metier ||
      !passwordArtisan ||
      !confirmPasswordArtisan ||
      !alphabetisation ||
      !ouverture ||
      !fermeture ||
      !experience
    ) {
      deleteUploadedFiles(req.files);
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires", status: false });
    }

    // Vérification si les images sont présentes
    if (!recto || !verso || !selfie) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({
        message: "Toutes les images sont obligatoires",
        status: false,
      });
    }

    // Validation du numéro de téléphone
    if (telArtisan.length !== 10) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({
        message: "Le numéro de téléphone doit contenir 10 caractères",
        status: false,
      });
    }

    // Vérification de la correspondance des mots de passe
    if (passwordArtisan !== confirmPasswordArtisan) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({
        message: "Les mots de passe ne correspondent pas",
        status: false,
      });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(passwordArtisan, 10);

    // Téléchargement des images sur S3
    const rectoName = `${uuidv4()}${path.extname(recto[0].originalname)}`;
    const versoName = `${uuidv4()}${path.extname(verso[0].originalname)}`;
    const selfieName = `${uuidv4()}${path.extname(selfie[0].originalname)}`;

    const rectoS3 = await s3Uploadv2(recto[0], rectoName);
    const versoS3 = await s3Uploadv2(verso[0], versoName);
    const selfieS3 = await s3Uploadv2(selfie[0], selfieName);

    // Création d'un nouvel artisan
    const newArtisan = new Artisans({
      nomArtisan,
      prenomArtisan,
      telArtisan,
      local,
      emailArtisan,
      cni: {
        recto: rectoS3.Location, // URL de l'image sur S3
        verso: versoS3.Location, // URL de l'image sur S3
      },
      selfie: selfieS3.Location, // URL de l'image sur S3
      adresseArtisan,
      metier,
      passwordArtisan: hashedPassword,
      alphabetisation,
      nomEntreprise,
      longitude,
      latitude,
      ouverture,
      fermeture,
      experience,
    });

    // Sauvegarder l'artisan dans la base de données
    const savedArtisan = await newArtisan.save();

    // Envoi de l'email de bienvenue
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: emailArtisan,
      subject: "Bienvenue sur DJUMAN !",
      html: `
        <h1>Bienvenue ${nomArtisan} !</h1>
        <p>Votre compte artisan a été créé avec succès sur DJUMAN.</p>
        <p>Nous sommes ravis de vous avoir parmi nous pour vous aider à promouvoir vos services et à développer votre entreprise.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    // Réponse réussie
    res.status(201).json({
      data: savedArtisan,
      message: "Vous avez été inscrit avec succès",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};


export const loginArtisan = async (req, res) => {
  const { telArtisan, passwordArtisan } = req.body;
  try {
    // Vérification des champs obligatoires
    if (!telArtisan || !passwordArtisan) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires",
        status: false,
      });
    }

    // Validation du format du numéro de téléphone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(telArtisan)) {
      return res.status(400).json({
        message: "Le numéro de téléphone est invalide",
        status: false,
      });
    }

    // Recherche de l'artisan
    const artisan = await Artisans.findOne({ telArtisan });
    if (!artisan) {
      return res.status(400).json({
        message: "Numéro de téléphone ou mot de passe incorrect",
        status: false,
      });
    }

    // Vérification du mot de passe
    const validPassword = await bcrypt.compare(passwordArtisan, artisan.passwordArtisan);
    if (!validPassword) {
      return res.status(400).json({
        message: "Numéro de téléphone ou mot de passe incorrect",
        status: false,
      });
    }

    // Génération du token JWT
    const token = jwt.sign({ artisanId: artisan._id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h", // Expiration après 24 heures
    });

    // Réponse réussie
    res.status(200).json({
      token,
      data: artisan, // Exclusion du mot de passe
      message: "Connexion réussie !",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur est survenue, veuillez réessayer plus tard",
      status: false,
    });
  }
};


export const getArtisanConnected = async (req, res) => {
  try {
    const artisan = await Artisans.findById(req.auth.artisanId);
    if (!artisan) {
      return res.status(404).json({
        error: "Artisan introuvable",
        message: "Artisan introuvable",
        status: false,
      });
    }
    res.status(200).json({
      artisan,
      message: "Artisan recupéré avec succes",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const updateArtisanProfil = async (req, res) => {
  try {
    const idArtisan = req.auth.artisanId;
    const { passwordArtisan, ...rest } = req.body;

    // Vérifiez si un nouveau mot de passe est fourni
    if (passwordArtisan) {
      // Vérifiez la longueur du mot de passe
      if (passwordArtisan.length < 6 || passwordArtisan.length > 10) {
        return res.status(400).json({
          message: "Le mot de passe doit être entre 6 et 10 caractères",
          status: false,
        });
      }

      // Hachez le mot de passe
      rest.passwordArtisan = await bcrypt.hash(passwordArtisan, 10);
    }

    const updatedArtisan = await Artisans.findByIdAndUpdate(
      idArtisan,
      rest,
      {
        new: true,
        runValidators: true, // Applique les validations définies dans le modèle
      }
    );

    if (!updatedArtisan) {
      return res.status(404).json({
        error: "Artisan introuvable",
        message: "Artisan introuvable",
        status: false,
      });
    }

    // Récupération du nom et de l'email du client mis à jour
        const { nomArtisan, emailArtisan } = updatedArtisan;
    
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
          to: emailArtisan,
          subject: "DJUMAN !",
          html: `
            <h1>Content de vous revoir ${nomArtisan} !</h1>
            <p>Votre Profil sur DJUMAN a été mis à jour avec succès.</p>
            <p>Merci de nous faire confiance pour acroitres votre visibilité sur le marché.</p>
            <p>Avec DJUMAN, j'ai trop de gombos !</p>
          `,
        };
    
        await transporter.sendMail(mailOptions);
    

    res.status(200).json({
      updatedArtisan,
      message: "Profil mis à jour avec succès",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};


export const updatePasswordArtisan = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const idArtisan = req.auth.artisanId;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    const artisan = await Artisans.findById(idArtisan);
    if (!artisan) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé", status: false });
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      artisan.passwordArtisan
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

    await Artisans.findByIdAndUpdate(idArtisan, {
      passwordArtisan: hashedPassword,
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

export const deletedArtisanAccount = async (req, res) => {
  try {
    const artisanId = req.auth.artisanId;

    const artisan = await Artisans.findById(artisanId);
    if (!artisan) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé", status: false });
    }
    await Artisans.findByIdAndDelete(artisanId);
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

export async function demandeReinitialisationMotDePasse(req, res) {
  const { emailArtisan } = req.body;

  try {
    // Rechercher l'artisan par email
    const artisan = await Artisans.findOne({ emailArtisan });
    if (!artisan) {
      console.log("Artisan non trouvé avec l'email:", emailArtisan);
      return res.status(404).json({ message: "Artisan non trouvé." });
    }

    // Générer un token de réinitialisation
    const token = crypto.randomBytes(20).toString("hex");

    // Définir le token et l'expiration dans le modèle
    artisan.resetPasswordToken = token;
    artisan.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await artisan.save();

    console.log('Token de réinitialisation généré:', token);
    console.log('Expiration du token:', artisan.resetPasswordExpires);

    // Créer le lien de réinitialisation
    const resetURL = `http://localhost:4000/api/artisans/reinitialiser-mot-de-passe/${token}`;

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
      to: artisan.emailArtisan,
      subject: "Réinitialisation de mot de passe",
      html: `
        <p>Bonjour ${artisan.nomArtisan},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour le faire :</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>Ce lien est valide pendant une heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail.</p>
        <p>Cordialement,<br>L'équipe DJUMAN</p>
      `,
    };

    // Envoyer l'e-mail
    await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé à:", artisan.emailArtisan);

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
    // Vérification du mot de passe
    if (!newPassword) {
      return res.status(400).json({ message: "Le mot de passe est requis." });
    }

    if (newPassword.length < 6 || newPassword.length > 10) {
      return res.status(400).json({
        message: "Le mot de passe doit être entre 6 et 10 caractères.",
      });
    }

    // Rechercher l'artisan par token et vérifier la date d'expiration
    const artisan = await Artisans.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Vérifie que l'expiration est encore valide
    });

    // Log des valeurs pour le débogage
    console.log("Token dans l'URL:", token);
    console.log("resetPasswordToken dans la base de données:", artisan ? artisan.resetPasswordToken : 'Aucun artisan trouvé');
    console.log("resetPasswordExpires dans la base de données:", artisan ? artisan.resetPasswordExpires : 'Aucun artisan trouvé');

    if (!artisan) {
      return res.status(400).json({
        message: "Le lien de réinitialisation est invalide ou a expiré.",
      });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et supprimer le token
    artisan.passwordArtisan = hashedPassword;
    artisan.resetPasswordToken = undefined;
    artisan.resetPasswordExpires = undefined;

    await artisan.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", error);
    res.status(500).json({
      message: "Erreur lors de la réinitialisation du mot de passe.",
    });
  }
}
