import Artisans from "../Models/Artisans.js";
import ConfirmationEmail from "../Models/ConfirmationEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRandomCode } from "../utils/generateRandomCode.js";
import { emailRegex } from "../utils/emailRegex.js";
import { deleteUploadedFiles } from "../utils/deleteUploadedFiles.js";
import { codeEmail } from "../services/emailService.js";
import theDate from "../utils/generateDate.js";
import dotenv from "dotenv";
dotenv.config();

const code = generateRandomCode();

export const signupArtisan = async (req, res) => {
  const {
    nomArtisan,
    prenomArtisan,
    // artisanUsername,
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
  try {
    // Vérifier si tous les champs sont renseignés
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

    // Vérifier si mes images sont définies
    if (!recto || !verso || !selfie) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({
        message: "Toutes les images sont obligatoires",
        status: false,
      });
    }

    // Vérifier si le numéro de téléphone est valide
    if (telArtisan.length !== 10) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({
        message: "Le numéro de portable doit être de 10 caractères",
        status: false,
      });
    }

    // Vérifier si l'email est valide
    if (!emailRegex.test(emailArtisan)) {
      deleteUploadedFiles(req.files);
      return res
        .status(400)
        .json({ message: "L'email doit être valide", status: false });
    }

    // Vérifier si les mots de passe sont identiques
    if (passwordArtisan !== confirmPasswordArtisan) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({
        message: "Les mots de passe ne sont pas identiques",
        status: false,
      });
    }

    // Vérifier si le mot de passe est au minimum 8 caractères
    if (passwordArtisan.length < 6 || passwordArtisan.length > 10) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({
        message: "Le mot de passe doit être entre 6 et 10 caractères",
        status: false,
      });
    }

    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const existingUser = await Artisans.findOne({
      $or: [{ emailArtisan } /* , { artisanUsername } */],
    });
    if (existingUser) {
      deleteUploadedFiles(req.files);
      return res.status(400).json({
        message: "Email ou nom d'utilisateur déjà utilisé",
        status: false,
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(passwordArtisan, 10);

    // Créer un nouvel artisan
    const newArtisan = new Artisans({
      nomArtisan,
      prenomArtisan,
      /*  artisanUsername, */
      telArtisan,
      local,
      emailArtisan,
      cni: {
        recto: recto[0]
          ? `${req.protocol}://${req.get("host")}/${recto[0].path}`
          : "",
        verso: verso[0]
          ? `${req.protocol}://${req.get("host")}/${verso[0].path}`
          : "",
      },
      selfie: selfie[0]
        ? `${req.protocol}://${req.get("host")}/${selfie[0].path}`
        : "",
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

    // Enregistrer l'artisan dans la base de données
    const savedArtisan = await newArtisan.save();

    // Enregistrement de l'email de confirmation
    /* const newConfirmationEmail = new ConfirmationEmail({
      email: emailArtisan,
      code: code,
    });
    await newConfirmationEmail.save(); */

    // Envoi du mail de confirmation
    /* const envoyerEmail = await codeEmail(emailArtisan, code);
    envoyerEmail;
    console.log("email envoyé: ", envoyerEmail.response); */

    // Enregistrer l'artisan dans la base de données
    res.status(201).json({
      data: savedArtisan,
      message: `Vous avez été inscrit avec succes, veuillez consulter votre email à l'adresse ${emailArtisan} pour activer votre compte`,
      status: true,
    });
  } catch (error) {
    deleteUploadedFiles(req.files);
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

// Connexion
export const loginArtisan = async (req, res) => {
  const { telArtisan, passwordArtisan } = req.body;
  try {
    // Vérifier si tous les champs sont renseignés
    if (!telArtisan || !passwordArtisan) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires", status: false });
    }

    // Vérifier si l'email ou le mot de passe sont incorrects
    const artisan = await Artisans.findOne({ telArtisan });
    if (!artisan) {
      return res.status(400).json({
        message: "Numéro de téléphone ou mot de passe incorrect",
        status: false,
      });
    }

    const validPassword = await bcrypt.compare(
      passwordArtisan,
      artisan.passwordArtisan
    );
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Mot de passe incorrect", status: false });
    }

    // Générer un jeton d'authentification
    const token = jwt.sign({ artisanId: artisan._id }, "RANDOM_TOKEN_SECRET", {
      expiresIn: "24h",
    });
    res.status(200).json({
      token,
      data: artisan,
      message: "Connexion reussie !",
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const getArtisanById = async (req, res) => {
  try {
    const idArtisan = req.params.id;
    const artisan = await Artisans.findById(idArtisan);
    if (!artisan) {
      return res.status(404).json({
        error: "Artisan non trouvé",
        message: "Artisan non trouvé",
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

export const getAllArtisans = async (req, res) => {
  try {
    const artisans = await Artisans.find();
    res
      .status(200)
      .json({ artisans, message: "Artisans récupérés", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue", status: false });
  }
};

export const updateArtisanProfil = async (req, res) => {
  try {
    const idArtisan = req.auth.artisanId;
    const updatedArtisan = await Artisans.findByIdAndUpdate(
      idArtisan,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedArtisan) {
      return res.status(404).json({
        error: "Artisan introuvable",
        message: "Artisan introuvable",
        status: false,
      });
    }

    const verifArtisan = await Artisans.find({ _id: idArtisan });

    if (!verifArtisan) {
      return res.status(404).json({
        error: "Vous ne pouvez pas modifier ce profil",
        message: "Vous ne pouvez pas modifier ce profil",
        status: false,
      });
    }

    res.status(200).json({
      updatedArtisan,
      message: "Profil mis à jour avec succes",
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
