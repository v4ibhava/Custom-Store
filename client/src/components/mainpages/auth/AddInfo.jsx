import React, { useState } from 'react';
import axios from 'axios';

function AddInfo() {
    const [formData, setFormData] = useState({ name: '', age: '', gender: '' });
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { name, age, gender } = formData;

    const onChange = (e) => {
        const { name, value } = e.target;
        if (name === 'age') {
            setFormData({ ...formData, [name]: value.replace(/\D/g, '').slice(0, 3) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setError('Please enter your full name'); return; }
        if (!age || age < 13 || age > 120) { setError('Please enter a valid age (13-120)'); return; }
        if (!gender) { setError('Please select your gender'); return; }

        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('firstLogin');
            const res = await axios.put('/user/setup-profile', formData, {
                headers: { Authorization: token }
            });
            setMsg(res.data.msg);
            setTimeout(() => { window.location.href = "/"; }, 1500);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to setup profile');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center px-3 py-6">
            <div className="max-w-sm w-full">
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-pink-50/50">
                    <div className="p-5 sm:p-7">
                        <div className="text-center mb-5">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl">🎉</span>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Complete Profile</h2>
                            <p className="text-xs text-gray-500 mt-1">Help us personalize your experience</p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-3">
                            <div>
                                <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="John Doe"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2.5 bg-pink-50/30 border border-pink-100 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-pink-100 disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label htmlFor="age" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Age *</label>
                                <input
                                    type="text"
                                    id="age"
                                    placeholder="25"
                                    name="age"
                                    value={age}
                                    onChange={onChange}
                                    required
                                    disabled={isLoading}
                                    inputMode="numeric"
                                    className="w-full px-3 py-2.5 bg-pink-50/30 border border-pink-100 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-pink-100 disabled:opacity-60"
                                />
                                {age && (age < 13 || age > 120) && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1">Age must be between 13 and 120</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="gender" className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Gender *</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={gender}
                                    onChange={onChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2.5 bg-pink-50/30 border border-pink-100 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-pink-100 disabled:opacity-60"
                                >
                                    <option value="">Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs font-bold text-red-700">
                                    ⚠️ {error}
                                </div>
                            )}

                            {msg && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 text-xs font-bold text-green-700">
                                    ✅ {msg}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 mt-1 rounded-xl text-sm font-bold text-white bg-pink-600 hover:bg-pink-700 focus:ring-2 focus:ring-pink-100 disabled:opacity-60 transition-all shadow-sm"
                            >
                                {isLoading ? 'Setting up...' : 'Complete Profile'}
                            </button>
                        </form>

                        <p className="text-center mt-4 text-[10px] text-gray-400 font-medium">
                            🔒 Your information is safe with us
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddInfo;
