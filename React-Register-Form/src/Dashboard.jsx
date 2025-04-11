import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ProductDashboard() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    productPrice: '',
    productUnit: '',
    productDescription: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8085/Product/get');
      if (res.data.status) {
        setProducts(res.data.message);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (err) {
      toast.error('Server error while fetching products');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const delay = new Promise(resolve => setTimeout(resolve, 2000));

    try {
      let res;
      if (editId) {
        res = await Promise.all([
          axios.put(`http://localhost:8085/Product/update/${editId}`, formData),
          delay
        ]);
        toast.success(res[0].data.message);
        setEditId(null);
      } else {
        res = await Promise.all([
          axios.post('http://localhost:8085/Product/add', formData),
          delay
        ]);
        if (res[0].data.status) {
          toast.success(res[0].data.message);
        } else {
          toast.error(res[0].data.message);
        }
      }

      setFormData({
        productName: '',
        productPrice: '',
        productUnit: '',
        productDescription: '',
      });

      fetchProducts();
    } catch (err) {
      toast.error('Error while saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prod) => {
    setEditId(prod._id);
    setFormData({
      productName: prod.productName,
      productPrice: prod.productPrice,
      productUnit: prod.productUnit,
      productDescription: prod.productDescription,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`http://localhost:8085/Product/delete/${id}`);
      if (res.data.status) {
        toast.success(res.data.message);
        fetchProducts();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const handleLogout = () => {
    Cookies.remove('user');
    navigate('/');
  };

  return (
    <>
      <Toaster position="top-center" />
      {isLoading && <Loader />}

      
      <div className="dashboard-header">
        <h2>Product Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      
      <div className="product-dashboard">
        <div className="left-section">
          <form onSubmit={handleSubmit}>
            <h3>{editId ? "Edit Product" : "Add Product"}</h3>

            <div className="input-field">
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-field">
              <label>Product Price</label>
              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="input-field">
              <label>Product Unit</label>
              <select
                name="productUnit"
                value={formData.productUnit}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Unit</option>
                <option value="kg">KG</option>
                <option value="liter">Liter</option>
                <option value="dozen">Dozen</option>
                <option value="ton">Ton</option>
              </select>
            </div>

            <div className="input-field">
              <label>Product Description</label>
              <textarea
                name="productDescription"
                value={formData.productDescription}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>

            <button type="submit">{editId ? "Update Product" : "Add Product"}</button>
          </form>
        </div>

        <div className="right-section">
          <h3>Product List</h3>
          <table className="table">
            <thead className="head">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Unit</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6">No Products Found</td>
                </tr>
              ) : (
                products.map((prod, index) => (
                  <tr key={prod._id}>
                    <td>{index + 1}</td>
                    <td>{prod.productName}</td>
                    <td>{prod.productPrice}</td>
                    <td>{prod.productUnit}</td>
                    <td>{prod.productDescription}</td>
                    <td>
                      <i
                        className="fa fa-edit"
                        style={{ color: 'green', cursor: 'pointer', marginRight: '10px' }}
                        onClick={() => handleEdit(prod)}
                      />
                      <i
                        className="fa fa-trash"
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => handleDelete(prod._id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
