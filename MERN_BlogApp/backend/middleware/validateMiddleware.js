export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username?.trim()) errors.push('Username is required');
  else if (username.trim().length < 3) errors.push('Username must be at least 3 characters');
  else if (!/^[a-zA-Z0-9_]+$/.test(username)) errors.push('Username can only contain letters, numbers, and underscores');

  if (!email?.trim()) errors.push('Email is required');
  else if (!/\S+@\S+\.\S+/.test(email)) errors.push('Please provide a valid email');

  if (!password) errors.push('Password is required');
  else if (password.length < 6) errors.push('Password must be at least 6 characters');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0] });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  next();
};

export const validateBlog = (req, res, next) => {
  const { title, content, excerpt } = req.body;
  const errors = [];

  if (!title?.trim()) errors.push('Title is required');
  else if (title.trim().length > 200) errors.push('Title cannot exceed 200 characters');

  if (!content?.trim()) errors.push('Content is required');
  if (!excerpt?.trim()) errors.push('Excerpt is required');
  else if (excerpt.trim().length > 500) errors.push('Excerpt cannot exceed 500 characters');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors[0] });
  }
  next();
};