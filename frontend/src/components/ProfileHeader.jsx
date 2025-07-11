"use client"

import { useState, useContext } from "react"
import { AuthContext } from "../auth/AuthProvider"
import { useUserPosts } from "../hooks/Admin/getPostByUser"
import { useFollowing, useFollowers } from "../hooks/friendsHook"
import ProfileImage from "./ProfileImage"
import ProfileActions from "./ProfileActions"
import EditProfileDialog from "./EditProfileDialog"
import FollowersFollowingModal from "./FollowersFollowingModal"
import { FiUser, FiAward, FiHash, FiMail, FiCalendar, FiFileText } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const ProfileHeader = ({ user, onUpdateUser }) => {
  const { logout, user: loggedInUser } = useContext(AuthContext)
  const isOwnProfile = loggedInUser?._id === user?._id

  const [openEdit, setOpenEdit] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [followersOpen, setFollowersOpen] = useState(false)
  const [followingOpen, setFollowingOpen] = useState(false)

  const { data: posts, isLoading: postsLoading } = useUserPosts(user?._id)
  const { data: followingData, isLoading: followingLoading } = useFollowing(loggedInUser?._id)
  const { data: followersData } = useFollowers(user?._id)
  const { data: userFollowingData } = useFollowing(user?._id)

  const isFollowing =
    !followingLoading &&
    followingData?.data?.some(
      (follow) => follow.followee?._id?.toString() === user?._id?.toString()
    )

  const followersList = followersData?.data || []
  const followingList = userFollowingData?.data || []

  return (
    <div className="flex justify-center mt-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {/* Background Card */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Purple Header Section - 30% with User Info */}
          <div
            className="h-40 relative px-6 sm:px-8 lg:px-12 py-6"
            style={{
              background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-8 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 left-8 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>

            {/* Content in Purple Section */}
            <div className="relative z-10 flex justify-between items-center h-full ml-0 lg:ml-48">
              {/* Left Side - Username and Role */}
              <div className="flex-1 space-y-3">
                {/* Username */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                    <FiUser size={20} className="text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
                    {user?.username || "User"}
                  </h1>
                </div>

                {/* Role */}
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                    <FiAward size={18} className="text-white" />
                  </div>
                  <div
                    className="px-4 py-2 rounded-full font-semibold text-lg backdrop-blur-sm border-2 border-white/30 shadow-lg"
                    style={{
                      background: "rgba(255, 255, 255, 0.25)",
                      color: WHITE,
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {user?.role || "N/A"}
                  </div>
                </div>
              </div>

              {/* Right Side - Action Buttons */}
              <div className="flex justify-end">
                <ProfileActions
                  isOwnProfile={isOwnProfile}
                  anchorEl={anchorEl}
                  viewedUserId={user?._id}
                  isFollowing={isFollowing}
                  onEditClick={() => {
                    setPreviewPhoto(null)
                    setOpenEdit(true)
                  }}
                  onLogout={logout}
                  onSettingsClick={(e) => setAnchorEl(e.currentTarget)}
                  onCloseSettings={() => setAnchorEl(null)}
                />
              </div>
            </div>
          </div>

          {/* White Content Section - 70% */}
          <div className="relative bg-white dark:bg-gray-800 px-6 sm:px-8 lg:px-12 pt-16 pb-8">
            {/* Profile Picture - Overlapping both sections */}
            <div className="absolute left-8 -top-20 z-10">
              <ProfileImage
                user={user}
                isOwnProfile={isOwnProfile}
                onEditClick={() => {
                  setPreviewPhoto(null)
                  setOpenEdit(true)
                }}
              />
            </div>

            {/* Main Content */}
            <div className="ml-0 lg:ml-48 space-y-6">
              {/* Top Row - Stats and Info */}
              <div className="flex flex-col lg:flex-row gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                {/* Left Side - Stats (Smaller) */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {postsLoading ? "..." : posts?.data?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Posts</div>
                  </div>

                  <button
                    onClick={() => setFollowersOpen(true)}
                    className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                  >
                    <div className="text-xl font-bold text-gray-900 dark:text-white hover:text-purple-600 transition-colors">
                      {followersList.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Followers</div>
                  </button>

                  <button
                    onClick={() => setFollowingOpen(true)}
                    className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                  >
                    <div className="text-xl font-bold text-gray-900 dark:text-white hover:text-purple-600 transition-colors">
                      {followingList.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Following</div>
                  </button>
                </div>

                {/* Right Side - User Info (Horizontal) */}
                <div className="flex-1 flex flex-wrap gap-6 lg:justify-end">
                  {/* Student ID */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <FiHash size={16} style={{ color: PURPLE }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Student ID</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.StudentId || "N/A"}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <FiMail size={16} style={{ color: PURPLE }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email || "N/A"}</p>
                    </div>
                  </div>

                  {/* Joined */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700">
                      <FiCalendar size={16} style={{ color: PURPLE }} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section - Bigger Box */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FiFileText size={18} style={{ color: PURPLE }} />
                  <h3 className="font-semibold text-gray-900 dark:text-white">About</h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 min-h-[120px]">
                  {user?.bio ? (
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base">{user.bio}</p>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic text-base">
                      {isOwnProfile ? "Add a bio to tell others about yourself" : "No bio available"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {isOwnProfile && (
          <EditProfileDialog
            open={openEdit}
            user={user}
            previewPhoto={previewPhoto}
            setOpen={setOpenEdit}
            setPreviewPhoto={setPreviewPhoto}
            onUpdateUser={onUpdateUser}
          />
        )}

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
    </div>
  )
}

export default ProfileHeader
