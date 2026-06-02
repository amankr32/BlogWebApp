import Blog from '../models/Blog.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all blogs with pagination, search, filters
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    tag,
    author,
    sort = 'createdAt',
    order = 'desc',
    status = 'published',
  } = req.query;

  const query = { status };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  if (category && category !== 'All') query.category = category;
  if (tag) query.tags = { $in: [tag.toLowerCase()] };
  if (author) query.author = author;

  const sortObj = { [sort]: order === 'asc' ? 1 : -1 };
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .populate('author', 'username name avatar bio')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Blog.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: blogs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
export const getFeaturedBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ featured: true, status: 'published' })
    .populate('author', 'username name avatar')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
  res.json({ success: true, data: blogs });
});

// @desc    Get trending blogs
// @route   GET /api/blogs/trending
// @access  Public
export const getTrendingBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: 'published' })
    .populate('author', 'username name avatar')
    .sort({ views: -1, 'likes': -1 })
    .limit(6)
    .lean();
  res.json({ success: true, data: blogs });
});

// @desc    Get single blog by slug + increment view
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate('author', 'username name avatar bio website twitter github followers')
    .populate('comments.user', 'username name avatar');

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  // Related blogs by category/tags
  const related = await Blog.find({
    _id: { $ne: blog._id },
    status: 'published',
    $or: [{ category: blog.category }, { tags: { $in: blog.tags } }],
  })
    .populate('author', 'username name avatar')
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  res.json({ success: true, data: blog, related });
});

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, excerpt, coverImage, tags, category, status, featured } = req.body;

  const blog = await Blog.create({
    title,
    content,
    excerpt,
    coverImage,
    tags: tags || [],
    category: category || 'Other',
    status: status || 'published',
    featured: featured || false,
    author: req.user._id,
  });

  const populated = await blog.populate('author', 'username name avatar');
  res.status(201).json({ success: true, data: populated });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this blog');
  }

  const { title, content, excerpt, coverImage, tags, category, status, featured } = req.body;

  if (title) blog.title = title;
  if (content) blog.content = content;
  if (excerpt) blog.excerpt = excerpt;
  if (coverImage !== undefined) blog.coverImage = coverImage;
  if (tags) blog.tags = tags;
  if (category) blog.category = category;
  if (status) blog.status = status;
  if (featured !== undefined) blog.featured = featured;

  const updated = await blog.save();
  const populated = await updated.populate('author', 'username name avatar');
  res.json({ success: true, data: populated });
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this blog');
  }

  await blog.deleteOne();
  res.json({ success: true, message: 'Blog deleted successfully' });
});

// @desc    Like / Unlike blog
// @route   PUT /api/blogs/:id/like
// @access  Private
export const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const userId = req.user._id;
  const alreadyLiked = blog.likes.some((id) => id.toString() === userId.toString());

  if (alreadyLiked) {
    blog.likes = blog.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    blog.likes.push(userId);
  }

  await blog.save();
  res.json({ success: true, likes: blog.likes, likesCount: blog.likes.length });
});

// @desc    Bookmark / Unbookmark blog
// @route   PUT /api/blogs/:id/bookmark
// @access  Private
export const bookmarkBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const userId = req.user._id;
  const alreadyBookmarked = blog.bookmarks.some((id) => id.toString() === userId.toString());

  if (alreadyBookmarked) {
    blog.bookmarks = blog.bookmarks.filter((id) => id.toString() !== userId.toString());
  } else {
    blog.bookmarks.push(userId);
  }

  await blog.save();
  res.json({ success: true, bookmarked: !alreadyBookmarked, bookmarksCount: blog.bookmarks.length });
});

// @desc    Add comment
// @route   POST /api/blogs/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  blog.comments.push({ user: req.user._id, text: text.trim() });
  await blog.save();

  const updated = await Blog.findById(blog._id).populate('comments.user', 'username name avatar');
  res.status(201).json({ success: true, comments: updated.comments });
});

// @desc    Delete comment
// @route   DELETE /api/blogs/:id/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  const comment = blog.comments.id(req.params.commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  comment.deleteOne();
  await blog.save();
  res.json({ success: true, message: 'Comment deleted' });
});

// @desc    Get admin stats
// @route   GET /api/blogs/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
  const [totalBlogs, totalViews, totalLikes, categoryStats] = await Promise.all([
    Blog.countDocuments({ status: 'published' }),
    Blog.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    Blog.aggregate([{ $project: { count: { $size: '$likes' } } }, { $group: { _id: null, total: { $sum: '$count' } } }]),
    Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalBlogs,
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      categoryStats,
    },
  });
});