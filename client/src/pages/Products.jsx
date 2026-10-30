import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getEmoji } from '../utils/productEmoji';

function ProductImage({ product }) {
  const [failed, setFailed] = useState(false);
  if (product.image && !failed) {
    return (
      <img
        src={product.image}
        alt={product.name}
        className="product-img"
        onError={() => setFailed(true)}
      />
    );
  }
  return <div className="emoji">{getEmoji(product.name)}</div>;
}

export default function Products() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  const isFarmer = user?.role === 'farmer';

  useEffect(() => {
    api.get('/products').then(({ data }) => {
      setProducts(Array.isArray(data) ? data : data.products || []);
    });
  }, []);

  // Products-la irukkura categories-ah automatic-ah edukkum
  const categories = [
    'all',
    ...new Set(products.map((p) => (p.category || 'other').toLowerCase())),
  ];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchCategory =
      category === 'all' || (p.category || 'other').toLowerCase() === category;
    const matchStock = !inStockOnly || p.quantity > 0;
    return matchSearch && matchCategory && matchStock;
  });

  return (
    <div>
      <Navbar />

      <div className="container">
        <div className="filters">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All categories' : c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <label className="check">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In stock only
          </label>
          <span className="count">{filtered.length} products</span>
        </div>

        <div className="grid">
          {filtered.map((p) => (
            <div key={p._id} className="card">
              <ProductImage product={p} />
              <h3>{p.name}</h3>
              <div className="price">
                ₹{p.price}
                {p.unit ? ` / ${p.unit}` : ''}
              </div>
              <div className={`stock ${p.quantity < 10 ? 'low' : ''}`}>
                {p.quantity < 1 ? 'Out of stock' : `Stock: ${p.quantity}`}
              </div>
              {!isFarmer && (
                <button onClick={() => addToCart(p)} disabled={p.quantity < 1}>
                  Add to Cart
                </button>
              )}
            </div>
          ))}
        </div>
        {filtered.length === 0 && <p>No products found</p>}
      </div>
    </div>
  );
}