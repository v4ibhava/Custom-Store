import React, { useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { Toaster, toast } from 'react-hot-toast';

// Admin Sub-components
import AdminOrders from './components/AdminOrders';
import AdminProducts from './components/AdminProducts';
import AdminSales from './components/AdminSales';
import AdminReviews from './components/AdminReviews';
import AdminCoupons from './components/AdminCoupons';

import {
  FiShoppingBag,
  FiBox,
  FiTrendingUp,
  FiStar,
  FiTag,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome
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
      icon: FiShoppingBag,
      description: 'Manage customer orders'
    },
    {
      id: 'products',
      label: 'Products',
      icon: FiBox,
      description: 'Manage cake catalog'
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: FiTrendingUp,
      description: 'Revenue & reports'
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: FiStar,
      description: 'Customer feedback'
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: FiTag,
      description: 'Promotions & discounts'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return <AdminOrders />;
      case 'products':
        return <AdminProducts />;
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
        <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiHome className="w-5 h-5 text-gray-600" />
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
          fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:shadow-lg lg:z-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500 mt-0.5">Cake Avenue Dashboard</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                transition-all duration-200 group
                ${activeSection === item.id
                  ? 'bg-pink-50 text-pink-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div
                className={`
                  p-2 rounded-lg transition-colors
                  ${activeSection === item.id
                    ? 'bg-pink-100 text-pink-600'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-sm">{item.label}</span>
                <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
              </div>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <div className="p-2 rounded-lg bg-red-100">
              <FiLogOut className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(m => m.id === activeSection)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">
                {menuItems.find(m => m.id === activeSection)?.description || 'Welcome to admin panel'}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors"
            >
              <FiHome className="w-4 h-4" />
              View Store
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
