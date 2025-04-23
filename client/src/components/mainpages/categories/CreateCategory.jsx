import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';

const CreateCategory = () => {
    const state = useContext(GlobalState);
    const [token] = state.token;
    const [categories, setCategories] = state.categoriesAPI.categories;
    const getCategories = state.categoriesAPI.getCategories;
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!token) {
                return alert('Please login first!');
            }

            await axios.post('/api/category', { name: category }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Clear the input
            setCategory('');
            
            // Refresh categories everywhere
            await getCategories();
            
            alert('Category created successfully!');
        } catch (err) {
            alert(err.response?.data?.msg || 'Error creating category');
        }
    };

    return (
        <div className="categories">
            <form onSubmit={handleSubmit}>
                <label htmlFor="category">Category</label>
                <input
                    type="text"
                    name="category"
                    value={category}
                    required
                    onChange={e => setCategory(e.target.value)}
                />
                <button type="submit">Create Category</button>
            </form>

            <div className="col">
                <h2>Existing Categories</h2>
                <div className="category-list">
                    {Array.isArray(categories) && categories.map(category => (
                        <div key={category._id} className="category-item">
                            {category.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;



