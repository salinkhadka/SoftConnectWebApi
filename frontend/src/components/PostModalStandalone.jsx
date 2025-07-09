import React, { useContext, useState } from "react";
import { FiX, FiMessageCircle } from "react-icons/fi";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";
import { AuthContext } from "../auth/AuthProvider";
import { usePostComments, useCreateComment } from "../hooks/usecommenthook";
import CommentCard from "./CommentCard";
import { toast } from "react-toastify";
import LikeButton from "./LikeButton";
import { createNotification } from "../api/notificationApi";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U";

export default function PostModalStandalone({ post, isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [newComment, setNewComment] = useState("");

  // Safe postId or null if post is undefined
  const postId = post?._id || null;

  // Call hooks unconditionally
  const { data: commentsData, isLoading, refetch } = usePostComments(postId);
  const createCommentMutation = useCreateComment();

  // If modal closed or no post, render nothing
  if (!isOpen || !post) return null;

  // Destructure post info
  const { userId: postUser = {}, content = "", imageUrl = "", createdAt } = post;
  const username = postUser.username || "Unknown User";
  const profilePhoto = postUser.profilePhoto?.trim()
    ? getBackendImageUrl(postUser.profilePhoto)
    : DEFAULT_AVATAR;
  const postImage = imageUrl?.trim() ? getBackendImageUrl(imageUrl) : "";

  const allComments = commentsData?.data || [];
  const parentComments = allComments.filter((c) => !c.parentCommentId);

  const handlePostComment = () => {
  if (!user) return toast.error("You must be logged in to comment");
  if (!newComment.trim()) return toast.error("Comment cannot be empty");

  createCommentMutation.mutate(
    {
      userId: user._id || user.id,
      postId,
      content: newComment.trim(),
      parentCommentId: null,
    },
    {
      onSuccess: () => {
        setNewComment("");
        refetch();

        // Create notification if commenter is NOT the post owner
        if (postUser._id && postUser._id !== (user._id || user.id)) {
          createNotification({
            recipient: postUser._id,
            type: "comment",
            message: `${user.username} commented on your post.`,
            relatedId: postId,
          }).catch((err) => {
            console.error("Notification creation failed:", err);
          });
        }
      },
    }
  );
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white dark:bg-[#1e1b29] w-full max-w-2xl rounded-2xl shadow-lg relative p-0 transition-all duration-300 max-h-[90vh] flex flex-col">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 dark:text-gray-300 z-10"
          onClick={onClose}
        >
          <FiX size={22} />
        </button>

        <div className="overflow-y-auto px-6 py-4 flex-grow">
          {/* Header */}
          <div className="pb-3">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={profilePhoto}
                alt="avatar"
                className="w-11 h-11 rounded-full object-cover border border-gray-200"
              />
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">{username}</span>
              </div>
            </div>
            <div className="text-base text-gray-900 dark:text-gray-100 whitespace-pre-line mb-3">
              {content}
            </div>
          </div>

          {/* Post Image */}
          {postImage && (
            <div className="rounded-xl mb-4 bg-black flex items-center justify-center">
              <img
                src={postImage}
                alt="Post"
                className="w-full max-h-[420px] object-contain rounded-b-2xl"
              />
            </div>
          )}

          {/* Like/Comment Actions */}
          <div className="flex items-center justify-between mt-2 py-3 border-t border-gray-200 dark:border-gray-700">
            <LikeButton postId={postId} postOwnerId={post.userId?._id} />
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-100">
              <FiMessageCircle size={20} />
              <span>Comment</span>
            </button>
          </div>

          {/* Comments */}
          <div className="mt-4">
            {isLoading ? (
              <p className="text-center text-gray-400">Loading comments...</p>
            ) : parentComments.length === 0 ? (
              <p className="text-center text-gray-400">No comments yet.</p>
            ) : (
              parentComments.map((parent) => (
                <CommentCard
                  key={parent._id}
                  comment={parent}
                  allComments={allComments}
                  postId={postId}
                  postOwnerId={postUser._id}
                  onReplyPosted={refetch}
                />
              ))
            )}
          </div>
        </div>

        {/* New Comment Input */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            disabled={createCommentMutation.isLoading}
          />
          <button
            onClick={handlePostComment}
            disabled={createCommentMutation.isLoading || newComment.trim() === ""}
            className="text-blue-600 font-semibold px-3 py-1 rounded-full hover:bg-blue-100 disabled:opacity-50"
          >
            {createCommentMutation.isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
