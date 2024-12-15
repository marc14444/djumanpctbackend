import { check } from "express-validator";

export const validateClientUpdate = [
  check("nomClient")
    .optional()
    .isString()
    .withMessage("Le nom doit être une chaîne de caractères."),
  check("prenomClient")
    .optional()
    .isString()
    .withMessage("Le prénom doit être une chaîne de caractères."),
  check("telClient")
    .optional()
    .isMobilePhone()
    .withMessage("Le numéro de téléphone doit être valide."),
  check("emailClient")
    .optional()
    .isEmail()
    .withMessage("L'adresse email doit être valide."),
  check("passwordClient")
    .optional()
    .isLength({ min: 6, max: 10 })
    .withMessage("Le mot de passe doit être entre 6 et 10 caractères."),
  check("profileImage")
    .optional()
    .isString()
    .withMessage("L'image de profil doit être une URL valide."),
];
