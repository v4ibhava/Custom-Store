const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

// Updated CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Frontend's origin
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

// Connect MongoDB
const URI = process.env.MONGODB_URL;
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
