const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// GET
// landing page for Overbooked
exports.getWelcome = function (req, res) {
    res.json({ message: "Welcome to the API" });
}

// GET
// login page
exports.getLogin = function (req, res) {
    res.json({ message: "Login page" });
}

// POST
// login authentication
exports.postLogin = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({
                success: false,
                message: "Email/Username and password are required"
            });
        }

        // Find user by either email or username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Create user object without sensitive information
        const userResponse = {
            _id: user._id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            issuedBooks: user.issuedBooks,
            readingProgress: user.readingProgress
        };

        res.json({
            success: true,
            message: "Login successful",
            user: userResponse
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
};

// GET
// registration page
exports.getRegister = function (req, res) {
    res.json({ message: "Register page" });
}

// POST
// registration page
exports.postRegister = async (req, res) => {
    try {
        const { email, username, password, isAdmin, adminCode } = req.body;

        // Validate required fields
        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "Email, username and password are required"
            });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already taken"
            });
        }

        // Validate admin registration
        if (isAdmin) {
            const correctAdminCode = "4269"; // Hardcoded admin code
            if (adminCode !== correctAdminCode) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid admin registration code"
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            isAdmin: isAdmin || false,
            issuedBooks: [],
            readingProgress: {}
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during registration"
        });
    }
};

