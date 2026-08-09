const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Branding & General Info
    storeName: {
        type: String,
        default: 'Cake Avenue'
    },
    tagline: {
        type: String,
        default: 'Handcrafted Fresh Baked Delights'
    },
    logoUrl: {
        type: String,
        default: ''
    },
    supportEmail: {
        type: String,
        default: 'support@cakeavenue.com'
    },
    supportPhone: {
        type: String,
        default: '+91 98765 43210'
    },
    address: {
        type: String,
        default: '123 Bakery Lane, Sweet City'
    },
    googleMapsUrl: {
        type: String,
        default: ''
    },
    googleMapsText: {
        type: String,
        default: 'View Store on Google Maps'
    },
    currencySymbol: {
        type: String,
        default: '₹'
    },
    currencyCode: {
        type: String,
        default: 'INR'
    },

    // Color Theme — accent palette only (all light-mode colors)
    colorTheme: {
        type: String,
        enum: ['blush', 'ocean', 'emerald'],
        default: 'blush'
    },
    // UI Style — shape language (curvy = rounded, edgy = sharp)
    uiStyle: {
        type: String,
        enum: ['curvy', 'edgy'],
        default: 'curvy'
    },
    // Dark Mode — separate from color theme
    darkMode: {
        type: Boolean,
        default: false
    },



    // Photo & Media Storage Settings (Cloudinary)

    cloudinaryCloudName: {
        type: String,
        default: ''
    },
    cloudinaryApiKey: {
        type: String,
        default: ''
    },
    cloudinaryApiSecret: {
        type: String,
        default: ''
    },
    cloudinaryFolder: {
        type: String,
        default: 'cake-avenue'
    },

    // Payment Gateway Settings

    razorpayKeyId: {
        type: String,
        default: ''
    },
    razorpayKeySecret: {
        type: String,
        default: ''
    },
    isRazorpayEnabled: {
        type: Boolean,
        default: true
    },
    isCodEnabled: {
        type: Boolean,
        default: true
    },

    // Shipping & Order Rules
    minOrderAmount: {
        type: Number,
        default: 0
    },
    flatDeliveryFee: {
        type: Number,
        default: 0
    },
    freeDeliveryThreshold: {
        type: Number,
        default: 500
    },

    // Feature Toggles
    isMaintenanceMode: {
        type: Boolean,
        default: false
    },
    isOtpVerificationEnabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
