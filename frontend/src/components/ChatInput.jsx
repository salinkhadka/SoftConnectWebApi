"use client"

import { useState } from "react"
import { FiSend, FiSmile } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      onSend(text.trim())
      setText("")
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            className="w-full px-4 py-3 pr-12 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FiSmile size={20} className="text-gray-500" />
          </button>
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="p-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            background: text.trim() ? `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)` : "#e5e7eb",
            color: text.trim() ? WHITE : "#9ca3af",
          }}
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  )
}
