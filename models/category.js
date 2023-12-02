// models/category.js

const mongoose = require('mongoose');
const { Schema } = mongoose;


const categorySchema = new Schema({
  name: { type: String, required: true },
  // Autres champs de catégorie si nécessaire
});

export default mongoose.model('Category', categorySchema);

