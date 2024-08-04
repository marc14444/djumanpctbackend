import ConfirmationEmail from "../Models/ConfirmationEmail.js";

//FONCTION POUR VERIFIER SI L'EMAIL EST CONFIRMÉ

export const clientCheckEmail = async (req, res, next) => {
  try {
    const confirmationEmail = await ConfirmationEmail.findOne({
      email: req.body.emailClient,
    });
    if (confirmationEmail) {
      return res.status(401).json({
        message:
          "Email non confirmer !, veuillez d'abord confirmer votre email ou contacter l'administrateur",
        status: false,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Erreur lors de la verification du code de confirmation",
      status: false,
    });
  }
};

export const artisanCheckEmail = async (req, res, next) => {
  try {
    const confirmationEmail = await ConfirmationEmail.findOne({
      email: req.body.emailArtisan,
    });
    if (confirmationEmail) {
      return res.status(401).json({
        message:
          "Email non confirmer !, veuillez d'abord confirmer votre email ou contacter l'administrateur",
        status: false,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Erreur lors de la verification du code de confirmation",
      status: false,
    });
  }
};
