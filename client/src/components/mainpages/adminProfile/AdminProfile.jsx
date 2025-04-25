import React, { useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import OrderHistory from '../history/UserHistory';
import { 
  BiBarChart,
  BiShoppingBag,
  BiStar,
  BiLogOut
} from 'react-icons/bi';

const AdminProfile = () => {
  const state = useContext(GlobalState);
  const [, setIsLogged] = state.userAPI.isLogged;
  const [, setIsAdmin] = state.userAPI.isAdmin;
  const [activeSection, setActiveSection] = useState('orders');
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

  const menuItems = [
    {
      id: 'orders',
      label: 'Orders',
      icon: BiShoppingBag,
      subItems: ['All Orders', 'Pending', 'Completed']
    },
    {
      id: 'products',
      label: 'Products',
      icon: BiShoppingBag,
      subItems: ['All Products', 'Add Product', 'Categories']
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: BiBarChart,
      subItems: ['Revenue', 'Reports']
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: BiStar,
      subItems: ['Product Reviews', 'Ratings Analytics']
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <BiShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Order Management</h2>
            </div>
            <OrderHistory isAdmin={true} />
          </div>
        );
      case 'products':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <BiShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Products Management</h2>
            </div>
            {/* Add your products management component here */}
          </div>
        );
      case 'sales':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <BiBarChart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Sales Analytics</h2>
            </div>
            {/* Add your sales analytics component here */}
          </div>
        );
      case 'reviews':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <BiStar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Reviews Management</h2>
            </div>
            {/* Add your reviews management component here */}
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <BiShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold">Select an option</h2>
            </div>
            <p className="text-gray-600">Please select an option from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          <div className="px-3 py-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.id} className="mb-4">
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full flex items-center px-4 py-2.5 text-sm rounded-lg
                    transition-all duration-200 ease-in-out
                    ${activeSection === item.id 
                      ? 'bg-pink-50 text-pink-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
                
                {/* Sub-items */}
                <div className="ml-9 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem}
                      to={`/admin/${item.id}/${subItem.toLowerCase().replace(' ', '-')}`}
                      className="
                        block px-4 py-2 text-sm text-gray-600
                        hover:text-pink-600 hover:bg-pink-50 
                        rounded-lg transition-colors duration-200
                      "
                    >
                      {subItem}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logoutUser}
            className="
              w-full flex items-center px-4 py-2.5 text-sm
              text-red-600 hover:bg-red-50 rounded-lg
              transition-colors duration-200
            "
          >
            <BiLogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;




