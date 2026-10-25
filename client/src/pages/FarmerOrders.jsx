import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD (local)

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [dates, setDates] = useState({}); // { orderId: 'YYYY-MM-DD' }

  const load = () =>
    api
      .get('/orders/farmer')
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load orders'));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    setError('');
    try {
      await api.put(`/orders/${id}/status`, {
        status,
        expectedDelivery: dates[id],
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container narrow">
        <h2>Orders for my products 📋</h2>
        {error && <p className="error">{error}</p>}
        {orders.length === 0 && !error && <div className="empty">No orders yet</div>}

        {orders.map((o) => (
          <div key={o._id} className="order-card">
            <div className="order-head">
              <span className={`badge ${o.status}`}>{o.status}</span>
              <span className="muted">
                👤 {o.customer?.name} ({o.customer?.email})
              </span>
            </div>

            {o.deliveryAddress && (
              <div className="address-view">
                <div>
                  <b>📍 Deliver to:</b> {o.deliveryAddress.fullName}
                </div>
                <div>
                  {o.deliveryAddress.street}, {o.deliveryAddress.city} - {o.deliveryAddress.pincode}
                </div>
                <div>
                  📞 <a href={`tel:${o.deliveryAddress.phone}`}>{o.deliveryAddress.phone}</a>
                </div>
              </div>
            )}

            {o.items.map((i, idx) => (
              <div key={idx} className="order-item">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}
            <small className="muted">{new Date(o.createdAt).toLocaleString()}</small>

            {o.expectedDelivery && (
              <p className="muted">
                📅 Expected delivery: {new Date(o.expectedDelivery).toLocaleDateString()}
              </p>
            )}
            {o.deliveredAt && (
              <p className="muted">✅ Delivered on: {new Date(o.deliveredAt).toLocaleDateString()}</p>
            )}

            <div className="actions">
              {o.status === 'pending' && (
                <>
                  <input
                    type="date"
                    min={today}
                    value={dates[o._id] || ''}
                    onChange={(e) => setDates({ ...dates, [o._id]: e.target.value })}
                  />
                  <button onClick={() => setStatus(o._id, 'confirmed')}>Confirm</button>
                </>
              )}
              {o.status === 'confirmed' && (
                <button onClick={() => setStatus(o._id, 'delivered')}>Mark Delivered</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}