import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/my')
      .then(({ data }) => setOrders(Array.isArray(data) ? data : data.orders || []))
      .catch((err) => setError(err.response?.data?.message || 'Could not load orders'));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container narrow">
        <h2>My Orders 📦</h2>
        {error && <p className="error">{error}</p>}
        {orders.length === 0 && !error && <div className="empty">No orders yet</div>}

        {orders.map((o) => (
          <div key={o._id} className="order-card">
            {o.deliveryAddress && (
              <div className="address-view">
                <b>📍 Delivering to:</b> {o.deliveryAddress.fullName}, {o.deliveryAddress.street},{' '}
                {o.deliveryAddress.city} - {o.deliveryAddress.pincode} | 📞 {o.deliveryAddress.phone}
              </div>
            )}
            <div className="order-head">
              <span className={`badge ${o.status}`}>{o.status}</span>
              <b>₹{o.totalPrice}</b>
            </div>
            {o.items.map((i, idx) => (
              <div key={idx} className="order-item">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}
            {o.status === 'pending' && (
              <p className="muted">⏳ Waiting for farmer to confirm</p>
            )}
            {o.expectedDelivery && o.status === 'confirmed' && (
              <p className="muted">
                📅 Expected delivery: <b>{new Date(o.expectedDelivery).toLocaleDateString()}</b>
              </p>
            )}
            {o.deliveredAt && (
              <p className="muted">✅ Delivered on {new Date(o.deliveredAt).toLocaleDateString()}</p>
            )}
            <small className="muted">{new Date(o.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}