"use client"

import { useContext } from "react"
import { useParams } from "react-router-dom"
import { useMessages, useSendMessage, useDeleteMessage } from "../hooks/messagehooks.js"
import ChatBox from "./ChatBox.jsx"
import ChatInput from "./ChatInput.jsx"
import { AuthContext } from "../auth/AuthProvider.jsx"
import { FiArrowLeft, FiUser } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function MessagePage() {
  const { user } = useContext(AuthContext)
  const senderId = user?.id || user?._id
  const { userid: recipientId } = useParams()
  const navigate = useNavigate()

  const { data: messages = [] } = useMessages(senderId, recipientId)
  const { mutate: sendMessage } = useSendMessage(senderId, recipientId)
  const { mutate: deleteMessage } = useDeleteMessage(senderId, recipientId)

  const handleSend = (text) => {
    if (!text.trim()) return
    sendMessage({ recipientId, content: text })
  }

  const handleDelete = (messageId) => {
    deleteMessage(messageId)
  }

  if (!senderId) {
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

  if (!recipientId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiUser size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No recipient selected.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="mx-auto mt-8 px-4"
      style={{
        width: "80vw",
        height: "90vh",
        maxWidth: "100%",
      }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
        style={{ height: "100%" }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/inbox")}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?background=${LAVENDER.slice(
                    1,
                  )}&color=${PURPLE.slice(1)}&name=U`}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white/30"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="font-bold text-white">Chat with User</h2>
                <p className="text-white/70 text-sm">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="overflow-y-auto bg-gray-50 dark:bg-gray-900 flex-grow p-4">
          <ChatBox messages={messages} senderId={senderId} onDelete={handleDelete} />
        </div>

        {/* Input */}
        <div className="p-4">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  )
}
