// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // Essential for global styles and variables
import App from './App'; // Your main App component

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider forceColorScheme="dark"> {/* Forces dark mode globally */}
      <App />
    </MantineProvider>
  </React.StrictMode>
);
