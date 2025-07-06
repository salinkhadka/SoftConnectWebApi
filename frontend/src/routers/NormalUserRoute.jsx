import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import { useContext } from "react";
import React from 'react'

function NormalUserRoute() {
    const { user, Loading } = useContext(AuthContext);

    if (Loading) return <>Loading</>

    if (!user) return <Navigate to="/login" replace />
    //replace will note save history
    console.log("Logged", user)
    // if (user.role === "normal") return <Navigate to="/admin" replace />

    
    return <Outlet />
}

export default NormalUserRoute