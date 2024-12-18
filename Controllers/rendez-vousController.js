import Rendezvous from "../Models/Rendezvous.js";
import Artisans from "../Models/Artisans.js";
import Clients from "../Models/Clients.js";
import nodemailer from "nodemailer";

// Prendre un rendez-vous
export const prendreRendezvous = async (req, res) => {
  try {
    const { clientId, artisanId } = req.params; // Récupérer les IDs depuis les paramètres de l'URL
    const { date } = req.body; // Récupérer la date depuis le corps de la requête
    // Vérifier si l'artisan existe
    const artisan = await Artisans.findById(artisanId);
    const client = await Clients.findById(clientId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan non trouvé" });
    }

    // Créer un nouveau rendez-vous
    const rendezvous = new Rendezvous({ clientId, artisanId, date });
    await rendezvous.save();

    //envoyer la notification du rdv par mail
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
        subject: "Vous avez reçu un rendez-vous !",
        html: `
          <h1>RDV en attente !</h1>
          <p>Bonjour ${artisan.nomArtisan},</p>
          <p>Vous avez reçu un rendez-vous pour le ${new Date(date).toLocaleDateString()} avec <b>${client.nomClient}  ${client.prenomClient}</b>.</p>
          <p>Si vous avez des questions ou des préoccupations, n'hésitez pas à contacter le responsable de l'équipe.</p>
          <p>Cordialement,<br>L'équipe DJUMAN</p>
        `,
      };
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Rendez-vous pris avec succès",
      rendezvous,
    });
  } catch (error) {
    console.error("Erreur lors de la prise de rendez-vous:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Confirmer ou refuser un rendez-vous
export const confirmerRendezvous = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "Confirmé" ou "Refusé"

    // Vérifier si le rendez-vous existe
    const rendezvous = await Rendezvous.findById(id);
    if (!rendezvous) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    const client = await Clients.findById(rendezvous.clientId);

    // Mettre à jour le statut du rendez-vous
    rendezvous.status = status;
    await rendezvous.save();

    // Envoyer la notification du rendez-vous par mail
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
      subject: "Votre rendez-vous a été confirmé !",
      html: `
        <h1>Rendez-vous Confirmé !</h1>
        <p>Bonjour ${client.nomClient},</p>
        <p>Votre rendez-vous pour le ${new Date(rendezvous.date).toLocaleDateString()} a été confirmé.</p>
        <p>Cordialement,<br>L'équipe DJUMAN</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: `Rendez-vous ${status.toLowerCase()} avec succès`,
      rendezvous,
    });
  } catch (error) {
    console.error("Erreur lors de la confirmation/refus du rendez-vous:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


// Annuler un rendez-vous
export const annulerRendezvous = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le rendez-vous existe
    const rendezvous = await Rendezvous.findById(id);

    if (!rendezvous) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    // Supprimer le rendez-vous
    await rendezvous.deleteOne();

    res.status(200).json({
      message: "Rendez-vous annulé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'annulation du rendez-vous:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Lister les rendez-vous d'un client
export const listerRendezvous = async (req, res) => {
  try {
    const clientId = req.auth.clientId;

    // Récupérer les rendez-vous du client
    const rendezvous = await Rendezvous.find({ clientId });

    res.status(200).json({
      message: "Rendez-vous récupérés avec succès",
      rendezvous,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Lister les rendez-vous reçus par l'artisan concerné
export const listerRendezvousRecus = async (req, res) => {
  try {
    const { artisanId } = req.params; // Récupérer l'ID de l'artisan depuis les paramètres de l'URL

    // Récupérer les rendez-vous reçus par l'artisan
    const rendezvous = await Rendezvous.find({ artisanId });

    res.status(200).json({
      message: "Rendez-vous reçus récupérés avec succès",
      rendezvous,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous reçus:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};


