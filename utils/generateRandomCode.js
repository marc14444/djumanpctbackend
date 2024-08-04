// Fonction pour générer un nombre aléatoire entre 10000 et 99999
export function generateRandomCode() {
    // Génère un nombre aléatoire entre 10000 et 99999
    const randomCode = Math.floor(10000 + Math.random() * 90000);
  
    // Convertit le nombre en chaîne de caractères (pour s'assurer de la longueur)
    const codeString = randomCode.toString();
  
    return codeString;
  }
  