import React, { useState } from "react";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";
import { FiGlobe, FiLock, FiUsers } from "react-icons/fi";
import LikeButton from "../components/LikeButton";
import CommentCount from "./CommentButton";
import PostModalStandalone from "../components/PostModalStandalone";
import { useNavigate } from "react-router-dom";


const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U";

const getPrivacyIcon = (privacy) => {
  switch (privacy) {
    case "public":
      return { icon: <FiGlobe size={14} />, label: "Public" };
    case "private":
      return { icon: <FiLock size={14} />, label: "Private" };
    case "friends":
      return { icon: <FiUsers size={14} />, label: "Friends" };
    default:
      return { icon: <FiGlobe size={14} />, label: "Public" };
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

export default function UserPostsGrid({ posts, user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const [modalPost, setModalPost] = useState(null);

  // Open post modal on card click
  const openPostModal = (post) => {
    setModalPost(post);
    setModalOpen(true);
  };

  // Close post modal
  const closePostModal = () => {
    setModalPost(null);
    setModalOpen(false);
  };

  // Handle different data structures - posts might be nested in data property
  const postsArray = Array.isArray(posts) ? posts : posts?.data || [];

  if (!postsArray || postsArray.length === 0)
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          No posts to show.
        </div>
      </div>
    );

  return (
    <>
      {/* Post Modal */}
      <PostModalStandalone post={modalPost} isOpen={modalOpen} onClose={closePostModal} />

      {/* Post Grid - Removed mt-10 px-4 to avoid double spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {postsArray.map((post) => {
          const { icon, label } = getPrivacyIcon(post.privacy);
          const username = post.userId?.username || user?.username || "Unknown User";
          const profilePhoto =
            user?.profilePhoto && user.profilePhoto.trim() !== ""
              ? getBackendImageUrl(user.profilePhoto)
              : post.userId?.profilePhoto && post.userId.profilePhoto.trim() !== ""
              ? getBackendImageUrl(post.userId.profilePhoto)
              : DEFAULT_AVATAR;
          const createdAt = formatFacebookDate(post.createdAt);

          return (
            <div
              key={post._id}
              className="bg-white dark:bg-[#1e1b29] rounded-2xl shadow p-4 flex flex-col border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openPostModal(post)}
            >
              {/* User Info */}
              <div className="flex items-center mb-2 gap-3">
                <img
                  src={profilePhoto}
                  alt={`Avatar of ${username}`}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{username}</span>
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
              <div className="text-base text-gray-900 dark:text-gray-100 whitespace-pre-line mb-2">
                {post.content}
              </div>

              {/* Image */}
              {post.imageUrl && (
                <div className="overflow-hidden rounded-xl mb-2 bg-black flex items-center justify-center w-full aspect-square">
                  <img
                    src={getBackendImageUrl(post.imageUrl)}
                    alt={`Post by ${username}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Like/Comment Actions */}
              <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                <div
                  className="py-2 px-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LikeButton postId={post._id} postOwnerId={post.userId?._id} />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <CommentCount postId={post._id} openPostModal={() => openPostModal(post)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}