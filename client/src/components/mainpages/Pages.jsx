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
import AdminProfile from './adminProfile/AdminProfile';
import Checkout from './checkout/checkout';
import EditProduct from './editproduct/EditProduct';
import ReceiptPage from './checkout/ReceiptPage';
import SavedUPI from './userProfile/SavedUPI';
import SavedCards from './userProfile/SavedCards';
import UserAddress from './userProfile/useraddress/UserAddress';



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
            <Route path="/AdminProfile" element={<AdminProfile />} />
            <Route path="/admin/:section/:subsection" element={<AdminProfile />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/edit-product/:id' element={<EditProduct />} />
            <Route path='/receipt' element={<ReceiptPage />} />
            <Route path='/saved-upi' element={<SavedUPI />} />
            <Route path='/saved-card' element={<SavedCards />} />
            <Route path='/user-address' element={<UserAddress />} />



            {/* Not Found Page */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Pages;
