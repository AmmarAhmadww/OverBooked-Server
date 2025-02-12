const express = require('express');
const User = require('../models/userModel');
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googlesignin = async (req, res) => {
  try {
    const { email, name, googleId, picture } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user's Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.picture = picture || user.picture;
        await user.save();
      }
    } else {
      // Create new user with Google info
      const username = email.split('@')[0] + Math.random().toString(36).slice(-4);
      user = new User({
        email,
        username,
        googleId,
        fullname: name,
        picture,
        issuedBooks: [],
        numberOfIssuedBooks: 0,
        signedIn: true,
        readingProgress: {}
      });
      await user.save();
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
        picture: user.picture,
        issuedBooks: user.issuedBooks,
        readingProgress: user.readingProgress
      }
    });

  } catch (error) {
    console.error("Google sign-in error:", error);
    res.status(500).json({
      success: false,
      message: "Error during Google sign-in",
      error: error.message
    });
  }
};