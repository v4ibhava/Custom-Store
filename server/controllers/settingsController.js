const Settings = require('../models/settingsModel');

const getStoreSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings({
            razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
            razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
            supportEmail: process.env.EMAIL_USER || process.env.SMTP_USER || 'support@cakeavenue.com'
        });
        await settings.save();
    } else {
        // Fall back to .env if DB field is blank
        if (!settings.razorpayKeyId && process.env.RAZORPAY_KEY_ID) {
            settings.razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        }
        if (!settings.razorpayKeySecret && process.env.RAZORPAY_KEY_SECRET) {
            settings.razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
        }
    }
    return settings;
};

const settingsController = {
    getSettings: async (req, res) => {
        try {
            const settings = await getStoreSettings();
            // Mask secret key before sending to public/frontend
            const settingsObject = settings.toObject();
            if (settingsObject.razorpayKeySecret) {
                settingsObject.hasKeySecret = true;
                // Don't leak full secret key in GET requests
                delete settingsObject.razorpayKeySecret;
            }
            res.json(settingsObject);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateSettings: async (req, res) => {
        try {
            let settings = await Settings.findOne();
            if (!settings) {
                settings = new Settings(req.body);
            } else {
                Object.assign(settings, req.body);
            }

            await settings.save();
            res.json({ msg: "Store settings updated successfully.", settings });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getStoreSettings
};

module.exports = settingsController;
