import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import {
  FiShoppingBag, FiUser, FiMapPin, FiCreditCard,
  FiSmartphone, FiGift, FiStar, FiHeart,
  FiLogOut, FiChevronRight, FiGrid, FiBell, FiX, FiLock
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import OrderHistory from '../history/UserHistory';
import SavedUPI from './SavedUPI';
import SavedCards from './SavedCards';
import UserAddress from './useraddress/UserAddress';
import Wishlist from '../wishlist/Wishlist';
import Reviews from '../utils/reviews/Reviews';

const Profile = () => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [, setIsLogged] = state.userAPI.isLogged;
  const [, setIsAdmin] = state.userAPI.isAdmin;
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();
  const [token] = state.token;

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passFormData, setPassFormData] = useState({ otp: '', newPassword: '' });
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const requestPasswordOTP = async () => {
    setPassError('');
    setPassMsg('');
    try {
      setOtpLoading(true);
      const res = await axios.post('/user/request-password-otp', {}, {
        headers: { Authorization: token }
      });
      setPassMsg(res.data.msg);
      setOtpSent(true);
    } catch (err) {
      setPassError(err.response?.data?.msg || 'Error sending OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassMsg('');
    if (passFormData.newPassword.length < 6) return setPassError('Password must be at least 6 characters.');
    if (!passFormData.otp) return setPassError('Please enter the OTP sent to your email.');

    try {
      setPassLoading(true);
      const res = await axios.put('/user/change-password', passFormData, {
        headers: { Authorization: token }
      });
      setPassMsg(res.data.msg);
      setPassFormData({ otp: '', newPassword: '' });
      setOtpSent(false); // Reset flow
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) {
      setPassError(err.response?.data?.msg || 'Error changing password.');
    } finally {
      setPassLoading(false);
    }
  };

  const logoutUser = useCallback(async () => {
    try {
      await axios.get("/user/logout");
      localStorage.removeItem("firstLogin");
      setIsAdmin(false);
      setIsLogged(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  }, [setIsLogged, setIsAdmin, navigate]);

  const menuSections = [
    {
      title: 'Activity',
      items: [
        { id: 'profile', label: 'Overview', icon: FiGrid, color: 'text-blue-500 bg-blue-50' },
        { id: 'orders', label: 'Orders History', icon: FiShoppingBag, color: 'text-pink-500 bg-pink-50' },
      ]
    },
    {
      title: 'Saved Items',
      items: [
        { id: 'wishlist', label: 'Wishlist', icon: FiHeart, color: 'text-rose-500 bg-rose-50' },
        { id: 'reviews', label: 'My Reviews', icon: FiStar, color: 'text-amber-500 bg-amber-50' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { id: 'addresses', label: 'Addresses', icon: FiMapPin, color: 'text-emerald-500 bg-emerald-50' },
        { id: 'payments', label: 'Payments', icon: FiCreditCard, color: 'text-indigo-500 bg-indigo-50' },
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl font-black border border-white/30">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-black tracking-tight">{user?.name || 'Baker Enthusiast'}</h2>
                  <p className="text-pink-100 font-medium mt-1 opacity-90">{user?.email}</p>
                  <div className="flex gap-2 mt-4 flex-wrap justify-center md:justify-start">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                      {user?.role === 1 ? 'Admin privileges' : 'Preferred Customer'}
                    </span>
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                      Member since {new Date(user?.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Orders', value: '12', icon: FiShoppingBag, color: 'blue' },
                { label: 'Wishlist Items', value: state.userAPI.wishlist[0].length, icon: FiHeart, color: 'rose' },
                { label: 'Coupons', value: '04', icon: FiGift, color: 'amber' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                Account Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => { setShowPasswordModal(true); setPassMsg(''); setPassError(''); }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm"><FiUser className="text-gray-400 group-hover:text-pink-500 transition-colors" /></div>
                    <div className="text-left font-bold text-gray-700">Change Password</div>
                  </div>
                  <FiChevronRight className="text-gray-300" />
                </button>
                <button className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm"><FiBell className="text-gray-400 group-hover:text-pink-500" /></div>
                    <div className="text-left font-bold text-gray-700">Notifications Settings</div>
                  </div>
                  <FiChevronRight className="text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'orders': return <OrderHistory />;
      case 'addresses': return <UserAddress />;
      case 'payments':
        return (
          <div className="space-y-6">
            <SavedUPI />
            <SavedCards />
          </div>
        );
      case 'wishlist': return <Wishlist />;
      case 'reviews': return <Reviews />;
      default: return <div className="p-10 text-center">In development</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFA]">
      {/* Premium Sidebar */}
      <div className="w-full lg:w-80 bg-white border-b lg:border-r border-gray-100 flex flex-col transition-all relative z-10 lg:sticky lg:top-0 h-auto lg:h-screen">
        <div className="p-6 lg:p-10">
          <div className="flex items-center gap-4 mb-6 lg:mb-10">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-pink-200 shrink-0">
              CA
            </div>
            <span className="font-black text-xl tracking-tighter text-gray-900">Cake Avenue</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block space-y-8">
            {menuSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-4">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group
                        ${activeSection === item.id
                          ? 'bg-pink-600 text-white shadow-xl shadow-pink-100 ring-4 ring-pink-50'
                          : 'text-gray-500 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg transition-colors ${activeSection === item.id ? 'bg-white/20' : item.color}`}>
                          <item.icon className="size-4" />
                        </div>
                        <span className={`text-sm font-bold ${activeSection === item.id ? 'text-white' : 'text-gray-600'}`}>
                          {item.label}
                        </span>
                      </div>
                      {activeSection === item.id && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-white rounded-full shadow-lg" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile Navigation (Horizontal Scroll) */}
          <nav className="lg:hidden flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
            {menuSections.flatMap(section => section.items).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                      shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold whitespace-nowrap
                      ${activeSection === item.id
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-100 ring-2 ring-pink-50'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }
                    `}
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 lg:p-10 border-t border-gray-50 bg-white">
          <button
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 lg:gap-3 py-3 lg:py-4 bg-red-50 text-red-500 font-bold text-sm lg:text-base rounded-2xl hover:bg-red-100 hover:text-red-600 transition-all border border-transparent"
          >
            <FiLogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto lg:max-h-screen custom-scrollbar w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-8">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <FiX size={20} />
                </button>
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-pink-500">
                  <FiLock size={28} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Change Password</h3>
                <p className="text-gray-500 text-sm mb-6 font-medium">Create a new, strong password for your account.</p>

                {otpSent ? (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Enter OTP</label>
                      <input
                        type="text"
                        value={passFormData.otp}
                        onChange={e => setPassFormData({ ...passFormData, otp: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-4 focus:ring-pink-50 font-bold text-gray-900 transition-all placeholder:font-normal tracking-[0.3em] font-mono text-center"
                        placeholder="123456"
                        maxLength="6"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">New Password</label>
                      <input
                        type="password"
                        value={passFormData.newPassword}
                        onChange={e => setPassFormData({ ...passFormData, newPassword: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-4 focus:ring-pink-50 font-bold text-gray-900 transition-all placeholder:font-normal"
                        placeholder="••••••••"
                      />
                    </div>

                    {passError && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl">⚠️ {passError}</p>}
                    {passMsg && <p className="text-green-600 text-sm font-bold bg-green-50 p-3 rounded-xl">✅ {passMsg}</p>}

                    <button
                      type="submit"
                      disabled={passLoading}
                      className="w-full py-4 mt-4 bg-gray-900 text-white font-black rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-60"
                    >
                      {passLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-700 bg-gray-50 p-4 rounded-xl text-center">
                      Security Check: We need to verify it's you. Click the button below to receive an OTP directly to your registered email address.
                    </p>

                    {passError && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl">⚠️ {passError}</p>}
                    {passMsg && <p className="text-green-600 text-sm font-bold bg-green-50 p-3 rounded-xl">✅ {passMsg}</p>}

                    <button
                      onClick={requestPasswordOTP}
                      disabled={otpLoading}
                      className="w-full py-4 mt-4 bg-pink-600 text-white font-black rounded-xl hover:bg-pink-700 transition-all disabled:opacity-60 shadow-lg"
                    >
                      {otpLoading ? 'Sending Mail...' : 'Send OTP to Email'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
