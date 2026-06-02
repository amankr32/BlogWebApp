import express from 'express';
import {
  getUserProfile,
  updateProfile,
  followUser,
  getBookmarks,
  getAllUsers,
  getAdminUserStats,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/:username', getUserProfile);

// Private
router.put('/profile/update', protect, updateProfile);
router.put('/:id/follow', protect, followUser);
router.get('/me/bookmarks', protect, getBookmarks);

// Admin
router.get('/', protect, admin, getAllUsers);
router.get('/admin/stats', protect, admin, getAdminUserStats);

export default router;