import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import FarmerOrders from './pages/FarmerOrders';
import MyProducts from './pages/MyProducts';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/add-product" element={<AddProduct />} />
    <Route path="/cart" element={<Cart />}/>
    <Route path="/my-orders" element={<MyOrders/>} />
    <Route path="/farmer-orders" element={<FarmerOrders />} />
    <Route path="/my-products" element={<MyProducts />} />
    </Routes>
  );
}