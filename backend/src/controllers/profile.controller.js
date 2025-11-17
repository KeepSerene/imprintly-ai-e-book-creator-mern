const User = require("../models/User");

/**
 * Get user profile
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>}
 */
async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    return res.status(200).json({
      message: "User profile found!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isPro: user.isPro,
      },
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

/**
 * Update user profile
 * @access Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>}
 */
async function updateProfile(req, res) {
  try {
    const { name, avatar } = req.body;

    if (!name && !avatar) {
      return res.status(400).json({
        error: "Please provide at least one field to update!",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Update fields if provided
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({
          error: "Name must be at least 2 characters!",
        });
      }

      if (name.trim().length > 50) {
        return res.status(400).json({
          error: "Name cannot exceed 50 characters!",
        });
      }

      user.name = name.trim();
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "User profile updated successfully!",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        isPro: updatedUser.isPro,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);

    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

module.exports = { getProfile, updateProfile };
