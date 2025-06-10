import React from 'react'
import Header from './header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'

function UserLayout() {
  return (
    <div>
        <Header/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default UserLayout