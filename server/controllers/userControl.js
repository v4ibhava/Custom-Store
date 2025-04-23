const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await Users.findOne({ email });
            if (user)
                return res.status(400).json({ msg: "The email already exists." });
            if (password.length < 6)
                return res.status(400).json({ msg: "Password must be at least 6 characters long." });

            // Password encryption
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = new Users({
                name,
                email,
                password: passwordHash
            });

            // Save to MongoDB
            await newUser.save();

            // JWT for authentication
            const accesstoken = createAccessToken({ id: newUser._id });
            const refreshtoken = createRefreshToken({ id: newUser._id });

            // Send tokens
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refreshtoken',
            });
            res.json({ accesstoken });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    refreshtoken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token)
                return res.status(400).json({ msg: "Please Login or Register." });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err)
                    return res.status(400).json({ msg: "Invalid token. Please Login or Register." });

                const accesstoken = createAccessToken({ id: user.id });
                res.json({ accesstoken });
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: "User does not exist." });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ msg: "Incorrect password." });

            const accesstoken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });

            // Set refresh token cookie with proper options
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Use secure in production
                path: '/user/refreshtoken',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({ accesstoken });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refreshtoken' });
            return res.json({ msg: "Logged out." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password');
            if (!user)
                return res.status(400).json({ msg: "User does not exist." });

            res.json(user);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    // Save cart to database
    saveCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found." });

            // Update the user's cart
            user.cart = req.body.cart;
            await user.save();

            res.json({ msg: "Cart updated successfully." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // Retrieve cart from database
    getCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found." });

            res.json(user.cart); // Send the cart to the frontend
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
};

// Utility functions
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userController;
