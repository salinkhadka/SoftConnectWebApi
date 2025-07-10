"use client"
import { usePostLikes, useLikePost, useUnlikePost } from "../hooks/uselikehook"
import { useCreateNotification } from "../hooks/notificationHooks"
import { FiHeart } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function LikeButton({ postId, postOwnerId }) {
  const userId = JSON.parse(localStorage.getItem("user"))?._id

  const { data: likesData = [], isLoading: likesLoading } = usePostLikes(postId)

  const likeMutation = useLikePost()
  const unlikeMutation = useUnlikePost()
  const createNotificationMutation = useCreateNotification()

  const hasLiked = likesData.some((like) => like.userId._id === userId)

  const isLoading =
    likesLoading || likeMutation.isLoading || unlikeMutation.isLoading || createNotificationMutation.isLoading

  const handleToggle = () => {
    if (isLoading) {
      console.log("Operation in progress, ignoring click")
      return
    }

    if (hasLiked) {
      console.log("Unliking post", postId)
      unlikeMutation.mutate(postId)
    } else {
      console.log("Liking post", postId)
      likeMutation.mutate(postId, {
        onSuccess: () => {
          console.log("Like success!")

          if (!postOwnerId) {
            console.warn("No postOwnerId provided — skipping notification")
            return
          }

          if (postOwnerId === userId) {
            console.log("Post owner is current user — skipping notification")
            return
          }

          console.log("Creating notification for post owner", postOwnerId)
          createNotificationMutation.mutate(
            {
              recipient: postOwnerId,
              type: "like",
              message: "liked your post",
              relatedId: postId,
            },
            {
              onSuccess: (data) => console.log("Notification created:", data),
              onError: (error) => console.error("Notification creation failed:", error),
            },
          )
        },
        onError: (error) => {
          console.error("Like mutation failed:", error)
        },
      })
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 active:scale-95
        ${
          hasLiked
            ? "text-white shadow-lg"
            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        }
        ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
      `}
      style={
        hasLiked
          ? {
              background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
            }
          : {}
      }
      aria-label={hasLiked ? "Unlike post" : "Like post"}
    >
      <FiHeart size={18} className={`transition-all duration-200 ${hasLiked ? "fill-current" : ""}`} />
      <span className="font-semibold">
        {likesData.length} {likesData.length === 1 ? "Like" : "Likes"}
      </span>
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-1"></div>
      )}
    </button>
  )
}
