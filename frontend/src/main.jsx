import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Add this import
import { AuthContextProvider } from './auth/AuthProvider'; // Adjust path as needed
import { ToastContainer,Slide } from 'react-toastify';

import UserLayout from './layouts/UserLayout';
import AppRouter from './routers/AppRouter';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <AppRouter />
       <ToastContainer
          position='top-right'
          autoClose={2000}
          hideProgressBar={false}
          theme='dark'
          transition={Slide} // Bouce, Slide, Zoom, Flip
        />
       

    </AuthContextProvider>
  </QueryClientProvider>
);