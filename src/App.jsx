import React, { useState, useEffect } from 'react';

function App() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '', quantity: '', status: 'Available' });

  // 1. Fetch data from Backend
  const fetchInventory = async () => {
    const response = await fetch('http://localhost:3000/inventory');
    const data = await response.json();
    setInventory(data);
  };

  useEffect(() => { fetchInventory(); }, []);

  // 2. Handle Form Changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, quantity: Number(formData.quantity) }),
    });
    setFormData({ name: '', category: '', quantity: '', status: 'Available' }); // Clear form
    fetchInventory(); // 3. Refresh list automatically
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Inventory Dashboard</h1>

      {/* ADD ITEM FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px' }}>
        <h3>Add New Item</h3>
        <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
        <input type="number" placeholder="Qty" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
        <button type="submit">Add to Inventory</button>
      </form>

      {/* DISPLAY LIST */}
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>Name</th><th>Category</th><th>Qty</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td><td>{item.category}</td><td>{item.quantity}</td><td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;