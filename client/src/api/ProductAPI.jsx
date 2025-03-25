import { useEffect, useState } from 'react';
import axios from 'axios';
function useProductsAPI() {
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
      const res = await axios.get('/api/products');
      console.log('Fetched products:', res.data);
      setProducts(res.data);
  };
  useEffect(() => {
    getProducts();
  }, []);
  return { products, getProducts };
}
export default useProductsAPI;
