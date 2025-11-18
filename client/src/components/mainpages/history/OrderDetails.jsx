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
        const { data } = await axios.get(`/api/orders/${params.id}`, {
          headers: { Authorization: token }
        });
        setOrderDetails(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.msg || 'Unable to load order details.');
        setOrderDetails(null);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [params.id, token]);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-500">
        Please sign in to view your order.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
        <Link to="/history" className="text-primary hover:text-primary-focus text-sm font-medium">
          ← Back to orders
        </Link>
      </div>
    );
  }

  if (!orderDetails) return null;

  const {
    _id,
    status,
    paymentStatus,
    paymentMode,
    razorpayPaymentId,
    razorpayOrderId,
    items = [],
    amount,
    address,
    placedAt,
    createdAt,
    deliveredAt
  } = orderDetails;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/history" className="text-primary hover:text-primary-focus text-sm font-medium">
          ← Back to orders
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-gray-900">Order #{_id.slice(-6).toUpperCase()}</h2>
          <p className="text-sm text-gray-500">
            Placed on {new Date(placedAt || createdAt).toLocaleString()}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-100 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Order Status</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{status}</p>
            {deliveredAt && (
              <p className="text-xs text-gray-500 mt-1">
                Delivered on {new Date(deliveredAt).toLocaleString()}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-gray-100 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Payment</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {paymentStatus} {paymentMode ? `• ${paymentMode}` : ''}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {razorpayPaymentId || razorpayOrderId || 'Awaiting confirmation'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">₹{Number(amount || 0).toFixed(2)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Items</h3>
          <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.productId} className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 gap-2">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-gray-900 font-medium">
                  ₹{Number(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No items found for this order.
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Address</h3>
          <div className="rounded-lg border border-gray-100 p-4 text-sm text-gray-600 leading-relaxed">
            {address ? (
              <>
                <div>{address.street}</div>
                <div>{address.city}, {address.state} {address.postalCode}</div>
                <div>{address.country}</div>
              </>
            ) : (
              <div>No address found for this order.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;