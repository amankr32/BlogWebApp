import express from 'express';
import { getUserProfile } from '../controllers/userController.js';

const router = express.Router();

// Public endpoint configuration enabling decentralized member queries
router.get('/profile/:username', getUserProfile);

export default router;