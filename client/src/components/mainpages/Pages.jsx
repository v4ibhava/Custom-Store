import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Product from './products/Products';
import Login from './login/Login';
import Register from './login/Register';
import Cart from './cart/Cart';
import DetailProduct from './utils/DetailProducts/DetailProduct';
import CreateProduct from './createproduct/CreateProduct';
import EditProduct from './editproduct/EditProduct';

function Pages() {
  return (
      <Routes>
        <Route path='/' element={<Product/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/detail/:id' element={<DetailProduct/>}/>
        <Route path='/create-product' element={<CreateProduct/>}/>
        <Route path='/edit-product/:id' element={<EditProduct/>}/>
      </Routes>
  );
}
export default Pages;
