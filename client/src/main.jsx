import React from 'react';
import ReactDOM from 'react-dom/client';
import router from './routes.jsx';

import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { ChakraProvider } from '@chakra-ui/react';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
