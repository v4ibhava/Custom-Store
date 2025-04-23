import React, { useContext, useState, useCallback } from "react";
import { RiMenuFill, RiCloseFill, RiShoppingCart2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import axios from "axios";
import "./Headers.css";

function Headers() {
  const state = useContext(GlobalState);

  const {
    isLogged = [false, () => {}],
    isAdmin = [false, () => {}],
    cart = [],
  } = state?.userAPI || {};
  const [logged, setLogged] = isLogged;
  const [admin, setAdmin] = isAdmin;

  const [menuOpen, setMenuOpen] = useState(false);

  const logoutUser = useCallback(async () => {
    try {
      await axios.get("/user/logout");
      localStorage.clear();
      setAdmin(false);
      setLogged(false);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  }, [setAdmin, setLogged]);

  const adminRouter = () => (
    <>
      <li>
        <Link to="/create-product" className="header-link">
          Create Products
        </Link>
      </li>
      <li>
        <Link to="/category" className="header-link">
          Category
        </Link>
      </li>
    </>
  );

  const loggedRouter = () => (
    <>
      {admin ? adminRouter() : (
        <li>
          <Link to="/profile" className="header-link">
            Profile
          </Link>
        </li>
      )}
      <li>
        <Link to="/" onClick={logoutUser} className="header-link">
          Logout
        </Link>
      </li>
    </>
  );

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          {!menuOpen ? (
            <RiMenuFill
              size={30}
              className="menu-icon"
              onClick={toggleMenu}
            />
          ) : (
            <RiCloseFill
              size={30}
              className="menu-icon"
              onClick={toggleMenu}
            />
          )}
          <h1>
            <Link to="/" className="header-link">
              {admin ? "Admin Dashboard" : "Liver Store"}
            </Link>
          </h1>
        </div>

        <ul className={`menu ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" className="header-link">
              {admin ? "Products" : "Liver"}
            </Link>
          </li>

          {logged && loggedRouter()}

          {!logged && (
            <li>
              <Link to="/login" className="header-link">
                Login or Register
              </Link>
            </li>
          )}
        </ul>

        {!admin && logged && (
          <div className="cart-icon">
            <span>{Array.isArray(cart[0]) ? cart[0].length : 0}</span>
            <Link to="/cart">
              <RiShoppingCart2Fill size={25} className="header-link" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Headers;
