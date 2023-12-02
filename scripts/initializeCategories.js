// scripts/initializeCategories.js

const mongoose = require('mongoose');
const Category = require('../models/category');

const categoriesData = [
  { name: 'Consoles' },
  { name: 'Jeux vidéo' },
  { name: 'Figurines' },
  { name: 'Ordinateurs et composants' },
  { name: 'Littérature' },
  { name: 'Accessoires de cosplay' },
  { name: 'Gadgets' },
  { name: 'Manga et anime' },
  { name: 'Art' },
  { name: 'Peluches' },
  { name: 'Stickers et autocollants ' },
  { name: 'Services' },
  { name: 'Divers' },
 
  // ...
];

async function initializeCategories() {
  mongoose.connect('mongodb+srv://wazabi:Nokia33102002.@swapzone.m74hpag.mongodb.net/swapzonedb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await Category.create(categoriesData);
    console.log('Catégories initialisées avec succès.');
  } catch (error) {
    console.error("Erreur lors de l'initialisation des catégories :", error);
  } finally {
    mongoose.disconnect();
  }
}

initializeCategories();
