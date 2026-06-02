import express from 'express';
import {
  getAllBlogs,
  getFeaturedBlogs,
  getTrendingBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  bookmarkBlog,
  addComment,
  deleteComment,
  getAdminStats,
} from '../controllers/blogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateBlog } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/trending', getTrendingBlogs);
router.get('/:slug', getBlogBySlug);

// Protected routes
router.post('/', protect, validateBlog, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.put('/:id/like', protect, likeBlog);
router.put('/:id/bookmark', protect, bookmarkBlog);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

// Admin only
router.get('/admin/stats', protect, admin, getAdminStats);

export default router;