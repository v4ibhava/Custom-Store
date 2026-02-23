import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import OTPInput from './OTPInput';
import { FiMail, FiArrowLeft, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';

function VerifyOTP({ email }) {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleOTPComplete = async (otpValue) => {
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/otp/verify', { email, otp: otpValue });
            localStorage.setItem('firstLogin', res.data.accesstoken);

            if (res.data.isNewUser && !res.data.isProfileComplete) {
                navigate('/add-info');
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Verification failed. Please check the code.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF9FB] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                {/* Back Button */}
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-pink-400 hover:text-pink-600 mb-8 transition-colors group">
                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to login
                </Link>

                <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(255,182,193,0.1)] border border-pink-50 overflow-hidden">
                    <div className="p-8 sm:p-10">
                        {/* Status Icon */}
                        <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                            <FiShield className="size-8 text-pink-500" />
                        </div>

                        {/* Title Section */}
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-black text-gray-900 mb-3">
                                Check Your Email
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed px-4">
                                We've sent a 6-digit verification code to
                                <span className="block font-bold text-gray-900 mt-1">{email || "your email"}</span>
                            </p>
                        </div>

                        <OTPInput
                            length={6}
                            onComplete={handleOTPComplete}
                            isLoading={isLoading}
                        />

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-600 text-sm border border-red-100"
                            >
                                <FiAlertTriangle className="shrink-0 size-5" />
                                <span className="font-semibold">{error}</span>
                            </motion.div>
                        )}

                        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                            <p className="text-sm text-gray-500">
                                Didn't receive the email?
                            </p>
                            <button
                                className="mt-2 text-sm font-bold text-pink-600 hover:text-pink-700 transition-colors cursor-pointer"
                                onClick={() => {/* Resend logic would go here if available */ }}
                            >
                                Click to resend
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-xs text-gray-400 font-medium tracking-wide flex items-center justify-center gap-2">
                    <FiMail className="size-3" />
                    SECURE VERIFICATION BY CAKE AVENUE
                </p>
            </motion.div>
        </div>
    );
}

export default VerifyOTP;
