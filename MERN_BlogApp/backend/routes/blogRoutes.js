import express from 'express';
import { getAllBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly readable package queries
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Protected mutation transaction channels
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;