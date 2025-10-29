import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { FiHome, FiMapPin, FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi';

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
    // Basic front-end validation
    const { street, city, postalCode } = newAddress;
    if (!street?.trim() || !city?.trim() || !postalCode?.trim()) {
      alert('Please fill street, city and pincode.');
      return;
    }
    if (!/^\d{4,10}$/.test(postalCode.trim())) {
      alert('Please enter a valid pincode.');
      return;
    }
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

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  const AddressForm = ({ data, onSubmit, isEditing = false }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <input
            type="text"
            name="street"
            value={data.street}
            onChange={handleInputChange}
            placeholder="Street Address"
            className="input input-bordered w-full"
            autoFocus={true}
            required
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={handleInputChange}
            placeholder="City"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            name="state"
            value={data.state}
            onChange={handleInputChange}
            placeholder="State"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control">
          <input
            type="text"
            name="postalCode"
            value={data.postalCode}
            onChange={handleInputChange}
            placeholder="Postal Code"
            className="input input-bordered w-full"
            inputMode="numeric"
            pattern="\\d{4,10}"
            required
          />
        </div>
        <div className="form-control md:col-span-2">
          <input
            type="text"
            name="country"
            value={data.country}
            onChange={handleInputChange}
            placeholder="Country"
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            name="isDefault"
            checked={data.isDefault}
            onChange={handleInputChange}
            className="checkbox checkbox-primary"
          />
          <span className="label-text">Set as default address</span>
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        {isEditing && (
          <button
            type="button"
            onClick={() => setEditingAddress(null)}
            className="btn btn-ghost"
          >
            <FiX className="w-4 h-4 mr-1" /> Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          <FiCheck className="w-4 h-4 mr-1" />
          {isEditing ? 'Save Changes' : 'Add Address'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <FiHome className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">My Addresses</h2>
      </div>

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {addresses.map((address) => (
          <div
            key={address._id}
            className={`card bg-base-100 shadow-lg ${
              address.isDefault ? 'border-2 border-primary' : ''
            }`}
          >
            {editingAddress && editingAddress._id === address._id ? (
              <div className="card-body">
                <h3 className="card-title">Edit Address</h3>
                <AddressForm
                  data={editingAddress}
                  onSubmit={handleUpdateAddress}
                  isEditing={true}
                />
              </div>
            ) : (
              <div className="card-body">
                {address.isDefault && (
                  <div className="badge badge-primary mb-2">Default Address</div>
                )}
                <div className="flex items-start gap-2">
                  <FiMapPin className="w-5 h-5 mt-1 text-gray-500" />
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => setEditingAddress(address)}
                    className="btn btn-ghost btn-sm"
                  >
                    <FiEdit2 className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Address */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            Add New Address
          </h3>
          <AddressForm data={newAddress} onSubmit={handleAddAddress} />
        </div>
      </div>
    </div>
  );
};

export default UserAddress
