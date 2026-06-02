import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, name } = req.body;

  const userExists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
  });

  if (userExists) {
    res.status(400);
    throw new Error(
      userExists.email === email.toLowerCase() ? 'Email already registered' : 'Username already taken'
    );
  }

  const user = await User.create({
    username: username.trim(),
    email: email.toLowerCase(),
    password,
    name: name || username,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
  });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      bookmarks: user.bookmarks,
    },
    token: generateToken(user._id),
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('bookmarks', 'title slug coverImage excerpt');

  res.json({ success: true, data: user });
});