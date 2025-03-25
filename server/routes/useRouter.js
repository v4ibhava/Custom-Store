const userController = require('../controllers/userControl');
const auth = require('../middleware/auth');
const router = require('express').Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/refreshtoken', userController.refreshtoken);
router.get('/logout', userController.logout);
router.get('/information', auth, userController.getUser);

// Cart routes
router.put('/cart', auth, userController.saveCart);
router.get('/cart', auth, userController.getCart);

module.exports = router;
