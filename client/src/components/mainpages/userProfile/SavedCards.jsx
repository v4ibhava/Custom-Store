import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { FiCreditCard, FiTrash2, FiPlus, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SavedCards = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCard, setNewCard] = useState({ cardNumber: '', cardHolderName: '', expiryMonth: '', expiryYear: '', isDefault: false });

  const getCards = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/user/card', { headers: { Authorization: token } });
      setCards(res.data.cards || res.data || []);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.data?.msg?.toLowerCase().includes('no cards')) {
        setCards([]);
      } else { alert(err.response?.data?.msg || 'Error fetching cards'); }
    } finally { setLoading(false); }
  };

  useEffect(() => { getCards(); }, [token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCard({ ...newCard, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/user/card', newCard, { headers: { Authorization: token } });
      setCards(res.data.cards);
      setNewCard({ cardNumber: '', cardHolderName: '', expiryMonth: '', expiryYear: '', isDefault: false });
      setShowForm(false);
    } catch (err) { alert(err.response?.data?.msg || 'Error adding card'); }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Delete this card?')) {
      try {
        const res = await axios.delete(`/user/card/${cardId}`, { headers: { Authorization: token } });
        setCards(res.data.cards);
      } catch (err) { alert(err.response?.data?.msg || 'Error deleting card'); }
    }
  };

  if (loading) return <div className="text-center py-6 text-gray-400 text-xs">Loading cards...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900">Saved Cards</h2>
          <p className="text-gray-500 text-xs mt-0.5">Faster checkout</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-lg font-bold text-xs transition-colors"
        >
          <FiPlus size={14} /> New Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              key={card._id}
              className={`bg-white p-3 rounded-xl border shadow-sm transition-all ${card.isDefault ? 'border-pink-500 ring-2 ring-pink-50 bg-gradient-to-r from-pink-50/30 to-white' : 'border-pink-50/50 hover:shadow-md hover:border-pink-200'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg w-9 h-9 flex items-center justify-center ${card.isDefault ? 'bg-pink-500 text-white' : 'bg-pink-50/30 text-gray-500'}`}>
                  <FiCreditCard className="size-4" />
                </div>
                <button onClick={() => handleDeleteCard(card._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 className="size-4" />
                </button>
              </div>

              {card.isDefault && <span className="text-[9px] font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full mb-2 inline-block">Default</span>}

              <div className="font-mono text-gray-800 tracking-widest text-sm font-bold">
                <div className="flex gap-1.5">
                  <span>****</span><span>****</span><span>****</span><span>{card.cardNumber.slice(-4)}</span>
                </div>
                <div className="flex justify-between items-end mt-2 font-sans">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase text-gray-400 tracking-wider font-bold">Holder</span>
                    <span className="text-[11px] font-bold text-gray-700 truncate max-w-[100px]">{card.cardHolderName}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[8px] uppercase text-gray-400 tracking-wider font-bold">Expires</span>
                    <span className="text-[11px] font-bold text-gray-700">{card.expiryMonth}/{card.expiryYear}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {cards.length === 0 && !showForm && (
          <div className="col-span-full text-center py-10 bg-pink-50/30 rounded-xl border-2 border-dashed border-pink-100">
            <FiCreditCard className="size-8 text-pink-200 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 mb-1">No Cards Saved</h3>
            <p className="text-gray-500 text-xs mb-4">Link a card for faster checkouts.</p>
            <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-lg hover:bg-gray-800">Add Card</button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddCard}
            className="space-y-3 bg-pink-50/30 p-4 rounded-xl border border-pink-100/50 mt-3"
          >
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Card Number</label>
              <input type="text" name="cardNumber" value={newCard.cardNumber} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pink-100 font-mono tracking-widest" placeholder="1234 5678 9101 1121" maxLength="16" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Card Holder</label>
                <input type="text" name="cardHolderName" value={newCard.cardHolderName} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pink-100 uppercase" placeholder="John Doe" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Month</label>
                  <input type="text" name="expiryMonth" value={newCard.expiryMonth} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pink-100" placeholder="MM" maxLength="2" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 block">Year</label>
                  <input type="text" name="expiryYear" value={newCard.expiryYear} onChange={handleInputChange} required className="w-full bg-white border border-pink-100 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pink-100" placeholder="YY" maxLength="2" />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer py-1 w-fit">
              <div className="relative flex items-center">
                <input type="checkbox" name="isDefault" checked={newCard.isDefault} onChange={handleInputChange} className="peer sr-only" />
                <div className="w-5 h-5 rounded bg-white border border-gray-200 peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-colors"></div>
                <FiCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity size-3" />
              </div>
              <span className="text-xs font-bold text-gray-600">Make default card</span>
            </label>

            <div className="flex gap-2 pt-3 border-t border-pink-100">
              <button type="submit" className="flex-1 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 text-xs">Save Card</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-white text-gray-500 font-bold rounded-lg hover:bg-gray-100 text-xs border border-pink-100">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedCards;
