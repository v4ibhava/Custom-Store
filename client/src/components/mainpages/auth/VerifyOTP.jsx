import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OTPInput from './OTPInput';

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

            // Check if user needs to complete profile
            if (res.data.isNewUser && !res.data.isProfileComplete) {
                navigate('/add-info');
            } else {
                window.location.href = "/";
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to verify OTP');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full animate-in slide-in-from-bottom-4 duration-700">
                {/* Card */}
                <div className="bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="p-8 sm:p-10">
                        {/* Title Section */}
                        <div className="text-center mb-6">
                            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                                Verify Your Email
                            </h2>
                            <p className="text-base font-semibold text-gray-600 mb-2">
                                We sent a code to
                            </p>
                            <p className="text-lg font-black text-pink-600 break-all">
                                {email}
                            </p>
                        </div>

                        <div className="divider text-xs font-bold text-gray-400">ENTER CODE</div>

                        <p className="text-center text-sm font-semibold text-gray-600 mb-2">
                            Enter the 6-digit code below
                        </p>
                        <p className="text-center text-xs font-bold text-pink-600 mb-4">
                            ✨ Auto-submits when complete
                        </p>

                        <OTPInput
                            length={6}
                            onComplete={handleOTPComplete}
                            isLoading={isLoading}
                        />

                        {error && (
                            <div className="alert alert-error shadow-lg animate-in slide-in-from-top-2 duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold">{error}</span>
                            </div>
                        )}

                        <div className="text-center mt-6 p-4 bg-gray-100 rounded-lg">
                            <p className="text-xs font-bold text-gray-600">
                                💡 Didn't receive the code?
                            </p>
                            <p className="text-xs font-semibold text-gray-500 mt-1">
                                Check your spam folder or request a new one
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;