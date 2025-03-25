import React from 'react';
import './ProductList.css';
import { Link } from 'react-router-dom';
import BtnRender from './BtnRender';

function ProductList({ product, isAdmin }) {
  return (
    <div className='product-card'>
      {/* {isAdmin && <input type='checkbox' defaultChecked={product.checked} />} */}
      <img src={product.images.url} alt={product.title} />
      <div className='product_box'>
        <h2>{product.title}</h2>
        <span>Price: &#x20b9;{product.price}</span>
        <p>{product.description}</p>
      </div>
      <BtnRender product={product} />
    </div>
  );
}

export default ProductList;
