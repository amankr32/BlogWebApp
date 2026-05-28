import Blog from '../models/Blog.js';

// @desc    Get all blogs
// @route   GET /api/blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username avatar').sort({ createdAt: -1 });
    return res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate('author', 'username avatar');
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a blog post
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
  const { title, content, excerpt, coverImage, tags } = req.body;

  try {
    if (!title || !content || !excerpt) {
      return res.status(400).json({ message: 'Title, content, and excerpt are required' });
    }

    // Fixed: Pulling natively from req.user._id since authMiddleware sets the full Mongoose document
    const blog = new Blog({
      title,
      content,
      excerpt,
      coverImage,
      tags,
      author: req.user._id || req.user.id, 
    });

    const createdBlog = await blog.save();
    return res.status(201).json(createdBlog);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  const { title, content, excerpt, coverImage, tags } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog entry not found' });

    const userId = req.user._id || req.user.id;
    if (blog.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized. Action restricted to account owners.' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.excerpt = excerpt || blog.excerpt;
    blog.coverImage = coverImage || blog.coverImage;
    blog.tags = tags || blog.tags;

    if (title) blog.slug = undefined;

    const updatedBlog = await blog.save();
    return res.status(200).json(updatedBlog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog entry not found' });

    const userId = req.user._id || req.user.id;
    if (blog.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized. Action restricted to account owners.' });
    }

    await blog.deleteOne();
    return res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};