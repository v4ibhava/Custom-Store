import React, { useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import './Profile.css';
import UserHistory from '../history/UserHistory';

const Profile = () => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [, setIsLogged] = state.userAPI.isLogged;
  const [, setIsAdmin] = state.userAPI.isAdmin;
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();

  const logoutUser = useCallback(async () => {
    try {
      await axios.get("/user/logout");
      localStorage.removeItem("firstLogin");
      setIsAdmin(false);
      setIsLogged(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  }, [setIsLogged, setIsAdmin, navigate]);

  const renderContent = () => {
    switch(activeSection) {
      case 'orders':
        return <UserHistory />;
      case 'profile':
        return (
          <div className="content-section profile-info">
            <h2>Profile Information</h2>
            <div className="profile-details">
              <div className="profile-field">
                <label>Name</label>
                <p>{user?.name || 'Not available'}</p>
              </div>
              <div className="profile-field">
                <label>Email</label>
                <p>{user?.email || 'Not available'}</p>
              </div>
              <div className="profile-field">
                <label>Role</label>
                <p>{user?.role === 1 ? 'Admin' : 'Customer'}</p>
              </div>
            </div>
          </div>
        );
      case 'addresses':
        return <div className="content-section">Manage Addresses Content</div>;
      case 'upi':
        return <div className="content-section">Saved UPI Content</div>;
      case 'cards':
        return <div className="content-section">Saved Cards Content</div>;
      case 'coupons':
        return <div className="content-section">My Coupons Content</div>;
      case 'reviews':
        return <div className="content-section">My Reviews & Ratings Content</div>;
      case 'wishlist':
        return <div className="content-section">My Wishlist Content</div>;
      default:
        return <div className="content-section">Select an option</div>;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="sidebar-section">
          <h3>MY ORDERS</h3>
          <ul>
            <li 
              className={activeSection === 'orders' ? 'active' : ''}
              onClick={() => setActiveSection('orders')}
            >
              Orders History
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>ACCOUNT SETTINGS</h3>
          <ul>
            <li 
              className={activeSection === 'profile' ? 'active' : ''}
              onClick={() => setActiveSection('profile')}
            >
              Profile Information
            </li>
            <li 
              className={activeSection === 'addresses' ? 'active' : ''}
              onClick={() => setActiveSection('addresses')}
            >
              Manage Addresses
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>PAYMENTS</h3>
          <ul>
            <li 
              className={activeSection === 'upi' ? 'active' : ''}
              onClick={() => setActiveSection('upi')}
            >
              Saved UPI
            </li>
            <li 
              className={activeSection === 'cards' ? 'active' : ''}
              onClick={() => setActiveSection('cards')}
            >
              Saved Cards
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3>MY STUFF</h3>
          <ul>
            <li 
              className={activeSection === 'coupons' ? 'active' : ''}
              onClick={() => setActiveSection('coupons')}
            >
              My Coupons
            </li>
            <li 
              className={activeSection === 'reviews' ? 'active' : ''}
              onClick={() => setActiveSection('reviews')}
            >
              My Reviews & Ratings
            </li>
            <li 
              className={activeSection === 'wishlist' ? 'active' : ''}
              onClick={() => setActiveSection('wishlist')}
            >
              My Wishlist
            </li>
            <li>
              <Link to="/" onClick={logoutUser} className="logout-link">Logout</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="profile-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;
