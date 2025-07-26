const User = require("../models/User");

// Get profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { username, email, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, bio, avatar },
      { new: true, runValidators: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};
