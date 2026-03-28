import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { FiPackage, FiChevronRight } from 'react-icons/fi';

const paymentBadge = (status) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-700';
    case 'failed': return 'bg-red-100 text-red-700';
    case 'refunded': return 'bg-purple-100 text-purple-700';
    default: return 'bg-amber-100 text-amber-700';
  }
};

const orderBadge = (status) => {
  switch (status) {
    case 'Delivered': return 'bg-emerald-100 text-emerald-700';
    case 'Out for Delivery': return 'bg-blue-100 text-blue-700';
    case 'Processing': case 'Packed': return 'bg-cyan-100 text-cyan-700';
    default: return 'bg-gray-100 text-gray-700';
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
        const res = await axios.get(endpoint, { headers: { Authorization: token } });
        setHistory(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err?.response?.data?.msg || 'Unable to load orders.');
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    getHistory();
  }, [token, endpoint]);

  if (!token) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-4">
        <FiPackage className="text-pink-300 size-7" />
      </div>
      <p className="text-gray-500 font-medium text-sm">Sign in to view your orders.</p>
    </div>
  );
  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-9 w-9 border-[3px] border-pink-200 border-t-pink-600"></div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{isAdmin ? 'All Orders' : 'Order History'}</h2>
          <p className="text-xs text-gray-500">Track payment and delivery status.</p>
        </div>
        <div className="text-xs text-gray-400 font-medium">{history.length} orders</div>
      </div>

      {error && (
        <div className="mb-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">{error}</div>
      )}

      {/* Card Layout for mobile, table for desktop */}
      <div className="space-y-2 sm:space-y-0">
        {/* Mobile Card Layout */}
        <div className="sm:hidden space-y-2">
          {history.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-pink-50/50 p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-gray-900 text-sm">#{order._id.slice(-6).toUpperCase()}</div>
                  <div className="text-[10px] text-gray-400">{order.items?.length || 0} items</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${orderBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-500">{new Date(order.placedAt || order.createdAt).toLocaleDateString()}</span>
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${paymentBadge(order.paymentStatus)}`}>
                    {order.paymentStatus || 'created'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-pink-600 text-sm" style={{ color: '#E91E63' }}>₹{Number(order.amount || 0).toFixed(2)}</span>
                  <Link to={`/history/${order._id}`} className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-lg">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm border border-pink-50/50">
            <thead className="bg-pink-50/30 text-xs font-medium uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-2.5 text-left">Order</th>
                <th className="px-4 py-2.5 text-left">Placed</th>
                <th className="px-4 py-2.5 text-left">Payment</th>
                <th className="px-4 py-2.5 text-left">Status</th>
                <th className="px-4 py-2.5 text-left">Total</th>
                <th className="px-4 py-2.5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50 text-sm">
              {history.map((order) => (
                <tr key={order._id} className="hover:bg-pink-50/20">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 text-xs">#{order._id.slice(-6).toUpperCase()}</div>
                    <div className="text-[10px] text-gray-400">{order.items?.length || 0} items</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                    {new Date(order.placedAt || order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${paymentBadge(order.paymentStatus)}`}>
                      {order.paymentStatus || 'created'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${orderBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-bold text-sm">₹{Number(order.amount || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/history/${order._id}`} className="text-xs font-bold text-pink-600 hover:text-pink-700">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {history.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiPackage className="text-pink-300 size-7" />
          </div>
          <p className="text-gray-500 font-medium">No orders yet</p>
          <Link to="/" className="text-sm text-pink-600 font-bold mt-2 inline-block hover:underline">Start Shopping</Link>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
