import { useState, useEffect } from "react";
import axios from "axios";

const CategoryAPI = () => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const res = await axios.get("/api/category");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err.response?.data?.msg || err.message);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories: [categories, setCategories],
    getCategories: getCategories
  };
};

export default CategoryAPI;
