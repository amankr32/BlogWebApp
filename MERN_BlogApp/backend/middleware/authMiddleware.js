import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Ensure all three arguments (req, res, next) are present in this exact position and order
export const protect = async (req, res, next) => {
  let token;

  // Check for Token inside standard Authorization Bearer headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. Access token required.' });
  }

  try {
    // Decode payload using environment key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user object instance (minus password string) to request payload lifecycle
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User reference attached to token no longer exists.' });
    }

    // Explicitly execute the next middleware or route controller function down the chain
    return next();
  } catch (error) {
    console.error('JWT validation error:', error);
    return res.status(401).json({ message: 'Session expired or invalid token structure.' });
  }
};