import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import toast from 'react-hot-toast';
import {
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiFilter,
  FiRefreshCw,
  FiChevronDown,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiCreditCard
} from 'react-icons/fi';

const statuses = ['Pending', 'Processing', 'Packed', 'Out for Delivery', 'Delivered'];
const payStates = ['created', 'paid', 'failed', 'refunded'];

const statusConfig = {
  'Pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: FiClock },
  'Processing': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: FiRefreshCw },
  'Packed': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: FiPackage },
  'Out for Delivery': { color: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: FiTruck },
  'Delivered': { color: 'bg-green-100 text-green-800 border-green-200', icon: FiCheck }
};

const paymentConfig = {
  'created': { color: 'bg-gray-100 text-gray-800' },
  'paid': { color: 'bg-green-100 text-green-800' },
  'failed': { color: 'bg-red-100 text-red-800' },
  'refunded': { color: 'bg-purple-100 text-purple-800' }
};

const AdminOrders = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = '/api/orders?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (paymentFilter) url += `paymentStatus=${paymentFilter}&`;
      
      const { data } = await axios.get(url, { headers: { Authorization: token } });
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      const timer = setInterval(fetchOrders, 15000);
      return () => clearInterval(timer);
    }
  }, [statusFilter, paymentFilter, token]);

  const advanceStatus = async (order) => {
    const idx = statuses.indexOf(order.status);
    if (idx === -1 || idx === statuses.length - 1) return;
    const next = statuses[idx + 1];
    try {
      const { data } = await axios.patch(
        `/api/orders/${order._id}/status`,
        { status: next },
        { headers: { Authorization: token } }
      );
      setOrders(prev => prev.map(o => o._id === order._id ? data : o));
      toast.success(`Order status updated to ${next}`);
    } catch (e) {
      toast.error(e?.response?.data?.msg || 'Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'Pending';
    if (activeTab === 'processing') return ['Processing', 'Packed'].includes(order.status);
    if (activeTab === 'delivery') return order.status === 'Out for Delivery';
    if (activeTab === 'completed') return order.status === 'Delivered';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => ['Processing', 'Packed'].includes(o.status)).length },
    { id: 'delivery', label: 'Out for Delivery', count: orders.filter(o => o.status === 'Out for Delivery').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'Delivered').length }
  ];

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
        {tabs.slice(1).map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              bg-white rounded-2xl p-4 cursor-pointer transition-all border-2
              ${activeTab === tab.id ? 'border-pink-500 shadow-lg' : 'border-transparent shadow-sm hover:shadow-md'}
            `}
          >
            <p className="text-sm text-gray-500 font-medium">{tab.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{tab.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <FiFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <FiCreditCard className="text-gray-400" />
            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
            >
              <option value="">All Payments</option>
              {payStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2.5 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${activeTab === tab.id
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }
            `}
          >
            {tab.label}
            <span
              className={`
                px-2 py-0.5 rounded-full text-xs
                ${activeTab === tab.id ? 'bg-pink-500' : 'bg-gray-100'}
              `}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No orders found</h3>
            <p className="text-gray-400 mt-1">No orders match your current filters</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${statusConfig[order.status]?.color || 'bg-gray-100'}`}>
                      {React.createElement(statusConfig[order.status]?.icon || FiPackage, { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          #{order._id?.slice(-6).toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[order.status]?.color}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiUser className="w-3.5 h-3.5" />
                          {order.user?.name || order.user?.email || 'Customer'}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar className="w-3.5 h-3.5" />
                          {new Date(order.placedAt || order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{order.amount?.toFixed(2)}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentConfig[order.paymentStatus]?.color}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <FiChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        Delivery Address
                      </h4>
                      <p className="text-sm text-gray-600">
                        {order.address?.street}, {order.address?.city},<br />
                        {order.address?.state} {order.address?.postalCode},<br />
                        {order.address?.country}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FiPackage className="w-4 h-4" />
                        Order Items ({order.items?.length || 0})
                      </h4>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg">
                            <img
                              src={item.image || '/default-image.jpg'}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status !== 'Delivered' && (
                    <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            const { data } = await axios.patch(
                              `/api/orders/${order._id}/status`,
                              { status: newStatus },
                              { headers: { Authorization: token } }
                            );
                            setOrders(prev => prev.map(o => o._id === order._id ? data : o));
                            toast.success(`Status updated to ${newStatus}`);
                          } catch (err) {
                            toast.error('Failed to update status');
                          }
                        }}
                        className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                      >
                        {statuses.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => advanceStatus(order)}
                        className="px-6 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors text-sm font-medium"
                      >
                        Advance Status
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
