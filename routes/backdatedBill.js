import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BackdatedBilling() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // default today

  useEffect(() => {
    axios.get("https://brotherscafe-backend.onrender.com/api/menu")
      .then(res => setMenu(res.data))
      .catch(console.error);
  }, []);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  const handleSave = async () => {
    if (!date) return alert("Select a date");
    if (cart.length === 0) return alert("Cart is empty");

    try {
      const res = await axios.post(
        "https://brotherscafe-backend.onrender.com/api/bill/backdated",
        { items: cart, total, date }
      );
      alert(res.data.message);
      setCart([]);
      setDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving backdated bill");
    }
  };

  return (
    <div className="container">
      <h2>Backdated Billing</h2>

      {/* Date Picker */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Menu Items */}
      <h3>Menu</h3>
      {menu.length === 0 && <div className="card">No menu items available.</div>}
      {menu.map((item, idx) => (
        <div key={idx} className="card" style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <div>{item.name} — ₹{item.price}</div>
          <button className="btn" onClick={() => addToCart(item)}>Add</button>
        </div>
      ))}

      {/* Cart */}
      <h3 style={{ marginTop: 20 }}>Cart</h3>
      {cart.length === 0 && <div className="card">Cart is empty</div>}
      {cart.map((i, idx) => (
        <div key={idx} className="card" style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <div>{i.name}</div>
          <div>₹{i.price}</div>
        </div>
      ))}

      {/* Total & Save */}
      <h3>Total: ₹{total}</h3>
      <button
        className="btn btn-blue"
        onClick={handleSave}
        disabled={!date || cart.length === 0}
      >
        Save Backdated Bill
      </button>
    </div>
  );
}
