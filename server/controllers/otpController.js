const Users = require('../models/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const sendOtpEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Cake Avenue',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
                    <p style="color: #666; font-size: 16px;">
                        Your OTP for accessing your account is:
                    </p>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        This OTP is valid for 10 minutes. Do not share this code with anyone.
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        If you didn't request this OTP, please ignore this email.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email. Please check your email configuration.');
    }
};

const otpController = {
    signup: async (req, res) => {
        try {
            const { email } = req.body;
            let user = await Users.findOne({ email });

            if (user && user.isVerified) {
                return res.status(400).json({ msg: "User already exists and is verified." });
            }

            const otp = crypto.randomInt(100000, 999999).toString();
            console.log('Generated OTP for signup:', { email, otp, otpType: typeof otp });

            if (!user) {
                user = new Users({ email });
            }

            user.otp = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();

            console.log('OTP saved to database:', { email, savedOtp: user.otp, expiresAt: new Date(user.otpExpires) });

            await sendOtpEmail(email, otp);

            res.json({ msg: "OTP sent to your email." });

        } catch (err) {
            console.error('Signup error:', err);
            return res.status(500).json({ msg: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await Users.findOne({ email });

            if (!user || !user.isVerified) {
                return res.status(400).json({ msg: "User not found or not verified. Please sign up." });
            }

            const otp = crypto.randomInt(100000, 999999).toString();
            console.log('Generated OTP for login:', { email, otp, otpType: typeof otp });

            user.otp = otp;
            user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
            await user.save();

            console.log('OTP saved to database:', { email, savedOtp: user.otp, expiresAt: new Date(user.otpExpires) });

            await sendOtpEmail(email, otp);

            res.json({ msg: "OTP sent to your email." });

        } catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ msg: err.message });
        }
    },

    verifyOtp: async (req, res) => {
        try {
            const { email, otp } = req.body;

            // Enhanced logging for debugging
            console.log('OTP Verification Request:', { email, otp, otpType: typeof otp });

            // First, find the user by email
            const user = await Users.findOne({ email });

            if (!user) {
                console.log('User not found:', email);
                return res.status(400).json({ msg: "User not found." });
            }

            // Log stored OTP details
            console.log('Stored OTP Details:', {
                storedOtp: user.otp,
                storedOtpType: typeof user.otp,
                otpExpires: user.otpExpires,
                currentTime: Date.now(),
                isExpired: user.otpExpires < Date.now()
            });

            // Check if OTP has expired
            if (!user.otpExpires || user.otpExpires < Date.now()) {
                console.log('OTP has expired');
                return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
            }

            // Check if OTP matches (trim whitespace and convert to string)
            const submittedOtp = String(otp).trim();
            const storedOtp = String(user.otp).trim();

            console.log('OTP Comparison:', {
                submittedOtp,
                storedOtp,
                match: submittedOtp === storedOtp
            });

            if (submittedOtp !== storedOtp) {
                console.log('OTP mismatch');
                return res.status(400).json({ msg: "Invalid OTP. Please check and try again." });
            }

            // OTP is valid - proceed with verification
            console.log('OTP verified successfully for:', email);

            const isNewUser = !user.isVerified;
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            const accesstoken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refreshtoken',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                sameSite: 'none',
                secure: true
            });

            res.json({
                accesstoken,
                isNewUser,
                isProfileComplete: user.isProfileComplete
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = otpController;