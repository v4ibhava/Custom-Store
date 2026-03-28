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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOrder, setSortOrder] = useState('');
  const [hasSearchTerm, setHasSearchTerm] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get('search');
    let filtered = [...products];
    setHasSearchTerm(!!searchTerm);

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i');
      filtered = filtered.filter(product =>
        searchRegex.test(product.title) ||
        searchRegex.test(product.description) ||
        searchRegex.test(product.category)
      );
    }

    if (!isAdmin) {
      if (selectedCategory) {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
      if (priceRange.min !== '' || priceRange.max !== '') {
        filtered = filtered.filter(product => {
          const price = Number(product.price);
          const min = priceRange.min === '' ? 0 : Number(priceRange.min);
          const max = priceRange.max === '' ? Infinity : Number(priceRange.max);
          return price >= min && price <= max;
        });
      }
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
    setPriceRange(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortOrder('');
  };

  if (hasSearchTerm && filteredProducts.length === 0) {
    return <ProductNotFound />;
  }

  return (
    <div className="min-h-screen bg-[#FAF0E6]">
      {/* Hero Section */}
      <div className="bg-white border-b border-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900">
              <span className="block">
                {isAdmin ? 'Product Management' : 'Discover Our'}
              </span>
              <span className="block text-pink-600">
                {isAdmin ? 'Dashboard' : 'Sweet Collection'}
              </span>
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto lg:mx-0">
              {isAdmin
                ? 'Manage your product inventory and categories efficiently.'
                : 'Handcrafted cakes and pastries, made with love and the finest ingredients.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-5 lg:py-6">
        {/* Filters */}
        {!isAdmin && (
          <div className="bg-white rounded-2xl shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-pink-50/50">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <select
                className="flex-1 sm:flex-none px-3 py-2 bg-pink-50/30 border border-pink-100 rounded-xl text-xs sm:text-sm min-w-[100px] focus:outline-none focus:ring-2 focus:ring-pink-100"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  name="min"
                  placeholder="Min ₹"
                  className="px-2.5 py-2 bg-pink-50/30 border border-pink-100 rounded-xl text-xs sm:text-sm w-[72px] sm:w-20 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                />
                <span className="text-pink-200 text-xs">—</span>
                <input
                  type="number"
                  name="max"
                  placeholder="Max ₹"
                  className="px-2.5 py-2 bg-pink-50/30 border border-pink-100 rounded-xl text-xs sm:text-sm w-[72px] sm:w-20 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                />
              </div>

              <select
                className="flex-1 sm:flex-none px-3 py-2 bg-pink-50/30 border border-pink-100 rounded-xl text-xs sm:text-sm min-w-[100px] focus:outline-none focus:ring-2 focus:ring-pink-100"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>

              {(selectedCategory || priceRange.min || priceRange.max || sortOrder) && (
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-pink-500 hover:text-pink-600 flex items-center gap-1 font-bold px-2 py-1"
                >
                  <HiAdjustments className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3 lg:gap-4">
          {isAdmin && (
            <Link to="/create_product" className="h-full">
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all h-full flex flex-col items-center justify-center p-3 sm:p-4 border-2 border-dashed border-pink-200 hover:border-pink-400 min-h-[180px] sm:min-h-[260px]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-pink-50 rounded-2xl mb-2 sm:mb-3 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">Add New</h2>
                <span className="text-xs text-pink-600 font-bold">+ Add Product</span>
              </div>
            </Link>
          )}

          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductList key={product._id} product={product} isAdmin={isAdmin} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 sm:py-12 text-gray-400">
              <p className="text-base sm:text-lg font-bold">No products found</p>
              <p className="text-xs sm:text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
