import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';

const paymentBadge = (status) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const orderBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800';
    case 'Out for Delivery':
      return 'bg-blue-100 text-blue-800';
    case 'Processing':
    case 'Packed':
      return 'bg-cyan-100 text-cyan-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

function OrderHistory({ isAdmin = false }) {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const endpoint = useMemo(() => (isAdmin ? '/api/orders' : '/api/orders/my'), [isAdmin]);

  useEffect(() => {
    if (!token) return;
    const getHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(endpoint, {
          headers: { Authorization: token }
        });
        setHistory(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err?.response?.data?.msg || 'Unable to load orders right now.');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    getHistory();
  }, [token, endpoint]);

  if (!token) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Please sign in to view your orders.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">
            {isAdmin ? 'All Orders' : 'Order History'}
          </h2>
          <p className="text-sm text-gray-500">Track payment and fulfillment status in real time.</p>
        </div>
        <div className="text-sm text-gray-500">
          {history.length} {history.length === 1 ? 'order' : 'orders'}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-3 text-left">Order</th>
              <th className="px-6 py-3 text-left">Placed</th>
              <th className="px-6 py-3 text-left">Payment</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {history.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    #{order._id.slice(-6).toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {new Date(order.placedAt || order.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentBadge(order.paymentStatus)}`}>
                    {order.paymentStatus || 'created'}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {order.razorpayPaymentId || order.razorpayOrderId || 'Awaiting payment'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${orderBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">
                  ₹{Number(order.amount || 0).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/history/${order._id}`}
                    className="text-primary hover:text-primary-focus font-medium text-sm"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {history.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500">You have not placed any orders yet.</p>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
