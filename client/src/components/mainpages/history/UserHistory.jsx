import React, { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
import './history.css';

const UserHistory = () => {
  const state = useContext(GlobalState);
  const [history, setHistory] = useState([]);
  const [token] = state.token;
  const [isAdmin] = state.userAPI.isAdmin;

  useEffect(() => {
    if(token) {
      const getHistory = async () => {
        try {
          if(isAdmin) {
            const res = await axios.get('/api/payment', {
              headers: { Authorization: token }
            });
            setHistory(res.data);
          } else {
            const res = await axios.get('/user/history', {
              headers: { Authorization: token }
            });
            setHistory(res.data);
          }
        } catch (err) {
          console.error(err.response.data.msg);
        }
      };
      getHistory();
    }
  }, [token, isAdmin]);

  return (
    <div className="history-page">
      <h2>History</h2>
      <h4>You have {history.length} ordered</h4>

      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Date of Purchase</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item._id}>
                <td>{item.paymentID}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{item.status}</td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => window.location.href = `/history/${item._id}`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserHistory;
