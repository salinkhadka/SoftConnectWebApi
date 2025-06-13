import React from 'react'
import Header from './header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'

function UserLayout() {
  return (
    <div>
        
        {/* <div className="bg-red-500 text-white text-4xl p-8">
      If you see a big red box, Tailwind is working! 🎉
    </div> */}

        <Outlet/>
        {/* <Footer/> */}
    </div>
  )
}

export default UserLayout