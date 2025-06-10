import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Add this import
import { AuthContextProvider } from './auth/AuthProvider'; // Adjust path as needed

import UserLayout from './layouts/UserLayout';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <UserLayout />
    </AuthContextProvider>
  </QueryClientProvider>
);