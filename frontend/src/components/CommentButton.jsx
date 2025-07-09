import React from "react";
import { FiMessageCircle } from "react-icons/fi";
import { usePostComments } from "../hooks/usecommenthook";


export default function CommentCount({ postId, openPostModal }) {
  const { data, isLoading } = usePostComments(postId);
  const count = data?.data?.length || 0;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        openPostModal(); // Trigger the modal view
      }}
      className="flex items-center gap-1 text-gray-600 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 py-2 px-4 rounded-md transition-colors"
    >
      <FiMessageCircle size={17} />
      <span>{isLoading ? "..." : `${count} Comment${count !== 1 ? "s" : ""}`}</span>
    </button>
  );
}
