"use client"

import { useState } from "react"
import { FiTrash2 } from "react-icons/fi"
import DeleteModal from "../components/DeleteModal"
import { formatDistanceToNow } from "date-fns"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function ChatBox({ messages, senderId, onDelete }) {
  const [openModal, setOpenModal] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState(null)

  const handleDeleteClick = (id) => {
    setSelectedMessageId(id)
    setOpenModal(true)
  }

  const handleConfirmDelete = () => {
    if (selectedMessageId) {
      onDelete(selectedMessageId)
      setSelectedMessageId(null)
    }
    setOpenModal(false)
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((msg) => {
        const isOwn = msg.sender === senderId
        const messageTime = formatDistanceToNow(new Date(msg.createdAt || Date.now()), { addSuffix: true })

        return (
          <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`group relative max-w-[70%] px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                isOwn
                  ? "text-white rounded-br-md"
                  : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md"
              }`}
              style={
                isOwn
                  ? {
                      background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                    }
                  : {}
              }
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                {isOwn && (
                  <button
                    onClick={() => handleDeleteClick(msg._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/20 transition-all duration-200 flex-shrink-0"
                    title="Delete message"
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>
              <div className={`text-xs mt-1 ${isOwn ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                {messageTime}
              </div>

              {/* Message tail */}
              <div
                className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                  isOwn
                    ? "-right-1 bg-gradient-to-br from-purple-600 to-purple-400"
                    : "-left-1 bg-white dark:bg-gray-700 border-l border-b border-gray-200 dark:border-gray-600"
                }`}
              ></div>
            </div>
          </div>
        )
      })}

      {messages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">💬</div>
          <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
        </div>
      )}

      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
      />
    </div>
  )
}
