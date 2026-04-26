import React from 'react'

function App() {
  const inventoryData = [
    { id: 1, name: "Arduino Kit", category: "Hardware", qty: 5, status: "Available" },
    { id: 2, name: "Figma License", category: "Software", qty: 20, status: "Available" },
    { id: 3, name: "Soldering Iron", category: "Hardware", qty: 0, status: "Unavailable" },
    { id: 4, name: "USB-C Hub", category: "Hardware", qty: 10, status: "Available" }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Open Project Inventory</h1>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={{ padding: '10px' }}>Name</th>
            <th style={{ padding: '10px' }}>Category</th>
            <th style={{ padding: '10px' }}>Qty</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map(item => (
            <tr key={item.id}>
              <td style={{ padding: '10px' }}>{item.name}</td>
              <td style={{ padding: '10px' }}>{item.category}</td>
              <td style={{ padding: '10px' }}>{item.qty}</td>
              <td style={{ 
                padding: '10px', 
                color: item.status === 'Available' ? 'green' : 'red',
                fontWeight: 'bold' 
              }}>
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App