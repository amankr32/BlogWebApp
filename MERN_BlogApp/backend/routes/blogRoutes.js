import express from 'express';
import { 
  getAllBlogs, 
  getBlogBySlug, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  likeBlog,
  addComment
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Data Routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Secure Core Operations
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

// Secure Interactions
router.put('/:id/like', protect, likeBlog);
router.post('/:id/comment', protect, addComment);

export default router;