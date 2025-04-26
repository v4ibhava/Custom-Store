import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalState } from '../../../../GlobalState';
import axios from 'axios';
import { FiShoppingCart, FiCreditCard } from 'react-icons/fi';

const BtnRender = ({ product }) => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;
  const addCart = state.userAPI.addCart;
  const [token] = state.token;
  const navigate = useNavigate();

  const handleAuthAction = (action) => {
    if (!token) {
      const confirmLogin = window.confirm("Please login to continue shopping. Would you like to login now?");
      if (confirmLogin) {
        navigate('/login');
      }
      return false;
    }
    return true;
  };

  const buyNow = async (product) => {
    if (!handleAuthAction('buy')) return;

    // Create a single-item cart for immediate checkout
    const singleItemCart = [{
      ...product,
      quantity: 1
    }];

    // Navigate to checkout with the single item
    navigate('/checkout', { 
      state: { 
        items: singleItemCart,
        isBuyNow: true 
      }
    });
  };

  const handleAddToCart = (product) => {
    if (!handleAuthAction('cart')) return;
    addCart(product);
  };

  const deleteProduct = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        const res = await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(res.data.msg);
      }
    } catch (err) {
      console.error("Delete Product Error:", err.response?.data?.msg || err.message);
      alert(err.response?.data?.msg || "Failed to delete product");
    }
  };
  
  return (
    <div className="join join-vertical lg:join-horizontal w-full">
      {isAdmin ? (
        <>
          <button 
            className="btn btn-error join-item"
            onClick={() => deleteProduct(product._id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
          <Link 
            to={`/edit-product/${product._id}`}
            className="btn btn-warning join-item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
        </>
      ) : (
        <>
          <button 
            className="btn btn-primary join-item"
            onClick={() => handleAddToCart(product)}
          >
            <FiShoppingCart />
            Add to Cart
          </button>
          <button 
            className="btn btn-secondary join-item"
            onClick={() => buyNow(product)}
          >
            <FiCreditCard />
            Buy Now
          </button>
        </>
      )}
    </div>
  );
};

export default BtnRender;
