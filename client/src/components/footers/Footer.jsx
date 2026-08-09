import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';
import { FiMapPin, FiPhone, FiMail, FiHeart, FiExternalLink, FiShoppingBag, FiStar } from 'react-icons/fi';

const Footer = () => {
  const state = useContext(GlobalState);
  const [settings] = state?.settingsAPI?.settings || [{}];

  const storeName = settings?.storeName || 'Cake Avenue';
  const tagline = settings?.tagline || 'Handcrafted Fresh Baked Delights';
  const address = settings?.address || '123 Bakery Lane, Sweet City';
  const phone = settings?.supportPhone || '+91 98765 43210';
  const email = settings?.supportEmail || 'support@cakeavenue.com';
  const googleMapsUrl = settings?.googleMapsUrl || '';
  const googleMapsText = settings?.googleMapsText || 'View Store on Google Maps';

  const getInitials = (name) => {
    if (!name) return 'CA';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  const initials = getInitials(storeName);

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-16 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Store Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-pink-600/20">
                {initials}
              </div>
              <span className="font-extrabold text-xl text-gray-900 tracking-tight">{storeName}</span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {tagline}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-4">Explore Store</h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <Link to="/shop" className="hover:text-pink-600 transition-colors flex items-center gap-2">
                  <FiShoppingBag size={14} /> Shop Products
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-pink-600 transition-colors flex items-center gap-2">
                  <FiHeart size={14} /> Wishlist
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-pink-600 transition-colors flex items-center gap-2">
                  <FiStar size={14} /> My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-4">Contact Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="text-pink-600 mt-0.5 shrink-0" size={16} />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="text-pink-600 shrink-0" size={16} />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="text-pink-600 shrink-0" size={16} />
                <span>{email}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Google Maps Location Link */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-4">Store Location</h4>
            <p className="text-xs text-gray-500 mb-3 font-medium">
              Visit our physical store location for orders & inquiries.
            </p>
            {googleMapsUrl ? (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-pink-600/20"
              >
                <FiMapPin size={14} />
                {googleMapsText}
                <FiExternalLink size={12} />
              </a>
            ) : (
              <div className="text-xs text-gray-400 font-medium italic">
                {address}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <FiHeart className="text-pink-500 fill-pink-500" size={12} /> for our valued customers.
          </p>
        </div>


      </div>
    </footer>
  );
};

export default Footer;
