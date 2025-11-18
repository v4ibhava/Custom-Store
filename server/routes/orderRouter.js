const router = require('express').Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const orderController = require('../controllers/orderController');

// Customer
router.get('/my', auth, orderController.listMine);
router.get('/:id', auth, orderController.getMyOrder);

// Admin
router.get('/', auth, authAdmin, orderController.listAll);
router.patch('/:id/status', auth, authAdmin, orderController.updateStatus);

module.exports = router;


