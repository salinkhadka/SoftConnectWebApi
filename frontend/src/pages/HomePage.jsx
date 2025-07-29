"use client"
import React from 'react';
import { useEffect, useState, useRef, useContext } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  FiHome,
  FiUser,
  FiMessageCircle,
  FiBell,
  FiPlusCircle,
  FiMoreHorizontal,
  FiLogOut,
  FiSearch,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
} from "react-icons/fi"
import { useNotifications } from "../hooks/notificationHooks"
import { useConversations } from "../hooks/messagehooks"
import logo from "../assets/logo.png"
import { AuthContext } from "../auth/AuthProvider"
import AddPostModal from "../components/AddPostModal"
import SearchPanel from "../components/SearchModal"
import ConfirmationModal from "../components/ui/ConfirmationModal"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openSearchPanel, setOpenSearchPanel] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme")
    if (saved) return saved
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })
  const moreRef = useRef(null)
  const mobileMenuRef = useRef(null)

  // Notifications auto-refresh every 30s
  const { data: notifications = [] } = useNotifications(user?._id, {
    refetchInterval: 30000,
  })
  const unreadNotifications = notifications.filter((n) => !n.isRead).length

  // Conversations auto-refresh every 30s
  const { data: conversations = [] } = useConversations(user?._id, {
    refetchInterval: 30000,
  })
  const unreadMessages = conversations.filter(
    (conv) => conv.lastMessageSenderId !== user?._id && !conv.lastMessageIsRead,
  ).length

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const u = JSON.parse(storedUser)
      if (u.role === "admin") navigate("/admin", { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setShowMore(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false)
      }
    }
    if (showMore || showMobileMenu) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showMore, showMobileMenu])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
    setShowMore(false)
    setShowMobileMenu(false)
  }

  const handleLogoutConfirm = () => {
    logout()
    navigate("/login")
  }

  // Desktop sidebar link styles
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 text-lg font-medium group hover:scale-105 ${
      isActive ? "text-white shadow-lg transform scale-105" : "text-white/90 hover:text-white hover:shadow-md"
    }`

  // Mobile bottom bar link styles
  const mobileLinkStyle = ({ isActive }) =>
    `flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 relative ${
      isActive ? "text-white" : "text-white/70 hover:text-white"
    }`

  const Badge = ({ count, className = "" }) => {
    if (count === 0) return null
    return (
      <span
        className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center ${className}`}
      >
        {count > 99 ? "99+" : count}
      </span>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 dark:bg-[#121018] text-black dark:text-white font-sans overflow-hidden transition-colors duration-300 relative">
      {/* Mobile Top Bar */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1e1b29] border-b border-gray-200 dark:border-gray-700 z-40">
        {/* Left: Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiBell size={24} style={{ color: PURPLE }} />
          <Badge count={unreadNotifications} />
        </button>
        {/* Center: Search */}
        <button
          onClick={() => setOpenSearchPanel(true)}
          className="flex-1 mx-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FiSearch size={20} />
          <span>Search users...</span>
        </button>
        {/* Right: More Menu */}
        <div className="relative" ref={mobileMenuRef}>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {showMobileMenu ? (
              <FiX size={24} style={{ color: PURPLE }} />
            ) : (
              <FiMenu size={24} style={{ color: PURPLE }} />
            )}
          </button>
          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-white dark:bg-[#1e1b29] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 mb-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <img
                  src={
                    user?.profilePhoto ||
                    `https://ui-avatars.com/api/?background=${LAVENDER.slice(1) || "/placeholder.svg"}&color=${PURPLE.slice(1)}&name=${user?.username || "User"}`
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2"
                  style={{ borderColor: LAVENDER }}
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user?.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              {/* Messages */}
              <button
                onClick={() => {
                  navigate("/inbox")
                  setShowMobileMenu(false)
                }}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium relative"
              >
                <FiMessageCircle size={20} />
                <span>Messages</span>
                <Badge count={unreadMessages} className="relative top-0 right-0 ml-auto" />
              </button>
              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-2 mt-2">
                <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-3">
                  {theme === "dark" ? <FiMoon size={20} /> : <FiSun size={20} />}
                  Dark mode
                </span>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    theme === "dark" ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
                      theme === "dark" ? "translate-x-6" : ""
                    }`}
                  ></div>
                </button>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 my-3"></div>
              {/* Logout */}
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex w-80 flex-col justify-between p-6 relative z-30"
        style={{
          background: `linear-gradient(180deg, ${PURPLE} 0%, #2d1b4e 100%)`,
          borderRight: `1px solid ${LAVENDER}40`,
        }}
      >
        <div>
          {/* Logo */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative">
              <img
                src={logo || "/placeholder.svg"}
                alt="Logo"
                className="h-32 w-32 rounded-full object-cover shadow-2xl border-4"
                style={{ borderColor: LAVENDER }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold" style={{ color: WHITE }}>
                <span style={{ color: LAVENDER }}>Soft</span>
                <span style={{ color: WHITE }}>Connect</span>
              </h1>
              <p className="text-white/70 text-sm mt-1">Connect • Share • Grow</p>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            <button
              className={linkStyle({ isActive: false })}
              onClick={() => setOpenSearchPanel(true)}
              style={{
                background: "linear-gradient(135deg, rgba(184, 166, 230, 0.2) 0%, rgba(184, 166, 230, 0.1) 100%)",
              }}
            >
              <FiSearch size={24} />
              <span>Search</span>
            </button>
            <NavLink
              to="/feed"
              className={linkStyle}
              style={({ isActive }) => ({
                background: isActive
                  ? `linear-gradient(135deg, ${LAVENDER} 0%, #9f7aea 100%)`
                  : "linear-gradient(135deg, rgba(184, 166, 230, 0.2) 0%, rgba(184, 166, 230, 0.1) 100%)",
              })}
            >
              <FiHome size={24} />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/inbox"
              className={linkStyle}
              style={({ isActive }) => ({
                background: isActive
                  ? `linear-gradient(135deg, ${LAVENDER} 0%, #9f7aea 100%)`
                  : "linear-gradient(135deg, rgba(184, 166, 230, 0.2) 0%, rgba(184, 166, 230, 0.1) 100%)",
              })}
            >
              <div className="relative">
                <FiMessageCircle size={24} />
                <Badge count={unreadMessages} />
              </div>
              <span>Messages</span>
            </NavLink>
            <NavLink
              to="/notifications"
              className={linkStyle}
              style={({ isActive }) => ({
                background: isActive
                  ? `linear-gradient(135deg, ${LAVENDER} 0%, #9f7aea 100%)`
                  : "linear-gradient(135deg, rgba(184, 166, 230, 0.2) 0%, rgba(184, 166, 230, 0.1) 100%)",
              })}
            >
              <div className="relative">
                <FiBell size={24} />
                <Badge count={unreadNotifications} />
              </div>
              <span>Notifications</span>
            </NavLink>
            <button
              className={linkStyle({ isActive: false })}
              onClick={() => setOpenCreateModal(true)}
              style={{
                background: "linear-gradient(135deg, rgba(184, 166, 230, 0.2) 0%, rgba(184, 166, 230, 0.1) 100%)",
              }}
            >
              <FiPlusCircle size={24} />
              <span>Create</span>
            </button>
            <NavLink
              to="/profile"
              className={linkStyle}
              style={({ isActive }) => ({
                background: isActive
                  ? `linear-gradient(135deg, ${LAVENDER} 0%, #9f7aea 100%)`
                  : "linear-gradient(135deg, rgba(184, 166, 230, 0.2) 0%, rgba(184, 166, 230, 0.1) 100%)",
              })}
            >
              <FiUser size={24} />
              <span>Profile</span>
            </NavLink>
            {/* More Button */}
            <div className="relative" ref={moreRef}>
              <button
                className={`${linkStyle({ isActive: false })} w-full justify-start`}
                onClick={() => setShowMore((v) => !v)}
                type="button"
                style={{
                  background: "linear-gradient(135deg, rgba(184, 166, 230, 0.2) 0%, rgba(184, 166, 230, 0.1) 100%)",
                }}
              >
                <FiMoreHorizontal size={24} />
                <span>More</span>
              </button>
              {showMore && (
                <div className="absolute w-72 left-0 bottom-16 bg-white dark:bg-[#1e1b29] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 p-4">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-800 dark:text-gray-200 font-medium flex items-center gap-3">
                      {theme === "dark" ? <FiMoon size={20} /> : <FiSun size={20} />}
                      Dark mode
                    </span>
                    <button
                      onClick={toggleTheme}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        theme === "dark" ? "bg-purple-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
                          theme === "dark" ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </button>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-3"></div>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium"
                  >
                    <FiLogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
        {/* Footer */}
        <div className="text-center mt-8">
          <div className="text-sm font-semibold">
            <span style={{ color: LAVENDER }}>Soft</span>
            <span style={{ color: WHITE }}>Connect</span>
          </div>
          <p className="text-white/50 text-xs mt-1">© 2025 All rights reserved</p>
        </div>
      </aside>

      {/* Desktop Search Panel - Positioned beside sidebar */}
      {openSearchPanel && (
        <SearchPanel open={openSearchPanel} onClose={() => setOpenSearchPanel(false)} positioning="beside-sidebar" />
      )}

      {/* Mobile Search Panel - Full screen modal */}
      {openSearchPanel && (
        <div className="lg:hidden">
          <SearchPanel open={openSearchPanel} onClose={() => setOpenSearchPanel(false)} positioning="mobile-modal" />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#121018] transition-colors duration-300 pb-20 lg:pb-6">
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-2 border-t border-gray-200 dark:border-gray-700"
        style={{
          background: `linear-gradient(180deg, ${PURPLE} 0%, #2d1b4e 100%)`,
        }}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          <NavLink to="/feed" className={mobileLinkStyle}>
            <FiHome size={24} />
            <span className="text-xs mt-1 font-medium">Home</span>
          </NavLink>
          <NavLink to="/inbox" className={mobileLinkStyle}>
            <div className="relative">
              <FiMessageCircle size={24} />
              <Badge count={unreadMessages} />
            </div>
            <span className="text-xs mt-1 font-medium">Messages</span>
          </NavLink>
          <button
            onClick={() => setOpenCreateModal(true)}
            className="flex flex-col items-center justify-center p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${LAVENDER} 0%, #9f7aea 100%)`,
            }}
          >
            <FiPlusCircle size={28} className="text-white" />
          </button>
          <NavLink to="/profile" className={mobileLinkStyle}>
            <FiUser size={24} />
            <span className="text-xs mt-1 font-medium">Profile</span>
          </NavLink>
        </div>
      </nav>

      {/* Modals */}
      <AddPostModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  )
}
