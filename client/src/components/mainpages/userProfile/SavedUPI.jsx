import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import { FiSmartphone, FiPlus, FiTrash2 } from 'react-icons/fi';

const SavedUPI = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [upis, setUpis] = useState([]);
  const [newUPI, setNewUPI] = useState({
    upiId: '',
    name: '',
    isDefault: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUPIs = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/user/upi', {
          headers: { Authorization: token }
        });
        setUpis(res.data.upis || res.data || []);
      } catch (err) {
        if (err.response?.status !== 404) {
          alert(err.response?.data?.msg || 'Error fetching UPIs');
        }
        setUpis([]);
      } finally {
        setLoading(false);
      }
    };
    getUPIs();
  }, [token]);

  const handleAddUPI = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/user/upi', newUPI, {
        headers: { Authorization: token }
      });
      setUpis(res.data.upis);
      setNewUPI({
        upiId: '',
        name: '',
        isDefault: false
      });
      alert('UPI added successfully');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error adding UPI');
    }
  };

  const handleDeleteUPI = async (upiId) => {
    if (window.confirm('Are you sure you want to delete this UPI?')) {
      try {
        const res = await axios.delete(`/user/upi/${upiId}`, {
          headers: { Authorization: token }
        });
        setUpis(res.data.upis);
        alert('UPI deleted successfully');
      } catch (err) {
        alert(err.response?.data?.msg || 'Error deleting UPI');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewUPI({
      ...newUPI,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <FiSmartphone className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Saved UPI</h2>
      </div>

      {/* UPI List */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {upis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {upis.map((upi) => (
                <div
                  key={upi._id}
                  className={`card bg-base-100 shadow-lg ${
                    upi.isDefault ? 'border-2 border-primary' : ''
                  }`}
                >
                  <div className="card-body">
                    {upi.isDefault && (
                      <div className="badge badge-primary mb-2">Default UPI</div>
                    )}
                    <div className="flex items-start gap-2">
                      <FiSmartphone className="w-5 h-5 mt-1 text-gray-500" />
                      <div>
                        <p className="font-medium">{upi.upiId}</p>
                        <p className="text-gray-600">{upi.name}</p>
                      </div>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <button
                        onClick={() => handleDeleteUPI(upi._id)}
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
              <FiSmartphone className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No saved UPI IDs yet</p>
            </div>
          )}
        </>
      )}

      {/* Add New UPI Form */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            Add New UPI
          </h3>
          <form onSubmit={handleAddUPI} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control md:col-span-2">
                <input
                  type="text"
                  name="upiId"
                  value={newUPI.upiId}
                  onChange={handleInputChange}
                  placeholder="UPI ID (e.g., name@bank)"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control md:col-span-2">
                <input
                  type="text"
                  name="name"
                  value={newUPI.name}
                  onChange={handleInputChange}
                  placeholder="Display Name"
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
                  checked={newUPI.isDefault}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Set as default UPI</span>
              </label>
            </div>

            <div className="card-actions justify-end">
              <button type="submit" className="btn btn-primary">
                <FiPlus className="w-4 h-4 mr-1" /> Add UPI
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SavedUPI;


