import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);

const renderApp = () => {
  try {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Error rendering app:', error);
    const errorElement = (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#ff0000',
        background: '#fff',
        border: '1px solid #ff0000'
      }}>
        <h1>Application Error</h1>
        <p>There was an error loading the application.</p>
        <p>Error: {error?.message || 'Unknown error'}</p>
        <p>Please check the browser console for more details.</p>
      </div>
    );

    root.render(errorElement);
  }
};

// Try to render the app
renderApp();

// Add error boundary for hydration errors
window.addEventListener('error', (event) => {
  console.error('Window error:', event);
  const errorElement = (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      color: '#ff0000',
      background: '#fff',
      border: '1px solid #ff0000'
    }}>
      <h1>Application Error</h1>
      <p>There was an error in the application.</p>
      <p>Please check the browser console for more details.</p>
    </div>
  );
  root.render(errorElement);
});
