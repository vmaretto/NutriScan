import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';           // importa il CSS di Tailwind
import App from './App';        // qui monteremo il tuo NutriScanApp

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);