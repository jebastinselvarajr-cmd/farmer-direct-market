import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((n, i) => n + (i.qty || 1), 0);

  return (
    <>
      <header className="topbar">
        <h2>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            Farmer Direct Market 🌾
          </Link>
        </h2>
        <div className="user-box">
          {user ? (
            <>
              <span>
                👤 {user.name} ({user.role})
              </span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>

      <nav className="nav-links">
        <Link to="/">🏠 Home</Link>
        <Link to="/cart">🛒 Cart ({cartCount})</Link>
        {user && <Link to="/my-orders">📦 My Orders</Link>}
        {user?.role === 'farmer' && (
          <>
            <Link to="/add-product">➕ Add Product</Link>
            <Link to="/my-products">🧑‍🌾 My Products</Link>
            <Link to="/farmer-orders">📋 Orders for my products</Link>
          </>
        )}
      </nav>
    </>
  );
}