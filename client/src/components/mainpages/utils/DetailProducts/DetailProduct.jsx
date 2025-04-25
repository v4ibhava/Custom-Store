import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GlobalState } from '../../../../GlobalState';
import { FiShoppingCart, FiCreditCard, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';

function DetailProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const [token] = state.token;
  const addCart = state.userAPI.addCart;
  const [detailProduct, setDetailProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${params.id}`);
        setDetailProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      getProduct();
    }
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );

  if (!detailProduct) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <Link to="/" className="mt-4 text-primary hover:text-primary-focus">
          Return to Home
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
        <FiArrowLeft className="mr-2" />
        Back to Products
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="relative h-96">
              <img
                src={detailProduct.images.url}
                alt={detailProduct.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {detailProduct.title}
            </h1>

            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-primary">
                ₹{detailProduct.price}
              </span>
              {detailProduct.old_price && (
                <span className="ml-3 text-lg text-gray-500 line-through">
                  ₹{detailProduct.old_price}
                </span>
              )}
            </div>

            <div className="prose prose-sm text-gray-600 mb-8">
              <p>{detailProduct.description}</p>
            </div>

            <div className="space-y-4">
              {detailProduct.content && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Product Details</h3>
                  <p className="text-sm text-gray-600">{detailProduct.content}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => addCart(detailProduct)}
                  className="btn btn-primary flex-1 gap-2"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>
                <Link
                  to="/checkout"
                  className="btn btn-secondary flex-1 gap-2"
                >
                  <FiCreditCard />
                  Buy Now
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            {/* <div className="mt-8 border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 text-gray-900">{detailProduct.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <span className="ml-2 text-gray-900">{detailProduct.stock}</span>
                </div>
                {detailProduct.sold && (
                  <div>
                    <span className="text-gray-500">Sold:</span>
                    <span className="ml-2 text-gray-900">{detailProduct.sold}</span>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
