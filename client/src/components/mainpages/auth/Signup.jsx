import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Signup({ setEmail: setParentEmail }) {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { setError('Please enter your email'); toast.error('Please enter your email'); return; }

        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/otp/signup', { email });
            setMsg(res.data.msg);
            toast.success(res.data.msg);
            setParentEmail(email);
            setTimeout(() => navigate('/verify-otp'), 1000);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to send OTP';
            setError(errorMsg);
            toast.error(errorMsg);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center px-3 py-6 sm:py-10">
            <div className="max-w-sm w-full">
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-pink-50/50">
                    <div className="p-5 sm:p-7">
                        <div className="text-center mb-5">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">🍰</span>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create Account</h2>
                            <p className="text-xs text-gray-500 mt-1">Join us and discover delicious cakes</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="your.email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2.5 bg-pink-50/30 border border-pink-100 rounded-xl text-sm focus:ring-2 focus:ring-pink-100 focus:border-pink-300 disabled:opacity-60"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-700 font-bold">
                                    ⚠️ {error}
                                </div>
                            )}

                            {msg && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 text-xs text-green-700 font-bold">
                                    ✅ {msg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2.5 rounded-xl shadow-sm text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 focus:ring-2 focus:ring-pink-100 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : 'Send OTP'}
                            </button>
                        </form>

                        <div className="mt-5 text-center pt-4 border-t border-pink-50">
                            <p className="text-xs text-gray-500">
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold text-pink-600 hover:text-pink-500">Login here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
