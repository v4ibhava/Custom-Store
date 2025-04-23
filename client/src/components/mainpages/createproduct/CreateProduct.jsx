import React, { useState, useContext, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
import './CreateProduct.css';

const CreateProduct = () => {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [token] = state.token;

  const [product, setProduct] = useState({
    product_id: '',
    title: '',
    description: '',
    price: 0,
    category: '',
    images: null,
    content: '',
  });

  const [loading, setLoading] = useState(false); // Loading state for image upload

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return alert("No file selected.");

    try {
      setLoading(true); // Start loading
      const formData = new FormData();
      formData.append("file", file);

      // Upload image to the `/upload` endpoint
      const res = await axios.post("/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Save the uploaded image details in the product state
      setProduct({ ...product, images: res.data });
      console.log("Updated product.images:", product.images); // Debugging log
      alert("File uploaded successfully!");
    } catch (err) {
      console.error(err.response?.data?.msg || "File upload failed");
      alert(err.response?.data?.msg || "Failed to upload the image");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("product_id", product.product_id);
      formData.append("content", product.content);

      // Attach the images field from state
      formData.append("images", JSON.stringify(product.images));

      await axios.post("/api/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product created successfully!");
    } catch (err) {
      console.error(err.response?.data?.msg || "An error occurred");
      alert(err.response?.data?.msg || "Failed to create the product");
    }
  };

  return (
    <div className="create-product-container">
      {loading && <div className="loading-overlay">Uploading...</div>} {/* Loading Overlay */}
      <h2>Create a New Product</h2>
      <form className="create-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product_id">Product ID</label>
          <input
            type="text"
            name="product_id"
            placeholder="Enter a unique product ID"
            value={product.product_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Product Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter product title"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            placeholder="Enter product description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Enter product price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            placeholder="Enter product content"
            value={product.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories && categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="images">Product Image</label>
          <input type="file" name="images" onChange={handleFileUpload} required />
        </div>

        <button className="submit-btn" type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
