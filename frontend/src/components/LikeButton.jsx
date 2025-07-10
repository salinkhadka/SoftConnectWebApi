import React from "react";
import { usePostLikes, useLikePost, useUnlikePost } from "../hooks/uselikehook";
import { useCreateNotification } from "../hooks/notificationHooks";

export default function LikeButton({ postId, postOwnerId }) {
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const { data: likesData = [], isLoading: likesLoading } = usePostLikes(postId);

  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const createNotificationMutation = useCreateNotification();

  const hasLiked = likesData.some((like) => like.userId._id === userId);

  const isLoading =
    likesLoading ||
    likeMutation.isLoading ||
    unlikeMutation.isLoading ||
    createNotificationMutation.isLoading;

  const handleToggle = () => {
    if (isLoading) {
      console.log("Operation in progress, ignoring click");
      return;
    }

    if (hasLiked) {
      console.log("Unliking post", postId);
      unlikeMutation.mutate(postId);
    } else {
      console.log("Liking post", postId);
      likeMutation.mutate(postId, {
        onSuccess: () => {
          console.log("Like success!");

          if (!postOwnerId) {
            console.warn("No postOwnerId provided — skipping notification");
            return;
          }

          if (postOwnerId === userId) {
            console.log("Post owner is current user — skipping notification");
            return;
          }

          console.log("Creating notification for post owner", postOwnerId);
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
            }
          );
        },
        onError: (error) => {
          console.error("Like mutation failed:", error);
        },
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        flex items-center gap-1 px-3 py-1 rounded transition-colors
        ${hasLiked ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
        ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
      `}
      aria-label={hasLiked ? "Unlike post" : "Like post"}
    >
      <span className="text-lg">{hasLiked ? "💙" : "🤍"}</span>
      <span>{likesData.length}</span>
      {isLoading && <span className="ml-2 animate-spin">⏳</span>}
    </button>
  );
}
