const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router.route('/reviews')
    .get(reviewController.getReviews)
    .post(auth, reviewController.createReview);

router.route('/reviews/:id')
    .delete(auth, reviewController.deleteReview);

router.get('/product_reviews/:id', reviewController.getProductReviews);

module.exports = router;
