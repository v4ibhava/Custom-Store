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
  const [newUpi, setNewUpi] = useState({ upiId: '', isDefault: false });

  const getUpis = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/user/upi', { headers: { Authorization: token } });
      setUpis(res.data.upis || res.data || []);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.data?.msg?.toLowerCase().includes('no upi')) {
        setUpis([]);
      } else { alert(err.response?.data?.msg || 'Error fetching UPI IDs'); }
    } finally { setLoading(false); }
  };

  useEffect(() => { getUpis(); }, [token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUpi({ ...newUpi, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddUpi = async (e) => {
    e.preventDefault();
    if (!newUpi.upiId.includes('@')) { alert('Must be a valid UPI ID'); return; }
    try {
      const res = await axios.post('/user/upi', newUpi, { headers: { Authorization: token } });
      setUpis(res.data.upis);
      setNewUpi({ upiId: '', isDefault: false });
      setShowForm(false);
    } catch (err) { alert(err.response?.data?.msg || 'Error adding UPI ID'); }
  };

  const handleDeleteUpi = async (upiId) => {
    if (window.confirm('Delete this UPI ID?')) {
      try {
        const res = await axios.delete(`/user/upi/${upiId}`, { headers: { Authorization: token } });
        setUpis(res.data.upis);
      } catch (err) { alert(err.response?.data?.msg || 'Error deleting'); }
    }
  };

  if (loading) return <div className="text-center py-6 text-gray-400 text-xs">Loading payment methods...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900">UPI IDs</h2>
          <p className="text-gray-500 text-xs mt-0.5">Single-tap payment options</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-lg font-bold text-xs transition-colors"
        >
          <FiPlus size={14} /> Add UPI
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3 mb-4">
        <AnimatePresence>
          {upis.map((upi) => (
            <motion.div
              layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              key={upi._id}
              className={`bg-white p-3 rounded-xl border shadow-sm transition-all flex items-start justify-between ${upi.isDefault ? 'border-pink-500 ring-2 ring-pink-50' : 'border-pink-50/50 hover:shadow-md hover:border-pink-200'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg flex items-center justify-center ${upi.isDefault ? 'bg-pink-500 text-white' : 'bg-pink-50/30 text-gray-400'}`}>
                  <FiSmartphone className="size-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{upi.upiId}</p>
                  {upi.isDefault ? (
                    <span className="text-[9px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full inline-block mt-0.5">Default</span>
                  ) : (
                    <span className="text-[10px] text-gray-400">Secondary</span>
                  )}
                </div>
              </div>
              <button onClick={() => handleDeleteUpi(upi._id)} className="p-2 bg-pink-50/30 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <FiTrash2 className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {upis.length === 0 && !showForm && (
        <div className="text-center py-10 bg-pink-50/30 rounded-xl border-2 border-dashed border-pink-100 mb-4">
          <FiSmartphone className="size-8 text-pink-200 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-900 mb-1">No UPI IDs</h3>
          <p className="text-gray-500 text-xs mb-4">Connect your UPI for fast transactions.</p>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-lg hover:bg-gray-800">Setup UPI</button>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddUpi}
            className="bg-pink-50/30 p-4 rounded-xl border border-pink-100/50 mb-4"
          >
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">UPI Address</label>
            <div className="relative mb-3">
              <input type="text" name="upiId" value={newUpi.upiId} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-pink-100 font-bold text-gray-900" placeholder="you@okbank" />
              <FiSmartphone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 size-4" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer py-1 w-fit mb-3">
              <div className="relative flex items-center">
                <input type="checkbox" name="isDefault" checked={newUpi.isDefault} onChange={handleInputChange} className="peer sr-only" />
                <div className="w-5 h-5 rounded bg-white border border-gray-200 peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-colors"></div>
                <FiCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity size-3" />
              </div>
              <span className="text-xs font-bold text-gray-600">Set as preferred</span>
            </label>

            <div className="flex gap-2 pt-3 border-t border-pink-100">
              <button type="submit" className="flex-1 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 text-xs">Connect</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-white text-gray-500 font-bold rounded-lg hover:bg-gray-100 text-xs border border-pink-100">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedUPI;
