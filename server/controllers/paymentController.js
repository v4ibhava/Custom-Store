const Razorpay = require('razorpay');
const crypto = require('crypto');
const Orders = require('../models/orderModel');
const Payments = require('../models/paymentModel');

const razorpayInstance = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentController = {
	getPublicKey: (req, res) => {
		try {
			const key = process.env.RAZORPAY_KEY_ID || '';
			if (!key) return res.status(500).json({ msg: 'Razorpay key is not configured on the server' });
			return res.json({ key });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	createOrder: async (req, res) => {
		try {
			const { amount, currency = 'INR', receipt = undefined, items, address } = req.body;
			if (!amount || !items || !address) {
				return res.status(400).json({ msg: 'amount, items and address are required' });
			}

			const options = { amount: Math.round(amount * 100), currency, receipt };
			const razorpayOrder = await razorpayInstance.orders.create(options);

			const newOrder = await Orders.create({
				user: req.user.id,
				items,
				amount,
				currency,
				address,
				razorpayOrderId: razorpayOrder.id,
				status: 'Pending',
				paymentStatus: 'created'
			});

			await Payments.create({
				order: newOrder._id,
				razorpayOrderId: razorpayOrder.id,
				amount,
				currency,
				status: 'created'
			});

			return res.json({ order: razorpayOrder, dbOrderId: newOrder._id });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},

	verifyPayment: async (req, res) => {
		try {
			const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
			if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
				return res.status(400).json({ msg: 'Missing Razorpay verification fields' });
			}

			const signatureData = razorpay_order_id + '|' + razorpay_payment_id;
			const expectedSignature = crypto
				.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
				.update(signatureData)
				.digest('hex');

			const isValid = expectedSignature === razorpay_signature;
			if (!isValid) {
				await Payments.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: 'failed' });
				await Orders.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { paymentStatus: 'failed' });
				return res.status(400).json({ msg: 'Invalid payment signature' });
			}

			// Fetch payment details to get mode and status
			let paymentInfo = null;
			try {
				paymentInfo = await razorpayInstance.payments.fetch(razorpay_payment_id);
			} catch (_) {}

			const paymentMode = paymentInfo?.method;
			let paymentStatus = 'pending';
			if (paymentInfo) {
				if (paymentInfo.status === 'captured' || paymentInfo.status === 'authorized') {
					paymentStatus = 'paid';
				} else {
					paymentStatus = paymentInfo.status || 'pending';
				}
			}

			const updatedOrder = await Orders.findOneAndUpdate(
				{ razorpayOrderId: razorpay_order_id },
				{
					razorpayPaymentId: razorpay_payment_id,
					razorpaySignature: razorpay_signature,
					paymentStatus,
					paymentMode,
					status: paymentStatus === 'paid' ? 'Processing' : 'Pending'
				},
				{ new: true }
			);

			await Payments.findOneAndUpdate(
				{ razorpayOrderId: razorpay_order_id },
				{
					razorpayPaymentId: razorpay_payment_id,
					razorpaySignature: razorpay_signature,
					status: paymentStatus,
					mode: paymentMode,
					notes: paymentInfo?.notes
				}
			);

			return res.json({ msg: 'Payment verified', order: updatedOrder });
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	}
};

module.exports = paymentController;


