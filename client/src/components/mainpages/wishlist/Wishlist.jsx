import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

function Wishlist() {
  const state = useContext(GlobalState);
  const [wishlist] = state.userAPI.wishlist;
  const removeWishlist = state.userAPI.removeWishlist;
  const addCart = state.userAPI.addCart;

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
          <FiHeart className="size-10 text-pink-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mt-2 max-w-xs mx-auto">
          Save your favorite treats and they'll show up here!
        </p>
        <Link
          to="/"
          className="mt-8 px-8 py-3 bg-pink-600 text-white font-bold rounded-full hover:bg-pink-700 transition-all shadow-lg shadow-pink-100"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900">My Wishlist</h2>
          <p className="text-gray-500 text-sm mt-1">
            You have {wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {wishlist.map(product => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4 group"
            >
              <Link to={`/detail/${product._id}`} className="shrink-0">
                <img
                  src={product.images.url}
                  alt={product.title}
                  className="size-24 rounded-xl object-cover group-hover:scale-105 transition-transform"
                />
              </Link>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <Link to={`/detail/${product._id}`} className="font-bold text-gray-900 hover:text-pink-600 transition-colors">
                    {product.title}
                  </Link>
                  <div className="text-pink-600 font-black mt-0.5">₹{product.price}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addCart(product)}
                    className="btn btn-sm bg-pink-50 text-pink-600 border-none hover:bg-pink-100 gap-1.5"
                  >
                    <FiShoppingCart className="size-3.5" />
                    Add
                  </button>
                  <button
                    onClick={() => removeWishlist(product._id)}
                    className="btn btn-sm btn-ghost text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <FiTrash2 className="size-3.5" />
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