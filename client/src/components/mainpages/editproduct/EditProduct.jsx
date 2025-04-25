import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
import { HiUpload, HiPhotograph } from 'react-icons/hi';
import categories from '../../../data/CategoryList';  // Import the predefined categories

const EditProduct = () => {
    const state = useContext(GlobalState);
    const [token] = state.token;

    const [product, setProduct] = useState({
        product_id: '',
        title: '',
        price: 0,
        description: '',
        category: '',
        images: '',
        content: '',
    });

    const [loading, setLoading] = useState(false);

    const { id } = useParams(); // Extract Product ID from URL

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get(`/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProduct(res.data);
            } catch (err) {
                console.error("Failed to fetch Product:", err.response?.data?.msg || err.message);
            }
        };
        getProduct();
    }, [id, token]);
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return alert("No file selected.");
    
        try {
            setLoading(true); // Show loading overlay
            const formData = new FormData();
            formData.append("file", file);
    
            // Upload image to the `/upload` endpoint
            const res = await axios.post("/api/upload", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });
    
            setProduct({ ...product, images: res.data }); // Update product with uploaded image
            alert("Image uploaded successfully!");
        } catch (err) {
            console.error("Image Upload Error:", err.response?.data?.msg || err.message);
            alert("Failed to upload the image.");
        } finally {
            setLoading(false); // Hide loading overlay
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/products/${id}`, product, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Product updated successfully!");
        } catch (err) {
            console.error("Update failed:", err.response?.data?.msg || err.message);
            alert("Failed to update the product.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Left Side - Image Section */}
                    <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center justify-center border-r border-gray-200">
                        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                            {product.images ? (
                                <img
                                    src={product.images.url}
                                    alt="Product"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <HiPhotograph className="w-20 h-20 text-gray-400" />
                                </div>
                            )}
                        </div>
                        
                        <label className="w-full">
                            <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                                <HiUpload className="w-5 h-5 mr-2 text-gray-500" />
                                Upload New Image
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept="image/*"
                            />
                        </label>
                    </div>

                    {/* Right Side - Form Section */}
                    <div className="md:w-2/3 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Product ID */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product ID
                                    </label>
                                    <input
                                        type="text"
                                        name="product_id"
                                        value={product.product_id}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                    />
                                </div>

                                {/* Category */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={product.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={product.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    name="content"
                                    value={product.content}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                                >
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent mx-auto"></div>
                        <p className="mt-2 text-gray-700">Uploading...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditProduct;
