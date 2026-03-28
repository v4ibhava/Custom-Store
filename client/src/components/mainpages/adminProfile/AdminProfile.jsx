import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import {
  FiShoppingBag,
  FiBox,
  FiLayers,
  FiStar,
  FiTag,
  FiLogOut,
  FiMenu,
  FiX,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiActivity,
  FiGrid
} from 'react-icons/fi';

// Admin Sub-components
import AdminOrders from './components/AdminOrders';
import AdminProducts from './components/AdminProducts';
import AdminCategories from './components/AdminCategories';
import AdminReviews from './components/AdminReviews';
import AdminCoupons from './components/AdminCoupons';
import AdminSales from './components/AdminSales';

const AdminProfile = () => {
  const state = useContext(GlobalState);
  const [, setIsLogged] = state.userAPI.isLogged;
  const [, setIsAdmin] = state.userAPI.isAdmin;
  const [user] = state.userAPI.user;
  const [activeSection, setActiveSection] = useState('orders'); // Changed default to 'orders' or 'dashboard'
  const navigate = useNavigate();

  const logoutUser = useCallback(async () => {
    try {
      await axios.get("/user/logout");
      localStorage.removeItem("firstLogin");
      setIsAdmin(false);
      setIsLogged(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
      toast.error('Logout failed');
    }
  }, [setIsLogged, setIsAdmin, navigate]);

  const menuSections = [
    {
      title: 'Orders Management',
      items: [
        { id: 'orders', label: 'All Orders', icon: FiShoppingBag, color: 'text-pink-500 bg-pink-50' }
      ]
    },
    {
      title: 'Product Management',
      items: [
        { id: 'products', label: 'Products Master', icon: FiBox, color: 'text-amber-500 bg-amber-50' },
        { id: 'categories', label: 'Categories', icon: FiLayers, color: 'text-emerald-500 bg-emerald-50' },
      ]
    },
    {
      title: 'Sales Reports',
      items: [
        { id: 'sales', label: 'Revenue & Reports', icon: FiActivity, color: 'text-blue-500 bg-blue-50' }
      ]
    },
    {
      title: 'Marketing Tools',
      items: [
        { id: 'coupons', label: 'Coupons Control', icon: FiTag, color: 'text-purple-500 bg-purple-50' },
        { id: 'reviews', label: 'Reviews Moderation', icon: FiStar, color: 'text-rose-500 bg-rose-50' }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        // Overview of admin
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl font-black border border-white/20">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-black tracking-tight">{user?.name || 'Administrator'}</h2>
                  <p className="text-gray-400 font-medium mt-1">{user?.email}</p>
                  <div className="flex gap-2 mt-4 flex-wrap justify-center md:justify-start">
                    <span className="px-4 py-1.5 bg-pink-500/20 text-pink-300 rounded-full text-xs font-bold uppercase tracking-wider">
                      Business Control Center
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Quick stats could go here */}
            <AdminSales />
          </div>
        );
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'sales':
        return <AdminSales />;
      case 'reviews':
        return <AdminReviews />;
      case 'coupons':
        return <AdminCoupons />;
      default:
        return <AdminOrders />;
    }
  };

  return (
    <div className="admin-dark-theme flex flex-col lg:flex-row min-h-screen bg-[#FAFAFA]">
      <Toaster position="top-right" />
      {/* Premium Admin Sidebar */}
      <div className="w-full lg:w-80 bg-white border-b lg:border-r border-gray-100 flex flex-col transition-all relative z-10 lg:sticky lg:top-0 h-auto lg:h-screen shadow-xl shadow-gray-200/20">
        <div className="p-6 lg:p-10">
          <div className="flex items-center gap-4 mb-6 lg:mb-10 cursor-pointer" onClick={() => setActiveSection('dashboard')}>
            <div className="w-10 h-10 bg-[#F3E4C9] rounded-xl flex items-center justify-center text-[#111111] font-black text-xl shadow-lg shadow-[#F3E4C9]/20 shrink-0">
              CA
            </div>
            <span className="font-black text-xl tracking-tighter text-gray-900">Admin Portal</span>
          </div>

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
                          ? 'bg-[#F3E4C9] text-[#111111] shadow-xl shadow-[#F3E4C9]/20 ring-4 ring-[#F3E4C9]/10'
                          : 'text-gray-500 hover:bg-gray-800 hover:text-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg transition-colors ${activeSection === item.id ? 'bg-black/5' : item.color}`}>
                          <item.icon className="size-4" />
                        </div>
                        <span className={`text-sm font-bold ${activeSection === item.id ? 'text-[#111111]' : 'text-[inherit]'}`}>
                          {item.label}
                        </span>
                      </div>
                      {activeSection === item.id && <motion.div layoutId="activeDotAdmin" className="w-1.5 h-1.5 bg-pink-500 rounded-full shadow-lg" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <nav className="lg:hidden flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
            {menuSections.flatMap(section => section.items).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`
                  shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold whitespace-nowrap
                  ${activeSection === item.id
                    ? 'bg-[#F3E4C9] text-[#111111] shadow-md shadow-[#F3E4C9]/20 ring-2 ring-[#F3E4C9]/10'
                    : 'bg-white text-gray-500 hover:bg-gray-800 hover:text-gray-200'
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
            Sign Out Admin
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto lg:max-h-screen custom-scrollbar w-full bg-[#f8f9fa]">
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
    </div>
  );
};

export default AdminProfile;
