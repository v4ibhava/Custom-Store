import { GlobalState } from '../../../../GlobalState';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';

const BtnRender = ({ product }) => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;
  const addCart = state.userAPI.addCart;
  const [token] = state.userAPI.token || [];

  const deleteProduct = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        const res = await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(res.data.msg); // "Deleted successfully"
      }
    } catch (err) {
      console.error("Delete Product Error:", err.response?.data?.msg || err.message);
      alert(err.response?.data?.msg || "Failed to delete product");
    }
  };
  
  return (
    <div className='row_btn'>
      {isAdmin ? (
        <>
          <Link id='btn_buy' to={'#!'} onClick={() => deleteProduct(product._id)}>
            Delete
          </Link>
          <Link id='btn_view' to={`/edit-product/${product._id}`}>
            Edit
          </Link>
        </>
      ) : (
        <>
          <Link id='btn_buy' to={'#!'} onClick={() => addCart(product)}>
            Buy
          </Link>
          <Link id='btn_view' to={`/detail/${product._id}`}>
            View
          </Link>
        </>
      )}
    </div>
  );
};

export default BtnRender;
