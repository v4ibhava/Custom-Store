import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserAPI = (token) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get('/user/information', {
            headers: { Authorization: token },
          });

          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
          setUser(res.data);

          const cartRes = await axios.get('/user/cart', {
            headers: { Authorization: token },
          });
          setCart(cartRes.data || []);

          const wishlistRes = await axios.get('/user/wishlist', {
            headers: { Authorization: token },
          });
          setWishlist(wishlistRes.data || []);
        } catch (err) {
          console.error("Error fetching user information:", err.response?.data?.msg);
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

  const updateCart = async (cart, token) => {
    try {
      await axios.put('/user/cart', { cart }, {
        headers: { Authorization: token }
      });
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Error updating cart");
    }
  };

  const addWishlist = async (product) => {
    if (!isLogged) return alert("Please login to see wishlist.");

    const check = wishlist.every(item => item._id !== product._id);
    if (check) {
      const newWishlist = [...wishlist, product];
      setWishlist(newWishlist);

      try {
        await axios.post('/user/wishlist', { product }, {
          headers: { Authorization: token }
        });
        alert("Added to wishlist!");
      } catch (err) {
        alert(err.response.data.msg);
      }
    } else {
      alert("This product is already in wishlist.");
    }
  };

  const removeWishlist = async (id) => {
    try {
      const newWishlist = wishlist.filter(item => item._id !== id);
      setWishlist(newWishlist);
      await axios.delete(`/user/wishlist/${id}`, {
        headers: { Authorization: token }
      });
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  // Return the state and functions
  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    wishlist: [wishlist, setWishlist],
    addCart: addCart,
    updateCart: updateCart,
    addWishlist: addWishlist,
    removeWishlist: removeWishlist,
    token: [token],
    user: [user, setUser],
  };
};

export default UserAPI;
