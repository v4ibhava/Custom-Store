const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
});

const cardSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
    },
    cardHolderName: {
        type: String,
        required: true,
    },
    expiryMonth: {
        type: String,
        required: true,
    },
    expiryYear: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
});

const upiSchema = new mongoose.Schema({
    upiId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    }
});

const orderHistorySchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    items: [{
        productId: String,
        title: String,
        price: Number,
        quantity: Number
    }],
    total: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0,
    },
    cart: {
        type: Array,
        default: [],
    },
    addresses: [addressSchema],
    cards: [cardSchema],
    upis: [upiSchema],
    orderHistory: [orderHistorySchema]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Users', userSchema);
