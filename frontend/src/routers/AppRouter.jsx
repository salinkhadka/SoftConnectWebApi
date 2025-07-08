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
import FeedComponent from '../components/FeedComponent';
import ProfileHeader from '../components/ProfileHeader';
import MyProfileSection from '../pages/ProfilePage';
import UserProfile from '../components/ProfileVisitHeader';

// ✅ Messaging
import InboxPage from '../components/InboxPage';
import MessagePage from '../components/MessagePage';

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

        {/* Normal User Routes */}
        <Route element={<NormalUserRoute />}>
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />}>
              <Route index element={<FeedComponent />} />
              <Route path="feed" element={<FeedComponent />} />
              <Route path="profile" element={<MyProfileSection />} />
              <Route path="/inbox" element={<InboxPage />} />
              <Route path="/:userid" element={<UserProfile />} />
              <Route path="/:userid/message" element={<MessagePage />} />
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
