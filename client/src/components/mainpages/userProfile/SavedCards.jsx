import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { FiCreditCard, FiPlus, FiTrash2 } from 'react-icons/fi';

const SavedCards = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCard({
      ...newCard,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  useEffect(() => {
    const getCards = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/user/cards', {
          headers: { Authorization: token }
        });
        console.log('Cards response:', res.data); // Debug log
        setCards(res.data.cards || []);
      } catch (err) {
        console.error('Error fetching cards:', err);
        alert(err.response?.data?.msg || 'Error fetching cards');
      } finally {
        setLoading(false);
      }
    };
    getCards();
  }, [token]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/user/card', newCard, {
        headers: { Authorization: token }
      });
      console.log('Add card response:', res.data); // Debug log
      setCards(res.data.cards);
      setNewCard({
        cardNumber: '',
        cardHolderName: '',
        expiryMonth: '',
        expiryYear: '',
        isDefault: false
      });
      alert('Card added successfully');
    } catch (err) {
      console.error('Error adding card:', err);
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
        alert('Card deleted successfully');
      } catch (err) {
        alert(err.response?.data?.msg || 'Error deleting card');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <FiCreditCard className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Saved Cards</h2>
      </div>

      {/* Card List */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {cards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {cards.map((card) => (
                <div
                  key={card._id}
                  className={`card bg-base-100 shadow-lg ${
                    card.isDefault ? 'border-2 border-primary' : ''
                  }`}
                >
                  <div className="card-body">
                    {card.isDefault && (
                      <div className="badge badge-primary mb-2">Default Card</div>
                    )}
                    <div className="flex items-start gap-2">
                      <FiCreditCard className="w-5 h-5 mt-1 text-gray-500" />
                      <div>
                        <p className="font-medium">{card.cardNumber}</p>
                        <p className="text-gray-600">{card.cardHolderName}</p>
                        <p className="text-gray-600">
                          Expires: {card.expiryMonth}/{card.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <button
                        onClick={() => handleDeleteCard(card._id)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <FiTrash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-base-200 rounded-lg mb-8">
              <FiCreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No saved cards yet</p>
            </div>
          )}
        </>
      )}

      {/* Add New Card Form */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            Add New Card
          </h3>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <input
                  type="text"
                  name="cardNumber"
                  value={newCard.cardNumber}
                  onChange={handleInputChange}
                  placeholder="Card Number"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  name="cardHolderName"
                  value={newCard.cardHolderName}
                  onChange={handleInputChange}
                  placeholder="Card Holder Name"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  name="expiryMonth"
                  value={newCard.expiryMonth}
                  onChange={handleInputChange}
                  placeholder="Expiry Month (MM)"
                  className="input input-bordered w-full"
                  maxLength="2"
                  required
                />
              </div>
              <div className="form-control">
                <input
                  type="text"
                  name="expiryYear"
                  value={newCard.expiryYear}
                  onChange={handleInputChange}
                  placeholder="Expiry Year (YY)"
                  className="input input-bordered w-full"
                  maxLength="2"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newCard.isDefault}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Set as default card</span>
              </label>
            </div>

            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary">
                <FiPlus className="w-4 h-4 mr-1" /> Add Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SavedCards;




