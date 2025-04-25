import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiLock, FiUser, FiLogIn } from 'react-icons/fi';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const onChangeInput = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/user/login', { ...user });
      localStorage.setItem('firstLogin', true);
      window.location.href = '/';
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-focus"
            >
              Sign up
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={loginSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input input-bordered w-full pl-10"
                  placeholder="Email address"
                  value={user.email}
                  onChange={onChangeInput}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input input-bordered w-full pl-10"
                  placeholder="Password"
                  value={user.password}
                  onChange={onChangeInput}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary w-full flex justify-center items-center gap-2"
            >
              <FiLogIn className="h-5 w-5" />
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
