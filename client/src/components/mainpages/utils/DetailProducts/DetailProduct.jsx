import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import "./DetailProduct.css";

const DetailProduct = () => {
  const { id } = useParams(); // Retrieve the id from the route
  const state = useContext(GlobalState); // Access the global state
  const products = state.productAPI.products; // Get the products array from global state
  const [detailProduct, setDetailProduct] = useState(null); // Initialize detailProduct state

  useEffect(() => {
    if (id && Array.isArray(products)) {
      const selectedProduct = products.find((product) => product._id === id); // Find product by _id
      setDetailProduct(selectedProduct); // Set the detail product state
    }
  }, [id, products]);

  if (!detailProduct) return <div>Loading product details...</div>; // Show fallback UI during loading

  return (
    <div className="detail">
  <img
    src={detailProduct.images?.url || "/default-image.jpg"}
    alt={detailProduct.title || "Product"}
  />
  <div className="product-info">
    <h2>{detailProduct.title || "No Title Available"}</h2>
    <p>{detailProduct.content || "No additional content available."}</p>
    <span>{detailProduct.price || "N/A"}</span>
    <p>{detailProduct.description || "No description available."}</p>
    <p>Sold: {detailProduct.sold || 0}</p>
    <Link to="/cart" className="cart">
      Buy Now
    </Link>
  </div>
</div>

  );
};

export default DetailProduct;
