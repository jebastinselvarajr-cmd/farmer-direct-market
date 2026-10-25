import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { getEmoji } from '../utils/productEmoji';

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [edits, setEdits] = useState({});
  const [msg, setMsg] = useState('');

  const load = () =>
    api
      .get('/products/mine')
      .then(({ data }) => setProducts(data))
      .catch((err) => setMsg(err.response?.data?.message || 'Could not load products'));

  useEffect(() => {
    load();
  }, []);

  const onChange = (id, field, value) =>
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const save = async (p) => {
    const e = edits[p._id] || {};
    try {
      await api.put(`/products/${p._id}`, {
        price: Number(e.price ?? p.price),
        quantity: Number(e.quantity ?? p.quantity),
      });
      setMsg(`${p.name} updated ✅`);
      setEdits((prev) => ({ ...prev, [p._id]: undefined }));
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      setMsg(`${p.name} deleted`);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container narrow">
        <h2>My Products 🧑‍🌾</h2>
        {msg && <p className="notice">{msg}</p>}
        <p>
          <Link to="/add-product">➕ Add new product</Link>
        </p>
        {products.length === 0 && <div className="empty">No products yet</div>}

        {products.map((p) => (
          <div key={p._id} className="row-card">
            <div className="thumb">
              {p.image ? <img src={p.image} alt={p.name} /> : getEmoji(p.name)}
            </div>
            <div className="info">
              <b>{p.name}</b>
            </div>
            <label className="field">
              ₹
              <input
                type="number"
                min="0"
                defaultValue={p.price}
                onChange={(e) => onChange(p._id, 'price', e.target.value)}
              />
            </label>
            <label className="field">
              Stock
              <input
                type="number"
                min="0"
                defaultValue={p.quantity}
                onChange={(e) => onChange(p._id, 'quantity', e.target.value)}
              />
            </label>
            <button onClick={() => save(p)}>Save</button>
            <button className="btn-danger" onClick={() => remove(p)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}