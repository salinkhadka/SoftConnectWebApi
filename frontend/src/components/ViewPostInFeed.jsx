"use client";

import { useContext, useState } from "react";
import { FiX, FiMessageCircle, FiLock, FiUsers, FiGlobe, FiShare2 } from "react-icons/fi";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";
import { AuthContext } from "../auth/AuthProvider";
import LikeButton from "../components/LikeButton";
import { usePostComments, useCreateComment } from "../hooks/usecommenthook";
import CommentCard from "./CommentCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { createNotification } from "../api/notificationApi";

const PURPLE = "#37225C";
const LAVENDER = "#B8A6E6";
const WHITE = "#FFFFFF";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U";

const getPrivacyIcon = (privacy) => {
  switch (privacy) {
    case "public":
      return { icon: <FiGlobe size={16} className="text-green-500" />, label: "Public" };
    case "private":
      return { icon: <FiLock size={16} className="text-red-500" />, label: "Private" };
    case "friends":
      return { icon: <FiUsers size={16} className="text-blue-500" />, label: "Friends" };
    default:
      return { icon: <FiGlobe size={16} className="text-green-500" />, label: "Public" };
  }
};

function formatFacebookDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function PostModal({ isOpen, onClose, post }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState("");

  if (!isOpen || !post) return null;

  const { userId: postUser = {}, content = "", imageUrl = "", privacy = "public", createdAt, _id: postId } = post;

  const { icon, label } = getPrivacyIcon(privacy);
  const username = postUser?.username || "Unknown User";
  const profilePhoto = postUser?.profilePhoto?.trim()
    ? getBackendImageUrl(postUser.profilePhoto)
    : DEFAULT_AVATAR;
  const dateStr = formatFacebookDate(createdAt);
  const postImage = imageUrl?.trim() ? getBackendImageUrl(imageUrl) : "";

  // ✅ Correct: pass postId to hook
  const { data: commentsData, isLoading, refetch } = usePostComments(postId);

  const allComments = commentsData?.data || [];
  const parentComments = allComments.filter((c) => !c.parentCommentId);

  const createCommentMutation = useCreateComment();

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
          if (postUser._id && postUser._id !== (user._id || user.id)) {
            createNotification({
              recipient: postUser._id,
              type: "comment",
              message: `${user.username} commented on your post.`,
              relatedId: postId,
            }).catch((err) => {
              console.error("Failed to create notification:", err);
            });
          }
        },
        onError: () => toast.error("Failed to post comment"),
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-3xl shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
          style={{ background: `linear-gradient(135deg, ${PURPLE}10 0%, ${LAVENDER}10 100%)` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={profilePhoto || "/placeholder.svg"}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border-2"
                style={{ borderColor: LAVENDER }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span
                    onClick={() => {
                      if (postUser?._id) navigate(`/${postUser._id}`);
                    }}
                    className="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer"
                  >
                    {username}
                  </span>

                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/50 dark:bg-gray-700/50">
                    {icon}
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{dateStr}</div>
              </div>
            </div>

            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={onClose}
              aria-label="Close post modal"
            >
              <FiX size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-grow px-6 py-4">
          <div className="mb-6">
            <div className="text-lg text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed mb-4">
              {content}
            </div>

            {postImage && (
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <img src={postImage} alt="Post" className="w-full max-h-[400px] object-contain" />
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between py-4 border-y border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-4">
              <LikeButton postId={postId} postOwnerId={postUser?._id} />
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
                <FiMessageCircle size={18} />
                <span className="font-medium">Comment</span>
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
              <FiShare2 size={18} />
              <span className="font-medium">Share</span>
            </button>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Comments ({parentComments.length})</h3>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: PURPLE }}></div>
              </div>
            ) : parentComments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FiMessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              parentComments.map((parent) => (
                <CommentCard
                  key={parent._id}
                  comment={parent}
                  allComments={allComments}
                  postId={postId}
                  postOwnerId={postUser?._id || postUser?.id}
                  onReplyPosted={refetch}
                />
              ))
            )}
          </div>
        </div>

        {/* Comment Input */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.profilePhoto
                  ? getBackendImageUrl(user.profilePhoto)
                  : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${user?.username || "U"}`
              }
              alt="Your avatar"
              className="w-10 h-10 rounded-full object-cover border-2"
              style={{ borderColor: LAVENDER }}
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                disabled={createCommentMutation.isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment();
                  }
                }}
              />
              <button
                onClick={handlePostComment}
                disabled={createCommentMutation.isLoading || newComment.trim() === ""}
                className="px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                  color: WHITE,
                }}
              >
                {createCommentMutation.isLoading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
