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
        const reviewRes = await axios.get(`/api/product_reviews/${params.id}`);
        setReviews(reviewRes.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) getProduct();
  }, [params.id]);

  const handleBuyNow = () => {
    if (!isLogged) { setShowToast(true); setTimeout(() => setShowToast(false), 3000); return; }
    addCart(detailProduct);
    navigate('/cart');
  };

  const handleAddToCart = () => {
    if (!isLogged) { setShowToast(true); setTimeout(() => setShowToast(false), 3000); return; }
    addCart(detailProduct);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isLogged) return alert("Please login to leave a review.");
    if (!comment) return alert("Please add a comment.");
    try {
      setSubmitting(true);
      await axios.post('/api/reviews', { product: params.id, rating, comment }, { headers: { Authorization: token } });
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
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-pink-500 border-t-transparent"></div>
    </div>
  );

  if (!detailProduct) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
        <Link to="/" className="mt-3 text-pink-600 hover:text-pink-700 text-sm font-medium">Return to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-3 z-[100] max-w-xs w-full"
          >
            <div className="alert alert-warning shadow-lg border-l-4 border-orange-500 bg-white rounded-xl p-3">
              <div className="flex items-start gap-2">
                <FiAlertCircle className="text-orange-500 mt-0.5 size-4 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm">Login Required</h3>
                  <div className="text-xs text-gray-600 mt-0.5">
                    Please <Link to="/login" className="text-pink-600 font-bold hover:underline">Sign In</Link> to purchase.
                  </div>
                </div>
                <button onClick={() => setShowToast(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                  <FiX size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-pink-600 mb-3 sm:mb-4 group text-sm">
        <FiArrowLeft className="mr-1.5 group-hover:-translate-x-1 transition-transform size-4" />
        Back to Products
      </Link>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-pink-50/50">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="relative h-56 sm:h-72 md:h-[450px] overflow-hidden group">
              <img
                src={detailProduct.images.url}
                alt={detailProduct.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-pink-600 shadow-sm">
                {detailProduct.category}
              </div>
              <button
                onClick={() => isLogged ? addWishlist(detailProduct) : setShowToast(true)}
                className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-rose-500 transition-all shadow-sm group"
              >
                <FiHeart className="size-5 group-active:scale-125 transition-transform" />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col">
            <div className="mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
                House Special
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2 leading-tight">
              {detailProduct.title}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-pink-600" style={{ color: '#E91E63' }}>
                  ₹{detailProduct.price}
                </span>
                {detailProduct.old_price && (
                  <span className="text-sm text-gray-300 line-through">
                    ₹{detailProduct.old_price}
                  </span>
                )}
              </div>
              <div className="h-8 w-px bg-pink-100"></div>
              <div className="flex flex-col">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <FiStar key={i} className="size-3.5 fill-current" />)}
                </div>
                <span className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{reviews.length} Reviews</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{detailProduct.description}</p>

            <div className="mt-auto space-y-4">
              {detailProduct.content && (
                <div className="bg-pink-50/40 rounded-xl p-3 border border-pink-100/50">
                  <h3 className="font-bold text-gray-900 mb-1 text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                    Perfect for...
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{detailProduct.content}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAddToCart}
                  className="btn border-pink-200 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 flex-1 h-11 rounded-xl gap-2 transition-all font-bold text-sm bg-transparent"
                >
                  <FiShoppingCart className="size-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn bg-pink-600 hover:bg-pink-700 border-none text-white flex-1 h-11 rounded-xl gap-2 shadow-md transition-all font-bold text-sm"
                >
                  <FiCreditCard className="size-4" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Customer Love</h2>
          <div className="w-16 h-1 bg-pink-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Review Form */}
          <div className="md:col-span-5">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-pink-50/50 md:sticky md:top-20">
              <h3 className="text-base font-black text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1.5 rounded-lg transition-all ${rating >= star ? 'text-yellow-400 bg-yellow-50' : 'text-gray-200 bg-gray-50'}`}
                      >
                        <FiStar className={`size-5 ${rating >= star ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Experience</label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full bg-pink-50/30 border border-pink-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-pink-100 focus:border-pink-200 min-h-[100px] outline-none resize-none"
                    placeholder="How was the taste?..."
                  ></textarea>
                </div>
                <button
                  disabled={submitting}
                  className="w-full py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? "Sending..." : "Submit Review"}
                  <FiMessageSquare size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Review List */}
          <div className="md:col-span-7 space-y-3">
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-pink-100">
                <p className="text-gray-400 font-bold text-sm">Be the first to review this cake!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-pink-50/50 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 font-black text-sm">
                        {review.userName[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{review.userName}</h4>
                        <div className="flex text-yellow-400 gap-0.5 mt-0.5">
                          {[...Array(review.rating)].map((_, i) => <FiStar key={i} size={10} className="fill-current" />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-gray-500 italic leading-relaxed text-xs sm:text-sm pl-11">
                    "{review.comment}"
                  </p>
                  {review.reply && (
                    <div className="mt-3 ml-11 p-3 bg-[#F3E4C9]/40 rounded-xl border border-[#F3E4C9] relative">
                        <div className="absolute -top-2 left-4 text-pink-700 bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border border-pink-100 shadow-sm">Store Response</div>
                        <p className="text-xs text-gray-800 leading-relaxed font-medium mt-1">{review.reply}</p>
                    </div>
                  )}
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
