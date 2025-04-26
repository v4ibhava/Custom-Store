import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { GlobalState } from "../../GlobalState";
import { FaUser } from "react-icons/fa";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { BiBell } from "react-icons/bi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

export default function Headers() {
  const state = useContext(GlobalState);
  const navigate = useNavigate(); // Add this
  const {
    isLogged = [false, () => {}],
    isAdmin = [false, () => {}],
    cart = [],
  } = state?.userAPI || {};
  const [logged] = isLogged;
  const [admin] = isAdmin;

  const cartItems = Array.isArray(cart[0]) ? cart[0] : cart;
  const cartCount = cartItems.length;

  // Add search handler
  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.value;
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/');
    }
  };

  // Admin Header
  if (admin) {
    return (
      <nav className="bg-base-100 shadow-md px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1">
            <Link to="/" className="text-2xl font-extrabold text-pink-600">
              Cake Avenue
            </Link>
          </div>
          {/* CENTER */}
          <div className="flex-1 w-full max-w-2xl mx-4">
      
            <input
              type="text"
              placeholder="Search orders, products, or users..."
              className="
                w-full h-10 px-3 py-2.5 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm
              "
              onChange={handleSearch}
            />
          </div>
          {/* // Right Side */}

          <div className="flex-1 flex justify-end items-center gap-4">
              <BiBell size={24} className=" text-zinc-950 cursor-pointer hover:text-pink-500"/>
      
            <Link
              to="/AdminProfile"
            >
              <FaUser size={20} className="hover:text-pink-500" />
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // Regular User Header
  return (
    <nav className="bg-base-100 shadow-md px-4 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex-1">
          <Link to="/" className="text-2xl font-extrabold text-pink-600">
            Cake Avenue
          </Link>
        </div>

        <div className="flex-1 w-full max-w-2xl mx-1 relative">
  <input
    type="text"
    placeholder="Craving cake? Type your sweet tooth's wish… 🍰"
    className="
      peer w-full h-8
      border border-gray-200 rounded pl-10
      focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200
      transition text-xs
      placeholder-pink-300 italic
    "
    onChange={handleSearch}
  />
  <span
    aria-hidden="true"
    className="absolute top-1/2 left-2 transform -translate-y-1/2 text-pink-400"
  >
    <HiMiniMagnifyingGlass />
  </span>
</div>





        <div className="flex-1 flex justify-end items-center gap-4">
          {logged ? (
            <>
              <Link 
                to="/profile" 
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Your Profile"
              >
                <FaUser size={24} className="text-gray-600" />
              </Link>
              <Link
                to="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="View Cart"
              >
                <RiShoppingCart2Fill size={24} className="text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link 
              to="/login" 
              className="group relative inline-block text-gray-600 hover:text-pink-600"
            >
              Sign In
              <span className="absolute left-0 -bottom-1 block h-0.5 w-0 bg-current transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
