import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import toast from 'react-hot-toast';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiPackage,
  FiCalendar,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';

const AdminSales = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/orders', {
          headers: { Authorization: token }
        });
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        toast.error('Failed to fetch sales data');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  // Calculate metrics
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const uniqueCustomers = new Set(orders.map(o => o.user?._id || o.user)).size;

  // Filter by date range
  const getDateFilter = () => {
    const now = new Date();
    const ranges = {
      'today': new Date(now.setHours(0, 0, 0, 0)),
      'week': new Date(now.setDate(now.getDate() - 7)),
      'month': new Date(now.setMonth(now.getMonth() - 1)),
      'year': new Date(now.setFullYear(now.getFullYear() - 1))
    };
    return ranges[dateRange] || ranges['week'];
  };

  const filteredOrders = orders.filter(o => {
    const orderDate = new Date(o.placedAt || o.createdAt);
    return orderDate >= getDateFilter();
  });

  const filteredRevenue = filteredOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  // Top selling products
  const productSales = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      if (!productSales[item.name]) {
        productSales[item.name] = { name: item.name, quantity: 0, revenue: 0, image: item.image };
      }
      productSales[item.name].quantity += item.quantity || 1;
      productSales[item.name].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Status distribution
  const statusCounts = {
    'Pending': orders.filter(o => o.status === 'Pending').length,
    'Processing': orders.filter(o => o.status === 'Processing').length,
    'Packed': orders.filter(o => o.status === 'Packed').length,
    'Out for Delivery': orders.filter(o => o.status === 'Out for Delivery').length,
    'Delivered': orders.filter(o => o.status === 'Delivered').length
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
      icon: FiDollarSign,
      color: 'bg-green-100 text-green-600',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: FiShoppingBag,
      color: 'bg-blue-100 text-blue-600',
      trend: '+8.2%',
      trendUp: true
    },
    {
      title: 'Customers',
      value: uniqueCustomers,
      icon: FiUsers,
      color: 'bg-purple-100 text-purple-600',
      trend: '+15.3%',
      trendUp: true
    },
    {
      title: 'Delivered',
      value: deliveredOrders.length,
      icon: FiPackage,
      color: 'bg-pink-100 text-pink-600',
      trend: `${((deliveredOrders.length / Math.max(orders.length, 1)) * 100).toFixed(1)}%`,
      trendUp: true
    }
  ];

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
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
      {/* Date Range Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dateRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${dateRange === range.id
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                }
              `}
            >
              {range.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-sm font-medium text-gray-700">
            <FiDownload className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <FiRefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trendUp ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Revenue Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5">
            <p className="text-sm text-green-700 font-medium">Paid Orders Revenue</p>
            <p className="text-3xl font-bold text-green-800 mt-2">
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-green-600 mt-2">{paidOrders.length} paid orders</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5">
            <p className="text-sm text-blue-700 font-medium">Selected Period</p>
            <p className="text-3xl font-bold text-blue-800 mt-2">
              ₹{filteredRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-blue-600 mt-2">{filteredOrders.length} orders in period</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5">
            <p className="text-sm text-amber-700 font-medium">Pending Orders</p>
            <p className="text-3xl font-bold text-amber-800 mt-2">{pendingOrders.length}</p>
            <p className="text-xs text-amber-600 mt-2">Awaiting processing</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="space-y-4">
            {Object.entries(statusCounts).map(([status, count]) => {
              const percentage = orders.length ? (count / orders.length) * 100 : 0;
              const colors = {
                'Pending': 'bg-yellow-500',
                'Processing': 'bg-blue-500',
                'Packed': 'bg-purple-500',
                'Out for Delivery': 'bg-cyan-500',
                'Delivered': 'bg-green-500'
              };
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-medium text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors[status] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <div className="text-center py-8">
              <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No sales data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-500">
                    {index + 1}
                  </div>
                  <img
                    src={product.image || '/default-image.jpg'}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.quantity} sold</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{product.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 10).map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    #{order._id?.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.user?.name || order.user?.email || 'Customer'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(order.placedAt || order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    ₹{order.amount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
