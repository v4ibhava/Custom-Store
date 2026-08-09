import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import OTPInput from './OTPInput';
import { FiMail, FiArrowLeft, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { GlobalState } from '../../../GlobalState';

function VerifyOTP({ email }) {
    const state = useContext(GlobalState);
    const [settings] = state?.settingsAPI?.settings || [{}];
    const storeName = settings?.storeName || 'Cake Avenue';

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
            setError(err.response?.data?.msg || 'Verification failed.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center px-3 py-6">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-sm w-full"
            >
                <Link to="/login" className="inline-flex items-center text-xs font-medium text-pink-500 hover:text-pink-600 mb-4 transition-colors group">
                    <FiArrowLeft className="mr-1.5 group-hover:-translate-x-1 transition-transform size-3.5" />
                    Back to login
                </Link>

                <div className="bg-white rounded-2xl shadow-lg border border-pink-50/50 overflow-hidden">
                    <div className="p-5 sm:p-7">
                        <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-5 mx-auto">
                            <FiShield className="size-6 text-pink-500" />
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-xl font-black text-gray-900 mb-2">Check Your Email</h2>
                            <p className="text-gray-500 text-xs leading-relaxed px-2">
                                We sent a 6-digit code to
                                <span className="block font-bold text-gray-900 mt-0.5 text-sm">{email || "your email"}</span>
                            </p>
                        </div>

                        <OTPInput length={6} onComplete={handleOTPComplete} isLoading={isLoading} />

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-xs border border-red-100"
                            >
                                <FiAlertTriangle className="shrink-0 size-4" />
                                <span className="font-bold">{error}</span>
                            </motion.div>
                        )}

                        <div className="mt-6 pt-4 border-t border-pink-50 text-center">
                            <p className="text-xs text-gray-500">Didn't receive the email?</p>
                            <button className="mt-1 text-xs font-bold text-pink-600 hover:text-pink-700 cursor-pointer">
                                Click to resend
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-4 text-[10px] text-gray-400 font-medium tracking-wide flex items-center justify-center gap-1.5">
                    <FiMail className="size-3" />
                    SECURE VERIFICATION BY {storeName.toUpperCase()}

                </p>
            </motion.div>
        </div>
    );
}

export default VerifyOTP;
