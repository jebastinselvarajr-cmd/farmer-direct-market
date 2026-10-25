import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'vegetable',
    pricePerUnit: '',
    unit: 'kg',
    stock: '',
    image: '',
    isOrganic: false,
  });
  const [error, setError] = useState('');

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.pricePerUnit),
        quantity: Number(form.stock),
        unit: form.unit,
        image: form.image.trim(),
        isOrganic: form.isOrganic,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add product');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 380, margin: '40px auto', display: 'grid', gap: 10 }}>
      <h2>Add Product</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="name" placeholder="Product name (eg. Tomato)" onChange={onChange} required />
      <textarea name="description" placeholder="Description" onChange={onChange} />
      <select name="category" value={form.category} onChange={onChange}>
        <option value="vegetable">Vegetables</option>
        <option value="fruit">Fruits</option>
        <option value="grains">Grains</option>
        <option value="dairy">Dairy</option>
        <option value="pulses">Pulses</option>
        <option value="spices">Spices</option>
        <option value="other">Other</option>
      </select>
      <input name="pricePerUnit" type="number" min="0" placeholder="Price per unit (₹)" onChange={onChange} required />
      <select name="unit" value={form.unit} onChange={onChange}>
        <option value="kg">kg</option>
        <option value="g">g</option>
        <option value="litre">litre</option>
        <option value="dozen">dozen</option>
        <option value="piece">piece</option>
      </select>
      <input name="stock" type="number" min="0" placeholder="Stock quantity" onChange={onChange} required />

      <input name="image" type="url" placeholder="Image URL (optional)" value={form.image} onChange={onChange} />
      {form.image && (
        <img
          src={form.image}
          alt="preview"
          style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
          onError={(e) => (e.target.style.display = 'none')}
        />
      )}

      <button type="submit">Add Product</button>
      <Link to="/">Back</Link>
    </form>
  );
}