import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import { FiMail, FiLock, FiArrowRight, FiKey, FiSmartphone } from 'react-icons/fi';

function Login({ setEmail: setParentEmail }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState('password');
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const state = useContext(GlobalState);
    const [settings] = state?.settingsAPI?.settings || [{}];
    const storeName = settings?.storeName || 'Cake Avenue';


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMsg('');

        if (!email.trim()) { setError('Please enter your email'); return; }
        if (loginMethod === 'password' && !password.trim()) { setError('Please enter your password'); return; }

        setIsLoading(true);
        try {
            if (loginMethod === 'otp') {
                const res = await axios.post('/api/otp/login', { email });
                setMsg(res.data.msg);
                setParentEmail(email);
                setTimeout(() => navigate('/verify-otp'), 1000);
            } else {
                await axios.post('/user/loginWithPassword', { email, password });
                localStorage.setItem('firstLogin', true);
                window.location.href = '/';
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed');
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
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
                            <p className="text-xs text-gray-500 mt-1">Sign in to your sweet favorites</p>
                        </div>

                        {/* TABS */}
                        <div className="flex bg-pink-50/50 rounded-xl p-0.5 mb-5">
                            <button
                                type="button"
                                onClick={() => { setLoginMethod('password'); setError(''); setMsg(''); }}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${loginMethod === 'password' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                            >
                                <FiKey className="size-3" /> Password
                            </button>
                            <button
                                type="button"
                                onClick={() => { setLoginMethod('otp'); setError(''); setMsg(''); }}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${loginMethod === 'otp' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                            >
                                <FiSmartphone className="size-3" /> OTP
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-3 py-2.5 bg-pink-50/30 border border-pink-100 rounded-xl text-sm focus:ring-2 focus:ring-pink-100 font-bold text-gray-900 placeholder:font-normal"
                                    />
                                    <FiMail className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400 size-4" />
                                </div>
                            </div>

                            {loginMethod === 'password' && (
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-3 py-2.5 bg-pink-50/30 border border-pink-100 rounded-xl text-sm focus:ring-2 focus:ring-pink-100 font-bold text-gray-900 placeholder:font-normal"
                                        />
                                        <FiLock className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400 size-4" />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-red-600 text-xs font-bold">
                                    ⚠️ {error}
                                </div>
                            )}

                            {msg && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 text-green-600 text-xs font-bold">
                                    ✅ {msg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl shadow-sm font-bold text-white bg-pink-600 hover:bg-pink-700 focus:ring-2 focus:ring-pink-100 disabled:opacity-60 transition-all text-sm group"
                            >
                                {isLoading ? 'Processing...' : (loginMethod === 'otp' ? 'Send OTP' : 'Sign In')}
                                {!isLoading && <FiArrowRight className="group-hover:translate-x-1 transition-transform size-4" />}
                            </button>
                        </form>

                        <div className="mt-5 text-center pt-4 border-t border-pink-50">
                            <p className="text-xs text-gray-500">
                                New to {storeName}?{' '}
                                <Link to="/signup" className="font-extrabold text-pink-600 hover:text-pink-700">Create Account</Link>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
