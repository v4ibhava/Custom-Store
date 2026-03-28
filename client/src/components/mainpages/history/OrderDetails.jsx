import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';

const OrderDetails = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const params = useParams();

  useEffect(() => {
    if (!params.id || !token) return;
    const getOrderDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/orders/${params.id}`, { headers: { Authorization: token } });
        setOrderDetails(data);
        setError('');
      } catch (err) {
        setError(err?.response?.data?.msg || 'Unable to load order details.');
        setOrderDetails(null);
      } finally {
        setLoading(false);
      }
    };
    getOrderDetails();
  }, [params.id, token]);

  if (!token) return <div className="text-center py-10 text-gray-500 text-sm">Please sign in to view your order.</div>;
  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent" />
    </div>
  );
  if (error) return (
    <div className="max-w-3xl mx-auto px-3 py-6">
      <div className="mb-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">{error}</div>
      <Link to="/history" className="text-xs text-pink-600 hover:text-pink-700 font-medium">← Back to orders</Link>
    </div>
  );
  if (!orderDetails) return null;

  const { _id, status, paymentStatus, paymentMode, items = [], amount, address, placedAt, createdAt, deliveredAt } = orderDetails;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <Link to="/history" className="text-xs text-pink-600 hover:text-pink-700 font-medium mb-3 inline-block">← Back to orders</Link>

      <div className="bg-white rounded-xl shadow-sm border border-pink-50/50 p-3 sm:p-5 space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Order #{_id.slice(-6).toUpperCase()}</h2>
          <p className="text-xs text-gray-400 mt-0.5">Placed on {new Date(placedAt || createdAt).toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="rounded-lg border border-pink-50 p-3 bg-pink-50/20">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Order Status</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">{status}</p>
            {deliveredAt && <p className="text-[10px] text-gray-400 mt-0.5">Delivered {new Date(deliveredAt).toLocaleDateString()}</p>}
          </div>
          <div className="rounded-lg border border-pink-50 p-3 bg-pink-50/20">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Payment</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">{paymentStatus}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{paymentMode || 'Online'}</p>
          </div>
          <div className="rounded-lg border border-pink-50 p-3 bg-pink-50/20">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Total</p>
            <p className="text-lg font-bold text-pink-600 mt-0.5" style={{ color: '#E91E63' }}>₹{Number(amount || 0).toFixed(2)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2">Items</h3>
          <div className="border border-pink-50 rounded-lg divide-y divide-pink-50">
            {items.map((item) => (
              <div key={item.productId} className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2.5 gap-1.5 bg-white hover:bg-pink-50/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Qty: {item.quantity}</p>
                  {status === 'Delivered' && (
                    <Link to={`/detail/${item.productId}`} className="inline-flex mt-1.5 text-[10px] font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1 rounded-full transition-colors">
                      Write a Review
                    </Link>
                  )}
                </div>
                <div className="text-gray-900 font-black text-sm sm:text-right shrink-0">
                  ₹{Number(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-gray-400 bg-pink-50/20">No items found.</div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-2">Delivery Address</h3>
          <div className="rounded-lg border border-pink-50 p-3 text-xs text-gray-600">
            {address ? (
              <>
                <div>{address.street}</div>
                <div>{address.city}, {address.state} {address.postalCode}</div>
                <div>{address.country}</div>
              </>
            ) : (
              <div>No address found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
