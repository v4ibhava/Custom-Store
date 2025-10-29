import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import ProductList from '../utils/productslists/ProductList';
import ProductNotFound from '../utils/not_found/ProductNotFound';
import { HiAdjustments } from 'react-icons/hi';
import { Link } from 'react-router-dom';

function Products() {
  const state = useContext(GlobalState);
  const { products } = state.productAPI;
  const [categories] = state.categoriesAPI.categories;
  const [isAdmin] = state.userAPI.isAdmin;
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();
  
  // Filter states (only for regular users)
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOrder, setSortOrder] = useState('');
  const [hasSearchTerm, setHasSearchTerm] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get('search');

    let filtered = [...products];

    // Track if there's a search term
    setHasSearchTerm(!!searchTerm);

    // Text search filter (available for both admin and users)
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      filtered = filtered.filter(product => {
        return (
          searchRegex.test(product.title) ||
          searchRegex.test(product.description) ||
          searchRegex.test(product.category)
        );
      });
    }

    // Apply these filters only for regular users
    if (!isAdmin) {
      // Category filter
      if (selectedCategory) {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }

      // Price range filter
      if (priceRange.min !== '' || priceRange.max !== '') {
        filtered = filtered.filter(product => {
          const price = Number(product.price);
          const min = priceRange.min === '' ? 0 : Number(priceRange.min);
          const max = priceRange.max === '' ? Infinity : Number(priceRange.max);
          return price >= min && price <= max;
        });
      }

      // Sorting
      if (sortOrder) {
        filtered.sort((a, b) => {
          const priceA = Number(a.price);
          const priceB = Number(b.price);
          return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });
      }
    }

    setFilteredProducts(filtered);
  }, [location.search, products, selectedCategory, priceRange, sortOrder, isAdmin]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortOrder('');
  };

  // Show ProductNotFound if there's a search term but no results
  if (hasSearchTerm && filteredProducts.length === 0) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">
                {isAdmin ? 'Product Management' : 'Discover Our'}
              </span>
              <span className="block text-pink-600">
                {isAdmin ? 'Dashboard' : 'Sweet Collection'}
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
              {isAdmin 
                ? 'Manage your product inventory and categories efficiently from one central dashboard.'
                : 'Explore our handcrafted selection of delightful cakes and pastries, made with love and the finest ingredients.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Section */}
        {!isAdmin && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <select
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-w-[140px] focus:outline-none"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm w-24 focus:outline-none"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm w-24 focus:outline-none"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                />
              </div>

              <select
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm min-w-[140px] focus:outline-none"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="">Sort by Price</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>

              {(selectedCategory || priceRange.min || priceRange.max || sortOrder) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-pink-500 hover:text-pink-600 flex items-center gap-1"
                >
                  <HiAdjustments className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Add Product Card - Admin Only */}
          {isAdmin && (
            <Link to="/create_product" className="h-full">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full flex flex-col items-center justify-center p-4">
                <div className="w-full h-48 bg-gray-50 rounded-md mb-4 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 text-pink-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Add New Product</h2>
                <p className="text-sm text-gray-600 text-center mb-4">Click here to add a new product to your inventory</p>
                <span className="text-pink-600 font-bold">Add Product</span>
              </div>
            </Link>
          )}

          {/* Product List */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductList key={product._id} product={product} isAdmin={isAdmin} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
