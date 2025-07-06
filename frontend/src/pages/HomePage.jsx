import React, { useEffect, useState, useRef, useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUser, FiMessageCircle, FiBell,
  FiPlusCircle, FiUsers, FiMoreHorizontal, FiLogOut,
  FiSearch,
} from 'react-icons/fi';

import logo from '../assets/logo.png';
import { AuthContext } from '../auth/AuthProvider';

import AddPostModal from '../components/AddPostModal';
import SearchPanel from '../components/SearchModal';

const PURPLE = '#37225C';
const LAVENDER = '#B8A6E6';
const WHITE = '#FFFFFF';

export default function HomePage() {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openSearchPanel, setOpenSearchPanel] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const moreRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      }
    }
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setShowMore(false);
      }
    }
    if (showMore) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMore]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg transition-all text-xl font-medium
    ${isActive
      ? 'bg-[#4A317C] text-white font-semibold shadow'
      : 'text-white hover:bg-[#4A317C] hover:text-[#B8A6E6]'
    }`;

  return (
    <div className="flex h-screen bg-white dark:bg-[#121018] text-black dark:text-white font-sans overflow-hidden transition-colors duration-500">
      {/* Sidebar */}
      <aside
        className="w-[23%] hidden sm:flex flex-col justify-between p-4"
        style={{
          background: PURPLE,
          borderRight: '2px solid #ede9fe',
        }}
      >
        <div>
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-10">
            <img
              src={logo}
              alt="Logo"
              className="h-48 w-48 rounded-full object-cover shadow-md"
              style={{ border: `3px solid ${LAVENDER}` }}
            />
            <div className="mt-3 text-3xl font-extrabold text-center" style={{ textShadow: '0 2px 10px #20153b' }}>
              <span style={{ color: LAVENDER }}>Soft</span>
              <span style={{ color: WHITE }}>Connect</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-3">
            <button
              className={linkStyle({ isActive: false })}
              onClick={() => setOpenSearchPanel(true)}
            >
              <FiSearch size={28} />
              <span>Search</span>
            </button>
            <NavLink to="/feed" className={linkStyle}>
              <FiHome size={28} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/friends" className={linkStyle}>
              <FiUsers size={28} />
              <span>Friends</span>
            </NavLink>
            <NavLink to="/messages" className={linkStyle}>
              <FiMessageCircle size={28} />
              <span>Messages</span>
            </NavLink>
            <NavLink to="/notifications" className={linkStyle}>
              <FiBell size={28} />
              <span>Notifications</span>
            </NavLink>
            <button
              className={linkStyle({ isActive: false })}
              onClick={() => setOpenCreateModal(true)}
              type="button"
            >
              <FiPlusCircle size={28} />
              <span>Create</span>
            </button>
            <NavLink to="/profile" className={linkStyle}>
              <FiUser size={28} />
              <span>Profile</span>
            </NavLink>

            {/* More Options */}
            <div className="relative flex flex-col items-center" ref={moreRef}>
              <button
                aria-label="More"
                className={`${linkStyle({ isActive: false })} w-full justify-start`}
                onClick={() => setShowMore((v) => !v)}
                style={{ boxShadow: 'none' }}
                type="button"
              >
                <FiMoreHorizontal size={28} />
                <span>More</span>
              </button>
              {showMore && (
                <div
                  className="absolute w-64 left-2 bottom-16 bg-white dark:bg-[#37225C] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#271d40] z-50 p-4"
                >
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-800 dark:text-[#B8A6E6] font-medium">Dark mode</span>
                    <button
                      onClick={toggleTheme}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300
                        ${theme === 'dark' ? 'bg-[#4A317C]' : 'bg-gray-300'}`}
                      aria-label="Toggle dark mode"
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform duration-300
                          ${theme === 'dark' ? 'translate-x-5' : ''}`}
                      ></div>
                    </button>
                  </div>
                  <div className="border-b border-gray-200 dark:border-[#4A317C] my-2"></div>
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-2 py-2 mt-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#4A317C] text-gray-700 dark:text-[#B8A6E6] font-medium"
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
        <div className="text-xs text-center mt-6 mb-2">
          <span style={{ color: LAVENDER, fontWeight: 700 }}>Soft</span>
          <span style={{ color: WHITE, fontWeight: 700 }}>Connect</span>
          @2025
        </div>
      </aside>

      {/* Modals */}
      <AddPostModal open={openCreateModal} onClose={() => setOpenCreateModal(false)} />
      <SearchPanel open={openSearchPanel} onClose={() => setOpenSearchPanel(false)} />

      {/* Main Content Outlet */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-[#121018] transition-colors duration-500">
        <Outlet />
      </main>
    </div>
  );
}
