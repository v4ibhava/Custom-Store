import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);

  // Fetch user information when token is present
  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get('/user/information', {
            headers: { Authorization: token },
          });

          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
          console.log("User information received:", res.data);

          // Fetch the user's cart from the backend
          const cartRes = await axios.get('/user/cart', {
            headers: { Authorization: token },
          });
          setCart(cartRes.data);
          console.log("Cart retrieved from backend:", cartRes.data);
        } catch (err) {
          console.error("Error fetching user information:", err.response?.data?.msg);
          alert(err.response?.data?.msg);
        }
      };
      getUser();
    }
  }, [token]);

  // Function to add a product to the cart
  const addCart = async (product) => {
    if (!isLogged) return alert("Please login to continue shopping.");
  
    // Check if the product already exists in the cart
    const existingProduct = cart.find((item) => item._id === product._id);
  
    if (existingProduct) {
      // Alert the user if the product already exists
      alert("This product is already in the cart.");
    } else {
      // Add new product with a default quantity of 1
      const newCart = [...cart, { ...product, quantity: 1 }];
      setCart(newCart);
      alert("Product added to cart!");

      // Save the updated cart to the backend
      try {
        await axios.put('/user/cart', { cart: newCart }, {
          headers: { Authorization: token },
        });
        console.log("Cart saved to backend.");
      } catch (err) {
        console.error("Error saving cart to backend:", err.response?.data?.msg);
      }
    }
  };

  // Return the state and functions
  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
  };
};

export default UserAPI;
