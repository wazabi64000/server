const mongoose = require('mongoose');
const { Schema } = mongoose; // Ajout de l'import du Schema

const locationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
  },
  coordinates: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  city: {
    type: String,
  },
  postalCode: {
    type: String,
  },
});

const Location = mongoose.model('Location', locationSchema); // Renommage du modèle

module.exports = Location; // Changement du nom exporté
