import React, { useState, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './products/Products';
import DetailProduct from '../mainpages/utils/DetailProducts/DetailProduct';
import Login from './auth/Login';
import Signup from './auth/Signup';
import VerifyOTP from './auth/VerifyOTP';
import AddInfo from './auth/AddInfo';
import OrderHistory from './history/UserHistory';
import OrderDetails from './history/OrderDetails';
import Cart from './cart/Cart';
import NotFound from './utils/not_found/NotFound';
import Categories from './categories/CreateCategory';
import CreateProduct from './createproduct/CreateProduct';
import Profile from './userProfile/Profile';
import AdminProfile from './adminProfile/AdminProfile';
import Checkout from './checkout/checkout';
import OrderStatus from './orders/OrderStatus';
import EditProduct from './editproduct/EditProduct';
import SavedUPI from './userProfile/SavedUPI';
import SavedCards from './userProfile/SavedCards';
import Wishlist from './wishlist/Wishlist';

import { GlobalState } from '../../GlobalState';

function Pages() {
    const [email, setEmail] = useState('');
    const state = useContext(GlobalState);
    const [isAdmin] = state.userAPI.isAdmin;

    return (
        <Routes>
            <Route path="/" element={isAdmin ? <AdminProfile /> : <Products />} />
            <Route path="/detail/:id" element={<DetailProduct />} />
            <Route path="/login" element={<Login setEmail={setEmail} />} />
            <Route path="/signup" element={<Signup setEmail={setEmail} />} />
            <Route path="/verify-otp" element={<VerifyOTP email={email} />} />
            <Route path="/add-info" element={<AddInfo />} />
            <Route path="/category" element={<Categories />} />
            <Route path="/create_product" element={<CreateProduct />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/history/:id" element={<OrderDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/profile' element={isAdmin ? <AdminProfile /> : <Profile />} />
            <Route path="/AdminProfile" element={<AdminProfile />} />
            <Route path="/admin/:section/:subsection" element={<AdminProfile />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/orders/:id' element={<OrderStatus />} />
            <Route path='/edit-product/:id' element={<EditProduct />} />
            <Route path='/saved-upi' element={<SavedUPI />} />
            <Route path='/saved-card' element={<SavedCards />} />
            <Route path='/wishlist' element={<Wishlist />} />

            {/* Common routes that users might try */}
            <Route path='/products' element={<Products />} />
            <Route path='/shop' element={<Products />} />
            <Route path='/store' element={<Products />} />

            {/* Not Found Page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Pages;