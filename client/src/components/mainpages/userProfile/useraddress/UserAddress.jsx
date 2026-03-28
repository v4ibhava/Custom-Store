import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { FiMapPin, FiEdit2, FiTrash2, FiPlus, FiCheck, FiHome } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const UserAddress = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', postalCode: '', country: '', isDefault: false });

  useEffect(() => {
    const getAddresses = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/user/addresses', { headers: { Authorization: token } });
        setAddresses(res.data);
      } catch (err) { alert(err.response?.data?.msg || 'Error fetching addresses'); }
      finally { setLoading(false); }
    };
    getAddresses();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    if (editingAddress) {
      setEditingAddress({ ...editingAddress, [name]: inputValue });
    } else {
      setNewAddress({ ...newAddress, [name]: inputValue });
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const { street, city, postalCode } = newAddress;
    if (!street?.trim() || !city?.trim() || !postalCode?.trim()) { alert('Please fill street, city and pincode.'); return; }
    try {
      const res = await axios.post('/user/address', newAddress, { headers: { Authorization: token } });
      setAddresses(res.data.addresses);
      setNewAddress({ street: '', city: '', state: '', postalCode: '', country: '', isDefault: false });
      setShowForm(false);
    } catch (err) { alert(err.response?.data?.msg || 'Error adding address'); }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/user/address/${editingAddress._id}`, editingAddress, { headers: { Authorization: token } });
      setAddresses(res.data.addresses);
      setEditingAddress(null);
    } catch (err) { alert(err.response?.data?.msg || 'Error updating address'); }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Delete this address?')) {
      try {
        const res = await axios.delete(`/user/address/${addressId}`, { headers: { Authorization: token } });
        setAddresses(res.data.addresses);
      } catch (err) { alert(err.response?.data?.msg || 'Error deleting address'); }
    }
  };

  if (loading) return <div className="text-center py-6 text-gray-400 text-xs">Loading addresses...</div>;

  const AddressForm = ({ data, onSubmit, isEditing = false }) => (
    <motion.form
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
      onSubmit={onSubmit}
      className="space-y-3 bg-pink-50/30 p-4 rounded-xl border border-pink-100/50 mt-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Street</label>
          <input type="text" name="street" value={data.street} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pink-100" placeholder="123 Baker St" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">City</label>
          <input type="text" name="city" value={data.city} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pink-100" placeholder="Oven City" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">State</label>
          <input type="text" name="state" value={data.state} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pink-100" placeholder="Sweet State" />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Postal Code</label>
          <input type="text" name="postalCode" value={data.postalCode} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pink-100" placeholder="10001" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Country</label>
          <input type="text" name="country" value={data.country} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pink-100" placeholder="Country" />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer py-1">
        <div className="relative flex items-center">
          <input type="checkbox" name="isDefault" checked={data.isDefault} onChange={handleInputChange} className="peer sr-only" />
          <div className="w-5 h-5 rounded bg-white border border-gray-200 peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-colors"></div>
          <FiCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity size-3" />
        </div>
        <span className="text-xs font-bold text-gray-600">Set as default address</span>
      </label>

      <div className="flex gap-2 pt-3 border-t border-pink-100">
        <button type="submit" className="flex-1 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 text-xs">
          {isEditing ? 'Save Changes' : 'Add Address'}
        </button>
        <button type="button" onClick={() => isEditing ? setEditingAddress(null) : setShowForm(false)} className="px-4 py-2 bg-white text-gray-500 font-bold rounded-lg hover:bg-gray-100 text-xs border border-pink-100">Cancel</button>
      </div>
    </motion.form>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900">My Addresses</h2>
          <p className="text-gray-500 text-xs mt-0.5">Delivery locations</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingAddress(null); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-lg font-bold text-xs transition-colors"
        >
          <FiPlus size={14} /> New Address
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3">
        <AnimatePresence>
          {addresses.map((address) => (
            <motion.div
              layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              key={address._id}
              className={`bg-white p-3 rounded-xl border shadow-sm transition-all ${address.isDefault ? 'border-pink-500 ring-2 ring-pink-50' : 'border-pink-50/50 hover:shadow-md hover:border-pink-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${address.isDefault ? 'bg-pink-50 text-pink-500' : 'bg-pink-50/30 text-gray-400'}`}>
                    <FiHome className="size-4" />
                  </div>
                  {address.isDefault && <span className="text-[9px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">Default</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingAddress(address)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <FiEdit2 className="size-3.5" />
                  </button>
                  <button onClick={() => handleDeleteAddress(address._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-900 text-sm">{address.street}</p>
                <p className="text-xs text-gray-500">{address.city}, {address.state} {address.postalCode}</p>
                <p className="text-[10px] text-gray-400 font-medium">{address.country}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {addresses.length === 0 && !showForm && (
          <div className="col-span-full text-center py-10 bg-pink-50/30 rounded-xl border-2 border-dashed border-pink-100">
            <FiMapPin className="size-8 text-pink-200 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">No Addresses</h3>
            <p className="text-gray-500 text-xs mb-4">Add an address for faster checkout.</p>
            <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-lg hover:bg-gray-800">Add Now</button>
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
