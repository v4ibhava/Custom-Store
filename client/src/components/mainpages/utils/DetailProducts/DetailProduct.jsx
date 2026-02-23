import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GlobalState } from '../../../../GlobalState';
import { FiShoppingCart, FiCreditCard, FiArrowLeft, FiAlertCircle, FiX, FiHeart, FiStar, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function DetailProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const navigate = useNavigate();
  const [token] = state.token;
  const isLogged = state.userAPI.isLogged[0];
  const addCart = state.userAPI.addCart;
  const addWishlist = state.userAPI.addWishlist;
  const [detailProduct, setDetailProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${params.id}`);
        setDetailProduct(res.data);

        // Fetch reviews
        const reviewRes = await axios.get(`/api/product_reviews/${params.id}`);
        setReviews(reviewRes.data);
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

  const handleBuyNow = () => {
    if (!isLogged) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    addCart(detailProduct);
    navigate('/cart');
  };

  const handleAddToCart = () => {
    if (!isLogged) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    addCart(detailProduct);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isLogged) return alert("Please login to leave a review.");
    if (!comment) return alert("Please add a comment.");

    try {
      setSubmitting(true);
      await axios.post('/api/reviews', {
        product: params.id,
        rating,
        comment
      }, {
        headers: { Authorization: token }
      });

      // Refresh reviews
      const reviewRes = await axios.get(`/api/product_reviews/${params.id}`);
      setReviews(reviewRes.data);
      setComment('');
      setRating(5);
      alert("Thank you for your review!");
    } catch (err) {
      alert(err.response.data.msg);
    } finally {
      setSubmitting(false);
    }
  };

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
    <div className="container mx-auto px-4 py-8 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-[100] max-w-sm w-full"
          >
            <div className="alert alert-warning shadow-2xl border-l-4 border-orange-500 bg-white">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="text-orange-500 mt-1 size-5 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Login Required</h3>
                  <div className="text-xs text-gray-600 mt-1">
                    Please <Link to="/login" className="text-pink-600 font-bold hover:underline">Sign In</Link> to purchase or favorite this item.
                  </div>
                </div>
                <button onClick={() => setShowToast(false)} className="btn btn-ghost btn-xs btn-circle">
                  <FiX />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 group">
        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Products
      </Link>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="md:flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="relative h-72 sm:h-96 md:h-[600px] overflow-hidden group">
              <img
                src={detailProduct.images.url}
                alt={detailProduct.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider text-pink-600 shadow-sm border border-white/50">
                {detailProduct.category}
              </div>
              <button
                onClick={() => isLogged ? addWishlist(detailProduct) : setShowToast(true)}
                className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl text-gray-400 hover:text-rose-500 transition-all shadow-sm border border-white/50 group"
              >
                <FiHeart className="size-6 group-active:scale-125 transition-transform" />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8 lg:p-14 flex flex-col">
            <div className="mb-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-pink-500 bg-pink-50 px-4 py-1.5 rounded-full">
                House Special
              </span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 leading-[1.1]">
              {detailProduct.title}
            </h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-pink-600">
                  ₹{detailProduct.price}
                </span>
                {detailProduct.old_price && (
                  <span className="text-lg text-gray-300 line-through decoration-pink-200">
                    ₹{detailProduct.old_price}
                  </span>
                )}
              </div>
              <div className="h-10 w-px bg-gray-100 mx-2"></div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="size-4 fill-current" />)}
                </div>
                <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{reviews.length} Reviews</span>
              </div>
            </div>

            <div className="prose prose-pink text-gray-500 mb-10 max-w-none">
              <p className="leading-relaxed text-lg">{detailProduct.description}</p>
            </div>

            <div className="mt-auto space-y-8">
              {detailProduct.content && (
                <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                  <h3 className="font-black text-gray-900 mb-2 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    Perfect for...
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{detailProduct.content}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="btn btn-outline border-pink-100 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 flex-1 h-16 rounded-2xl gap-3 transition-all font-black"
                >
                  <FiShoppingCart className="size-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn bg-pink-600 hover:bg-pink-700 border-none text-white flex-1 h-16 rounded-2xl gap-3 shadow-2xl shadow-pink-100 transition-all font-black text-lg"
                >
                  <FiCreditCard className="size-5" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Customer Love</h2>
          <div className="w-20 h-1.5 bg-pink-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Review Form */}
          <div className="md:col-span-5">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 sticky top-24">
              <h3 className="text-xl font-black text-gray-900 mb-6">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-xl transition-all ${rating >= star ? 'text-yellow-400 bg-yellow-50' : 'text-gray-200 bg-gray-50'}`}
                      >
                        <FiStar className={`size-6 ${rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-3 block">Experience</label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 min-h-[120px]"
                    placeholder="How was the taste?..."
                  ></textarea>
                </div>
                <button
                  disabled={submitting}
                  className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? "Sending..." : "Submit Review"}
                  <FiMessageSquare size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Review List */}
          <div className="md:col-span-7 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">Be the first to review this cake!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 group hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 font-black text-lg">
                        {review.userName[0]}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900">{review.userName}</h4>
                        <div className="flex text-yellow-400 gap-0.5 mt-0.5">
                          {[...Array(review.rating)].map((_, i) => <FiStar key={i} size={12} className="fill-current" />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-gray-500 italic leading-relaxed pl-16">
                    "{review.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailProduct;
