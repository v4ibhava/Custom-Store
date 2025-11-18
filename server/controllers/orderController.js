const Orders = require('../models/orderModel');

const orderController = {
	getMyOrder: async (req, res) => {
		try {
			const order = await Orders.findOne({ _id: req.params.id, user: req.user.id });
			if (!order) return res.status(404).json({ msg: 'Order not found' });
			return res.json(order);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	listMine: async (req, res) => {
		try {
			const { status, paymentStatus } = req.query;
			const filter = { user: req.user.id };
			if (status) filter.status = status;
			if (paymentStatus) filter.paymentStatus = paymentStatus;
			const orders = await Orders.find(filter).sort({ createdAt: -1 });
			return res.json(orders);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	listAll: async (req, res) => {
		try {
			const { status, paymentStatus } = req.query;
			const filter = {};
			if (status) filter.status = status;
			if (paymentStatus) filter.paymentStatus = paymentStatus;
			const orders = await Orders.find(filter).sort({ createdAt: -1 }).populate('user', 'name email');
			return res.json(orders);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	updateStatus: async (req, res) => {
		try {
			const nextStatus = req.body.status;
			if (!nextStatus) return res.status(400).json({ msg: 'status is required' });
			const update = { status: nextStatus };
			if (nextStatus === 'Delivered') update.deliveredAt = new Date();
			const order = await Orders.findByIdAndUpdate(req.params.id, update, { new: true });
			if (!order) return res.status(404).json({ msg: 'Order not found' });
			return res.json(order);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	}
};

module.exports = orderController;


