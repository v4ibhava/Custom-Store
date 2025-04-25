import React, { useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import UserHistory from '../history/UserHistory';
import UserAddress from './useraddress/UserAddress';
import { 
  FiShoppingBag,
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiSmartphone,
  FiGift,
  FiStar,
  FiHeart,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';
import OrderHistory from '../history/UserHistory';
import SavedUPI from './SavedUPI';
import SavedCards from './SavedCards';

const Profile = () => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [, setIsLogged] = state.userAPI.isLogged;
  const [, setIsAdmin] = state.userAPI.isAdmin;
  const [activeSection, setActiveSection] = useState('profile');
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
    }
  }, [setIsLogged, setIsAdmin, navigate]);

  const menuSections = [
    {
      title: 'MY ORDERS',
      items: [
        { id: 'orders', label: 'Orders History', icon: FiShoppingBag }
      ]
    },
    {
      title: 'ACCOUNT SETTINGS',
      items: [
        { id: 'profile', label: 'Profile Information', icon: FiUser },
        { id: 'addresses', label: 'Manage Addresses', icon: FiMapPin }
      ]
    },
    {
      title: 'PAYMENTS',
      items: [
        { id: 'upi', label: 'Saved UPI', icon: FiSmartphone },
        { id: 'cards', label: 'Saved Cards', icon: FiCreditCard }
      ]
    },
    {
      title: 'MY STUFF',
      items: [
        { id: 'coupons', label: 'My Coupons', icon: FiGift },
        { id: 'reviews', label: 'My Reviews & Ratings', icon: FiStar },
        { id: 'wishlist', label: 'My Wishlist', icon: FiHeart }
      ]
    }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'orders':
        return <OrderHistory />;
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiUser className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Profile Information</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-lg">{user?.name || 'Not available'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg">{user?.email || 'Not available'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-lg">
                    <span className={`badge ${user?.role === 1 ? 'badge-primary' : 'badge-secondary'}`}>
                      {user?.role === 1 ? 'Admin' : 'Customer'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'addresses':
        return <UserAddress />;
      case 'upi':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <SavedUPI />
          </div>
        );
      case 'cards':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <SavedCards />
          </div>
        );
      case 'coupons':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiGift className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">My Coupons</h2>
            </div>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'reviews':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiStar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">My Reviews & Ratings</h2>
            </div>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      case 'wishlist':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiHeart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">My Wishlist</h2>
            </div>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiSettings className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Select an option</h2>
            </div>
            <p className="text-gray-600">Please select an option from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">My Account</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your profile</p>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 mb-2 px-4">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`
                        w-full flex items-center px-4 py-2 text-sm rounded-lg
                        transition-all duration-200 ease-in-out
                        ${activeSection === item.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-gray-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={logoutUser}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <FiLogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
