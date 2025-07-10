"use client"

import { useState, useContext } from "react"
import { getBackendImageUrl } from "../utils/getBackendImageUrl"
import WriteComment from "./WriteCommentComponent"
import { useDeleteComment } from "../hooks/usecommenthook"
import { AuthContext } from "../auth/AuthProvider"
import DeleteModal from "./DeleteModal"
import { FiTrash2, FiReply, FiChevronDown, FiChevronUp } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U"

export default function CommentCard({ comment, allComments, postId, postOwnerId, onReplyPosted }) {
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { user } = useContext(AuthContext)
  const deleteComment = useDeleteComment()

  const replies = allComments.filter((c) => c.parentCommentId === comment._id)
  const userInfo = comment.userId || {}
  const username = userInfo.username || "Unknown User"
  const profilePhoto =
    userInfo.profilePhoto && userInfo.profilePhoto.trim() !== ""
      ? getBackendImageUrl(userInfo.profilePhoto)
      : DEFAULT_AVATAR

  const currentUserId = user?._id || user?.id
  const commentOwnerId = userInfo?._id
  const isCommentAuthor = currentUserId === commentOwnerId
  const isPostOwner = currentUserId === postOwnerId
  const canDelete = isCommentAuthor || isPostOwner

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    deleteComment.mutate(comment._id, {
      onSuccess: () => {
        onReplyPosted()
        setShowDeleteModal(false)
      },
      onError: () => {
        setShowDeleteModal(false)
      },
    })
  }

  return (
    <>
      <div className="group">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          <div className="flex gap-3">
            <img
              src={profilePhoto || "/placeholder.svg"}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2"
              style={{ borderColor: LAVENDER }}
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">{username}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {canDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-all duration-200"
                    title="Delete comment"
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}
              </div>

              <p className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">{comment.content}</p>

              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-purple-600"
                  style={{ color: PURPLE }}
                  onClick={() => setShowReplyBox((prev) => !prev)}
                >
                  <FiReply size={14} />
                  {showReplyBox ? "Cancel" : "Reply"}
                </button>

                {replies.length > 0 && (
                  <button
                    className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    onClick={() => setShowReplies((prev) => !prev)}
                  >
                    {showReplies ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                    {showReplies ? "Hide" : "Show"} {replies.length} repl{replies.length > 1 ? "ies" : "y"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {showReplyBox && (
            <div className="mt-4 ml-13">
              <WriteComment
                postId={postId}
                parentCommentId={comment._id}
                onCommentPosted={() => {
                  onReplyPosted()
                  setShowReplyBox(false)
                }}
              />
            </div>
          )}
        </div>

        {showReplies && replies.length > 0 && (
          <div className="ml-8 mt-3 space-y-3 border-l-2 pl-4" style={{ borderColor: `${LAVENDER}40` }}>
            {replies.map((reply) => (
              <CommentCard
                key={reply._id}
                comment={reply}
                allComments={allComments}
                postId={postId}
                postOwnerId={postOwnerId}
                onReplyPosted={onReplyPosted}
              />
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </>
  )
}
