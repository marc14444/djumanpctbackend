// controllers/languageController.js
import Clients from '../Models/Clients.js';
import Artisans from '../Models/Artisans.js';
import Admin from '../Models/Admin.js';

export const updateLanguage = async (req, res) => {
  const { userId, language, role } = req.body;

  console.log(`Received request to update language to ${language} for user with ID ${userId} and role ${role}`);

  if (!['en', 'fr', 'es'].includes(language)) {
    return res.status(400).json({ message: 'Langue non prise en charge.' });
  }

  let user;
  if (role === 'client') {
    user = await Clients.findById(userId);
  } else if (role === 'artisan') {
    user = await Artisans.findById(userId);
  } else if (role === 'admin') {
    user = await Admin.findById(userId);
  }

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }

  user.language = language;

  console.log(`Updating language to ${language} for user with ID ${userId} and role ${role}`);

  await user.save();

  console.log(`Language updated successfully to ${language} for user with ID ${userId} and role ${role}`);

  res.status(200).json({ message: 'Langue mise à jour avec succès.' });
};
