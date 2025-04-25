import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

function ProductList({ product, isAdmin }) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    if (!isAdmin) {
      navigate(`/detail/${product._id}`);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow 
        ${!isAdmin ? 'cursor-pointer' : ''}`}
      onClick={handleProductClick}
    >
      <div className="p-4">
        <img 
          src={product.images.url} 
          alt={product.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-pink-600">₹{product.price}</span>
          
          {isAdmin && (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Link 
                to={`/edit-product/${product._id}`}
                className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
              >
                <FiEdit className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => deleteProduct(product._id)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {isAdmin && (
          <div 
            className="mt-4 flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input 
              type="checkbox" 
              id={`featured-${product._id}`}
              defaultChecked={product.checked}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label 
              htmlFor={`featured-${product._id}`}
              className="text-sm text-gray-600"
            >
              Featured Product
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
