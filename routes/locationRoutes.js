// locationRoutes.js
import express from 'express';
const router = express.Router();
 
// Importer les fonctions du contrôleur
import {
  createLocation,
  readLocation,  
  updateLocation,
  removeLocation,
} from '../controllers/locationController';

// Utiliser les fonctions correctes dans les routes
router.post("/create", createLocation);
router.get("/read", readLocation); // Utiliser la même dénomination ici
router.put("/update", updateLocation);
router.delete("/remove", removeLocation);

export default router;
