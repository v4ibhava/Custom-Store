import React, { useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
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
  const [activeSection, setActiveSection] = useState('products');
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
      id: 'products',
      label: 'Products',
      icon: BiShoppingBag,
      subItems: ['All Products', 'Add Product', 'Categories']
    },
    {
      id: 'sales',
      label: 'Sales',
      icon: BiBarChart,
      subItems: ['Orders', 'Revenue', 'Reports']
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
      case 'products':
        return <div>Products Management Content</div>;
      case 'sales':
        return <div>Sales Analytics Content</div>;
      case 'reviews':
        return <div>Reviews Management Content</div>;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your store</p>
        </div>
        
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <div key={item.id} className="px-4 py-2">
              <button
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full flex items-center px-4 py-2 text-sm rounded-lg
                  ${activeSection === item.id 
                    ? 'bg-pink-100 text-pink-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
              
              {/* Sub-items */}
              {item.subItems.length > 0 && (
                <div className="ml-9 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem}
                      to={`/admin/${item.id}/${subItem.toLowerCase().replace(' ', '-')}`}
                      className="
                        block px-4 py-2 text-sm text-gray-600
                        hover:text-pink-600 hover:bg-pink-50 rounded-lg
                      "
                    >
                      {subItem}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logoutUser}
            className="
              w-full flex items-center px-4 py-2 text-sm
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
          <div className="bg-white rounded-lg shadow p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;


