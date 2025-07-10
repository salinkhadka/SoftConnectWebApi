"use client"

import { useState, useEffect } from "react"
import { FiMail, FiCalendar } from "react-icons/fi"
import { useFollowers, useFollowing } from "../hooks/friendsHook"
import FollowersFollowingModal from "./FollowersFollowingModal"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const ProfileInfo = ({ user, posts, postsLoading }) => {
  const [followersOpen, setFollowersOpen] = useState(false)
  const [followingOpen, setFollowingOpen] = useState(false)
  const [followersList, setFollowersList] = useState([])
  const [followingList, setFollowingList] = useState([])

  const { data: followersData } = useFollowers(user._id)
  const { data: followingData } = useFollowing(user._id)

  useEffect(() => {
    if (followersData?.data) {
      setFollowersList(followersData.data)
    }
  }, [followersData])

  useEffect(() => {
    if (followingData?.data) {
      setFollowingList(followingData.data)
    }
  }, [followingData])

  return (
    <div className="space-y-6 w-full">
      {/* Stats */}
      <div className="flex gap-8 text-center sm:text-left justify-center lg:justify-start">
        <div className="group cursor-default">
          <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-110 transition-transform">
            {postsLoading ? "..." : posts?.data?.length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Posts</div>
        </div>

        <button onClick={() => setFollowersOpen(true)} className="group hover:scale-105 transition-all duration-200">
          <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600">
            {followersList.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-purple-500">
            Followers
          </div>
        </button>

        <button onClick={() => setFollowingOpen(true)} className="group hover:scale-105 transition-all duration-200">
          <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600">
            {followingList.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium group-hover:text-purple-500">
            Following
          </div>
        </button>
      </div>

      {/* User Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${LAVENDER}15` }}>
            <FiMail size={16} style={{ color: PURPLE }} />
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
            <div className="font-medium">{user.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${LAVENDER}15` }}>
            <FiCalendar size={16} style={{ color: PURPLE }} />
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Joined</span>
            <div className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        {user.bio && (
          <div
            className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-l-4"
            style={{ borderColor: LAVENDER }}
          >
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bio</div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{user.bio}</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <FollowersFollowingModal
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        title="Followers"
        users={followersList}
      />
      <FollowersFollowingModal
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
        title="Following"
        users={followingList}
      />
    </div>
  )
}

export default ProfileInfo
