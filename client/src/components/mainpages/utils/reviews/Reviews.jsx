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
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    const submitReply = async (id) => {
        try {
            await axios.put(`/api/reviews/${id}`, { reply: replyText }, { headers: { Authorization: token } });
            setReviews(reviews.map(r => r._id === id ? { ...r, reply: replyText } : r));
            setReplyingTo(null);
            setReplyText('');
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to submit reply.");
        }
    };

    useEffect(() => {
        const getReviews = async () => {
            try {
                const res = await axios.get('/api/reviews');
                if (!isAdmin && user) {
                    setReviews(res.data.filter(r => r.user?._id === user._id || r.user === user._id));
                } else {
                    setReviews(res.data);
                }
                setLoading(false);
            } catch (err) { console.error(err); }
        };
        getReviews();
    }, [isAdmin, user]);

    const deleteReview = async (id) => {
        if (window.confirm("Delete this review?")) {
            try {
                await axios.delete(`/api/reviews/${id}`, { headers: { Authorization: token } });
                setReviews(reviews.filter(r => r._id !== id));
            } catch (err) { alert(err.response.data.msg); }
        }
    };

    if (loading) return <div className="text-center py-8 text-sm text-gray-400">Loading reviews...</div>;

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    {isAdmin ? "All Reviews" : "My Reviews"}
                </h2>
                <p className="text-gray-500 text-xs mt-0.5">
                    {isAdmin ? "Manage customer feedback" : "Your shared experiences"}
                </p>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-12 bg-pink-50/30 rounded-xl border-2 border-dashed border-pink-100">
                    <FiMessageCircle className="size-8 text-pink-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium text-sm">No reviews found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {reviews.map(review => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-3 sm:p-4 rounded-xl border border-pink-50/50 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2.5 items-center">
                                        <div className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600 font-bold text-sm">
                                            {review.userName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{review.userName}</h4>
                                            <div className="flex text-yellow-400 gap-0.5 mt-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <FiStar key={i} className={`size-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="text-[10px] text-gray-400 flex items-center gap-1 bg-pink-50/30 px-2 py-1 rounded-full">
                                            <FiClock className="size-2.5" />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                        {(isAdmin || (user && (review.user?._id === user._id || review.user === user._id))) && (
                                            <button
                                                onClick={() => deleteReview(review._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <FiTrash2 className="size-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pl-11">
                                    "{review.comment}"
                                </p>

                                {review.reply && (
                                    <div className="mt-3 ml-11 p-3 bg-[#F3E4C9]/30 rounded-xl border border-[#F3E4C9] relative">
                                        <div className="absolute -top-2 left-4 text-pink-700 bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border border-pink-100 shadow-sm">Store Response</div>
                                        <p className="text-xs text-gray-800 leading-relaxed font-medium mt-1">{review.reply}</p>
                                    </div>
                                )}

                                {isAdmin && !review.reply && replyingTo !== review._id && (
                                    <button onClick={() => setReplyingTo(review._id)} className="ml-11 mt-2 px-3 py-1 bg-pink-50 text-pink-600 rounded-lg text-[10px] font-bold hover:bg-pink-100 transition-colors">
                                        Reply
                                    </button>
                                )}

                                {replyingTo === review._id && (
                                    <div className="mt-3 ml-11 flex gap-1.5">
                                        <input 
                                            type="text" 
                                            value={replyText} 
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write response..."
                                            className="flex-1 px-3 py-2 border border-pink-200 bg-pink-50/30 rounded-lg text-xs focus:ring-2 focus:ring-pink-100 outline-none"
                                        />
                                        <button onClick={() => submitReply(review._id)} className="px-3 py-2 bg-pink-600 text-white rounded-lg text-xs font-bold hover:bg-pink-700">Send</button>
                                        <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="px-2 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200">Cancel</button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

export default Reviews;
