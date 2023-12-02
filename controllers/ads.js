// controllers/ads.js
import { JWT_SECRET } from '../config';
import Annonce from '../models/ads'
import Category from '../models/category'; // Ajoutez cette ligne
 
const expressJwt = require('express-jwt');

// middleware
exports.requireSignin = expressJwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
});




export const createAd = async (req, res) => {
  try {
    const { title, description, images, city, country, mainImage, zip_code, category } = req.body;

    const newAd = new Annonce({
      title,
      description,
      images,
      city,
      country,
      mainImage,
      zip_code,
      user_id: req.user._id,
      category,  // Ajoutez la catégorie à la création de l'annonce
    });

    const savedAd = await newAd.save();
    res.json(savedAd);
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'annonce.' });
  }
};





// READ
export const getAllAds = async (req, res) => {
  try {
    // Utilisez la méthode .find() avec une condition pour exclure les annonces sans user_id
    const ads = await Annonce.find({ user_id: { $exists: true } }).populate('user_id');
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const getAdById = async (req, res) => {
  try {
    const ad = await Annonce.findById(req.params.id).populate('user_id');
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateAd = async (req, res) => {
  try {
    const updatedAd = await Annonce.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.status(200).json(updatedAd);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteAd = async (req, res) => {
  try {
    const deletedAd = await Annonce.findByIdAndDelete(req.params.id);
    if (!deletedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

