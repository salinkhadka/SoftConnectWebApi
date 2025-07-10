import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import { useContext } from "react";
import React from 'react';

function NormalUserRoute() {
  const { user, loading } = useContext(AuthContext); // ✅ lowercase

  if (loading) return <>Loading</>;

  if (!user) return <Navigate to="/login" replace />;

  // Optional: redirect based on role
  // if (user.role !== "normal") return <Navigate to="/admin" replace />;

  console.log("Logged", user);

  return <Outlet />;
}

export default NormalUserRoute;
