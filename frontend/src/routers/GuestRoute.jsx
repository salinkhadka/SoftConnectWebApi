import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import { useContext } from "react";
import React from "react";

function GuestRoute() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Allow access to reset-password route even if user is logged in
  const isResetPasswordPage = location.pathname.startsWith("/reset-password");

  if (loading) return <>Loading</>;

  if (user && !isResetPasswordPage) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default GuestRoute;
