import { useState } from 'react';

export function DebugTest() {
  const [value, setValue] = useState('');

  return (
    <div style={{ padding: '20px', background: '#1a1a1a', color: 'white' }}>
      <h2>Debug Test Component</h2>
      <p>If you can type below, React is working:</p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginTop: '10px',
          background: '#333',
          border: '1px solid #666',
          color: 'white',
          fontSize: '16px'
        }}
        placeholder="Type here to test..."
      />
      <p style={{ marginTop: '10px' }}>You typed: {value}</p>
    </div>
  );
}
