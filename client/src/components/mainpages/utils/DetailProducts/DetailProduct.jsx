import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import axios from 'axios';
import "./DetailProduct.css";

const DetailProduct = () => {
  const { id } = useParams();
  const state = useContext(GlobalState);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isLogged] = state.userAPI.isLogged;
  const addCart = state.userAPI.addCart;
  const [token] = state.token;
  // const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setDetailProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        alert("Failed to load product details");
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]);

  const handleBuyClick = async (e) => {
    e.preventDefault();
    if (!isLogged) {
      alert("Please login to continue shopping.");
      // navigate("/login");
      return;
    }

    try {
      await addCart(detailProduct);
      navigate("/cart");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      alert("Failed to add product to cart. Please try again.");
    }
  };

  if (!detailProduct) return <div>Loading product details...</div>;

  return (
    <div className="detail">
      <img
        src={detailProduct.images?.url || "/default-image.jpg"}
        alt={detailProduct.title || "Product"}
      />
      <div className="product-info">
        <h2>{detailProduct.title || "No Title Available"}</h2>
        <p>{detailProduct.content || "No additional content available."}</p>
        <span>₹{detailProduct.price || "N/A"}</span>
        <p>{detailProduct.description || "No description available."}</p>
        <p>Sold: {detailProduct.sold || 0}</p>
        <button 
          onClick={handleBuyClick}
          className="cart"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default DetailProduct;
