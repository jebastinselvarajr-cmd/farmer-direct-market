import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import FarmerOrders from './pages/FarmerOrders';
import MyProducts from './pages/MyProducts';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/cart"
        element={
          <ProtectedRoute roles={['customer']}>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-orders"
        element={
          <ProtectedRoute roles={['customer']}>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-product"
        element={
          <ProtectedRoute roles={['farmer']}>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-products"
        element={
          <ProtectedRoute roles={['farmer']}>
            <MyProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer-orders"
        element={
          <ProtectedRoute roles={['farmer']}>
            <FarmerOrders />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}