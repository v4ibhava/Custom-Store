import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import ProductList from '../utils/productslists/ProductList';

function Products() {
  const state = useContext(GlobalState);
  const { products } = state.productAPI;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">  
      <div className="container mx-auto">
        {/* Hero Section */}
        <div className="hero bg-base-100 rounded-box mb-8 shadow-lg">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Our Products</h1>
              <p className="py-6">Discover our amazing collection of products curated just for you.</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products && Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <ProductList 
                  product={product} 
                  isAdmin={isAdmin}
                  className="animate-fade-in-up"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="alert alert-info shadow-lg max-w-md mx-auto">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Products are not available at the moment.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
