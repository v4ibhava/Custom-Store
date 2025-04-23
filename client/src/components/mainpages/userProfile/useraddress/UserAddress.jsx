import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import './UserAddress.css';

const UserAddress = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  // Fetch addresses
  useEffect(() => {
    const getAddresses = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/user/addresses', {
          headers: { Authorization: token }
        });
        setAddresses(res.data);
      } catch (err) {
        alert(err.response?.data?.msg || 'Error fetching addresses');
      } finally {
        setLoading(false);
      }
    };
    getAddresses();
  }, [token]);

  // Handle input change for new/editing address
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (editingAddress) {
      setEditingAddress({ ...editingAddress, [name]: inputValue });
    } else {
      setNewAddress({ ...newAddress, [name]: inputValue });
    }
  };

  // Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/user/address', newAddress, {
        headers: { Authorization: token }
      });
      setAddresses(res.data.addresses);
      setNewAddress({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false
      });
      alert('Address added successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding address');
    }
  };

  // Update address
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/user/address/${editingAddress._id}`, editingAddress, {
        headers: { Authorization: token }
      });
      setAddresses(res.data.addresses);
      setEditingAddress(null);
      alert('Address updated successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating address');
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const res = await axios.delete(`/user/address/${addressId}`, {
          headers: { Authorization: token }
        });
        setAddresses(res.data.addresses);
        alert('Address deleted successfully');
      } catch (err) {
        alert(err.response?.data?.msg || 'Error deleting address');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="address-container">
      <h2>My Addresses</h2>

      {/* Address List */}
      <div className="addresses-list">
        {addresses.map((address) => (
          <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
            {editingAddress && editingAddress._id === address._id ? (
              <form onSubmit={handleUpdateAddress} className="address-form">
                <input
                  type="text"
                  name="street"
                  value={editingAddress.street}
                  onChange={handleInputChange}
                  placeholder="Street"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={editingAddress.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  required
                />
                <input
                  type="text"
                  name="state"
                  value={editingAddress.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  value={editingAddress.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  required
                />
                <input
                  type="text"
                  name="country"
                  value={editingAddress.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  required
                />
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={editingAddress.isDefault}
                    onChange={handleInputChange}
                  />
                  Set as default
                </label>
                <div className="button-group">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingAddress(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="address-details">
                  {address.isDefault && <span className="default-badge">Default</span>}
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.postalCode}</p>
                  <p>{address.country}</p>
                </div>
                <div className="address-actions">
                  <button onClick={() => setEditingAddress(address)}>Edit</button>
                  <button onClick={() => handleDeleteAddress(address._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New Address Form */}
      <div className="add-address-section">
        <h3>Add New Address</h3>
        <form onSubmit={handleAddAddress} className="address-form">
          <input
            type="text"
            name="street"
            value={newAddress.street}
            onChange={handleInputChange}
            placeholder="Street"
            required
          />
          <input
            type="text"
            name="city"
            value={newAddress.city}
            onChange={handleInputChange}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            value={newAddress.state}
            onChange={handleInputChange}
            placeholder="State"
            required
          />
          <input
            type="text"
            name="postalCode"
            value={newAddress.postalCode}
            onChange={handleInputChange}
            placeholder="Postal Code"
            required
          />
          <input
            type="text"
            name="country"
            value={newAddress.country}
            onChange={handleInputChange}
            placeholder="Country"
            required
          />
          <label>
            <input
              type="checkbox"
              name="isDefault"
              checked={newAddress.isDefault}
              onChange={handleInputChange}
            />
            Set as default
          </label>
          <button type="submit">Add Address</button>
        </form>
      </div>
    </div>
  );
};

export default UserAddress
