import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Force dark mode on app initialization
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);