"use client"

import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useContext, useState, useRef, useEffect } from "react"
import { AuthContext } from "../auth/AuthProvider"
import {
  FiUsers,
  FiFileText,
  FiPlus,
  FiBarChart,
  FiMoreHorizontal,
  FiLogOut,
  FiMoon,
  FiSun,
  FiKey,
  FiMenu,
  FiX,
} from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
      )
    }
    return false
  })

  const navigate = useNavigate()
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const moreMenuRef = useRef(null)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDarkMode])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev)

  const handleLogout = () => {
    logout()
    setShowMoreMenu(false)
  }

  const handleChangePassword = () => {
    navigate("/changepassword")
    setShowMoreMenu(false)
  }

  const navItems = [
    { to: "/admin/users", icon: FiUsers, label: "Users" },
    { to: "/admin/posts", icon: FiFileText, label: "Posts" },
    { to: "/admin/addPost", icon: FiPlus, label: "Add Post" },
    { to: "/admin/analytics", icon: FiBarChart, label: "Analytics" },
  ]

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-white/20 text-white font-semibold shadow-lg backdrop-blur-sm"
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col shadow-2xl">
        <div
          className="h-full flex flex-col"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <div className="p-6 border-b border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white">SoftConnect</h2>
            <p className="text-sm text-white/70 mt-1">Admin Panel</p>
          </div>

          <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkStyle}>
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}

            {/* More menu - Desktop */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu((prev) => !prev)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-white/80 hover:bg-white/10 hover:text-white"
                aria-haspopup="true"
                aria-expanded={showMoreMenu}
              >
                <FiMoreHorizontal size={20} />
                More
              </button>

              {showMoreMenu && (
                <div
                  ref={moreMenuRef}
                  className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-[#1e1b29] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4"
                >
                  {/* Profile section */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        user?.profilePhoto ||
                        `https://ui-avatars.com/api/?background=${
                          LAVENDER.slice(1) || "/placeholder.svg"
                        }&color=${PURPLE.slice(1)}&name=${user?.username || "Admin"}`
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2"
                      style={{ borderColor: LAVENDER }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username || "Admin"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || "admin@softconnect.com"}
                      </p>
                    </div>
                  </div>

                  {/* Dark Mode toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-800 dark:text-white">
                      {isDarkMode ? <FiMoon size={18} /> : <FiSun size={18} />}
                      <span>Dark Mode</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        isDarkMode ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
                          isDarkMode ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 my-3" />

                  {/* Change Password */}
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium"
                  >
                    <FiKey size={18} />
                    Change Password
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium"
                  >
                    <FiLogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>

          <div className="p-6 border-t border-white/20 text-center text-xs text-white/60">© 2025 SoftConnect</div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">SoftConnect</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full font-medium">
              Admin
            </span>
            <div className="relative" ref={moreMenuRef}>
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <FiMoreHorizontal size={20} />
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1e1b29] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 p-4">
                  {/* Profile section */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={
                        user?.profilePhoto ||
                        `https://ui-avatars.com/api/?background=${
                          LAVENDER.slice(1) || "/placeholder.svg"
                        }&color=${PURPLE.slice(1)}&name=${user?.username || "Admin"}`
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2"
                      style={{ borderColor: LAVENDER }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username || "Admin"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || "admin@softconnect.com"}
                      </p>
                    </div>
                  </div>

                  {/* Dark Mode toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-gray-800 dark:text-white">
                      {isDarkMode ? <FiMoon size={18} /> : <FiSun size={18} />}
                      <span>Dark Mode</span>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        isDarkMode ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
                          isDarkMode ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 my-3" />

                  {/* Change Password */}
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-medium"
                  >
                    <FiKey size={18} />
                    Change Password
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium"
                  >
                    <FiLogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="w-64 h-full shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/20">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">SoftConnect</h2>
                <p className="text-sm text-white/70 mt-1">Admin Panel</p>
              </div>
            </div>
            <nav className="p-6 space-y-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkStyle} onClick={() => setIsMobileMenuOpen(false)}>
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                  isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"
                }`
              }
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden md:flex bg-white dark:bg-gray-800 shadow-sm px-6 py-4 justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome, {user?.username || "Admin"}</h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full font-medium">
              Administrator
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto mt-16 md:mt-0 mb-16 md:mb-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
