import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, User, LogOut, HomeIcon, Plus, Trash2, Package, X, ChevronDown, MessageSquare, Send } from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:8080/api';

const getAllowedProductIds = (username) => {
  if (!username) return [];
  const name = username.toLowerCase();
  if (name.includes('gurnoor')) return [1]; 
  if (name.includes('abhishek')) return [5, 6]; 
  if (name.includes('gaurav')) return [3]; 
  if (name.includes('aditya')) return [7]; 
  if (name.includes('amit')) return [6]; 
  return [];
};

const Navbar = ({ user, role, cartCount, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = role === 'ADMIN';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-brand">🅂ⓢⓢ SpecificSportShop</div>
      <div className="nav-links">
        <Link to="/home" className="nav-item"><HomeIcon size={20} /> Home</Link>
        
        {!isAdmin && (
          <Link to="/cart" className="nav-item">
            <ShoppingCart size={20} /> 
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        )}

        {user && (
          <div className="dropdown" style={{ position: 'relative' }}>
            <button className="nav-item btn-account" onClick={toggleMenu}>
              <User size={20} /> {user.split('@')[0].replace(/\d+/g, '')}
              <ChevronDown size={16} style={{ marginLeft: '5px' }} />
            </button>
            
            {isMenuOpen && (
              <div className="dropdown-content" style={{ display: 'block', right: 0 }}>
                {!isAdmin && (
                  <Link to="/orders" onClick={closeMenu}><Package size={16} /> My Orders</Link>
                )}
                <button onClick={() => { closeMenu(); onLogout(); }}><LogOut size={16} /> Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.username);
      localStorage.setItem('role', res.data.role);
      onLogin(res.data.username, res.data.role);
      navigate('/home');
    } catch (err) { alert('Login failed'); }
  };

  return (
    <div className="auth-container">
      <div className="login-logo login-logo-gradient">
  🅂ⓢⓢ SpecificSportShop
</div>
      <form onSubmit={handleLogin}>
        <input placeholder="Email Address" onChange={e => setForm({...form, username: e.target.value})} />
        <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const ProductCard = ({ product, allReviews, user, role, addToCart, onSelectProduct }) => {
  const allowedIds = getAllowedProductIds(user);
  const canReview = allowedIds.includes(product.id) && role !== 'ADMIN';
  const productReviews = allReviews.filter(r => r.productId === product.id);
  const isAdmin = role === 'ADMIN';

  return (
    <div className="product-card">
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="prod-img" 
        onClick={() => onSelectProduct(product)}
        style={{cursor: 'pointer'}}
        onError={(e)=>{e.target.src='https://via.placeholder.com/150?text=No+Image'}} 
      />
      <h3 onClick={() => onSelectProduct(product)} style={{cursor:'pointer', color:'#2563eb'}}>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="price">₹{product.price.toLocaleString()}</p>
      
      <p style={{fontSize:'0.9rem', color:'#666', margin:'5px 0'}}>
        {productReviews.length} {productReviews.length === 1 ? 'Review' : 'Reviews'}
      </p>

      {!isAdmin && (
        <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="btn-cart">
          <Plus size={16}/> Add to Cart
        </button>
      )}
    </div>
  );
};

const ProductReviewView = ({ product, allReviews, user, role, onClose, onSubmitReview, onDeleteReview, onReplyReview }) => {
  const allowedIds = getAllowedProductIds(user);
  const canReview = allowedIds.includes(product.id) && role !== 'ADMIN';
  const productReviews = allReviews.filter(r => r.productId === product.id);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [replyForm, setReplyForm] = useState({}); 
  const isAdmin = role === 'ADMIN';
  const token = localStorage.getItem('token');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReview(product, reviewForm, () => setReviewForm({ rating: 5, comment: '' }));
  };

  const handleReplySubmit = (reviewId) => {
    const text = replyForm[reviewId];
    if (!text) return;
    onReplyReview(reviewId, text, () => {
      const newForm = { ...replyForm };
      delete newForm[reviewId];
      setReplyForm(newForm);
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X size={24}/></button>
        
        <div className="modal-header">
          <img src={product.imageUrl} alt={product.name} className="modal-img" />
          <div>
            <h2>{product.name}</h2>
            <p className="price-large">₹{product.price.toLocaleString()}</p>
          </div>
        </div>

        <div className="reviews-section">
          <h3>Customer Reviews ({productReviews.length})</h3>
          
          {canReview && (
            <div className="write-review-box">
              <h4>Write a Review</h4>
              <p style={{fontSize:'0.85rem', color:'#555'}}>You purchased this item. Share your experience!</p>
              <form onSubmit={handleSubmit}>
                <select 
                  value={reviewForm.rating} 
                  onChange={e => setReviewForm({...reviewForm, rating: e.target.value})}
                  className="rating-select"
                >
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Poor</option>
                  <option value="1">⭐ Very Poor</option>
                </select>
                <input 
                  placeholder="Your review..." 
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                  required
                  className="review-input"
                />
                <button type="submit" className="btn-primary">Submit Review</button>
              </form>
            </div>
          )}

          {productReviews.length === 0 ? (
            <p className="no-reviews">No reviews yet.</p>
          ) : (
            productReviews.map(r => (
              <div key={r.id} className="review-item">
                <div className="review-header">
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <strong>{r.userName}</strong>
                    <span className="stars">{'⭐'.repeat(r.rating)}</span>
                  </div>
                  {isAdmin && (
                    <button 
                      onClick={() => onDeleteReview(r.id)} 
                      className="btn-icon" 
                      style={{background:'#fee2e2', color:'#ef4444', padding:'5px', borderRadius:'50%'}}
                    >
                      <Trash2 size={16}/>
                    </button>
                  )}
                </div>
                <p>{r.comment}</p>
                
                {r.reply && (
                  <div style={{marginTop:'10px', paddingLeft:'15px', borderLeft:'3px solid #2563eb', background:'#f0f9ff', padding:'10px', borderRadius:'0 8px 8px 0'}}>
                    <strong style={{color:'#2563eb', fontSize:'0.9rem'}}>Admin Reply:</strong>
                    <p style={{margin:'5px 0 0 0', fontSize:'0.9rem'}}>{r.reply}</p>
                    <small style={{color:'#64748b'}}>{new Date(r.replyDate).toLocaleDateString()}</small>
                  </div>
                )}

                {isAdmin && (
                  <div style={{marginTop:'10px', display:'flex', gap:'10px', alignItems:'center'}}>
                    <input 
                      placeholder="Write a reply..." 
                      value={replyForm[r.id] || ''}
                      onChange={(e) => setReplyForm({...replyForm, [r.id]: e.target.value})}
                      className="review-input"
                      style={{width:'70%', padding:'6px', fontSize:'0.9rem'}}
                    />
                    <button 
                      onClick={() => handleReplySubmit(r.id)} 
                      className="btn-primary" 
                      style={{padding:'6px 12px', fontSize:'0.8rem'}}
                    >
                      <Send size={14} style={{marginRight:'4px'}}/> Reply
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Home = ({ addToCart, role }) => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${API_URL}/products`).then(res => setProducts(res.data));
    if(token) {
      axios.get(`${API_URL}/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setReviews(res.data)).catch(err => console.error(err));
    }
  }, [token]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSubmitReview = async (product, form, onSuccess) => {
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }
    try {
      await axios.post(`${API_URL}/reviews`, {
        userId: 1, 
        userName: user.split('@')[0],
        productId: product.id,
        productName: product.name,
        rating: parseInt(form.rating),
        comment: form.comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Review Submitted!');
      onSuccess();
      const res = await axios.get(`${API_URL}/reviews`, { headers: { Authorization: `Bearer ${token}` } });
      setReviews(res.data);
    } catch (err) { 
      console.error(err);
      alert('Failed: ' + (err.response?.status === 403 ? 'Unauthorized' : err.message)); 
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if(!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Review Deleted');
      const res = await axios.get(`${API_URL}/reviews`, { headers: { Authorization: `Bearer ${token}` } });
      setReviews(res.data);
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const handleReplyReview = async (reviewId, replyText, onSuccess) => {
    try {
      await axios.put(`${API_URL}/reviews/${reviewId}`, {
        reply: replyText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Reply Sent');
      onSuccess();
      const res = await axios.get(`${API_URL}/reviews`, { headers: { Authorization: `Bearer ${token}` } });
      setReviews(res.data);
    } catch (err) {
      alert('Failed to reply');
    }
  };

  return (
    <div className="container">
      <h2>All Products</h2>
      <div className="product-grid">
        {products.map(p => (
          <ProductCard 
            key={p.id} 
            product={p} 
            allReviews={reviews} 
            user={user}
            role={role}
            addToCart={addToCart}
            onSelectProduct={handleSelectProduct}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductReviewView 
          product={selectedProduct}
          allReviews={reviews}
          user={user}
          role={role}
          onClose={() => setSelectedProduct(null)}
          onSubmitReview={handleSubmitReview}
          onDeleteReview={handleDeleteReview}
          onReplyReview={handleReplyReview}
        />
      )}
    </div>
  );
};

const Cart = ({ cart, removeFromCart, checkout }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <div className="container">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-state">Your cart is empty. <Link to="/home">Go Shopping</Link></div>
      ) : (
        <>
          {cart.map((item, idx) => (
            <div key={idx} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-img" />
              <div className="cart-info">
                <h4>{item.name}</h4>
                <p className="cart-price">₹{item.price.toLocaleString()}</p>
              </div>
              <button onClick={() => removeFromCart(idx)} className="btn-icon"><Trash2 size={20}/></button>
            </div>
          ))}
          <div className="cart-summary">
            <div className="summary-row"><span>Total:</span><strong>₹{total.toLocaleString()}</strong></div>
            <button onClick={checkout} className="btn-checkout">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

const Orders = () => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    axios.get(`${API_URL}/orders/user/${encodeURIComponent(user)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [user, token]);

  if (loading) return <div className="container">Loading orders...</div>;

  return (
    <div className="container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found.</p>
          <p style={{fontSize: '0.9rem', color: '#888'}}>Try buying something from the Home page!</p>
        </div>
      ) : (
        orders.map(o => (
          <div key={o.id} className="order-card">
            <div className="order-header">
              <h3>Order #{o.id}</h3>
              <span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span>
            </div>
            <p>Date: {new Date(o.orderDate).toLocaleDateString()}</p>
            <p>Total: ₹{o.totalAmount.toLocaleString()}</p>
            <ul className="order-items-list">
              {o.items.map((item, i) => (
                <li key={i}>{item.productName} (x{item.quantity})</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    setCart([]);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const checkout = async () => {
    if(!user || !token) return alert("Please login");
    
    try {
      await axios.post(`${API_URL}/orders`, 
        {
          userName: user,
          items: cart.map(item => ({ productId: item.id }))
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert('Order Placed Successfully! Check "My Orders".');
      setCart([]);
    } catch (err) { 
      console.error(err);
      alert('Checkout failed: ' + (err.response?.data || err.message)); 
    }
  };

  return (
    <Router>
      <div className="app-wrapper">
        {!user ? (
          <Login onLogin={(u, r) => { setUser(u); setRole(r); }} />
        ) : (
          <>
            <Navbar user={user} role={role} cartCount={cart.length} onLogout={handleLogout} />
            <Routes>
              <Route path="/home" element={<Home addToCart={addToCart} role={role} />} />
              <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} checkout={checkout} />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/" element={<Home addToCart={addToCart} role={role} />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;