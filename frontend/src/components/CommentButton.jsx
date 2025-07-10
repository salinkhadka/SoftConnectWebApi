"use client"
import { FiMessageCircle } from "react-icons/fi"
import { usePostComments } from "../hooks/usecommenthook"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"

export default function CommentCount({ postId, openPostModal }) {
  const { data, isLoading } = usePostComments(postId)
  const count = data?.data?.length || 0

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        openPostModal()
      }}
      className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
      style={{
        ":hover": {
          backgroundColor: `${LAVENDER}20`,
          color: PURPLE,
        },
      }}
    >
      <FiMessageCircle size={18} />
      <span className="font-semibold">{isLoading ? "..." : `${count} Comment${count !== 1 ? "s" : ""}`}</span>
    </button>
  )
}
