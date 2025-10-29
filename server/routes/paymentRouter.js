const router = require('express').Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Public endpoint to expose Razorpay key_id to the client
router.get('/config', paymentController.getPublicKey);

router.post('/order', auth, paymentController.createOrder);
router.post('/verify', auth, paymentController.verifyPayment);

module.exports = router;
