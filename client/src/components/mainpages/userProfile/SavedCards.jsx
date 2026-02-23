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
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false
  });

  const getCards = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/user/card', {
        headers: { Authorization: token }
      });
      setCards(res.data.cards || res.data || []);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.data?.msg?.toLowerCase().includes('no cards')) {
        setCards([]);
      } else {
        alert(err.response?.data?.msg || 'Error fetching cards');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCards();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCard({
      ...newCard,
      [name]: type === 'checkbox' ? (checked ? true : false) : value
    });
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/user/card', newCard, {
        headers: { Authorization: token }
      });
      setCards(res.data.cards);
      setNewCard({
        cardNumber: '', cardHolderName: '', expiryMonth: '', expiryYear: '', isDefault: false
      });
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        const res = await axios.delete(`/user/card/${cardId}`, {
          headers: { Authorization: token }
        });
        setCards(res.data.cards);
      } catch (err) {
        alert(err.response?.data?.msg || 'Error deleting card');
      }
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-400">Loading cards...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Saved Cards</h2>
          <p className="text-gray-500 text-sm mt-1">Manage credit/debit cards for faster checkout</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-3 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-xl font-bold transition-colors"
        >
          <FiPlus /> New Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={card._id}
              className={`bg-white p-6 rounded-3xl border shadow-sm transition-all group ${card.isDefault ? 'border-pink-500 ring-4 ring-pink-50 bg-gradient-to-r from-pink-50 to-white' : 'border-gray-100 hover:shadow-md hover:border-pink-200'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center ${card.isDefault ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <FiCreditCard className="size-5" />
                  </div>
                  {card.isDefault && <span className="text-[10px] font-black uppercase tracking-widest text-pink-600 bg-white shadow-sm px-3 py-1.5 rounded-full mt-2 self-start ring-1 ring-pink-100">Default</span>}
                </div>
                <button onClick={() => handleDeleteCard(card._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0">
                  <FiTrash2 className="size-5" />
                </button>
              </div>

              <div className="space-y-1 mt-auto font-mono text-gray-800 tracking-widest text-lg font-bold">
                <div className="flex gap-2">
                  <span>****</span>
                  <span>****</span>
                  <span>****</span>
                  <span>{card.cardNumber.slice(-4)}</span>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div className="flex flex-col font-sans">
                    <span className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Card Holder</span>
                    <span className="text-sm font-bold text-gray-700">{card.cardHolderName}</span>
                  </div>
                  <div className="flex flex-col text-right font-sans">
                    <span className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Expires</span>
                    <span className="text-sm font-bold text-gray-700">{card.expiryMonth}/{card.expiryYear}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {cards.length === 0 && !showForm && (
          <div className="col-span-full text-center py-16 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-300">
              <FiCreditCard className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Cards Found</h3>
            <p className="text-gray-500 text-sm mb-6">Link a card to your account for faster checkouts.</p>
            <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
              Add Card Now
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddCard}
            className="space-y-6 bg-gray-50 p-6 rounded-[2rem] border border-gray-100 mt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Card Number</label>
                <input type="text" name="cardNumber" value={newCard.cardNumber} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 shadow-sm font-mono tracking-widest" placeholder="1234 5678 9101 1121" maxLength="16" />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2 block">Card Holder Name</label>
                <input type="text" name="cardHolderName" value={newCard.cardHolderName} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 shadow-sm uppercase placeholder:normal-case font-bold" placeholder="John Doe" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Exp Month</label>
                  <input type="text" name="expiryMonth" value={newCard.expiryMonth} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 shadow-sm" placeholder="MM" maxLength="2" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Exp Year</label>
                  <input type="text" name="expiryYear" value={newCard.expiryYear} onChange={handleInputChange} required className="w-full bg-white border-none rounded-2xl p-4 text-sm focus:ring-4 focus:ring-pink-50 shadow-sm" placeholder="YY" maxLength="2" />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer py-2 px-1 w-fit">
              <div className="relative flex items-center">
                <input type="checkbox" name="isDefault" checked={newCard.isDefault} onChange={handleInputChange} className="peer sr-only" />
                <div className="w-6 h-6 rounded-md bg-white border border-gray-200 peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-colors shadow-sm"></div>
                <FiCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity size-4" />
              </div>
              <span className="text-sm font-bold text-gray-600">Make this my default card</span>
            </label>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button type="submit" className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                Save Card Securely
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-4 bg-white text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-sm">
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedCards;
