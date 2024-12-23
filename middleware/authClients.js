import jwt from "jsonwebtoken";

export default (req, res, next) => {
  // Vérification du token
  try {
    const token = req.cookies.token; // Récupérer le token depuis les cookies

    if (!token) {
      return res.status(401).json({
        message: 'Authentification échouée : aucun token trouvé',
        status: false,
      });
    }

    const decoded = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const clientId = decoded.clientId;

    req.auth = { clientId: clientId };

    if (!req.auth.clientId) {
      return res.status(401).json({
        error: "Invalid Client ID",
        message: "Authentification échouée, Vous n'êtes pas autorisé",
        status: false,
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: error,
      message: "Authentification échouée. Veuillez vous reconnecter",
      status: false,
    });
  }
};
