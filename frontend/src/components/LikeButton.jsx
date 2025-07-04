import React from "react";
import { usePostLikes, useLikePost, useUnlikePost } from "../hooks/uselikehook";

export default function LikeButton({ postId }) {
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  // Fetch likes data
  const { data: likesData = [], isLoading: likesLoading } = usePostLikes(postId);

  // Mutations for like/unlike
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();

  const hasLiked = likesData.some((like) => like.userId._id === userId);

  // Disable button while any mutation or likes fetching is in progress
  const isLoading = likesLoading || likeMutation.isLoading || unlikeMutation.isLoading;

  const handleToggle = () => {
    if (isLoading) return; // prevent multiple clicks while loading

    if (hasLiked) {
      unlikeMutation.mutate(postId);
    } else {
      likeMutation.mutate(postId);
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
