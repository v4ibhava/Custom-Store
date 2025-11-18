const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');

const userController = {
    register: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ email });
            if (user) return res.status(400).json({ msg: "The email already exists." });

            if (password.length < 6)
                return res.status(400).json({ msg: "Password is at least 6 characters long." });

            // Password Encryption (not used - OTP login only)
            // const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new Users({
                email
                // password: passwordHash (not used - OTP login only)
            });

            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            newUser.otp = otp;
            newUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

            await newUser.save();

            // Here you would send the OTP to the user's email.
            // For this example, we'll just return it in the response.
            res.json({ msg: "Registration successful. Please verify your OTP.", otp });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    verifyOtp: async (req, res) => {
        try {
            const { email, otp } = req.body;
            const user = await Users.findOne({ email });

            if (!user) return res.status(400).json({ msg: "User not found." });

            if (user.otp !== otp || user.otpExpires < Date.now()) {
                return res.status(400).json({ msg: "Invalid or expired OTP." });
            }

            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            // Create access and refresh tokens
            const accesstoken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refreshtoken',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            });

            res.json({ accesstoken });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    setupProfile: async (req, res) => {
        try {
            const { name, age, gender } = req.body;
            const user = await Users.findById(req.user.id);

            if (!user) return res.status(400).json({ msg: "User not found." });

            user.name = name;
            user.age = age;
            user.gender = gender;
            user.isProfileComplete = true;
            await user.save();

            res.json({ msg: "Profile setup successful." });

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
    // Add a new address
    addAddress: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            // If this is the first address, make it default
            if (user.addresses.length === 0) {
                req.body.isDefault = true;
            }

            // If new address is set as default, unset any existing default
            if (req.body.isDefault) {
                user.addresses.forEach(addr => addr.isDefault = false);
            }

            user.addresses.push(req.body);
            await user.save();

            res.json({ msg: "Address added successfully", addresses: user.addresses });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // Get all addresses
    getAddresses: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            res.json(user.addresses);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // Update an address
    updateAddress: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            const addressIndex = user.addresses.findIndex(
                addr => addr._id.toString() === req.params.addressId
            );

            if (addressIndex === -1) {
                return res.status(404).json({ msg: "Address not found" });
            }

            // If updating to default, unset other defaults
            if (req.body.isDefault) {
                user.addresses.forEach(addr => addr.isDefault = false);
            }

            // Update the address
            user.addresses[addressIndex] = {
                ...user.addresses[addressIndex].toObject(),
                ...req.body
            };

            await user.save();
            res.json({ msg: "Address updated successfully", addresses: user.addresses });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // Delete an address
    deleteAddress: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            const addressIndex = user.addresses.findIndex(
                addr => addr._id.toString() === req.params.addressId
            );

            if (addressIndex === -1) {
                return res.status(404).json({ msg: "Address not found" });
            }

            // If deleting default address, make the first remaining address default
            const wasDefault = user.addresses[addressIndex].isDefault;
            user.addresses.splice(addressIndex, 1);
            
            if (wasDefault && user.addresses.length > 0) {
                user.addresses[0].isDefault = true;
            }

            await user.save();
            res.json({ msg: "Address deleted successfully", addresses: user.addresses });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    // Card Management
    addCard: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            const maskedCardNumber = req.body.cardNumber.replace(/\d(?=\d{4})/g, "*");
            
            if (user.cards.length === 0) {
                req.body.isDefault = true;
            }

            if (req.body.isDefault) {
                user.cards.forEach(card => card.isDefault = false);
            }

            user.cards.push({
                ...req.body,
                cardNumber: maskedCardNumber
            });
            await user.save();

            res.json({ msg: "Card added successfully", cards: user.cards });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteCard: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            const cardIndex = user.cards.findIndex(
                card => card._id.toString() === req.params.cardId
            );

            if (cardIndex === -1) {
                return res.status(404).json({ msg: "Card not found" });
            }

            // If deleting default card, make the first remaining card default
            const wasDefault = user.cards[cardIndex].isDefault;
            user.cards.splice(cardIndex, 1);
            
            if (wasDefault && user.cards.length > 0) {
                user.cards[0].isDefault = true;
            }

            await user.save();
            res.json({ msg: "Card deleted successfully", cards: user.cards });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    // UPI Management
    addUPI: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            // If this is the first UPI, make it default
            if (user.upis.length === 0) {
                req.body.isDefault = true;
            }

            // If new UPI is set as default, unset any existing default
            if (req.body.isDefault) {
                user.upis.forEach(upi => upi.isDefault = false);
            }

            user.upis.push(req.body);
            await user.save();

            res.json({ msg: "UPI added successfully", upis: user.upis });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteUPI: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            const upiIndex = user.upis.findIndex(
                upi => upi._id.toString() === req.params.upiId
            );

            if (upiIndex === -1) {
                return res.status(404).json({ msg: "UPI not found" });
            }

            // If deleting default UPI, make the first remaining UPI default
            const wasDefault = user.upis[upiIndex].isDefault;
            user.upis.splice(upiIndex, 1);
            
            if (wasDefault && user.upis.length > 0) {
                user.upis[0].isDefault = true;
            }

            await user.save();
            res.json({ msg: "UPI deleted successfully", upis: user.upis });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

// Utility functions
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Export the entire userController object
module.exports = userController;