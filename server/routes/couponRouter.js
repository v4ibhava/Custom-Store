const router = require('express').Router();
const couponController = require('../controllers/couponController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router.route('/coupons')
    .get(couponController.getCoupons)
    .post(auth, authAdmin, couponController.createCoupon);

router.route('/coupons/:id')
    .put(auth, authAdmin, couponController.updateCoupon)
    .delete(auth, authAdmin, couponController.deleteCoupon);

module.exports = router;
