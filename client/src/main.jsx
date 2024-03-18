import React from 'react';
import ReactDOM from 'react-dom/client';
import router from './routes.jsx';

import { RouterProvider } from 'react-router-dom';

import { ChakraProvider } from '@chakra-ui/react';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
