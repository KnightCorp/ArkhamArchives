import React from 'react';
import ReactDOM from 'react-dom/client';

function EnvTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Environment Variables Test</h2>
      <pre>{
        JSON.stringify({
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✅ Found' : '❌ Missing',
          VITE_SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY ? '✅ Found' : '❌ Missing',
          NODE_ENV: import.meta.env.MODE,
          BASE_URL: import.meta.env.BASE_URL,
          DEV: import.meta.env.DEV,
          PROD: import.meta.env.PROD,
          SSR: import.meta.env.SSR,
        }, null, 2)
      }</pre>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<EnvTest />);
