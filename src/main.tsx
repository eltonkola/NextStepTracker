import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);

try {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  root.render(
    <div style={{
      padding: '20px',
      textAlign: 'center',
      color: '#ff0000'
    }}>
      <h1>Application Error</h1>
      <p>There was an error loading the application.</p>
      <p>Please check the browser console for more details.</p>
    </div>
  );
}
