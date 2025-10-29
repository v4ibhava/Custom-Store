const otpController = require('../controllers/otpController');
const router = require('express').Router();

router.post('/signup', otpController.signup);
router.post('/login', otpController.login);
router.post('/verify', otpController.verifyOtp);

module.exports = router;