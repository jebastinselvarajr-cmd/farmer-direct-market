import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { getEmoji } from '../utils/productEmoji';

const loadAddress = () => {
  try {
    return JSON.parse(localStorage.getItem('address')) || {};
  } catch {
    return {};
  }
};

export default function Cart() {
  const { items, changeQty, removeFromCart, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [addr, setAddr] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
    ...loadAddress(),
  });

  const onAddr = (e) => setAddr({ ...addr, [e.target.name]: e.target.value });

  const placeOrder = async () => {
    if (!user) return navigate('/login');
    setError('');

    if (!addr.fullName || !addr.phone || !addr.street || !addr.city || !addr.pincode)
      return setError('Please fill all delivery details');
    if (!/^\d{10}$/.test(addr.phone)) return setError('Phone number must be 10 digits');
    if (!/^\d{6}$/.test(addr.pincode)) return setError('Pincode must be 6 digits');

    setLoading(true);
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ product: i._id, quantity: i.qty })),
        deliveryAddress: addr,
      });
      localStorage.setItem('address', JSON.stringify(addr)); // next time prefill
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container narrow">
        <h2>Your Cart 🛒</h2>
        {error && <p className="error">{error}</p>}

        {items.length === 0 ? (
          <div className="empty">
            <p>Cart is empty</p>
            <Link to="/">Start shopping →</Link>
          </div>
        ) : (
          <>
            {items.map((i) => (
              <div key={i._id} className="row-card">
                <div className="thumb">
                  {i.image ? <img src={i.image} alt={i.name} /> : getEmoji(i.name)}
                </div>
                <div className="info">
                  <b>{i.name}</b>
                  <div className="muted">
                    ₹{i.price}
                    {i.unit ? ` / ${i.unit}` : ''}
                  </div>
                </div>
                <input
                  type="number"
                  min="1"
                  max={i.quantity}
                  value={i.qty}
                  onChange={(e) => changeQty(i._id, Number(e.target.value))}
                  style={{ width: 70 }}
                />
                <div className="line-total">₹{i.price * i.qty}</div>
                <button className="btn-danger" onClick={() => removeFromCart(i._id)}>
                  ✕
                </button>
              </div>
            ))}

            <div className="address-box">
              <h3>🚚 Delivery Details</h3>
              <input name="fullName" placeholder="Full name" value={addr.fullName} onChange={onAddr} />
              <input name="phone" placeholder="Phone (10 digits)" maxLength={10} value={addr.phone} onChange={onAddr} />
              <input name="street" placeholder="Door no, street, area" value={addr.street} onChange={onAddr} />
              <div className="two-col">
                <input name="city" placeholder="City" value={addr.city} onChange={onAddr} />
                <input name="pincode" placeholder="Pincode" maxLength={6} value={addr.pincode} onChange={onAddr} />
              </div>
              <small className="muted">💵 Payment: Cash on Delivery</small>
            </div>

            <div className="summary">
              <span>Total</span>
              <b>₹{total}</b>
            </div>
            <button className="wide" onClick={placeOrder} disabled={loading}>
              {loading ? 'Placing order...' : 'Place Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}