import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { Toaster, toast } from 'react-hot-toast';

// Admin Sub-components
import AdminOrders from './components/AdminOrders';
import AdminProducts from './components/AdminProducts';
import AdminCategories from './components/AdminCategories';
import AdminReviews from './components/AdminReviews';
import AdminCoupons from './components/AdminCoupons';

import {
  FiShoppingBag,
  FiBox,
  FiLayers,
  FiStar,
  FiTag,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

const AdminProfile = () => {
  const state = useContext(GlobalState);
  const [, setIsLogged] = state.userAPI.isLogged;
  const [, setIsAdmin] = state.userAPI.isAdmin;
  const [activeSection, setActiveSection] = useState('orders');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const logoutUser = useCallback(async () => {
    try {
      await axios.get("/user/logout");
      localStorage.removeItem("firstLogin");
      setIsAdmin(false);
      setIsLogged(false);
      toast.success('Logged out successfully');
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
      toast.error('Logout failed');
    }
  }, [setIsLogged, setIsAdmin, navigate]);

  const menuItems = [
    {
      id: 'orders',
      label: 'Orders',
      icon: FiShoppingBag
    },
    {
      id: 'products',
      label: 'Products',
      icon: FiBox
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FiLayers
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: FiStar
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: FiTag
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'reviews':
        return <AdminReviews />;
      case 'coupons':
        return <AdminCoupons />;
      default:
        return <AdminOrders />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiMenu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Admin</h1>
        <button
          onClick={logoutUser}
          className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
        >
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:shadow-lg lg:z-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                transition-all duration-200
                ${activeSection === item.id
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Content Area */}
        <div className="p-4 lg:p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
