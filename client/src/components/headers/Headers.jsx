import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { FaUser } from "react-icons/fa";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { BiBell } from "react-icons/bi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FiHeart, FiSearch, FiX, FiHome } from "react-icons/fi";

export default function Headers() {
  const state = useContext(GlobalState);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const {
    isLogged = [false, () => { }],
    isAdmin = [false, () => { }],
    cart = [],
  } = state?.userAPI || {};
  const [logged] = isLogged;
  const [admin] = isAdmin;

  const cartItems = Array.isArray(cart[0]) ? cart[0] : cart;
  const cartCount = cartItems.length;

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
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
      <nav className="sticky top-0 z-50 bg-white shadow-sm px-3 sm:px-4 lg:px-8 border-b border-gray-100">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="text-lg sm:text-2xl font-extrabold text-pink-600 tracking-tight shrink-0">
            Cake Avenue
          </Link>
          <div className="hidden sm:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search orders, products, or users..."
                className="w-full h-9 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 text-sm transition-all"
                onChange={handleSearch}
              />
              <HiMiniMagnifyingGlass className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 size-4" />
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <button className="sm:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
              {mobileSearchOpen ? <FiX size={20} className="text-gray-500" /> : <HiMiniMagnifyingGlass size={20} className="text-gray-500" />}
            </button>
            <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative">
              <BiBell size={20} className="text-gray-500" />
            </button>
            <Link to="/AdminProfile" className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
              <FaUser size={18} className="text-gray-500" />
            </Link>
          </div>
        </div>
        {mobileSearchOpen && (
          <div className="sm:hidden pb-3 animate-fade-in-up">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders, products, or users..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 text-sm"
                onChange={handleSearch}
                autoFocus
              />
              <HiMiniMagnifyingGlass className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 size-4" />
            </div>
          </div>
        )}
      </nav>
    );
  }

  // User Header
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-pink-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            <Link to="/" className="text-lg sm:text-xl font-extrabold text-pink-600 tracking-tight shrink-0">
              Cake Avenue
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-6 relative">
              <input
                type="text"
                placeholder="Craving cake? Search here..."
                className="peer w-full h-9 border border-pink-100 rounded-xl pl-10 pr-4 bg-pink-50/30 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all text-sm placeholder-pink-300"
                onChange={handleSearch}
              />
              <HiMiniMagnifyingGlass className="absolute top-1/2 left-3.5 -translate-y-1/2 text-pink-300 size-4" />
            </div>

            {/* Desktop-only icons (mobile uses bottom tab bar) */}
            <div className="hidden sm:flex items-center gap-1">
              {logged ? (
                <>
                  <Link to="/wishlist" className="p-2.5 rounded-xl hover:bg-pink-50 transition-colors relative">
                    <FiHeart size={20} className="text-gray-500" />
                    {state.userAPI.wishlist[0].length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                    )}
                  </Link>
                  <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-pink-50 transition-colors">
                    <RiShoppingCart2Fill size={20} className="text-gray-500" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/profile" className="p-2.5 rounded-xl hover:bg-pink-50 transition-colors">
                    <FaUser size={18} className="text-gray-500" />
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-pink-600 text-white text-sm font-bold rounded-xl hover:bg-pink-700 transition-all shadow-sm shadow-pink-200/50 active:scale-95"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile: only Sign In for non-logged users */}
            {!logged && (
              <Link
                to="/login"
                className="sm:hidden px-4 py-2 bg-pink-600 text-white text-sm font-bold rounded-xl hover:bg-pink-700 transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar - hidden on cart/checkout */}
      {logged && !['/cart', '/checkout'].includes(location.pathname) && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-pink-100/40"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center justify-around py-1.5">
            {[
              { to: '/', icon: <FiHome size={22} />, label: 'Home' },
              { to: '/wishlist', icon: <FiHeart size={22} />, label: 'Wishlist', badge: state.userAPI.wishlist[0].length > 0 },
              { to: '/cart', icon: <RiShoppingCart2Fill size={22} />, label: 'Cart', count: cartCount },
              { to: '/profile', icon: <FaUser size={20} />, label: 'Profile' },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors relative ${isActive(item.to) ? 'text-pink-600' : 'text-gray-400'}`}
              >
                {item.icon}
                {item.badge && (
                  <span className="absolute top-0.5 right-2 w-2 h-2 bg-rose-500 rounded-full" />
                )}
                {item.count > 0 && (
                  <span className="absolute -top-0.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[9px] font-bold text-white">
                    {item.count}
                  </span>
                )}
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
