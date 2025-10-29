import React, { useState, useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
import { FiUploadCloud, FiDollarSign, FiBox, FiFileText, FiImage, FiTag, FiList } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [token] = state.token;
  const { getProducts } = state.productAPI;
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    product_id: '',
    title: '',
    description: '',
    price: 0,
    category: '',
    images: null,
    content: '',
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
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

      setProduct({ ...product, images: res.data });
      
    } catch (err) {
      console.error(err.response?.data?.msg || "File upload failed");
      alert(err.response?.data?.msg || "Failed to upload the image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(product).forEach(([key, value]) => {
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

      alert("Product created successfully!");
      await getProducts(); // Refresh the products list
      navigate('/');
    } catch (err) {
      console.error(err.response?.data?.msg || "An error occurred");
      alert(err.response?.data?.msg || "Failed to create the product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="mt-2 text-sm text-gray-600">Add a new product to your store</p>
        </div>

        {/* Main Form */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product ID and Title */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <FiBox className="w-4 h-4" />
                    Product ID
                  </div>
                </label>
                <input
                  type="text"
                  name="product_id"
                  value={product.product_id}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter unique product ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <FiTag className="w-4 h-4" />
                    Product Title
                  </div>
                </label>
                <input
                  type="text"
                  name="title"
                  value={product.title}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="Enter product title"
                />
              </div>
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <FiDollarSign className="w-4 h-4" />
                    Price
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    required
                    className="input input-bordered w-full pl-8"
                    placeholder="0.00"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2 mb-1">
                    <FiList className="w-4 h-4" />
                    Category
                  </div>
                </label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  required
                  className="select select-bordered w-full"
                >
                  <option value="">Select Category</option>
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <FiFileText className="w-4 h-4" />
                  Description
                </div>
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                required
                className="textarea textarea-bordered w-full h-24"
                placeholder="Enter product description"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <FiFileText className="w-4 h-4" />
                  Content
                </div>
              </label>
              <textarea
                name="content"
                value={product.content}
                onChange={handleChange}
                required
                className="textarea textarea-bordered w-full h-24"
                placeholder="Enter product content"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <FiImage className="w-4 h-4" />
                  Product Image
                </div>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="mb-4">
                      <img src={preview} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-lg" />
                    </div>
                  ) : (
                    <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-focus">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        name="images"
                        onChange={handleFileUpload}
                        className="sr-only"
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-2 text-gray-700">Uploading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;
