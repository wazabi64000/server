// routes/ads.js
import express from 'express';
const router = express.Router();
 


const {
    createAd,
    getAllAds,
    getAdById,
    updateAd,
    deleteAd,
    requireSignin,
} = require("../controllers/ads")

 


// CREATE
router.post('/ads',  requireSignin, createAd);

// READ
router.get('/ads', getAllAds);
router.get('/ads/:id', getAdById);

// UPDATE
router.put('/ads/:id', updateAd);

// DELETE
router.delete('/ads/:id', deleteAd);

export default router;
