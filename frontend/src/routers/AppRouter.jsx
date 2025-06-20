import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import UserLayout from '../layouts/UserLayout';
import HomePage from '../pages/HomePage';
import AdminLayout from '../layouts/AdminLayout';
import AdminUserRoute from './AdminUserRoute';
import PostPageAdmin from '../pages/Admin/PostPageAdmin';
import AddPostComponent from '../components/Admin/AddPost';
import UserPageAdmin from '../pages/Admin/UserPageAdmin';

export default function AppRouter() {
  return (
     <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/homepage" element={<HomePage />} />
        </Route>

       <Route path="/admin" element={<AdminLayout />}>
          {/* All admin pages protected by AdminUserRoute */}
          <Route element={<AdminUserRoute />}>
          <Route path="users" element={<UserPageAdmin/>} />
            <Route path="posts" element={<PostPageAdmin/>} />
            <Route path="addPost" element={<AddPostComponent/>} />
            {/* Add more admin subpages here, e.g.: */}
            {/* <Route path="users" element={<UsersPage />} /> */}
          </Route>
          <Route path="*" element={<>404 Not Found</>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}