import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function Wishlist() {
  const state = useContext(GlobalState);
  const [wishlist] = state.userAPI.wishlist;
  const removeWishlist = state.userAPI.removeWishlist;
  const addCart = state.userAPI.addCart;

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4">
          <FiHeart className="size-8 text-pink-300" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-gray-500 text-sm mt-1 max-w-xs">
          Save your favorite treats!
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-2.5 bg-pink-600 text-white font-bold text-sm rounded-full hover:bg-pink-700 transition-all shadow-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">My Wishlist</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            {wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
        <AnimatePresence>
          {wishlist.map(product => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-white p-3 rounded-xl border border-pink-50/50 shadow-sm hover:shadow-md transition-all flex gap-3 group"
            >
              <Link to={`/detail/${product._id}`} className="shrink-0">
                <img
                  src={product.images.url}
                  alt={product.title}
                  className="size-16 sm:size-20 rounded-lg object-cover group-hover:scale-105 transition-transform"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                <div>
                  <Link to={`/detail/${product._id}`} className="font-bold text-gray-900 hover:text-pink-600 transition-colors text-sm truncate block">
                    {product.title}
                  </Link>
                  <div className="text-pink-600 font-black text-sm" style={{ color: '#E91E63' }}>₹{product.price}</div>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => addCart(product)}
                    className="btn btn-xs bg-pink-50 text-pink-600 border-none hover:bg-pink-100 gap-1 text-[11px]"
                  >
                    <FiShoppingCart className="size-3" />
                    Add
                  </button>
                  <button
                    onClick={() => removeWishlist(product._id)}
                    className="btn btn-xs btn-ghost text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <FiTrash2 className="size-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Wishlist;
