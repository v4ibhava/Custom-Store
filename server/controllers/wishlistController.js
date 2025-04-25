const Wishlist = require('../models/wishlistModel');

const wishlistController = {
    getWishlist: async (req, res) => {
        try {
            const wishlist = await Wishlist.findOne({ user: req.user.id })
                .populate('products');
            
            if (!wishlist) {
                return res.json({ products: [] });
            }
            
            res.json({ products: wishlist.products });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    addToWishlist: async (req, res) => {
        try {
            const { productId } = req.body;
            
            let wishlist = await Wishlist.findOne({ user: req.user.id });
            
            if (!wishlist) {
                wishlist = new Wishlist({
                    user: req.user.id,
                    products: [productId]
                });
            } else {
                if (!wishlist.products.includes(productId)) {
                    wishlist.products.push(productId);
                }
            }
            
            await wishlist.save();
            res.json({ msg: "Added to wishlist" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    removeFromWishlist: async (req, res) => {
        try {
            const { productId } = req.params;
            
            const wishlist = await Wishlist.findOne({ user: req.user.id });
            
            if (!wishlist) {
                return res.status(400).json({ msg: "Wishlist not found" });
            }
            
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
            await wishlist.save();
            
            res.json({ msg: "Removed from wishlist" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = wishlistController;