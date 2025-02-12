const User = require("../models/userModel");

const adminAuth = async (req, res, next) => {
  try {
    // Check Authorization header first
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      userId = authHeader.split(' ')[1];
    } else {
      // Fallback to body if no header
      userId = req.body.userId;
    }

    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Add user to request object for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

module.exports = adminAuth; 