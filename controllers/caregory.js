import axios from 'axios';
import { DATABASE } from '../config';
import Category from '../models/category';

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    // Vérifiez si la catégorie avec le même nom existe déjà
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'La catégorie avec ce nom existe déjà.' });
    }

    // Créez une nouvelle catégorie
    const newCategory = new Category({ name });

    // Sauvegardez la nouvelle catégorie
    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie :', error);
    res.status(500).json({ error: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    const categories = await Category.find();
    //console.log('Categories retrieved:', categories); // Ajoutez cette ligne
    res.status(200).json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories :', error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;

    // Vérifiez si la catégorie avec l'ID donné existe
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Catégorie non trouvée.' });
    }

    // Mettez à jour le nom de la catégorie
    existingCategory.name = name;

    // Sauvegardez la catégorie mise à jour
    const updatedCategory = await existingCategory.save();

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie :', error);
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Vérifiez si la catégorie avec l'ID donné existe
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Catégorie non trouvée.' });
    }

    // Supprimez la catégorie
    await existingCategory.remove();

    res.status(204).end();
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie :', error);
    res.status(500).json({ error: error.message });
  }
};
