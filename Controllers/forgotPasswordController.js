import Clients from "../Models/Clients.js";
import Artisans from "../Models/Artisans.js";
import bcrypt from "bcrypt";
import ForgotPassword from "../Models/ForgotPassword.js";
import { generateRandomCode } from "../utils/generateRandomCode.js";
import { codeForgotPassword } from "../services/emailService.js";
import { emailRegex } from "../utils/emailRegex.js";

export const forgotPassword = async (req, res) => {
  try {
    const code = generateRandomCode();
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: "Veuillez renseigner votre email !", status: false });

    const verifEmailExisting = await ForgotPassword.findOne({ email });
    if (verifEmailExisting) {
      return res.status(400).json({
        message:
          "Un code a été deja envoyé ! , veuillez verifier votre boite mail ou contacter l'administrateur",
        status: false,
      });
    }

    const clients = await Clients.findOne({ emailClient: email });
    const artisans = await Artisans.findOne({ emailArtisan: email });

    if (!clients && !artisans) {
      return res.status(400).json({
        message: "Veuillez renseigner un email valide !",
        status: false,
      });
    }

    const newForgotPassword = new ForgotPassword({
      email,
      code,
    });
    await newForgotPassword.save();

    //Send an email to the user
    await codeForgotPassword(email, code);

    res.status(200).json({ message: "Code envoyé !", status: true });
  } catch (error) {
    res.status(500).json({ error: error, status: false });
  }
};

export const verifyCode = async (req, res) => {
  const { code } = req.body;
  try {
    if (!code) {
      return res.status(400).json({
        message: "Veuillez renseigner le code de confirmation",
        status: false,
      });
    }

    const forgotPasswordEntry = await ForgotPassword.findOne({ code });

    if (forgotPasswordEntry) {
      await ForgotPassword.findByIdAndDelete(forgotPasswordEntry._id);
      res.status(200).json({ message: "Code correct !", status: true });
    } else {
      res.status(401).json({
        message: "Code incorrect ! Veuillez reessayer",
        status: false,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la verification du code de confirmation",
      status: false,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Veuillez renseigner tous les champs !",
        status: false,
      });
    }

    // Vérifier si l'email fourni est valide
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalide", status: false });
    }

    if (newPassword.length < 6 || newPassword.length > 10) {
      return res.status(400).json({
        message: "Le nouveau mot de passe doit être entre 8 et 10 caractères",
        status: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Les nouveaux mots de passe ne correspondent pas",
        status: false,
      });
    }

    const forgotPasswordEntry = await ForgotPassword.findOne({ email });
    if (forgotPasswordEntry) {
      return res.status(404).json({
        message:
          "Un code de confirmation a été envoyé dans votre boite mail,veuillez le confirmer d'abord!",
        status: false,
      });
    }

    const client = await Clients.findOne({ emailClient: email });
    const artisan = await Artisans.findOne({ emailArtisan: email });

    if (!client && !artisan) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable", status: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (client) {
      client.passwordClient = hashedPassword;
      await client.save();
      res
        .status(200)
        .json({ message: "Mot de passe mis à jour !", status: true });
    } else if (artisan) {
      artisan.passwordArtisan = hashedPassword;
      await artisan.save();
      res
        .status(200)
        .json({ message: "Mot de passe mis à jour !", status: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, status: false });
  }
};