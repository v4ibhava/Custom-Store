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
    },
    // Get UPIs
    getUPIs: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            // Add detailed logging
            console.log('User ID:', req.user.id);
            console.log('Full User Object:', user);
            console.log('UPIs Array:', user.upis);

            res.json({ 
                upis: user.upis || [],
                msg: "UPIs fetched successfully" 
            });
        } catch (err) {
            console.error('Error in getUPIs:', err);
            return res.status(500).json({ msg: err.message });
        }
    },
    // Get all cards
    getCards: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            console.log('Retrieved cards:', user.cards); // Debug log
            res.json({ cards: user.cards });
        } catch (err) {
            console.error('Error in getCards:', err);
            return res.status(500).json({ msg: err.message });
        }
    },
    // Add new card
    addCard: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            const { cardNumber, cardHolderName, expiryMonth, expiryYear, isDefault } = req.body;

            // Basic validation
            if (!cardNumber || !cardHolderName || !expiryMonth || !expiryYear) {
                return res.status(400).json({ msg: "Please fill in all card fields" });
            }

            // Mask card number (keep last 4 digits visible)
            const maskedCardNumber = cardNumber.replace(/\d(?=\d{4})/g, "*");

            // If this is the first card or isDefault is true, handle default logic
            if (user.cards.length === 0 || isDefault) {
                user.cards.forEach(card => card.isDefault = false);
            }

            const newCard = {
                cardNumber: maskedCardNumber,
                cardHolderName,
                expiryMonth,
                expiryYear,
                isDefault: user.cards.length === 0 ? true : isDefault
            };

            user.cards.push(newCard);
            await user.save();

            console.log('Card added successfully:', newCard); // Debug log
            res.json({ msg: "Card added successfully", cards: user.cards });
        } catch (err) {
            console.error('Error in addCard:', err);
            return res.status(500).json({ msg: err.message });
        }
    },
    addOrder: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            // Generate a simple order ID
            const orderId = 'ORD-' + Date.now();

            // Create order history entry
            const orderHistory = {
                orderId,
                items: req.body.cart.map(item => ({
                    productId: item._id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: req.body.total,
                date: new Date()
            };

            // Add to user's order history
            user.orderHistory.push(orderHistory);
            
            // Clear the user's cart
            user.cart = [];
            
            await user.save();

            res.json({ 
                msg: "Order placed successfully", 
                orderId,
                orderHistory 
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getOrderHistory: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id);
            if (!user) return res.status(404).json({ msg: "User not found" });

            res.json(user.orderHistory);
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
