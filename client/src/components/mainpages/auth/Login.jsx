import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import { FiMail, FiLock, FiArrowRight, FiKey, FiSmartphone } from 'react-icons/fi';
import toast from 'react-hot-toast';

function Login({ setEmail: setParentEmail }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const state = useContext(GlobalState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');

        if (!email.trim()) {
            setError('Please enter your email');
            toast.error('Please enter your email');
            return;
        }

        if (loginMethod === 'password' && !password.trim()) {
            setError('Please enter your password');
            toast.error('Please enter your password');
            return;
        }

        setIsLoading(true);

        try {
            if (loginMethod === 'otp') {
                const res = await axios.post('/api/otp/login', { email });
                setMsg(res.data.msg);
                toast.success(res.data.msg);
                setParentEmail(email);
                setTimeout(() => navigate('/verify-otp'), 1000);
            } else {
                const res = await axios.post('/user/loginWithPassword', { email, password });
                toast.success('Login successful!');
                localStorage.setItem('firstLogin', true);
                window.location.href = '/';
            }
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Login failed';
            setError(errorMsg);
            toast.error(errorMsg);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🍰</span>
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2 mt-2 tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="text-sm font-medium text-gray-500">
                                Sign in to check out your sweet favorites
                            </p>
                        </div>

                        {/* TABS */}
                        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                            <button
                                type="button"
                                onClick={() => { setLoginMethod('password'); setError(''); setMsg(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${loginMethod === 'password' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FiKey className="size-4" /> Password
                            </button>
                            <button
                                type="button"
                                onClick={() => { setLoginMethod('otp'); setError(''); setMsg(''); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${loginMethod === 'otp' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <FiSmartphone className="size-4" /> OTP
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        placeholder="you@example.com"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-4 focus:ring-pink-50 font-bold text-gray-900 transition-all placeholder:font-normal"
                                    />
                                    <FiMail className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400 size-5" />
                                </div>
                            </div>

                            {loginMethod === 'password' && (
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required={loginMethod === 'password'}
                                            disabled={isLoading}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-4 focus:ring-pink-50 font-bold text-gray-900 transition-all placeholder:font-normal"
                                        />
                                        <FiLock className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400 size-5" />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-600 text-sm font-bold animate-pulse">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            {msg && (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3 text-green-600 text-sm font-bold">
                                    <span>✅</span> {msg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-4 border border-transparent rounded-2xl shadow-md font-black text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-100 disabled:opacity-60 transition-all group"
                            >
                                {isLoading ? 'Processing...' : (loginMethod === 'otp' ? 'Send OTP to Email' : 'Sign In Securely')}
                                {!isLoading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-8 border-t border-gray-100">
                            <p className="text-sm text-gray-500 font-medium">
                                New to Cake Avenue?{' '}
                                <Link to="/signup" className="font-extrabold text-pink-600 hover:text-pink-700 transition-colors">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;