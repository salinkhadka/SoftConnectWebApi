import React, { useState, useContext } from "react";
import { useAllPosts } from "../hooks/Admin/getAllPosts";
import { usePostComments } from "../hooks/usecommenthook";
import LikeButton from "../components/LikeButton";
import { FiMessageCircle, FiLock, FiUsers, FiGlobe } from "react-icons/fi";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";
import { AuthContext } from "../auth/AuthProvider";
import PostModal from "./ViewPostInFeed";
import CommentCount from "./CommentButton";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U";

const getPrivacyIcon = (privacy) => {
  switch (privacy) {
    case "public":
      return { icon: <FiGlobe size={16} />, label: "Public" };
    case "private":
      return { icon: <FiLock size={16} />, label: "Private" };
    case "friends":
      return { icon: <FiUsers size={16} />, label: "Friends" };
    default:
      return { icon: <FiGlobe size={16} />, label: "Public" };
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
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function PostCard({ post, openModal }) {
  const { icon, label } = getPrivacyIcon(post.privacy);
  const username = post.userId?.username || "Unknown User";
  const profilePhoto =
    post.userId?.profilePhoto && post.userId.profilePhoto.trim() !== ""
      ? getBackendImageUrl(post.userId.profilePhoto)
      : DEFAULT_AVATAR;
  const createdAt = formatFacebookDate(post.createdAt);
  const hasImage = post.imageUrl && post.imageUrl.trim() !== "";


  return (
    <div
      className="bg-white dark:bg-[#1e1b29] rounded-2xl shadow p-4 mb-6 border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#232137] transition"
      onClick={(e) => {
        if (
          e.target.closest("button") ||
          e.target.tagName === "BUTTON" ||
          e.target.tagName === "SVG"
        )
          return;
        openModal(post);
      }}
    >
      {/* User Info */}
      <div className="flex items-center mb-2 gap-3">
        <img
          src={profilePhoto}
          alt="avatar"
          className="w-11 h-11 rounded-full object-cover border border-gray-200"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {username}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-300 gap-1">
            <span>{createdAt}</span>
            <span>·</span>
            {icon}
            <span>{label}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-lg text-gray-900 dark:text-gray-100 whitespace-pre-line mb-2">
        {post.content}
      </div>

      {/* Image */}
      {hasImage && (
        <div className="overflow-hidden rounded-xl mb-2 mt-2 bg-black dark:bg-[#18191a] flex items-center justify-center">
          <img
            src={getBackendImageUrl(post.imageUrl)}
            alt="Post"
            className="w-full max-h-[400px] object-fit"
            style={{ background: "#111" }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <LikeButton postId={post._id} />
        <CommentCount postId={post._id} openPostModal={() => openModal(post)} />
      </div>
    </div>
  );
}

export default function FeedComponent() {
  const { data, isLoading, isError } = useAllPosts();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const openModal = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  if (isLoading) return <div className="text-center p-10">Loading posts...</div>;
  if (isError) return <div className="text-center p-10 text-red-500">Failed to load posts.</div>;

  return (
    <div className="max-w-2xl mx-auto px-2 py-8">
      {data?.data?.map((post) => (
        <PostCard key={post._id} post={post} openModal={openModal} />
      ))}
      {selectedPost && (
        <PostModal isOpen={modalOpen} onClose={closeModal} post={selectedPost} />
      )}
    </div>
  );
}
