import ConfirmationEmail from "../Models/ConfirmationEmail.js";
import { welcomeEmail } from "../services/emailService.js";
//import Clients from "../Models/Clients.js";

//FONCTION POUR VERIFIER LE CODE
export const verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    const confirmationEntry = await ConfirmationEmail.findOne({ code });

    if (!code) {
      return res.status(400).json({
        message: "Veuillez renseigner le code de confirmation",
        status: false,
      });
    }

    if (confirmationEntry) {
      //Send an email to the user
      await welcomeEmail(confirmationEntry.email);
        
      //Delete the confirmation entry after it has been verified
      await ConfirmationEmail.findByIdAndDelete(confirmationEntry._id);

      res.status(200).json({
        message: "Code correct ! Email confirmer avec success ! ",
        status: true,
      });
    } else {
      res.status(401).json({
        message: "Code incorrect ! Veuillez reessayer",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Erreur lors de la verification du code de confirmation",
      status: false,
    });
  }
};
