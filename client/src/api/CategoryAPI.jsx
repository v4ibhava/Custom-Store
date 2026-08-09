import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../services";

const CategoryAPI = () => {
  const [categoriesList, setCategoriesList] = useState([]);

  const getCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories();
      setCategoriesList(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return {
    categories: [categoriesList, setCategoriesList],
    getCategories
  };
};

export default CategoryAPI;

