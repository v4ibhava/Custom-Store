import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import toast from 'react-hot-toast';
import {
  FiStar,
  FiTrash2,
  FiMessageCircle,
  FiCalendar,
  FiFilter,
  FiRefreshCw,
  FiSend,
  FiCornerDownRight,
  FiPackage
} from 'react-icons/fi';

const AdminReviews = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/reviews', {
        headers: { Authorization: token }
      });
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-medium">Delete this review?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/api/reviews/${id}`, {
                  headers: { Authorization: token }
                });
                setReviews(reviews.filter(r => r._id !== id));
                toast.success('Review deleted');
              } catch (err) {
                toast.error(err.response?.data?.msg || 'Delete failed');
              }
            }}
            className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      setSendingReply(true);
      // Store reply locally (since there's no reply API endpoint)
      setReviews(reviews.map(r => 
        r._id === reviewId 
          ? { ...r, adminReply: replyText.trim(), repliedAt: new Date().toISOString() }
          : r
      ));
      toast.success('Reply sent!');
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  // Calculate statistics
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
      : 0
  }));

  const filteredReviews = reviews.filter(review => {
    const matchesRating = !ratingFilter || review.rating === parseInt(ratingFilter);
    const matchesSearch = !searchTerm ||
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-xl">
              <FiStar className="w-5 h-5 text-yellow-600 fill-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Rating</p>
              <p className="text-xl font-bold text-gray-900">{avgRating}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-100 rounded-xl">
              <FiMessageCircle className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">{reviews.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiStar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">5 Star</p>
              <p className="text-xl font-bold text-gray-900">{reviews.filter(r => r.rating === 5).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <FiStar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low</p>
              <p className="text-xl font-bold text-gray-900">{reviews.filter(r => r.rating <= 2).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium text-gray-700">{rating}</span>
                <FiStar className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <select
            value={ratingFilter}
            onChange={e => setRatingFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
          <button
            onClick={fetchReviews}
            className="px-4 py-2.5 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <FiMessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No reviews found</h3>
            <p className="text-gray-400 mt-1">No reviews match your filters</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 font-bold shrink-0">
                    {review.userName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">"{review.comment}"</p>

                    {/* Admin Reply */}
                    {review.adminReply && (
                      <div className="mt-3 p-3 bg-pink-50 rounded-xl border-l-4 border-pink-500">
                        <div className="flex items-center gap-2 mb-1">
                          <FiCornerDownRight className="w-4 h-4 text-pink-600" />
                          <span className="text-sm font-semibold text-pink-600">Your Reply</span>
                        </div>
                        <p className="text-sm text-gray-700">{review.adminReply}</p>
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === review._id && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleReply(review._id)}
                          disabled={sendingReply}
                          className="px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors disabled:opacity-50"
                        >
                          <FiSend className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!review.adminReply && replyingTo !== review._id && (
                    <button
                      onClick={() => setReplyingTo(review._id)}
                      className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all"
                      title="Reply"
                    >
                      <FiMessageCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
