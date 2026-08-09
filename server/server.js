const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Set reliable public DNS servers for MongoDB Atlas SRV resolution
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    console.warn('DNS server configuration warning:', e.message);
}
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

// Updated CORS configuration for Vercel & Render
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.startsWith('http://localhost') || origin.includes('vercel.app') || origin === process.env.CLIENT_URL) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Enable cookies to be sent with the request
}));

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Home route
app.get('/', (req, res) => {
    res.json({ msg: "This is the home page of the server" });
});

// Routes
app.use('/user', require('./routes/useRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/upload'));
app.use('/api/otp', require('./routes/otpRouter'));
app.use('/api/payment', require('./routes/paymentRouter'));
app.use('/api/orders', require('./routes/orderRouter'));
app.use('/api', require('./routes/reviewRouter'));
app.use('/api', require('./routes/couponRouter'));
app.use('/api', require('./routes/notificationRouter'));
app.use('/api', require('./routes/settingsRouter'));

// Connect MongoDB
const URI = process.env.MONGODB_URI;
mongoose.connect(URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log(err);
    });

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
