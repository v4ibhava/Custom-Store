import React, { useState } from 'react';
import axios from 'axios';

function AddInfo() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: ''
    });
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { name, age, gender } = formData;

    const onChange = (e) => {
        const { name, value } = e.target;
        if (name === 'age') {
            // Only allow numbers and limit to 3 digits
            const numValue = value.replace(/\D/g, '').slice(0, 3);
            setFormData({ ...formData, [name]: numValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) {
            setError('Please enter your full name');
            return;
        }
        if (!age || age < 13 || age > 120) {
            setError('Please enter a valid age (13-120)');
            return;
        }
        if (!gender) {
            setError('Please select your gender');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('firstLogin');
            const res = await axios.put('/user/setup-profile', formData, {
                headers: { Authorization: token }
            });
            setMsg(res.data.msg);
            // Redirect after a short delay to show success message
            setTimeout(() => {
                window.location.href = "/";
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to setup profile');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center px-4 py-12 animate-in fade-in duration-500">
            <div className="max-w-md w-full animate-in slide-in-from-bottom-4 duration-700">
                {/* Card */}
                <div className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                    <div className="card-body p-8 sm:p-10">
                        {/* Title Section */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
                                Complete Your Profile
                            </h2>
                            <p className="text-base font-semibold text-gray-600">
                                Help us personalize your experience 🎉
                            </p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="form-control">
                                <label htmlFor="name" className="label">
                                    <span className="label-text text-base font-bold text-gray-800">
                                        Full Name *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="John Doe"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                    disabled={isLoading}
                                    className="input input-bordered input-lg w-full font-medium text-gray-900 focus:input-primary focus:scale-[1.02] transition-all duration-200 disabled:opacity-60"
                                />
                            </div>

                            <div className="form-control">
                                <label htmlFor="age" className="label">
                                    <span className="label-text text-base font-bold text-gray-800">
                                        Age *
                                    </span>
                                </label>
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
                                    className="input input-bordered input-lg w-full font-medium text-gray-900 focus:input-primary focus:scale-[1.02] transition-all duration-200 disabled:opacity-60"
                                />
                                {age && (age < 13 || age > 120) && (
                                    <label className="label">
                                        <span className="label-text-alt text-error font-bold animate-in slide-in-from-left-2 duration-200">
                                            ⚠️ Age must be between 13 and 120
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label htmlFor="gender" className="label">
                                    <span className="label-text text-base font-bold text-gray-800">
                                        Gender *
                                    </span>
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={gender}
                                    onChange={onChange}
                                    required
                                    disabled={isLoading}
                                    className="select select-bordered select-lg w-full font-medium text-gray-900 focus:select-primary focus:scale-[1.02] transition-all duration-200 disabled:opacity-60"
                                >
                                    <option value="">Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>

                            {error && (
                                <div className="alert alert-error shadow-lg animate-in slide-in-from-top-2 duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-semibold">{error}</span>
                                </div>
                            )}

                            {msg && (
                                <div className="alert alert-success shadow-lg animate-in slide-in-from-top-2 duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-semibold">{msg}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn btn-primary btn-lg w-full text-base font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Setting up...
                                    </>
                                ) : (
                                    'Complete Profile'
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-6 p-4 bg-base-200 rounded-lg">
                            <p className="text-xs font-bold text-gray-600">
                                🔒 Your information is safe with us
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddInfo;