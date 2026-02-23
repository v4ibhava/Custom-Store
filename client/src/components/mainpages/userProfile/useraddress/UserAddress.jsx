import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { FiMapPin, FiEdit2, FiTrash2, FiPlus, FiCheck, FiX, FiHome } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const UserAddress = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? (checked ? true : false) : value;

    if (editingAddress) {
      setEditingAddress({ ...editingAddress, [name]: inputValue });
    } else {
      setNewAddress({ ...newAddress, [name]: inputValue });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const { street, city, postalCode } = newAddress;
    if (!street?.trim() || !city?.trim() || !postalCode?.trim()) {
      alert('Please fill street, city and pincode.');
      return;
    }
    try {
      const res = await axios.post('/user/address', newAddress, {
        headers: { Authorization: token }
      });
      setAddresses(res.data.addresses);
      setNewAddress({
        street: '', city: '', state: '', postalCode: '', country: '', isDefault: false
      });
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding address');
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/user/address/${editingAddress._id}`, editingAddress, {
        headers: { Authorization: token }
      });
      setAddresses(res.data.addresses);
      setEditingAddress(null);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const res = await axios.delete(`/user/address/${addressId}`, {
          headers: { Authorization: token }
        });
        setAddresses(res.data.addresses);
      } catch (err) {
        alert(err.response?.data?.msg || 'Error deleting address');
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-400">Loading addresses...</div>;

  const AddressForm = ({ data, onSubmit, isEditing = false }) => (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={onSubmit}
      className="space-y-6 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 mt-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Street Address</label>
          <input type="text" name="street" value={data.street} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 shadow-sm" placeholder="123 Baker St" />
        </div>
        <div>
          <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">City</label>
          <input type="text" name="city" value={data.city} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 shadow-sm" placeholder="Oven City" />
        </div>
        <div>
          <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">State</label>
          <input type="text" name="state" value={data.state} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 shadow-sm" placeholder="Sweet State" />
        </div>
        <div>
          <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Postal Code</label>
          <input type="text" name="postalCode" value={data.postalCode} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 shadow-sm" placeholder="10001" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Country</label>
          <input type="text" name="country" value={data.country} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 shadow-sm" placeholder="Country" />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer py-2 px-1">
        <div className="relative flex items-center">
          <input type="checkbox" name="isDefault" checked={data.isDefault} onChange={handleInputChange} className="peer sr-only" />
          <div className="w-6 h-6 rounded-md bg-white border border-gray-200 peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-colors"></div>
          <FiCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity size-4" />
        </div>
        <span className="text-sm font-bold text-gray-600">Set as default delivery address</span>
      </label>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button type="submit" className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
          {isEditing ? 'Save Changes' : 'Add Address'}
        </button>
        <button type="button" onClick={() => isEditing ? setEditingAddress(null) : setShowForm(false)} className="px-6 py-4 bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-sm">
          Cancel
        </button>
      </div>
    </motion.form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900">My Addresses</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your delivery locations</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingAddress(null); }}
          className="flex items-center gap-2 px-5 py-3 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-xl font-bold transition-colors"
        >
          <FiPlus /> New Address
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {addresses.map((address) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={address._id}
              className={`bg-white p-6 rounded-3xl border shadow-sm transition-all group ${address.isDefault ? 'border-pink-500 ring-4 ring-pink-50' : 'border-gray-100 hover:shadow-md hover:border-pink-200'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${address.isDefault ? 'bg-pink-50 text-pink-500' : 'bg-gray-50 text-gray-400'}`}>
                    <FiHome className="size-5" />
                  </div>
                  {address.isDefault && <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full">Default</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingAddress(address)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <FiEdit2 className="size-4" />
                  </button>
                  <button onClick={() => handleDeleteAddress(address._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-900">{address.street}</p>
                <p className="text-sm text-gray-500">{address.city}, {address.state} {address.postalCode}</p>
                <p className="text-sm text-gray-400 font-medium">{address.country}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {addresses.length === 0 && !showForm && (
          <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
              <FiMapPin className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Addresses Saved</h3>
            <p className="text-gray-500 text-sm mb-6">Add a delivery address to make checkout faster.</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
              Add Now
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(showForm || editingAddress) && (
          <AddressForm
            data={editingAddress || newAddress}
            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
            isEditing={!!editingAddress}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserAddress;
