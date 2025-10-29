const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Products',
		required: true
	},
	name: { type: String, required: true },
	price: { type: Number, required: true },
	quantity: { type: Number, required: true },
	image: { type: String }
});

const deliveryAddressSchema = new mongoose.Schema({
	street: { type: String, required: true },
	city: { type: String, required: true },
	state: { type: String, required: true },
	postalCode: { type: String, required: true },
	country: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
	items: [orderItemSchema],
	amount: { type: Number, required: true },
	currency: { type: String, default: 'INR' },
	address: { type: deliveryAddressSchema, required: true },
	status: {
		type: String,
		enum: ['Pending', 'Processing', 'Packed', 'Out for Delivery', 'Delivered'],
		default: 'Pending'
	},
	razorpayOrderId: { type: String },
	razorpayPaymentId: { type: String },
	razorpaySignature: { type: String },
	paymentStatus: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
	paymentMode: { type: String },
	placedAt: { type: Date, default: Date.now },
	deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Orders', orderSchema);


