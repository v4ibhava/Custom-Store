import { useState, useEffect } from "react";
import axios from "axios";

const CategoryAPI = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category");
        setCategories(res.data); // Ensure `res.data` is an array
      } catch (err) {
        console.error("Error fetching categories:", err.response?.data?.msg || err.message);
      }
    };
    fetchCategories();
  }, []);

  return {
    categories,
    setCategories, // Optional: allows dynamic updates to categories
  };
};

export default CategoryAPI;
