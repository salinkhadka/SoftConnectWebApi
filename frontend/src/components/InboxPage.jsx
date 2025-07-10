"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useConversations, useMarkAsRead } from "../hooks/messagehooks"
import { AuthContext } from "../auth/AuthProvider.jsx"
import { getBackendImageUrl } from "../utils/getBackendImageUrl.js"
import { formatDistanceToNow } from "date-fns"
import { FiInbox, FiMessageCircle } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function InboxPage() {
  const { user } = useContext(AuthContext)
  const userId = user?.id || user?._id
  const navigate = useNavigate()

  const { data: conversations, isLoading, refetch } = useConversations(userId)
  const markAsReadMutation = useMarkAsRead(userId)

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: PURPLE }}
          ></div>
          <p className="text-gray-600">Loading user info...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const handleClick = (otherUserId) => {
    markAsReadMutation.mutate(
      { otherUserId },
      {
        onSuccess: () => {
          refetch()
          navigate(`/${otherUserId}/message`)
        },
      },
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      {/* Header */}
      <div
        className="rounded-3xl p-8 text-center mb-8"
        style={{
          background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
        }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <FiInbox size={32} className="text-white" />
          <h1 className="text-3xl font-bold text-white">Messages</h1>
        </div>
        <p className="text-white/90">Stay connected with your conversations</p>
      </div>

      {/* Conversations List */}
      {conversations?.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
          <FiMessageCircle size={64} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No conversations yet</h3>
          <p className="text-gray-600 dark:text-gray-400">Start messaging people to see your conversations here.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
          {conversations?.map((conv) => {
            const isUnread = !conv.lastMessageIsRead
            const isSender = conv.lastMessageSenderId === userId
            const isReceiver = !isSender

            return (
              <div
                key={conv._id}
                onClick={() => handleClick(conv._id)}
                className={`flex items-center gap-4 p-6 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  isUnread && isReceiver ? "bg-purple-50 dark:bg-purple-900/10" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={
                      conv.profilePhoto
                        ? getBackendImageUrl(conv.profilePhoto)
                        : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${conv.username || "U"}`
                    }
                    alt="avatar"
                    className="w-14 h-14 rounded-full object-cover border-2"
                    style={{ borderColor: isUnread && isReceiver ? PURPLE : LAVENDER }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  {isUnread && isReceiver && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: PURPLE }}
                    >
                      !
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3
                      className={`font-semibold ${
                        isUnread && isReceiver
                          ? "text-purple-900 dark:text-purple-100"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {conv.username}
                    </h3>
                    {conv.lastMessageTime && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(conv.lastMessageTime), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm truncate ${
                      isUnread && isReceiver
                        ? "font-semibold text-purple-800 dark:text-purple-200"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {conv.lastMessage || "No messages yet"}
                  </p>
                </div>

                <FiMessageCircle
                  size={20}
                  className={`${isUnread && isReceiver ? "text-purple-600" : "text-gray-400"} transition-colors`}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
