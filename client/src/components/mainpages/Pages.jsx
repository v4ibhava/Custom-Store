import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './products/Products';
import DetailProduct from '../mainpages/utils/DetailProducts/DetailProduct';
import Login from './login/Login';
import Register from './login/Register';
import OrderHistory from './history/UserHistory';
import OrderDetails from './history/OrderDetails';
import Cart from './cart/Cart';
import NotFound from './utils/not_found/NotFound';
import Categories from './categories/CreateCategory';
import CreateProduct from './createProduct/CreateProduct';
import Profile from './userProfile/Profile';

function Pages() {
    return (
        <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/detail/:id" element={<DetailProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/category" element={<Categories />} />
            <Route path="/create_product" element={<CreateProduct />} />
            <Route path="/history" element={<OrderHistory />} />
            <Route path="/history/:id" element={<OrderDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path='/profile' element={<Profile />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Pages;
