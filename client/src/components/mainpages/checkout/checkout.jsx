import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import { FiMapPin, FiCreditCard, FiSmartphone, FiDollarSign, FiCheck, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import BakingAnimation from './BakingAnimation';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const [cart] = state.userAPI.cart;
  const [token] = state.token;

  // Get items either from direct buy or cart
  const checkoutItems = location.state?.isBuyNow ? location.state.items : cart;
  
  // Calculate total based on checkout items
  const total = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentStep, setPaymentStep] = useState(false);
  const [savedUPIs, setSavedUPIs] = useState([]);
  const [upiError, setUpiError] = useState(null);
  const [savedCards, setSavedCards] = useState([]);
  const [cardError, setCardError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Fetch addresses
  useEffect(() => {
    const getAddresses = async () => {
      try {
        const res = await axios.get('/user/addresses', {
          headers: { Authorization: token }
        });
        setAddresses(res.data);
        // Set default address if exists
        const defaultAddress = res.data.find(addr => addr.isDefault);
        if (defaultAddress) setSelectedAddress(defaultAddress);
      } catch (err) {
        console.error('Error fetching addresses:', err);
      }
    };
    getAddresses();
  }, [token]);

  // Fetch saved payment methods when payment step is active
  useEffect(() => {
    if (paymentStep) {
      const fetchPaymentMethods = async () => {
        try {
          // First, log the token to ensure it's present
          console.log('Token present:', !!token);

          const upiRes = await axios.get('/user/upi', {
            headers: { Authorization: token }
          });

          // Log the full response
          console.log('UPI Response:', upiRes);
          console.log('UPI Data:', upiRes.data);

          if (upiRes.data && Array.isArray(upiRes.data.upis)) {
            setSavedUPIs(upiRes.data.upis);
            console.log('Saved UPIs set to:', upiRes.data.upis);
          } else {
            console.warn('UPI data structure unexpected:', upiRes.data);
            setSavedUPIs([]);
          }

        } catch (err) {
          console.error('Error fetching UPIs:', err);
          setUpiError(err.message);
          setSavedUPIs([]);
        }
      };

      fetchPaymentMethods();
    }
  }, [paymentStep, token]);

  useEffect(() => {
    if (paymentStep) {
      const fetchPaymentMethods = async () => {
        try {
          const cardRes = await axios.get('/user/cards', {
            headers: { Authorization: token }
          });
          
          console.log('Card Response:', cardRes.data); // Debug log
          setSavedCards(cardRes.data.cards || []);
          
        } catch (err) {
          console.error('Error fetching cards:', err);
          setCardError(err.message);
          setSavedCards([]);
        }
      };

      fetchPaymentMethods();
    }
  }, [paymentStep, token]);

  const handleContinueToPayment = () => {
    if (!selectedAddress) return;
    setPaymentStep(true);
  };

  const handlePaymentMethodSelect = (method, details = null) => {
    setSelectedPaymentMethod(method);
    // For COD, we don't need payment details
    setSelectedPaymentDetails(method === 'COD' ? null : details);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Only check for payment details if the method is not COD
    if (selectedPaymentMethod !== 'COD' && !selectedPaymentDetails) {
      alert('Please select payment details');
      return;
    }

    setProcessing(true);
    try {
      // Add order to user's history
      const response = await axios.post('/user/order', {
        cart: checkoutItems,
        total: total,
        address: selectedAddress,
        paymentMethod: selectedPaymentMethod,
        paymentDetails: selectedPaymentMethod === 'COD' ? null : selectedPaymentDetails
      }, {
        headers: { Authorization: token }
      });

      // If this was a cart purchase (not Buy Now), clear the cart
      if (!location.state?.isBuyNow) {
        await axios.put('/user/cart', { cart: [] }, {
          headers: { Authorization: token }
        });
      }

      // Navigate to receipt page with order details
      navigate('/receipt', { 
        state: { 
          orderDetails: {
            orderId: response.data.orderId,
            items: checkoutItems,
            total: total,
            date: new Date(),
            address: selectedAddress,
            paymentMethod: selectedPaymentMethod,
            paymentDetails: selectedPaymentMethod === 'COD' ? null : selectedPaymentDetails
          }
        }
      });

    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Selection */}
          {!paymentStep && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiMapPin className="text-primary" />
                Select Delivery Address
              </h2>
              <div className="space-y-4">
                {addresses.length > 0 ? (
                  addresses.map(address => (
                    <label
                      key={address._id}
                      className={`block p-4 border rounded-lg cursor-pointer transition-colors
                        ${selectedAddress?._id === address._id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-primary/50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?._id === address._id}
                          onChange={() => setSelectedAddress(address)}
                          className="mt-1 radio radio-primary"
                        />
                        <div>
                          {address.isDefault && (
                            <span className="badge badge-primary mb-2">Default</span>
                          )}
                          <p className="font-medium">{address.street}</p>
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No delivery addresses found</p>
                    <Link 
                      to="/user-address" 
                      className="btn btn-primary"
                    >
                      <FiPlus className="w-4 h-4 mr-2" />
                      Add New Address
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Selection */}
          {paymentStep && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiCreditCard className="text-primary" />
                Select Payment Method
              </h2>
              
              {/* Payment Options */}
              <div className="space-y-4">
                {/* UPI Section */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <FiSmartphone /> UPI
                  </h3>
                  {upiError ? (
                    <div className="text-red-500 mb-3">Error: {upiError}</div>
                  ) : savedUPIs && savedUPIs.length > 0 ? (
                    savedUPIs.map(upi => (
                      <label
                        key={upi._id}
                        className={`block p-3 border rounded-lg cursor-pointer mb-2
                          ${selectedPaymentMethod === 'UPI' && selectedPaymentDetails?._id === upi._id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={selectedPaymentMethod === 'UPI' && selectedPaymentDetails?._id === upi._id}
                            onChange={() => handlePaymentMethodSelect('UPI', upi)}
                            className="radio radio-primary"
                          />
                          <div>
                            <span className="font-medium">{upi.upiId}</span>
                            {upi.name && <p className="text-sm text-gray-600">{upi.name}</p>}
                          </div>
                          {upi.isDefault && <span className="badge badge-primary">Default</span>}
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-3">No UPI IDs saved</p>
                      <Link
                        to="/saved-upi"
                        className="btn btn-outline btn-sm"
                      >
                        <FiPlus className="w-4 h-4 mr-1" />
                        Add New UPI
                      </Link>
                    </div>
                  )}
                </div>

                {/* Credit Card Section */}
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <FiCreditCard /> Credit/Debit Cards
                  </h3>
                  {cardError ? (
                    <div className="text-red-500 mb-3">Error: {cardError}</div>
                  ) : savedCards && savedCards.length > 0 ? (
                    savedCards.map(card => (
                      <label
                        key={card._id}
                        className={`block p-3 border rounded-lg cursor-pointer mb-2
                          ${selectedPaymentMethod === 'CARD' && selectedPaymentDetails?._id === card._id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="payment"
                            checked={selectedPaymentMethod === 'CARD' && selectedPaymentDetails?._id === card._id}
                            onChange={() => handlePaymentMethodSelect('CARD', card)}
                            className="radio radio-primary"
                          />
                          <div>
                            <span className="font-medium">{card.cardNumber}</span>
                            <p className="text-sm text-gray-600">
                              {card.cardHolderName} • Expires {card.expiryMonth}/{card.expiryYear}
                            </p>
                          </div>
                          {card.isDefault && <span className="badge badge-primary">Default</span>}
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-3">No saved cards</p>
                      <Link
                        to="/saved-cards"
                        className="btn btn-outline btn-sm"
                      >
                        <FiPlus className="w-4 h-4 mr-1" />
                        Add New Card
                      </Link>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <label className="block p-3 border rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPaymentMethod === 'COD'}
                      onChange={() => handlePaymentMethodSelect('COD')}
                      className="radio radio-primary"
                    />
                    <div className="flex items-center gap-2">
                      <FiDollarSign />
                      <span>Cash on Delivery</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {checkoutItems.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.title} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!paymentStep ? (
              <button
                onClick={handleContinueToPayment}
                disabled={!selectedAddress}
                className="btn btn-primary w-full mt-6"
              >
                Continue to Payment
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedPaymentMethod}
                className="btn btn-primary w-full mt-6"
              >
                Place Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
