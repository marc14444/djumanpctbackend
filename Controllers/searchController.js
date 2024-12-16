import Artisans from "../Models/Artisans.js";

// Fonction pour calculer la distance entre deux points géographiques
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const R = 6371; // Rayon de la Terre en km

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lat2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en km
}

// Fonction pour convertir la distance en temps
function convertDistanceToTime(distance, speed) {
  const hours = distance / speed; // Temps en heures
  return hours % 1 === 0 ? { hours: Math.floor(hours), minutes: 0 } : { hours: Math.floor(hours), minutes: Math.round((hours % 1) * 60) }; // Formater le temps en heures et minutes
}

// Contrôleur de recherche
export const searchArtisans = async (req, res) => {
  try {
    const { latitude, longitude, metier, rayon = 10, mode = "voiture" } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Les coordonnées (latitude, longitude) sont requises pour effectuer la recherche."
      });
    }

    // Convertir en nombres pour les calculs
    const clientLat = parseFloat(latitude);
    const clientLon = parseFloat(longitude);

    // Définir la vitesse moyenne en fonction du mode de déplacement
    const speeds = {
      voiture: 60, // km/h
      pied: 5 // km/h
    };
    const speed = speeds[mode] || speeds.voiture; // Utiliser la vitesse de la voiture par défaut

    // Rechercher les artisans correspondant aux critères
    const artisans = await Artisans.find({
      metier: metier ? { $regex: metier, $options: "i" } : { $exists: true }
    });

    // Ajouter des logs pour vérifier les artisans trouvés
    console.log(`Artisans trouvés pour le métier "${metier}":`, artisans);

    // Calculer la distance et le temps pour chaque artisan
    const artisansAvecDistanceEtTemps = artisans.map((artisan) => {
      if (artisan.latitude && artisan.longitude) {
        const distance = calculateDistance(
          clientLat,
          clientLon,
          artisan.latitude,
          artisan.longitude
        ).toFixed(2); // Formater la distance avec deux chiffres après la virgule
        const time = convertDistanceToTime(distance, speed); // Temps en heures et en minutes
        return { ...artisan.toObject(), distance, time };
      } else {
        return { ...artisan.toObject(), distance: Infinity, time: { hours: "Infinity", minutes: "Infinity" } }; // Assigner une grande valeur pour les distances inconnues
      }
    });

    // Filtrer par rayon (en km) et trier par distance croissante
    let artisansFiltres = artisansAvecDistanceEtTemps
      .filter((artisan) => artisan.distance <= rayon)
      .sort((a, b) => a.distance - b.distance);

    // Si aucun artisan n'est trouvé dans le rayon, afficher tous les artisans du métier recherché
    if (artisansFiltres.length === 0 && metier) {
      artisansFiltres = artisansAvecDistanceEtTemps.filter((artisan) =>
        artisan.metier.match(new RegExp(metier, "i"))
      );

      if (artisansFiltres.length === 0) {
        // Si aucun artisan ne correspond au métier recherché, retourner une réponse vide
        return res.status(200).json({
          message: "Aucun artisan trouvé correspondant au métier recherché.",
          data: [],
        });
      } else {
        // Retourner tous les artisans du métier recherché
        return res.status(200).json({
          message: "Aucun artisan trouvé à proximité, voici tous les artisans correspondant au métier recherché.",
          data: artisansFiltres,
        });
      }
    }

    res.status(200).json({
      message: "Artisans trouvés avec succès.",
      data: artisansFiltres
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
