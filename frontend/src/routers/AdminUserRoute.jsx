import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import AdminLayout from '../layouts/AdminLayout';
import HomePage from "../pages/HomePage";


function AdminUserRoute() {
  const { user, Loading } = useContext(AuthContext);
  const location = useLocation();

  if (Loading) return <>Loading...</>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  
  return < Outlet/>;
}

export default AdminUserRoute;
