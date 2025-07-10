"use client"

import { FiMessageCircle } from "react-icons/fi"
import { getBackendImageUrl } from "../utils/getBackendImageUrl"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function ConversationCard({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 transition-all duration-200 group"
    >
      <div className="relative">
        <img
          src={
            user.profilePhoto
              ? getBackendImageUrl(user.profilePhoto)
              : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${user.username || "U"}`
          }
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover border-2 group-hover:scale-105 transition-transform duration-200"
          style={{ borderColor: LAVENDER }}
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
            {user.username}
          </p>
          <FiMessageCircle size={16} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-52">
          {user.lastMessage || "Start a conversation..."}
        </p>
      </div>
    </div>
  )
}
