const Coupons = require('../models/couponModel');

const couponController = {
    getCoupons: async (req, res) => {
        try {
            const coupons = await Coupons.find().sort({ createdAt: -1 });
            res.json(coupons);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createCoupon: async (req, res) => {
        try {
            const { code, type, value, minOrder, maxDiscount, usageLimit, validFrom, validUntil, isActive } = req.body;
            
            if (!code || value === undefined) {
                return res.status(400).json({ msg: "Please fill in all required fields." });
            }

            const existingCoupon = await Coupons.findOne({ code: code.toUpperCase() });
            if (existingCoupon) {
                return res.status(400).json({ msg: "Coupon code already exists." });
            }

            const newCoupon = new Coupons({
                code: code.toUpperCase(),
                type,
                value,
                minOrder,
                maxDiscount,
                usageLimit,
                validFrom: validFrom ? new Date(validFrom) : Date.now(),
                validUntil: validUntil ? new Date(validUntil) : null,
                isActive: isActive !== undefined ? isActive : true
            });

            await newCoupon.save();
            res.json({ msg: "Coupon created successfully.", coupon: newCoupon });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateCoupon: async (req, res) => {
        try {
            const updateData = { ...req.body };
            if (updateData.code) {
                updateData.code = updateData.code.toUpperCase();
            }
            if (updateData.validFrom) {
                updateData.validFrom = new Date(updateData.validFrom);
            }
            if (updateData.validUntil) {
                updateData.validUntil = new Date(updateData.validUntil);
            }

            const coupon = await Coupons.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!coupon) return res.status(404).json({ msg: "Coupon not found." });

            res.json({ msg: "Coupon updated successfully.", coupon });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteCoupon: async (req, res) => {
        try {
            const coupon = await Coupons.findByIdAndDelete(req.params.id);
            if (!coupon) return res.status(404).json({ msg: "Coupon not found." });

            res.json({ msg: "Coupon deleted successfully." });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = couponController;
