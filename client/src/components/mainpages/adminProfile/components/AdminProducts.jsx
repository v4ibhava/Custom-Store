import React, { useContext, useState } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import toast from 'react-hot-toast';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUploadCloud,
  FiX,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiBox,
  FiFileText,
  FiImage,
  FiList,
  FiGrid,
  FiList as FiListIcon
} from 'react-icons/fi';

const AdminProducts = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const { products, setProducts, getProducts } = state.productAPI;
  const [categories] = state.categoriesAPI.categories;

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [newProduct, setNewProduct] = useState({
    product_id: '',
    title: '',
    description: '',
    price: '',
    category: '',
    images: null,
    content: '',
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNewProduct({ ...newProduct, images: res.data });
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.msg || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.images) {
      toast.error('Please upload an image');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) => {
        if (key === 'images') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      await axios.post("/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created!");
      await getProducts();
      setShowAddForm(false);
      setNewProduct({
        product_id: '',
        title: '',
        description: '',
        price: '',
        category: '',
        images: null,
        content: '',
      });
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <span className="font-medium">Delete this product?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`/api/products/${id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{products.length} products in catalog</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200"
        >
          {showAddForm ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Product</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <FiBox className="w-4 h-4" />
                    Product ID *
                  </div>
                </label>
                <input
                  type="text"
                  name="product_id"
                  value={newProduct.product_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                  placeholder="e.g., cake-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4" />
                    Title *
                  </div>
                </label>
                <input
                  type="text"
                  name="title"
                  value={newProduct.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="w-4 h-4" />
                    Price *
                  </div>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleChange}
                    required
                    className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center gap-2">
                    <FiList className="w-4 h-4" />
                    Category *
                  </div>
                </label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <FiFileText className="w-4 h-4" />
                  Description *
                </div>
              </label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleChange}
                required
                rows="2"
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                placeholder="Short product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <FiFileText className="w-4 h-4" />
                  Content *
                </div>
              </label>
              <textarea
                name="content"
                value={newProduct.content}
                onChange={handleChange}
                required
                rows="2"
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
                placeholder="Detailed product content"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiImage className="w-4 h-4" />
                  Product Image *
                </div>
              </label>
              <div className="flex items-center gap-4">
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setNewProduct({ ...newProduct, images: null });
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors">
                    <FiUploadCloud className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setPreview(null);
                  setNewProduct({
                    product_id: '',
                    title: '',
                    description: '',
                    price: '',
                    category: '',
                    images: null,
                    content: '',
                  });
                }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              <FiListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.images?.url || '/default-image.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="p-2 bg-white rounded-xl shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                <p className="text-sm text-gray-500 mt-1 truncate">{product.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-pink-600">₹{product.price}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                    Sold: {product.sold || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Sold</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.url || '/default-image.jpg'}
                          alt={product.title}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.title}</p>
                          <p className="text-xs text-gray-500">{product.product_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600">
                        {categories.find(c => c._id === product.category)?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.sold || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => deleteProduct(product._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No products found</h3>
          <p className="text-gray-400 mt-1">Add your first product to get started</p>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
