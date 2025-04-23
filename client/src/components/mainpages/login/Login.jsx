import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import "./Login.css";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { refreshToken } = useContext(GlobalState);

  const navigate = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/login", { ...user });
      localStorage.setItem("firstLogin", true);
      
      // Ensure we have the access token before proceeding
      if (response.data.accesstoken) {
        await refreshToken();
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={loginSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="Email"
            autoComplete="email"
            value={user.email}
            onChange={onChangeInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            placeholder="Password"
            autoComplete="current-password"
            value={user.password}
            onChange={onChangeInput}
          />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
