import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiHeart } from 'react-icons/fi';
import { GlobalState } from '../../../../GlobalState';
import { useContext } from 'react';

function ProductList({ product, isAdmin }) {
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const addWishlist = state.userAPI.addWishlist;

  const handleProductClick = () => {
    if (!isAdmin) {
      navigate(`/detail/${product._id}`);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-pink-50/30 group
        ${!isAdmin ? 'cursor-pointer active:scale-[0.98] hover:border-pink-100' : ''}`}
      onClick={handleProductClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images.url}
          alt={product.title}
          className="w-full h-36 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              addWishlist(product);
            }}
            className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-pink-300 hover:text-rose-500 transition-all shadow-sm opacity-70 group-hover:opacity-100 active:scale-110"
          >
            <FiHeart size={16} />
          </button>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">{product.title}</h2>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2.5 leading-relaxed">{product.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-base sm:text-lg font-black text-pink-600">₹{product.price}</span>

          {isAdmin && (
            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
              <Link
                to={`/edit-product/${product._id}`}
                className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <FiEdit className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => deleteProduct(product._id)}
                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="mt-2.5 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              id={`featured-${product._id}`}
              defaultChecked={product.checked}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              style={{ accentColor: '#E91E63' }}
            />
            <label htmlFor={`featured-${product._id}`} className="text-xs text-gray-500">
              Featured
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
