const Reviews = require('../models/reviewModel');
const Users = require('../models/userModel');

const reviewController = {
    getReviews: async (req, res) => {
        try {
            const reviews = await Reviews.find().populate('user', 'name email');
            res.json(reviews);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getProductReviews: async (req, res) => {
        try {
            const reviews = await Reviews.find({ product: req.params.id }).populate('user', 'name email');
            res.json(reviews);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createReview: async (req, res) => {
        try {
            const { product, rating, comment } = req.body;
            const user = await Users.findById(req.user.id);

            if (!user) return res.status(400).json({ msg: "User does not exist." });

            const newReview = new Reviews({
                user: req.user.id,
                product,
                rating,
                comment,
                userName: user.name || 'Anonymous'
            });

            await newReview.save();
            res.json({ msg: "Review created successfully." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteReview: async (req, res) => {
        try {
            const review = await Reviews.findById(req.params.id);
            if (!review) return res.status(400).json({ msg: "Review not found." });

            const user = await Users.findById(req.user.id);
            // Allow user to delete their own review OR admin to delete any review
            if (review.user.toString() !== req.user.id && user.role !== 1) {
                return res.status(400).json({ msg: "Unauthorized." });
            }

            await Reviews.findByIdAndDelete(req.params.id);
            res.json({ msg: "Review deleted." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = reviewController;
