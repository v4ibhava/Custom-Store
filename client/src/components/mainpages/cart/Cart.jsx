// Make sure you have installed react-icons:
// npm install react-icons

import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  // Remove an item from cart and sync with server
  const removeItem = async (product) => {
    if (window.confirm("Do you want to remove this item from cart?")) {
      const newCart = cart.filter(item => item._id !== product._id);
      setCart(newCart);
      try {
        await axios.put(
          '/user/cart',
          { cart: newCart },
          { headers: { Authorization: token } }
        );
      } catch (err) {
        console.error("Error updating cart:", err.response?.data?.msg || err.message);
      }
    }
  };

  // Increment quantity
  const increment = (product) => {
    setCart(
      cart.map(item =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrement quantity (min 1)
  const decrement = (product) => {
    if (product.quantity > 1) {
      setCart(
        cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <FiShoppingCart size={80} className="text-gray-300" />
        <h2 className="text-4xl font-bold text-gray-400">Your Cart is Empty</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((product, i) => (
            <div key={`${product._id}-${i}`} className="bg-white rounded-lg shadow-md">
              <div className="p-4 flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  <img
                    src={product.images?.url || '/default-image.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrement(product)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{product.quantity}</span>
                      <button
                        onClick={() => increment(product)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        ₹{(product.price * product.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(product)}
                        className="w-8 h-8 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <hr className="my-4 border-gray-200" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
                <button
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
