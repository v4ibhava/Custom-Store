import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { FiStar, FiTrash2, FiMessageCircle, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function Reviews() {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [user] = state.userAPI.user;
    const [isAdmin] = state.userAPI.isAdmin;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getReviews = async () => {
            try {
                const url = isAdmin ? '/api/reviews' : '/api/reviews'; // For now same, admin gets all, user might get only theirs if filtered
                const res = await axios.get(url);

                // If not admin, filter only user's reviews
                if (!isAdmin && user) {
                    setReviews(res.data.filter(r => r.user?._id === user._id || r.user === user._id));
                } else {
                    setReviews(res.data);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        };
        getReviews();
    }, [isAdmin, user]);

    const deleteReview = async (id) => {
        if (window.confirm("Do you want to delete this review?")) {
            try {
                await axios.delete(`/api/reviews/${id}`, {
                    headers: { Authorization: token }
                });
                setReviews(reviews.filter(r => r._id !== id));
            } catch (err) {
                alert(err.response.data.msg);
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading reviews...</div>;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900">
                    {isAdmin ? "All Reviews" : "My Reviews & Ratings"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    {isAdmin ? "Manage customer feedback" : "Your shared experiences"}
                </p>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <FiMessageCircle className="size-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No reviews found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {reviews.map(review => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 font-bold text-xl">
                                            {review.userName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{review.userName}</h4>
                                            <div className="flex text-yellow-400 gap-0.5 mt-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} className={`size-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-xs text-gray-400 flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                                            <FiClock className="size-3" rotate={90} />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                        {(isAdmin || (user && (review.user?._id === user._id || review.user === user._id))) && (
                                            <button
                                                onClick={() => deleteReview(review._id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <FiTrash2 className="size-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed pl-16">
                                    "{review.comment}"
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

export default Reviews;
