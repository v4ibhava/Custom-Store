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

// New address routes
router.get('/addresses', auth, userController.getAddresses);
router.post('/address', auth, userController.addAddress);
router.put('/address/:addressId', auth, userController.updateAddress);
router.delete('/address/:addressId', auth, userController.deleteAddress);

// Card routes
router.get('/cards', auth, userController.getCards);
router.post('/card', auth, userController.addCard);
router.delete('/card/:cardId', auth, userController.deleteCard);

// UPI routes
router.get('/upi', auth, userController.getUPIs);
router.post('/upi', auth, userController.addUPI);
router.delete('/upi/:upiId', auth, userController.deleteUPI);

// Order routes
router.post('/order', auth, userController.addOrder);
router.get('/order-history', auth, userController.getOrderHistory);

module.exports = router;
