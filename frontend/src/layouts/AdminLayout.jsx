import { Outlet, NavLink } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import { useContext } from "react";

export default function AdminLayout() {
    const { user, logout } = useContext(AuthContext);

    const linkStyle = ({ isActive }) =>
        `block px-4 py-2 rounded-lg transition-all ${
            isActive
                ? "bg-white text-purple-700 font-semibold"
                : "text-white hover:bg-purple-700"
        }`;

    return (
        <div className="flex h-screen font-sans bg-white">
            {/* Sidebar */}
            <aside className="w-64 bg-[#4B2E83] text-white shadow-lg p-6 flex flex-col justify-between">
                <div>
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold tracking-wide">
                            Soft<span className="text-white">Connect</span>
                        </h2>
                        <p className="text-sm text-purple-200 mt-1">Admin Panel</p>
                    </div>
                    <nav className="flex flex-col space-y-4">
                        <NavLink to="/admin/users" className={linkStyle}>
                            Users
                        </NavLink>
                        <NavLink to="/admin/posts" className={linkStyle}>
                            Posts
                        </NavLink>
                        <NavLink to="/admin/addPost" className={linkStyle}>
                            Add-Announcement
                        </NavLink>
                        
                        <NavLink to="/admin/analytics" className={linkStyle}>
                            Analytics
                        </NavLink>
                        <NavLink to="/admin/feedback" className={linkStyle}>
                            Feedback
                        </NavLink>
                        <NavLink to="/admin/settings" className={linkStyle}>
                            Settings
                        </NavLink>
                    </nav>
                </div>
                <div className="text-xs text-purple-200 mt-10 text-center">
                    © 2025 SoftConnect
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-purple-700">
                        Welcome, {user?.username || "Admin"}
                    </h1>
                    <button
                        onClick={logout}
                        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
                    >
                        Logout
                    </button>
                </header>

                {/* Page Content */}
                <main className="p-6 bg-gray-50 overflow-y-auto flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
