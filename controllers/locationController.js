// controllers/locationController.js
const axios = require('axios');
const Location = require('../models/Location');
const User = require('../models/user');
const Ad = require('../models/ads');

// Fonction pour créer une nouvelle localisation
exports.createLocation = async (req, res) => {
  try {
    const { userId, adId, coordinates } = req.body;

    // Utiliser le service de géocodage de OpenStreetMap Nominatim pour obtenir les détails de l'adresse
    const nominatimResponse = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates[1]}&lon=${coordinates[0]}&addressdetails=1`
    );

    const addressDetails = nominatimResponse.data.address;

    // Extraire la ville et le code postal
    const city = addressDetails.city || addressDetails.village || addressDetails.town || null;
    const postalCode = addressDetails.postcode || null;

    // Vérifier si l'utilisateur et l'annonce existent
    const user = await User.findById(userId);
    const ad = await Ad.findById(adId);

    if (!user || !ad) {
      return res.status(404).json({ error: 'Utilisateur ou annonce introuvable' });
    }

    // Enregistrez la localisation avec les détails de l'adresse, l'utilisateur et l'annonce
    const location = new Location({
      user: userId,
      ad: adId,
      coordinates,
      city,
      postalCode,
    });

    const savedLocation = await location.save();
    res.json(savedLocation);
  } catch (error) {
    console.error('Erreur lors de la création de la localisation :', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Fonction pour lire toutes les localisations
exports.readLocation = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    console.error('Erreur lors de la lecture des localisations :', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
};

// Fonction pour mettre à jour une localisation
exports.updateLocation = async (req, res) => {
  // À vous de définir comment vous souhaitez mettre à jour une localisation en fonction de vos besoins
  res.json({ message: 'Fonction de mise à jour non implémentée' });
};

// Fonction pour supprimer une localisation
exports.removeLocation = async (req, res) => {
  // À vous de définir comment vous souhaitez supprimer une localisation en fonction de vos besoins
  res.json({ message: 'Fonction de suppression non implémentée' });
};
