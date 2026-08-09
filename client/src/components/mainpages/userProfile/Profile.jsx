import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import {
  FiShoppingBag, FiUser, FiMapPin, FiCreditCard,
  FiGift, FiStar, FiHeart,
  FiLogOut, FiChevronRight, FiGrid, FiBell, FiX, FiLock, FiTag
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

  const [settings] = state?.settingsAPI?.settings || [{}];
  const storeName = settings?.storeName || 'Cake Avenue';

  const getInitials = (name) => {
    if (!name) return 'CA';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  const initials = getInitials(storeName);


  const [coupons, setCoupons] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const activeCouponsCount = coupons.filter(c => c.isActive).length;
  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  React.useEffect(() => {
    if (token) {
      axios.get('/api/coupons').then(res => setCoupons(res.data)).catch(console.error);
      axios.get('/api/notifications', { headers: { Authorization: token } }).then(res => setNotifications(res.data)).catch(console.error);
    }
  }, [token]);

  const markNotifAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`, {}, { headers: { Authorization: token } });
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passFormData, setPassFormData] = useState({ otp: '', newPassword: '' });
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const requestPasswordOTP = async () => {
    setPassError(''); setPassMsg('');
    try {
      setOtpLoading(true);
      const res = await axios.post('/user/request-password-otp', {}, { headers: { Authorization: token } });
      setPassMsg(res.data.msg);
      setOtpSent(true);
    } catch (err) { setPassError(err.response?.data?.msg || 'Error sending OTP.'); }
    finally { setOtpLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError(''); setPassMsg('');
    if (passFormData.newPassword.length < 6) return setPassError('Password must be at least 6 characters.');
    if (!passFormData.otp) return setPassError('Please enter the OTP.');
    try {
      setPassLoading(true);
      const res = await axios.put('/user/change-password', passFormData, { headers: { Authorization: token } });
      setPassMsg(res.data.msg);
      setPassFormData({ otp: '', newPassword: '' });
      setOtpSent(false);
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err) { setPassError(err.response?.data?.msg || 'Error changing password.'); }
    finally { setPassLoading(false); }
  };

  const logoutUser = useCallback(async () => {
    try {
      await axios.get("/user/logout");
      localStorage.removeItem("firstLogin");
      setIsAdmin(false);
      setIsLogged(false);
      navigate("/");
    } catch (err) { console.error("Logout failed:", err.message); }
  }, [setIsLogged, setIsAdmin, navigate]);

  const menuSections = [
    {
      title: 'Activity',
      items: [
        { id: 'profile', label: 'Overview', icon: FiGrid, color: 'text-blue-500 bg-blue-50' },
        { id: 'orders', label: 'Orders', icon: FiShoppingBag, color: 'text-pink-500 bg-pink-50' },
      ]
    },
    {
      title: 'Saved',
      items: [
        { id: 'wishlist', label: 'Wishlist', icon: FiHeart, color: 'text-rose-500 bg-rose-50' },
        { id: 'reviews', label: 'Reviews', icon: FiStar, color: 'text-amber-500 bg-amber-50' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'addresses', label: 'Addresses', icon: FiMapPin, color: 'text-emerald-500 bg-emerald-50' },
      ]
    },
    {
      title: 'More',
      items: [
        { id: 'coupons', label: 'Coupons', icon: FiTag, color: 'text-pink-600 bg-[#F3E4C9]', hasNotification: activeCouponsCount > 0 },
        { id: 'notifications', label: 'Alerts', icon: FiBell, color: 'text-amber-600 bg-amber-50', hasNotification: unreadNotifCount > 0 }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black border border-white/30">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-3xl font-black tracking-tight">{user?.name || 'Baker Enthusiast'}</h2>
                  <p className="text-pink-100 font-medium text-sm mt-0.5 opacity-90">{user?.email}</p>
                  <div className="flex gap-2 mt-3 flex-wrap justify-center sm:justify-start">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {(user?.role === 'admin' || user?.role === 1) ? 'Admin' : 'Preferred Customer'}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Since {new Date(user?.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { label: 'Orders', value: '12', icon: FiShoppingBag, color: 'blue' },
                { label: 'Wishlist', value: state.userAPI.wishlist[0]?.length || 0, icon: FiHeart, color: 'rose' },
                { label: 'Coupons', value: activeCouponsCount.toString().padStart(2, '0'), icon: FiGift, color: 'amber' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-pink-50/50 shadow-sm flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Account Security */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-pink-50/50 shadow-sm">
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                Account Security
              </h3>
              <button
                onClick={() => { setShowPasswordModal(true); setPassMsg(''); setPassError(''); }}
                className="flex items-center justify-between p-3 bg-pink-50/30 rounded-xl hover:bg-pink-50 transition-colors group w-full"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><FiLock className="text-gray-400 group-hover:text-pink-500 transition-colors size-4" /></div>
                  <div className="text-left font-bold text-gray-700 text-sm">Change Password</div>
                </div>
                <FiChevronRight className="text-gray-300" />
              </button>
            </div>
          </div>
        );
      case 'orders': return <OrderHistory />;
      case 'addresses': return <UserAddress />;
      case 'payments':
        return (
          <div className="space-y-4 sm:space-y-6">
            <SavedUPI />
            <SavedCards />
          </div>
        );
      case 'wishlist': return <Wishlist />;
      case 'reviews': return <Reviews />;
      case 'notifications':
        return (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-pink-50/50">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent notifications.</p>
              ) : (
                notifications.map(n => (
                  <div key={n._id} onClick={() => !n.isRead && markNotifAsRead(n._id)} className={`p-3 rounded-xl border ${n.isRead ? 'bg-gray-50 border-gray-100' : 'bg-pink-50 border-pink-100 cursor-pointer'} flex items-center gap-3 transition-all hover:bg-pink-50/50`}>
                    <div className="p-2 bg-white rounded-lg"><FiBell className={`size-4 ${n.isRead ? 'text-gray-400' : 'text-pink-500'}`} /></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${n.isRead ? 'text-gray-600 font-medium' : 'text-gray-900 font-bold'}`}>{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                    {!n.isRead && <div className="w-2 h-2 rounded-full bg-pink-500 shrink-0"></div>}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'coupons': 
        return (
          <div className="p-4 sm:p-6 text-center rounded-2xl shadow-sm border border-[#e8dcb9] bg-[#F3E4C9] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/40 backdrop-blur-md rounded-xl mx-auto flex items-center justify-center mb-4 shadow-sm border border-white/50">
                <FiTag className="w-7 h-7 text-pink-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 tracking-tight">Coupons Zone</h2>
              <p className="text-gray-700 mb-6 max-w-md mx-auto font-medium text-sm">Exclusive offers for your favorite cakes!</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {coupons.filter(c => c.isActive).map(c => (
                    <div key={c._id} className="p-4 border border-white/60 bg-white/50 backdrop-blur-sm rounded-xl relative overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F3E4C9] rounded-full border-l border-white/60"></div>
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#F3E4C9] rounded-full border-r border-white/60"></div>
                        
                        <h3 className="text-lg font-black text-gray-800 mb-1 mt-1 font-mono tracking-widest border-b-2 border-dashed border-gray-300 pb-2 uppercase">{c.code}</h3>
                        <p className="text-xs font-bold text-gray-700 mt-2">{c.type === 'percentage' ? `Get ${c.value}% off` : `Flat ₹${c.value} off`} {c.minOrder > 0 ? `on orders above ₹${c.minOrder}` : 'no minimum'}.</p>
                        <p className="text-[10px] text-pink-600 font-black mt-1 uppercase tracking-wider">Valid till {new Date(c.validUntil).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {activeCouponsCount === 0 && (
                    <div className="col-span-full text-center text-gray-500 mt-3 text-sm">
                      No active coupons. Check back later!
                    </div>
                  )}
              </div>
            </div>
          </div>
        );
      default: return <div className="p-6 text-center text-sm">In development</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAF0E6]">
      {/* Sidebar */}
      <div className="w-full lg:w-64 xl:w-72 bg-white border-b lg:border-r border-pink-50 flex flex-col transition-all relative z-10 lg:sticky lg:top-0 h-auto lg:h-screen shadow-sm">
        <div className="p-3 sm:p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-4 lg:mb-6 cursor-pointer" onClick={() => setActiveSection('profile')}>
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm shadow-pink-200 shrink-0">
              {initials}
            </div>
            <span className="font-black text-base tracking-tight text-gray-900">{storeName}</span>

          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:block space-y-4">
            {menuSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-3">
                  {section.title}
                </h3>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group text-sm
                        ${activeSection === item.id
                          ? 'bg-pink-600 text-white shadow-md shadow-pink-100'
                          : 'text-gray-500 hover:bg-pink-50/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg transition-colors relative ${activeSection === item.id ? 'bg-white/20' : item.color}`}>
                          <item.icon className="size-3.5" />
                          {item.hasNotification && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-sm border-2 border-white"></span>
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-bold ${activeSection === item.id ? 'text-white' : 'text-gray-600'}`}>
                          {item.label}
                        </span>
                      </div>
                      {activeSection === item.id && <motion.div layoutId="activeDot" className="w-1 h-1 bg-white rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile Nav (Horizontal Scroll) */}
          <nav className="lg:hidden flex overflow-x-auto gap-1.5 pb-1 custom-scrollbar -mx-1 px-1">
            {menuSections.flatMap(section => section.items).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold whitespace-nowrap text-xs
                  ${activeSection === item.id
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-100'
                    : 'bg-pink-50/50 text-gray-600 hover:bg-pink-100'
                  }
                `}
              >
                <div className="relative">
                  <item.icon className="size-3.5" />
                  {item.hasNotification && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-3 lg:p-5 border-t border-pink-50">
          <button
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 py-2.5 lg:py-3 bg-red-50 text-red-500 font-bold text-xs lg:text-sm rounded-xl hover:bg-red-100 hover:text-red-600 transition-all"
          >
            <FiLogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto lg:max-h-screen custom-scrollbar w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative"
            >
              <div className="p-5 sm:p-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="absolute top-4 right-4 p-1.5 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={16} />
                </button>
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 text-pink-500">
                  <FiLock size={22} />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">Change Password</h3>
                <p className="text-gray-500 text-xs mb-4">Create a new password for your account.</p>

                {otpSent ? (
                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Enter OTP</label>
                      <input
                        type="text"
                        value={passFormData.otp}
                        onChange={e => setPassFormData({ ...passFormData, otp: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 bg-pink-50/30 border border-pink-100 rounded-xl text-sm focus:ring-2 focus:ring-pink-100 font-bold text-gray-900 placeholder:font-normal tracking-[0.3em] font-mono text-center"
                        placeholder="123456"
                        maxLength="6"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">New Password</label>
                      <input
                        type="password"
                        value={passFormData.newPassword}
                        onChange={e => setPassFormData({ ...passFormData, newPassword: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 bg-pink-50/30 border border-pink-100 rounded-xl text-sm focus:ring-2 focus:ring-pink-100 font-bold text-gray-900 placeholder:font-normal"
                        placeholder="••••••••"
                      />
                    </div>
                    {passError && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">⚠️ {passError}</p>}
                    {passMsg && <p className="text-green-600 text-xs font-bold bg-green-50 p-2 rounded-lg">✅ {passMsg}</p>}
                    <button
                      type="submit"
                      disabled={passLoading}
                      className="w-full py-2.5 mt-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 focus:ring-2 focus:ring-gray-200 transition-all disabled:opacity-60 text-sm"
                    >
                      {passLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-700 bg-pink-50/30 p-3 rounded-xl text-center border border-pink-100/50">
                      We'll send an OTP to your registered email.
                    </p>
                    {passError && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">⚠️ {passError}</p>}
                    {passMsg && <p className="text-green-600 text-xs font-bold bg-green-50 p-2 rounded-lg">✅ {passMsg}</p>}
                    <button
                      onClick={requestPasswordOTP}
                      disabled={otpLoading}
                      className="w-full py-2.5 mt-2 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-all disabled:opacity-60 shadow-sm text-sm"
                    >
                      {otpLoading ? 'Sending...' : 'Send OTP to Email'}
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
