import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { FiSmartphone, FiTrash2, FiPlus, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SavedUPI = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [upis, setUpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUpi, setNewUpi] = useState({
    upiId: '',
    isDefault: false
  });

  const getUpis = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/user/upi', {
        headers: { Authorization: token }
      });
      setUpis(res.data.upis || res.data || []);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.data?.msg?.toLowerCase().includes('no upi')) {
        setUpis([]);
      } else {
        alert(err.response?.data?.msg || 'Error fetching UPI IDs');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUpis();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUpi({
      ...newUpi,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddUpi = async (e) => {
    e.preventDefault();
    if (!newUpi.upiId.includes('@')) {
      alert('Must be a valid UPI ID');
      return;
    }
    try {
      const res = await axios.post('/user/upi', newUpi, {
        headers: { Authorization: token }
      });
      setUpis(res.data.upis);
      setNewUpi({ upiId: '', isDefault: false });
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding UPI ID');
    }
  };

  const handleDeleteUpi = async (upiId) => {
    if (window.confirm('Are you sure you want to delete this UPI ID?')) {
      try {
        const res = await axios.delete(`/user/upi/${upiId}`, {
          headers: { Authorization: token }
        });
        setUpis(res.data.upis);
      } catch (err) {
        alert(err.response?.data?.msg || 'Error deleting UPI ID');
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-400">Loading payment methods...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900">UPI IDs</h2>
          <p className="text-gray-500 text-sm mt-1">Manage single-tap payment options</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-3 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-xl font-bold transition-colors"
        >
          <FiPlus /> Add UPI Handle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnimatePresence>
          {upis.map((upi) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={upi._id}
              className={`bg-white p-6 rounded-3xl border shadow-sm transition-all group flex items-start justify-between ${upi.isDefault ? 'border-pink-500 ring-4 ring-pink-50' : 'border-gray-100 hover:shadow-md hover:border-pink-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-[1.25rem] flex items-center justify-center shadow-inner ${upi.isDefault ? 'bg-pink-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <FiSmartphone className="size-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg mb-1">{upi.upiId}</p>
                  {upi.isDefault ? (
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full inline-block">Default Account</span>
                  ) : (
                    <span className="text-xs font-bold text-gray-400">Secondary Account</span>
                  )}
                </div>
              </div>
              <button onClick={() => handleDeleteUpi(upi._id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors">
                <FiTrash2 className="size-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {upis.length === 0 && !showForm && (
        <div className="text-center py-16 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 mt-4 mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
            <FiSmartphone className="size-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">UPI Setup Needed</h3>
          <p className="text-gray-500 text-sm mb-6">Connect your standard UPI ID for ultra-fast transactions.</p>
          <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
            Setup UPI
          </button>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddUpi}
            className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100"
          >
            <div className="mb-6">
              <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">UPI Address / Handle</label>
              <div className="relative">
                <input type="text" name="upiId" value={newUpi.upiId} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-pink-50 font-bold text-gray-900" placeholder="you@okbank" />
                <FiSmartphone className="absolute top-1/2 left-5 -translate-y-1/2 text-gray-400 size-5" />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer py-2 px-1 w-fit mb-6">
              <div className="relative flex items-center">
                <input type="checkbox" name="isDefault" checked={newUpi.isDefault} onChange={handleInputChange} className="peer sr-only" />
                <div className="w-6 h-6 rounded-md bg-white border border-gray-200 peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-colors shadow-sm"></div>
                <FiCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity size-4" />
              </div>
              <span className="text-sm font-bold text-gray-600">Set as preferred gateway</span>
            </label>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button type="submit" className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                Connect Account
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-4 bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-sm border border-gray-200">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedUPI;
