import User from '../models/User.js';
import Driver from '../models/Driver.js';
import Ride from '../models/Ride.js';

// @desc    Get comprehensive public profile data for any registered platform member
// @route   GET /api/users/profile/:username
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: 'Username parameter is missing.' });
    }

    // 1. Search Passenger Account Collection (Case-Insensitive)
    let accountData = await User.findOne({ 
      username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } 
    }).select('-password'); 

    let accountType = 'passenger';

    // 2. If not found in Passengers, check the Drivers collection
    if (!accountData) {
      accountData = await Driver.findOne({ 
        username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } 
      });
      accountType = 'driver';
    }

    // If both return null, safely exit
    if (!accountData) {
      return res.status(404).json({ message: 'Requested system profile registry not found.' });
    }

    // 3. Query ride telemetry based on the confirmed _id
    let rideHistory = [];
    if (accountType === 'passenger') {
      rideHistory = await Ride.find({ passengerId: accountData._id })
        .populate('driverId', 'username vehicleDetails licensePlate')
        .sort({ createdAt: -1 });
    } else {
      rideHistory = await Ride.find({ driverId: accountData._id })
        .populate('passengerId', 'username email phone')
        .sort({ createdAt: -1 });
    }

    // CRITICAL: Ensure object keys are exactly named 'profile', 'role', and 'history'
    return res.status(200).json({
      profile: accountData,
      role: accountType,
      history: rideHistory
    });
  } catch (error) {
    console.error("Profile query bottleneck error:", error);
    return res.status(500).json({ message: 'Internal Server Data Sync Failure.' });
  }
};