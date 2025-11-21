import React, { useState, useEffect } from 'react';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Recycled Plastic Bottles",
      description: "Clean, sorted plastic bottles ready for recycling",
      price: 20,
      quantity: 5,
      image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=200&h=200&fit=crop",
      inStock: true,
      selected: true
    },
    {
      id: 2,
      name: "Used Cardboard Box",
      description: "Sturdy cardboard boxes, perfect for repurposing",
      price: 10,
      quantity: 10,
      image: "https://images.unsplash.com/photo-1580913428706-c311e67898b3?w=200&h=200&fit=crop",
      inStock: true,
      selected: true
    },
    {
      id: 3,
      name: "Metal Scrap Bundle",
      description: "High-quality metal scraps sorted by type",
      price: 150,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1609424246634-00ed16e1d6b4?w=200&h=200&fit=crop",
      inStock: true,
      selected: true
    },
    {
      id: 4,
      name: "Reused Glass Containers",
      description: "Clean glass jars and bottles for reuse",
      price: 40,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&h=200&fit=crop",
      inStock: true,
      selected: true
    }
  ]);

  const [notification, setNotification] = useState(null);
  const [promoCode, setPromoCode] = useState('');

  const SHIPPING_FEE = 50;
  const TAX_RATE = 0.13;
  const ECO_DISCOUNT_RATE = 0.05;

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleItemSelection = (itemId) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, selected: !item.selected } : item
    ));
  };

  const removeItem = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (window.confirm(`Remove ${item.name} from cart?`)) {
      setCartItems(cartItems.filter(i => i.id !== itemId));
      showNotification(`${item.name} removed from cart`, 'danger');
    }
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      setCartItems([]);
      showNotification('Cart cleared', 'danger');
    }
  };

  const applyPromoCode = () => {
    const validCodes = {
      'ECO10': 0.10,
      'GREEN15': 0.15,
      'SAVE20': 0.20
    };
    
    const code = promoCode.trim().toUpperCase();
    
    if (validCodes[code]) {
      const discount = validCodes[code];
      showNotification(`Promo code applied! ${discount * 100}% off`, 'success');
      setPromoCode('');
    } else if (code === '') {
      showNotification('Please enter a promo code', 'warning');
    } else {
      showNotification('Invalid promo code', 'danger');
    }
  };

  const proceedToCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      showNotification('Please select items to checkout', 'warning');
      return;
    }
    
    showNotification('Proceeding to checkout...', 'success');
    setTimeout(() => {
      alert('Redirecting to checkout page...\n\nSelected items: ' + selectedItems.length);
    }, 500);
  };

  const calculateSummary = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * TAX_RATE;
    const ecoDiscount = subtotal * ECO_DISCOUNT_RATE;
    const total = subtotal + SHIPPING_FEE + tax - ecoDiscount;
    const wastesSaved = (selectedItems.length * 0.625).toFixed(1);
    
    return { subtotal, tax, ecoDiscount, total, wastesSaved, itemCount: selectedItems.length };
  };

  const summary = calculateSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
        
        .notification-enter {
          animation: slideIn 0.3s ease-out;
        }
        
        .notification-exit {
          animation: slideOut 0.3s ease-out;
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-24 right-8 z-50 px-6 py-4 rounded-xl shadow-lg font-semibold notification-enter ${
          notification.type === 'success' ? 'bg-green-600' : 
          notification.type === 'danger' ? 'bg-red-600' : 'bg-orange-600'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-40">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/891/891462.png" 
              alt="Logo" 
              className="w-12 h-12 hover:rotate-360 hover:scale-110 transition-all duration-300"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
              Recycle Reuse Reduce
            </h1>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <input 
              type="search" 
              placeholder="Search eco-friendly products..." 
              className="pl-12 pr-4 py-3 w-80 rounded-full border-2 border-gray-200 bg-slate-50 focus:border-green-600 focus:outline-none focus:bg-white focus:shadow-lg transition-all"
            />
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <ul className="flex justify-center gap-2 px-8 py-3">
          {['🏠 Home', '💰 Sell', '🛒 Cart', '📦 Order', '📜 History', '✨ Custom', '📊 Dashboard'].map((item, idx) => (
            <li 
              key={idx}
              className={`px-6 py-3 rounded-full cursor-pointer font-medium transition-all ${
                item === '🛒 Cart' 
                  ? 'bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:-translate-y-0.5'
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center bg-white p-16 rounded-2xl shadow-lg">
              <div className="text-8xl mb-4 opacity-50">🛒</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any eco-friendly items yet!</p>
              <button className="px-8 py-4 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all">
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800">Shopping Cart</h2>
                <span className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold text-sm">
                  {cartItems.length} items
                </span>
              </div>

              {/* Cart Items */}
              {cartItems.map(item => (
                <div 
                  key={item.id}
                  className="grid grid-cols-[auto_100px_2fr_140px_120px_auto] gap-6 items-center p-6 mb-4 border-2 border-gray-200 rounded-2xl hover:border-green-600 hover:shadow-md transition-all"
                >
                  <input 
                    type="checkbox" 
                    checked={item.selected}
                    onChange={() => toggleItemSelection(item.id)}
                    className="w-5 h-5 cursor-pointer accent-green-600"
                  />
                  
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="flex gap-3">
                      <span className="bg-gradient-to-r from-green-700 to-green-600 text-white px-3 py-1 rounded-xl text-xs font-semibold">
                        ♻️ Eco-Friendly
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-xs font-semibold">
                        In Stock
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 px-5 py-3 rounded-xl">
                    <span className="text-sm text-gray-600 mr-2">Qty:</span>
                    <span className="text-xl font-bold text-green-700">{item.quantity}</span>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-700">Rs. {item.price * item.quantity}</div>
                    <div className="text-xs text-gray-500 mt-1">Rs. {item.price} each</div>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="bg-red-50 hover:bg-red-600 p-3 rounded-xl text-xl transition-all hover:scale-110"
                  >
                    🗑️
                  </button>
                </div>
              ))}

              {/* Cart Actions */}
              <div className="flex justify-between gap-4 mt-8 pt-6 border-t-2 border-gray-100">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-white hover:border-green-600 hover:text-green-700 transition-all">
                  <span>←</span> Continue Shopping
                </button>
                <button 
                  onClick={clearCart}
                  className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-600 hover:text-white transition-all"
                >
                  🗑️ Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-lg h-fit sticky top-32">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({summary.itemCount} items)</span>
                  <span>Rs. {summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping Fee</span>
                  <span>Rs. {SHIPPING_FEE}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (13%)</span>
                  <span>Rs. {summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-orange-600 font-semibold">
                  <span>Eco Discount (-5%)</span>
                  <span>- Rs. {summary.ecoDiscount.toFixed(2)}</span>
                </div>
              </div>

              <div className="h-0.5 bg-gray-100 my-6"></div>

              <div className="flex justify-between text-xl font-bold text-green-700 mb-6">
                <span>Total</span>
                <span>Rs. {summary.total.toFixed(2)}</span>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyPromoCode()}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none"
                />
                <button 
                  onClick={applyPromoCode}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 hover:-translate-y-0.5 transition-all"
                >
                  Apply
                </button>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={proceedToCheckout}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-xl font-bold text-lg flex justify-between items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all mb-6"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </button>

              {/* Eco Impact */}
              <div className="flex gap-4 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl mb-6">
                <div className="text-3xl">🌱</div>
                <div>
                  <div className="font-bold text-green-700 mb-1">Eco Impact</div>
                  <p className="text-sm text-gray-600">
                    Your purchase saves {summary.wastesSaved}kg of waste from landfills!
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="text-center pt-6 border-t-2 border-gray-100">
                <p className="text-sm text-gray-500 mb-3">We Accept</p>
                <div className="flex justify-center gap-4 text-2xl">
                  <span>💳</span>
                  <span>📱</span>
                  <span>💰</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShoppingCart;