import React, { useContext, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import { CiTrash } from 'react-icons/ci';
import axios from 'axios';
import './Cart.css';

function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;

  // Function to remove item from cart
  const removeItem = async (product) => {
    if (window.confirm("Do you want to remove this item from cart?")) {
      const newCart = cart.filter(item => item._id !== product._id);
      setCart(newCart);
      
      // Save the updated cart to the backend
      try {
        await axios.put('/user/cart', { cart: newCart }, {
          headers: { Authorization: token }
        });
      } catch (err) {
        console.error("Error updating cart:", err.response?.data?.msg || err.message);
      }
    }
  };

  // Function to increase quantity
  const increment = (product) => {
    setCart(
      cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Function to decrease quantity
  const decrement = (product) => {
    if (product.quantity > 1) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    }
  };

  // Calculate total price
  const total = cart.reduce((prev, item) => prev + item.price * item.quantity, 0);

  // Check if the cart is empty
  if (cart.length === 0) {
    return <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart Empty</h2>;
  }

  return (
    <div>
      {cart.map((product, index) => (
        <div key={`${product._id}-${index}`} className="detail">
          <img
            src={product.images?.url || "/default-image.jpg"}
            alt={product.title || "Product"}
          />
          <div className="product-info">
            <h2>{product.title || "No Title Available"}</h2>
            <p>{product.description || "No description available."}</p>
            <span>Price: ₹{product.price || "N/A"}</span>
            <p>Quantity: {product.quantity}</p>
            <div className="quantity-controls">
              <button onClick={() => decrement(product)}>-</button>
              <button onClick={() => increment(product)}>+</button>
              <button 
                className="delete-btn"
                onClick={() => removeItem(product)}
              >
                <CiTrash size={20} />
              </button>
            </div>
            <Link to="/cart" className="cart">
              Buy Now
            </Link>
          </div>
        </div>
      ))}
      <h2 style={{ textAlign: "center" }}>Total: ₹{total.toFixed(2)}</h2>
    </div>
  );
}

export default Cart;
