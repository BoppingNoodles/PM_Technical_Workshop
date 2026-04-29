import React, { useState, useEffect } from 'react';

function App() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({ name: '', category: '', quantity: '', status: 'Available' });
  
  const [auditLogs, setAuditLogs] = useState([]);

  // Fetch data from Backend
  const fetchInventory = async () => {
    try {
      const response = await fetch('https://pm-technical-workshop.onrender.com');
      const data = await response.json();
      setInventory(data);
    } catch (err) {
      console.error("Error fetching inventory", err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      // Assumes audit_log.jsonl is placed in your React app's /public folder
      const response = await fetch('/audit_log.jsonl');
      if (response.ok) {
        const text = await response.text();
        const logs = text.trim().split('\n').filter(line => line).map(line => JSON.parse(line));
        setAuditLogs(logs);
      }
    } catch (error) {
      console.error("Could not load audit logs. Did you copy it to the public folder?", error);
    }
  };

  useEffect(() => { 
    fetchInventory(); 
    fetchAuditLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, quantity: Number(formData.quantity) }),
    });
    setFormData({ name: '', category: '', quantity: '', status: 'Available' }); 
    fetchInventory(); 
  };

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventory.filter(item => item.quantity > 0 && item.quantity < 5).length;
  const uniqueCategories = new Set(inventory.map(item => item.category)).size;

  // --- REQUIREMENT 2: Surface ML-Related System States ---
  const discrepancies = auditLogs.filter(log => log.event_type === 'DISCREPANCY');
  const uncertainItems = auditLogs.filter(log => log.event_type === 'UNCERTAIN');

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Inventory Dashboard</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', background: '#f0f4f8', borderRadius: '8px', flex: 1 }}>
          <h3>Total Items</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{totalItems}</p>
        </div>
        <div style={{ padding: '20px', background: '#f0f4f8', borderRadius: '8px', flex: 1 }}>
          <h3>Categories</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{uniqueCategories}</p>
        </div>
        <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '8px', flex: 1 }}>
          <h3>Low Stock Items</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#856404' }}>{lowStockCount}</p>
        </div>
      </div>

      {(discrepancies.length > 0 || uncertainItems.length > 0) && (
        <div style={{ marginBottom: '30px' }}>
          {discrepancies.length > 0 && (
            <div style={{ padding: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '10px' }}>
              <strong>⚠️ Discrepancy Detected!</strong> ML model observed {discrepancies.length} item(s) on the shelf that are marked as out-of-stock in the database.
            </div>
          )}
          {uncertainItems.length > 0 && (
            <div style={{ padding: '15px', background: '#cce5ff', color: '#004085', borderRadius: '8px' }}>
              <strong>👀 Manual Review Required:</strong> {uncertainItems.length} item(s) have low ML confidence scores and need human verification.
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h3>Add New Item</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
          <input type="number" placeholder="Qty" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
          <button type="submit">Add to Inventory</button>
        </div>
      </form>

      <h3>Inventory Status</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Declared DB Qty</th>
            <th style={{ padding: '10px' }}>Observed ML Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => {
            // Find if this item has an ML audit log
            const mlLog = auditLogs.find(log => log.item === item.name);
            
            // Determine how to style the observed status
            let mlStatusText = "No recent image";
            let mlStatusColor = "gray";

            if (mlLog) {
              if (mlLog.event_type === "VERIFIED") {
                mlStatusText = `Verified (Conf: ${mlLog.confidence})`;
                mlStatusColor = "green";
              } else if (mlLog.event_type === "DISCREPANCY") {
                mlStatusText = `Discrepancy: Seen on shelf!`;
                mlStatusColor = "red";
              } else if (mlLog.event_type === "UNCERTAIN") {
                mlStatusText = `Uncertain (Review needed)`;
                mlStatusColor = "orange";
              }
            }

            return (
              <tr key={index}>
                <td style={{ padding: '10px' }}>{item.name}</td>
                <td style={{ padding: '10px' }}>{item.category}</td>
                <td style={{ padding: '10px' }}>{item.quantity}</td>
                <td style={{ padding: '10px', color: mlStatusColor, fontWeight: 'bold' }}>
                  {mlStatusText}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;