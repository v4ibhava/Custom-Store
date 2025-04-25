import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import ProductList from '../utils/productslists/ProductList';

function Wishlist() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWishlist = async () => {
      try {
        const res = await axios.get('/api/wishlist', {
          headers: { Authorization: token }
        });
        setWishlistItems(res.data.products);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setLoading(false);
      }
    };

    if (token) getWishlist();
  }, [token]);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`, {
        headers: { Authorization: token }
      });
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map(product => (
            <div key={product._id} className="relative">
              <ProductList product={product} />
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;