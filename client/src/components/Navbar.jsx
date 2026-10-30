import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((n, i) => n + (i.qty || 1), 0);

  const isFarmer = user?.role === 'farmer';
  const isCustomer = user?.role === 'customer';

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
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" style={{ marginLeft: 12 }}>
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <nav className="nav-links">
        {user && (
          <NavLink to="/" end>
            🏠 Home
          </NavLink>
        )}

        {/* Customer-ku mattum */}
        {isCustomer && <NavLink to="/cart">🛒 Cart ({cartCount})</NavLink>}
        {isCustomer && <NavLink to="/my-orders">📦 My Orders</NavLink>}

        {/* Farmer-ku mattum */}
        {isFarmer && (
          <>
            <NavLink to="/add-product">➕ Add Product</NavLink>
            <NavLink to="/my-products">🧑‍🌾 My Products</NavLink>
            <NavLink to="/farmer-orders">📋 Orders for my products</NavLink>
          </>
        )}
      </nav>
    </>
  );
}