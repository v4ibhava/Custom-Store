import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import ProductList from '../utils/productslists/ProductList';

function Products() {
  const state = useContext(GlobalState);
  const { products } = state.productAPI;
  const [isAdmin] = state.userAPI.isAdmin;

  // console.log('State:', state);
  // console.log('Products:', products);

  return (
    <div className='products-container'>
      {products && Array.isArray(products) && products.length > 0 ? (
        products.map((product) => (
          <ProductList key={product._id} product={product} isAdmin={isAdmin}/>
        ))
      ) : (
        <div className='products-empty'>Products are not available.</div>
      )}
    </div>
  );
}

export default Products;
