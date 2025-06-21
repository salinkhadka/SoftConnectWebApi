import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import AdminUserRoute from './AdminUserRoute';
import GuestRoute from './GuestRoute';
import NormalUserRoute from './NormalUserRoute';
import PostPageAdmin from '../pages/Admin/PostPageAdmin';
import AddPostComponent from '../components/Admin/AddPost';
import UserPageAdmin from '../pages/Admin/UserPageAdmin';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Guest-only Routes */}
        <Route element={<GuestRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>
        </Route>

        {/* Normal Logged-in User Routes */}
        <Route element={<NormalUserRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/homepage" element={<HomePage />} />
            {/* Add more normal-user accessible routes here */}
          </Route>
        </Route>

        <Route element={<AdminUserRoute />}>
          <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<div>Welcome to Admin Dashboard</div>} />
            <Route path="users" element={<UserPageAdmin />} />
            <Route path="posts" element={<PostPageAdmin />} />
            <Route path="addPost" element={<AddPostComponent />} />
            <Route path="*" element={<>Admin Page Not Found</>} />
          </Route>
        </Route>


        <Route path="*" element={<HomePage/>} />

      </Routes>
    </BrowserRouter>
  );
}
