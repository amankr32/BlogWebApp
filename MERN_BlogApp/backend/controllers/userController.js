import User from '../models/User.js';
import Blog from '../models/Blog.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get user public profile by username
// @route   GET /api/users/:username
// @access  Public
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .select('-password -bookmarks')
    .populate('followers', 'username name avatar')
    .populate('following', 'username name avatar');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const blogs = await Blog.find({ author: user._id, status: 'published' })
    .sort({ createdAt: -1 })
    .select('title slug excerpt coverImage tags category views likes readTime createdAt')
    .lean();

  res.json({ success: true, data: { user, blogs } });
});

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, website, twitter, github, location, avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (website !== undefined) user.website = website;
  if (twitter !== undefined) user.twitter = twitter;
  if (github !== undefined) user.github = github;
  if (location !== undefined) user.location = location;
  if (avatar !== undefined) user.avatar = avatar;

  const updated = await user.save();
  res.json({
    success: true,
    data: {
      _id: updated._id,
      username: updated.username,
      email: updated.email,
      name: updated.name,
      avatar: updated.avatar,
      bio: updated.bio,
      website: updated.website,
      twitter: updated.twitter,
      github: updated.github,
      location: updated.location,
      role: updated.role,
    },
  });
});

// @desc    Follow / Unfollow user
// @route   PUT /api/users/:id/follow
// @access  Private
export const followUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot follow yourself');
  }

  const userToFollow = await User.findById(req.params.id);
  if (!userToFollow) {
    res.status(404);
    throw new Error('User not found');
  }

  const currentUser = await User.findById(req.user._id);
  const isFollowing = currentUser.following.some((id) => id.toString() === req.params.id);

  if (isFollowing) {
    currentUser.following = currentUser.following.filter((id) => id.toString() !== req.params.id);
    userToFollow.followers = userToFollow.followers.filter((id) => id.toString() !== req.user._id.toString());
  } else {
    currentUser.following.push(req.params.id);
    userToFollow.followers.push(req.user._id);
  }

  await Promise.all([currentUser.save(), userToFollow.save()]);
  res.json({
    success: true,
    following: !isFollowing,
    followersCount: userToFollow.followers.length,
  });
});

// @desc    Get user bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
export const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'bookmarks',
    match: { status: 'published' },
    populate: { path: 'author', select: 'username name avatar' },
    options: { sort: { createdAt: -1 } },
  });

  res.json({ success: true, data: user.bookmarks });
});

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {};
  if (search) query.$or = [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  res.json({ success: true, data: users, total });
});

// @desc    Get admin overview stats
// @route   GET /api/users/admin/stats
// @access  Private/Admin
export const getAdminUserStats = asyncHandler(async (req, res) => {
  const [totalUsers, newThisMonth, activeAuthors] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
    Blog.distinct('author', { status: 'published' }).then((ids) => ids.length),
  ]);

  res.json({ success: true, data: { totalUsers, newThisMonth, activeAuthors } });
});