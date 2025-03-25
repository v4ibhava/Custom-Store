const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Fixed typo: 'require' -> 'required'
    },
    email: {
        type: String,
        unique: true,
        required: true, // Added required since email is essential
    },
    password: {
        type: String,
        required: true, // Fixed typo: 'require' -> 'required'
    },
    role: {
        type: Number,
        default: 0, // 0 for normal user, 1 for admin
    },
    cart: {
        type: Array,
        default: [], // Cart defaults to an empty array
    },
}, {
    timestamps: true, // Fixed typo: 'Timestamp' -> 'timestamps'
});

module.exports = mongoose.model('Users', userSchema);
