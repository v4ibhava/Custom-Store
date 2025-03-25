import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
import './EditProduct.css';

const EditProduct = () => {
    const state = useContext(GlobalState);
    const { categories } = state.categoriesAPI || { categories: [] };
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
        <div className="edit-product-container">
            {loading && <div className="loading-overlay">Uploading...</div>}
            <h2>Edit Product</h2>
            <form className="edit-product-form" onSubmit={handleSubmit}>
   <div className="form-group">
     <label>Product ID</label>
     <input
       type="text"
       name="product_id"
       value={product.product_id}
       disabled // Product ID is not editable
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
     />
   </div>

   <div className="form-group">
     <label htmlFor="description">Description</label>
     <textarea
       name="description"
       placeholder="Enter product description"
       value={product.description}
       onChange={handleChange}
     />
   </div>

   <div className="form-group">
     <label htmlFor="content">Content</label>
     <textarea
       name="content"
       placeholder="Enter product content"
       value={product.content}
       onChange={handleChange}
     />
   </div>

   <div className="form-group">
     <label htmlFor="category">Category</label>
     <select
       name="category"
       value={product.category}
       onChange={handleChange}
     >
       <option value="">Select Category</option>
       {categories.map((cat) => (
         <option key={cat._id} value={cat._id}>
           {cat.name}
         </option>
       ))}
     </select>
   </div>

   <div className="form-group">
     <label htmlFor="images">Product Image</label>
     <input type="file" name="images" onChange={handleFileUpload} />
     {/* Display existing image if available */}
     {product.images && (
       <div className="image-preview">
         <img
           src={product.images.url}
           alt="Product"
           style={{ width: "100px", height: "100px", objectFit: "cover" }}
         />
       </div>
     )}
   </div>

   <button className="submit-btn" type="submit">
     Update Product
   </button>
</form>

        </div>
    );
};

export default EditProduct;
