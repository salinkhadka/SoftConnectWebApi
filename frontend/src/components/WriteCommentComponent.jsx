"use client"

import { useState, useContext } from "react"
import { useCreateComment } from "../hooks/usecommenthook"
import { AuthContext } from "../auth/AuthProvider"
import { toast } from "react-toastify"
import { createNotification } from "../api/notificationApi"
import { FiSend } from "react-icons/fi"
import { getBackendImageUrl } from "../utils/getBackendImageUrl"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function WriteComment({ postId, parentCommentId = null, onCommentPosted, postUserId }) {
  const { user } = useContext(AuthContext)
  const [content, setContent] = useState("")
  const createCommentMutation = useCreateComment()

  const handleSubmit = () => {
    if (!user) {
      toast.error("You must be logged in to comment")
      return
    }
    if (!content.trim()) {
      toast.error("Comment cannot be empty")
      return
    }
    createCommentMutation.mutate(
      {
        userId: user.id || user._id,
        postId,
        content: content.trim(),
        parentCommentId,
      },
      {
        onSuccess: () => {
          setContent("")
          onCommentPosted?.()
          toast.success("Comment posted")

          if (postUserId && postUserId !== (user.id || user._id)) {
            createNotification({
              recipient: postUserId,
              type: "comment",
              message: `${user.username} commented on your post.`,
              relatedId: postId,
            }).catch((err) => {
              console.error("Failed to create notification:", err)
            })
          }
        },
      },
    )
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600">
      <img
        src={
          user?.profilePhoto
            ? getBackendImageUrl(user.profilePhoto)
            : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${user?.username || "U"}`
        }
        alt="Your avatar"
        className="w-8 h-8 rounded-full object-cover border-2"
        style={{ borderColor: LAVENDER }}
      />
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          placeholder={parentCommentId ? "Write a reply..." : "Write a comment..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          disabled={createCommentMutation.isLoading}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={createCommentMutation.isLoading || content.trim() === ""}
          className="p-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
            color: WHITE,
          }}
        >
          {createCommentMutation.isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiSend size={16} />
          )}
        </button>
      </div>
    </div>
  )
}
