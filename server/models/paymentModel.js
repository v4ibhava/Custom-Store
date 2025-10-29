const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
	order: { type: mongoose.Schema.Types.ObjectId, ref: 'Orders', required: true },
	razorpayOrderId: { type: String, required: true },
	razorpayPaymentId: { type: String },
	razorpaySignature: { type: String },
	amount: { type: Number, required: true },
	currency: { type: String, default: 'INR' },
	status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
	mode: { type: String },
	notes: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Payments', paymentSchema);


