
import express from 'express';
const router = express.Router();

// controllers
const {
 create, read, update, remove
} = require('../controllers/caregory.js')


router.post("/create", create);
router.get("/read", read);
router.put("/update", update);
router.delete("/remove", remove);

export default router;
