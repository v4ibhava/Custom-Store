import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheck, FiShoppingBag } from 'react-icons/fi';

const ReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    navigate('/');
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Success Header */}
        <div className="bg-primary text-white p-6 rounded-t-lg text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="mt-2">Thank you for your purchase</p>
        </div>

        {/* Order Details */}
        <div className="p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Order Details</h2>
            <p className="text-gray-600">Order Number: {orderDetails.orderId}</p>
            <p className="text-gray-600">Date: {formatDate(orderDetails.date)}</p>
          </div>

          {/* Items */}
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Items</h2>
            <div className="space-y-2">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.title} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
            <p className="text-gray-600">Method: {orderDetails.paymentMethod}</p>
            {orderDetails.paymentDetails && (
              <p className="text-gray-600">
                {orderDetails.paymentMethod === 'UPI' && `UPI ID: ${orderDetails.paymentDetails.upiId}`}
                {orderDetails.paymentMethod === 'CARD' && `Card ending in: ${orderDetails.paymentDetails.cardNumber.slice(-4)}`}
                {orderDetails.paymentMethod === 'COD' && 'Cash on Delivery'}
              </p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
            <p className="text-gray-600">{orderDetails.address.street}</p>
            <p className="text-gray-600">
              {orderDetails.address.city}, {orderDetails.address.state} {orderDetails.address.postalCode}
            </p>
            <p className="text-gray-600">{orderDetails.address.country}</p>
          </div>

          {/* Total */}
          <div className="mb-6">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>₹{orderDetails.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
          >
            <FiShoppingBag />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;