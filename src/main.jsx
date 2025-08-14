// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications'; // Add this for notifications
import '@mantine/core/styles.css'; // Essential for global styles and variables
import '@mantine/notifications/styles.css'; // Add this for notifications styles
import App from './App'; // Your main App component

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider forceColorScheme="dark"> {/* Forces dark mode globally */}
      <Notifications /> {/* Add this provider for notifications to work */}
      <App />
    </MantineProvider>
  </React.StrictMode>
);
