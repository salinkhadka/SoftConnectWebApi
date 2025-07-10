import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Pages & Layouts
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import HomePage from '../pages/HomePage';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Route Guards
import AdminUserRoute from './AdminUserRoute';
import GuestRoute from './GuestRoute';
import NormalUserRoute from './NormalUserRoute';

// Admin Components
import PostPageAdmin from '../pages/Admin/PostPageAdmin';
import AddPostComponent from '../components/Admin/AddPost';
import UserPageAdmin from '../pages/Admin/UserPageAdmin';

// User Components
import FeedComponent from '../components/FeedComponent';
import MyProfileSection from '../pages/ProfilePage';
import UserProfile from '../components/ProfileVisitHeader';
import InboxPage from '../components/InboxPage';
import MessagePage from '../components/MessagePage';
import NotificationPage from '../components/NotificationPage';

// Auth & Password
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import ChangePassword from '../components/ChangePassword';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/reset-password/:token" element={<ResetPassword />} />
        

        {/* Guest-only Routes */}
        <Route element={<GuestRoute />}>
          {/* Routes with layout */}
          <Route element={<UserLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

          </Route>

          {/* Standalone public route without layout */}
          
        </Route>

        {/* Normal User Routes */}
        <Route element={<NormalUserRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />}>
              <Route index element={<FeedComponent />} />
              <Route path="feed" element={<FeedComponent />} />
              <Route path="profile" element={<MyProfileSection />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/:userid" element={<UserProfile />} />
              <Route path="/:userid/message" element={<MessagePage />} />
              <Route path="/changepassword" element={<ChangePassword />} />
            </Route>
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminUserRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<div>Welcome to Admin Dashboard</div>} />
            <Route path="users" element={<UserPageAdmin />} />
            <Route path="posts" element={<PostPageAdmin />} />
            <Route path="addPost" element={<AddPostComponent />} />
            <Route path="*" element={<div>Admin Page Not Found</div>} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div>404 Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}
