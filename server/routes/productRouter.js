const router = require('express').Router();
const productController = require('../controllers/productController');

router
.route('/products')
.get(productController.getProduct)
.post(productController.createProduct)

router
.route('/products/:id')
.get(productController.getProductById)
.delete(productController.deleteProduct)
.put(productController.updateProduct)

module.exports = router;