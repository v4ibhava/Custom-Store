import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiTrash2,
  FiTag,
  FiSearch,
  FiEdit2,
  FiX,
  FiCheck
} from 'react-icons/fi';

const AdminCategories = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [categories, setCategories] = state.categoriesAPI.categories;
  const getCategories = state.categoriesAPI.getCategories;
  const { products } = state.productAPI;

  const [newCategory, setNewCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/category', { name: newCategory.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewCategory('');
      await getCategories();
      toast.success('Category created!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-medium">Delete "{name}"?</span>
        <p className="text-sm text-gray-500">This action cannot be undone</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/api/category/${id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(categories.filter(c => c._id !== id));
                toast.success('Category deleted');
              } catch (err) {
                toast.error(err.response?.data?.msg || 'Delete failed');
              }
            }}
            className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      await axios.put(`/api/category/${id}`, { name: editName.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await getCategories();
      setEditingId(null);
      toast.success('Category updated');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Update failed');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count products per category
  const getCategoryProductCount = (categoryId) => {
    return products.filter(p => p.category === categoryId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <p className="text-sm text-gray-500">{categories.length} categories</p>
      </div>

      {/* Add Category Form */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Category</h3>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Add
          </button>
        </form>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <FiTag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No categories found</h3>
            <p className="text-gray-400 mt-1">Add your first category above</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <FiTag className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    {editingId === category._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdate(category._id)}
                          className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500">
                          {getCategoryProductCount(category._id)} products
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {editingId !== category._id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(category._id);
                        setEditName(category.name);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiEdit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
