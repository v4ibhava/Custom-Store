import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';

const OrderDetails = () => {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [orderDetails, setOrderDetails] = useState(null);
  const [token] = state.token;
  const params = useParams();

  useEffect(() => {
    if(params.id) {
      const getOrderDetails = async () => {
        try {
          const res = await axios.get(`/api/payment/${params.id}`, {
            headers: { Authorization: token }
          });
          setOrderDetails(res.data);
        } catch (err) {
          console.error(err.response.data.msg);
        }
      };
      getOrderDetails();
    }
  }, [params.id, token]);

  if(!orderDetails) return <div>Loading...</div>;

  return (
    <div className="order-details">
      <h2>Order Details</h2>
      
      <div className="order-info">
        <p><strong>Order ID:</strong> {orderDetails._id}</p>
        <p><strong>Date:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {orderDetails.status}</p>
      </div>

      <div className="order-items">
        <h3>Items</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.cart.map(item => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="order-total">
        <h3>Total: ${orderDetails.total}</h3>
      </div>
    </div>
  );
};

export default OrderDetails;