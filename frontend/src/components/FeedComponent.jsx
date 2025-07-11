"use client"

import { useState } from "react"
import { useAllPosts } from "../hooks/Admin/getAllPosts"
import LikeButton from "../components/LikeButton"
import { FiLock, FiUsers, FiGlobe } from "react-icons/fi"
import { getBackendImageUrl } from "../utils/getBackendImageUrl"
import PostModal from "./ViewPostInFeed"
import CommentCount from "./CommentButton"
import SugesstionFriends from "./SugesstionFriends"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U"

const getPrivacyIcon = (privacy) => {
  switch (privacy) {
    case "public":
      return { icon: <FiGlobe size={16} className="text-green-500" />, label: "Public" }
    case "private":
      return { icon: <FiLock size={16} className="text-red-500" />, label: "Private" }
    case "friends":
      return { icon: <FiUsers size={16} className="text-blue-500" />, label: "Friends" }
    default:
      return { icon: <FiGlobe size={16} className="text-green-500" />, label: "Public" }
  }
}

function formatFacebookDate(dateStr) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const now = new Date()
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function PostCard({ post, openModal }) {
  const { icon, label } = getPrivacyIcon(post.privacy)
  const username = post.userId?.username || "Unknown User"
  const profilePhoto =
    post.userId?.profilePhoto && post.userId.profilePhoto.trim() !== ""
      ? getBackendImageUrl(post.userId.profilePhoto)
      : DEFAULT_AVATAR
  const createdAt = formatFacebookDate(post.createdAt)
  const hasImage = post.imageUrl && post.imageUrl.trim() !== ""

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 mb-6 border border-gray-100 dark:border-gray-700 cursor-pointer transform hover:scale-[1.02]"
      onClick={(e) => {
        if (e.target.closest("button") || e.target.tagName === "BUTTON" || e.target.tagName === "SVG") return
        openModal(post)
      }}
    >
      {/* User Info Header */}
      <div className="flex items-center mb-4 gap-4">
        <div className="relative">
          <img
            src={profilePhoto || "/placeholder.svg"}
            alt="avatar"
            className="w-12 h-12 rounded-full object-cover border-3 shadow-md"
            style={{ borderColor: LAVENDER }}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 dark:text-white text-lg">{username}</span>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              {icon}
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{label}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1 mt-1">
            <span>{createdAt}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-gray-900 dark:text-gray-100 whitespace-pre-line mb-4 text-lg leading-relaxed">
        {post.content}
      </div>

      {/* Image */}
      {hasImage && (
        <div className="overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <img
            src={getBackendImageUrl(post.imageUrl) || "/placeholder.svg"}
            alt="Post"
            className="w-full max-h-[500px] object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-4">
          <LikeButton postId={post._id} postOwnerId={post.userId?._id} />
          <CommentCount postId={post._id} openPostModal={() => openModal(post)} />
        </div>
      </div>
    </div>
  )
}

export default function FeedComponent() {
  const { data, isLoading, isError } = useAllPosts()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const openModal = (post) => {
    setSelectedPost(post)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedPost(null)
  }

  return (
  <div className="relative w-full px-4 py-8">
    {/* Centered Feed */}
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: PURPLE }}>
          Latest Posts
        </h2>
        <p className="text-gray-600 dark:text-gray-300">Stay connected with your community</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
              <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-300 rounded-lg p-4 text-center">
          Failed to load posts. Please try again later.
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No posts yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Be the first to share something!</p>
        </div>
      ) : (
        data.data.map((post) => <PostCard key={post._id} post={post} openModal={openModal} />)
      )}

      {selectedPost && <PostModal isOpen={modalOpen} onClose={closeModal} post={selectedPost} />}
    </div>

    {/* Right-Aligned Suggestion Box */}
    <div className="hidden lg:block absolute top-20 right-10 w-[300px]">
      <SugesstionFriends />
    </div>
  </div>
)

}
