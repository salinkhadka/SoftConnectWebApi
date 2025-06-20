import { Navigate,Outlet } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import { useContext } from "react";

import React from 'react'

function GuestRoute() {
    const {user} =useContext(AuthContext)
    const {loading}=useContext(AuthContext)

    if(loading) return <>Loading</>
    if(user) return <Navigate to="/" />


  return <Outlet/>
}

export default GuestRoute