import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiTrash2
} from 'react-icons/fi';

function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const navigate = useNavigate();

  const removeItem = async (product) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <span className="text-sm">Remove this item?</span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              const newCart = cart.filter(item => item._id !== product._id);
              setCart(newCart);
              axios.put('/user/cart', { cart: newCart }, { headers: { Authorization: token } })
                .then(() => toast.success('Item removed'))
                .catch(() => toast.error('Failed to remove'));
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
          >
            Remove
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-pink-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-pink-200"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const increment = async (product) => {
    const newCart = cart.map(item =>
      item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(newCart);
    try {
      await axios.put('/user/cart', { cart: newCart }, { headers: { Authorization: token } });
    } catch {
      toast.error('Failed to update');
      setCart(cart);
    }
  };

  const decrement = async (product) => {
    if (product.quantity <= 1) return toast.error('Minimum quantity is 1');
    const newCart = cart.map(item =>
      item._id === product._id ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(newCart);
    try {
      await axios.put('/user/cart', { cart: newCart }, { headers: { Authorization: token } });
    } catch {
      toast.error('Failed to update');
      setCart(cart);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4">
        <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center">
          <FiShoppingCart size={36} className="text-pink-300" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700">Your Cart is Empty</h2>
        <p className="text-sm text-gray-400 text-center max-w-xs">Looks like you haven't added any sweet treats yet!</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition-all shadow-lg shadow-pink-200/50 active:scale-95"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF0E6]">
      {/* Header */}
      <div className="bg-white border-b border-pink-50">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{cart.length} item{cart.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-2.5 sm:space-y-3 pb-4 sm:pb-0">
            {cart.map((product, i) => (
              <div key={`${product._id}-${i}`} className="bg-white rounded-2xl shadow-sm border border-pink-50/40 overflow-hidden">
                <div className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                  <div className="w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.images?.url || '/default-image.jpg'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">{product.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.description}</p>
                    <p className="text-base sm:text-lg font-black text-pink-600 mt-1.5">
                      ₹{(product.price * product.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-pink-50/50 rounded-xl p-0.5">
                        <button
                          onClick={() => decrement(product)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white hover:bg-pink-50 flex items-center justify-center transition-colors shadow-sm"
                        >
                          <FiMinus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-8 sm:w-10 text-center font-bold text-sm">{product.quantity}</span>
                        <button
                          onClick={() => increment(product)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white hover:bg-pink-50 flex items-center justify-center transition-colors shadow-sm"
                        >
                          <FiPlus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product)}
                        className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Desktop only */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm border border-pink-50/40 p-5 sticky top-20">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <hr className="border-pink-100" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-pink-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-5 space-y-2.5">
                <button
                  className="w-full px-4 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all font-bold shadow-lg shadow-pink-200/50 active:scale-[0.98]"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
                <button
                  className="w-full px-4 py-2.5 border border-pink-100 rounded-xl hover:bg-pink-50/50 transition-colors font-medium text-gray-600 text-sm"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Checkout Bar - always visible on small screens */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t-2 border-pink-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-xl font-black text-pink-600">₹{total.toFixed(2)}</span>
        </div>
        <button
          className="w-full py-3.5 bg-pink-600 text-white font-bold rounded-xl active:bg-pink-700 active:scale-[0.98]"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
