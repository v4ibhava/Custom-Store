import { useState, useEffect } from "react";
import categories from "../data/CategoryList";

const CategoryAPI = () => {
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    // Using the predefined categories instead of fetching
    setCategoriesList(categories);
  }, []);

  return {
    categories: [categoriesList, setCategoriesList],
    getCategories: () => setCategoriesList(categories)
  };
};

export default CategoryAPI;
