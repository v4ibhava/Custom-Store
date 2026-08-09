const Notifications = require('../models/notificationModel');

const notificationController = {
    getNotifications: async (req, res) => {
        try {
            const notifications = await Notifications.find({ user: req.user.id }).sort({ createdAt: -1 });
            res.json(notifications);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    markAsRead: async (req, res) => {
        try {
            const notification = await Notifications.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id },
                { read: true },
                { new: true }
            );
            if (!notification) return res.status(404).json({ msg: "Notification not found." });
            res.json({ msg: "Marked as read.", notification });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createUserNotification: async (userId, type, message) => {
        try {
            const newNotification = new Notifications({
                user: userId,
                type: type || 'GENERAL',
                message
            });
            await newNotification.save();
            return newNotification;
        } catch (err) {
            console.error("Error creating user notification:", err);
        }
    }
};

module.exports = notificationController;
