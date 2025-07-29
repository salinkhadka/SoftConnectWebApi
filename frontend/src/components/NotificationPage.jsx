"use client"
import React from "react"
import { useEffect, useState, useContext } from "react"
import { getNotifications, markNotificationAsRead, deleteNotification } from "../api/notificationApi"
import { AuthContext } from "../auth/AuthProvider"
import { formatDistanceToNow } from "date-fns"
import { FiBell, FiTrash2, FiRefreshCcw, FiThumbsUp, FiMessageCircle, FiUserPlus, FiCheckCircle } from "react-icons/fi"
import DeleteModal from "./DeleteModal"
import { useToast } from "../contexts/ToastContext"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function NotificationPage() {
  const { user } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const toast=useToast();

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications(user._id || user.id)
      setNotifications(res.data?.data || [])
    } catch (err) {
      console.error(err)
      toast.error("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const interval = setInterval(() => {
        fetchNotifications()
      }, 15000)

      return () => clearInterval(interval)
    }
  }, [user])

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      fetchNotifications()
    } catch (err) {
      console.error(err)
      toast.error("Failed to mark as read")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.isRead)
      await Promise.all(unread.map((n) => markNotificationAsRead(n._id)))
      fetchNotifications()
      toast.success("All notifications marked as read")
    } catch (err) {
      toast.error("Failed to mark all as read")
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteNotification(deleteTargetId)
      toast.success("Notification deleted")
      setDeleteTargetId(null)
      fetchNotifications()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete notification")
    }
  }

  const renderIcon = (type) => {
    const iconProps = { size: 20 }
    switch (type) {
      case "like":
        return (
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <FiThumbsUp {...iconProps} className="text-blue-600" />
          </div>
        )
      case "comment":
        return (
          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
            <FiMessageCircle {...iconProps} className="text-green-600" />
          </div>
        )
      case "follow":
        return (
          <div className="p-2 rounded-full" style={{ backgroundColor: `${LAVENDER}20` }}>
            <FiUserPlus {...iconProps} style={{ color: PURPLE }} />
          </div>
        )
      default:
        return (
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
            <FiBell {...iconProps} className="text-gray-600" />
          </div>
        )
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div
          className="rounded-3xl p-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FiBell size={32} className="text-white" />
            <h1 className="text-3xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">{unreadCount}</span>
            )}
          </div>
          <p className="text-white/90">Stay updated with your latest activities</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: `${LAVENDER}20`,
                color: PURPLE,
                border: `2px solid ${LAVENDER}`,
              }}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <FiCheckCircle size={18} />
              Mark All Read
            </button>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            onClick={fetchNotifications}
          >
            <FiRefreshCcw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
          <FiBell size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No notifications yet</h3>
          <p className="text-gray-600 dark:text-gray-400">When you get notifications, they'll show up here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkAsRead(n._id)}
              className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                !n.isRead ? "ring-2 ring-purple-200 dark:ring-purple-800" : ""
              }`}
            >
              <div className="flex items-center gap-4 p-6">
                {/* Icon */}
                <div className="flex-shrink-0">{renderIcon(n.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-gray-900 dark:text-white ${!n.isRead ? "font-semibold" : ""}`}>{n.message}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!n.isRead && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PURPLE }}></div>}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteTargetId(n._id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-all duration-200"
                  title="Delete notification"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              {/* Gradient border for unread */}
              {!n.isRead && (
                <div
                  className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "xor",
                    padding: "2px",
                  }}
                ></div>
              )}
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
  )
}
