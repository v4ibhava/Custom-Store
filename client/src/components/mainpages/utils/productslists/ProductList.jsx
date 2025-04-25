import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductList({ product, isAdmin }) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/detail/${product._id}`);
  };

  return (
    <div 
      className="card w-full bg-base-100 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleProductClick}
    >
      <figure className="px-4 pt-4">
        <img 
          src={product.images.url} 
          alt={product.title} 
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-primary">{product.title}</h2>
        <div className="badge badge-secondary font-bold">
          ₹{product.price}
        </div>
        <p className="text-base-content/70 line-clamp-2">{product.description}</p>
        
        {/* Stats */}
        <div className="stats stats-vertical shadow bg-base-200 my-2">
          {/* <div className="stat">
            <div className="stat-title">Category</div>
            <div className="stat-value text-sm">{product.category}</div>
          </div> */}
          {/* <div className="stat">
            <div className="stat-title">Stock</div>
            <div className="stat-value text-sm">{product.stock}</div>
          </div> */}
        </div>

        {/* Admin Checkbox */}
        {isAdmin && (
          <div className="form-control" onClick={e => e.stopPropagation()}>
            <label className="label cursor-pointer">
              <span className="label-text">Featured</span>
              <input 
                type="checkbox" 
                className="checkbox checkbox-primary" 
                defaultChecked={product.checked}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
