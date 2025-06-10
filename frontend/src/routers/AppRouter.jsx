import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import UserLayout from '../layouts/UserLayout';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout/>}>
          <Route path="login" element={<LoginPage/>} />
          <Route path="signup" element={<SignupPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}