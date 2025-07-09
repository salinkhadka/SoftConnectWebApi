import React, { useState, useContext } from "react";
import { useCreateComment } from "../hooks/usecommenthook";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "react-toastify";
import { createNotification } from "../api/notificationApi";

export default function WriteComment({ postId, parentCommentId = null, onCommentPosted }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const createCommentMutation = useCreateComment();

  const handleSubmit = () => {
  if (!user) {
    toast.error("You must be logged in to comment");
    return;
  }
  if (!content.trim()) {
    toast.error("Comment cannot be empty");
    return;
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
        setContent("");
        onCommentPosted?.();
        toast.success("Comment posted");

        // Create notification if commenter is not the post owner
        if (postUserId && postUserId !== (user.id || user._id)) {
          createNotification({
            recipient: postUserId,
            type: "comment",
            message: `${user.username} commented on your post.`,
            relatedId: postId,
          }).catch((err) => {
            console.error("Failed to create notification:", err);
          });
        }
      },
    }
  );
};


  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder={parentCommentId ? "Write a reply..." : "Write a comment..."}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        disabled={createCommentMutation.isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={createCommentMutation.isLoading || content.trim() === ""}
        className="text-blue-600 font-semibold px-3 py-1 rounded-full hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {createCommentMutation.isLoading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
