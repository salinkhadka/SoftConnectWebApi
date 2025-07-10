import React, { useEffect, useState, useContext } from 'react';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification
} from '../api/notificationApi';
import { AuthContext } from '../auth/AuthProvider';
import { formatDistanceToNow } from 'date-fns';
import {
  FiBell,
  FiTrash2,
  FiRefreshCcw,
  FiThumbsUp,
  FiMessageCircle,
  FiUserPlus,
} from 'react-icons/fi';
import DeleteModal from './DeleteModal';
import { toast } from 'react-toastify';

export default function NotificationPage() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications(user._id || user.id);
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
      }, 15000); // every 15 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.isRead);
      await Promise.all(unread.map(n => markNotificationAsRead(n._id)));
      fetchNotifications();
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteNotification(deleteTargetId);
      toast.success("Notification deleted");
      setDeleteTargetId(null);
      fetchNotifications();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'like':
        return <FiThumbsUp className="text-blue-500" />;
      case 'comment':
        return <FiMessageCircle className="text-green-500" />;
      case 'follow':
        return <FiUserPlus className="text-purple-500" />;
      default:
        return <FiBell />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FiBell size={24} />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>

        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            ✅ Mark All as Read
          </button>
          <button
            className="flex items-center gap-1 text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
            onClick={fetchNotifications}
          >
            <FiRefreshCcw />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkAsRead(n._id)}
              className={`flex items-center justify-between gap-4 p-4 rounded-lg shadow border transition-all cursor-pointer
                ${n.isRead ? 'bg-white dark:bg-[#1e1b29]' : 'bg-blue-50 dark:bg-[#2a1d4a] border-blue-200'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{renderIcon(n.type)}</div>
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{n.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTargetId(n._id);
                }}
                className="text-red-500 hover:text-red-700"
                title="Delete notification"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Delete Notification"
        description="Are you sure you want to delete this notification?"
      />
    </div>
  );
}
