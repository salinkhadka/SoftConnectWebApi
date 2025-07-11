"use client"

import { useContext } from "react"
import { useGetUsersAdmin } from "../hooks/Admin/adminUserhook"
import { useFollowing, useFollowUser, useUnfollowUser } from "../hooks/friendsHook"
import { AuthContext } from "../auth/AuthProvider"
import { FiUser, FiPlus, FiCheck } from "react-icons/fi"
import { getBackendImageUrl } from "../utils/getBackendImageUrl"
import { Avatar, Button, Typography, Tooltip } from "@mui/material"
import { useNavigate } from "react-router-dom"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function SugesstionFriends() {
  const { user: currentUser } = useContext(AuthContext)
  const currentUserId = currentUser?._id || localStorage.getItem("userId")

  const navigate = useNavigate()

  // Fetch all users
  const { data: allUsersData = [], isLoading: loadingUsers, error: errorUsers } = useGetUsersAdmin({ search: "" })
  // Fetch users current user is following
  const {
    data: followingData = { data: [] },
    isLoading: loadingFollowing,
    error: errorFollowing,
    refetch: refetchFollowing,
  } = useFollowing(currentUserId)

  // Follow/Unfollow mutations
  const followMutation = useFollowUser()
  const unfollowMutation = useUnfollowUser()

  const followingUsers = followingData.data || []
  const followingUserIds = followingUsers.map((follow) => follow.followee?._id || follow._id)

  const suggestedUsers = allUsersData.filter(
    (user) => user._id !== currentUserId && !followingUserIds.includes(user._id),
  )

  const handleFollow = async (userId) => {
    await followMutation.mutateAsync(userId)
    refetchFollowing()
  }

  const handleUnfollow = async (userId) => {
    await unfollowMutation.mutateAsync(userId)
    refetchFollowing()
  }

  if (loadingUsers || loadingFollowing) {
    return (
      <div className="flex items-center justify-center min-h-[150px] bg-white dark:bg-gray-800 transition-colors duration-300 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-purple-500 dark:border-purple-400"></div>
          <p className="mt-3 text-md font-medium text-gray-700 dark:text-gray-300">Loading suggestions...</p>
        </div>
      </div>
    )
  }

  if (errorUsers || errorFollowing) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-400 border border-red-200 dark:border-red-700 shadow-md">
        <p className="text-center text-sm">Error loading suggestions. Please try again later.</p>
      </div>
    )
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6 border border-gray-100 dark:border-gray-700 max-h-[600px] overflow-y-auto w-full max-w-[680px] ml-[-20px]"
    >
      <div
        className="rounded-xl overflow-hidden mb-4"
        style={{
          background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
        }}
      >
        <div className="p-4 flex items-center">
          <h2 className="text-xl font-bold text-white flex items-center">
            <FiUser className="inline-block mr-2 text-white/80" size={24} />
            Suggested Friends
          </h2>
        </div>
      </div>

      {suggestedUsers.length === 0 ? (
        <div className="text-center py-6">
          <FiUser size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <p className="text-md font-semibold text-gray-700 dark:text-gray-300">No new users to suggest</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Check back later for more connections!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {suggestedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-[#2d2a3e] rounded-xl shadow-sm dark:shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-md dark:hover:shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <Avatar
                src={
                  user.profilePhoto
                    ? getBackendImageUrl(user.profilePhoto)
                    : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${encodeURIComponent(user.username)}`
                }
                alt={user.username}
                sx={{
                  width: 48,
                  height: 48,
                  border: `2px solid ${LAVENDER}`,
                  flexShrink: 0,
                  ".dark &": { borderColor: PURPLE },
                }}
              />
              <div className="flex flex-col flex-grow min-w-0">
                <Tooltip title={user.username}>
                  <Typography
                    variant="body1"
                    className="font-semibold text-gray-900 dark:text-white text-sm cursor-pointer"
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "nowrap",
                      overflow: "visible",
                      maxWidth: "calc(100% - 100px)",
                    }}
                    onClick={() => navigate(`/${user._id}`)}
                  >
                    {user.username}
                  </Typography>
                </Tooltip>
              </div>

              {followingUserIds.includes(user._id) ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: LAVENDER,
                    "&:hover": { backgroundColor: PURPLE },
                    color: WHITE,
                    borderRadius: "9999px",
                    textTransform: "none",
                    px: 2,
                    py: 0.5,
                    fontSize: "0.75rem",
                    boxShadow: `0 2px 5px ${LAVENDER}40`,
                    "&:hover": { boxShadow: `0 3px 8px ${PURPLE}60` },
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                  onClick={() => handleUnfollow(user._id)}
                  startIcon={<FiCheck size={12} />}
                >
                  Following
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: PURPLE,
                    "&:hover": { backgroundColor: LAVENDER },
                    color: WHITE,
                    borderRadius: "9999px",
                    textTransform: "none",
                    px: 2,
                    py: 0.5,
                    fontSize: "0.75rem",
                    boxShadow: `0 2px 5px ${PURPLE}40`,
                    "&:hover": { boxShadow: `0 3px 8px ${LAVENDER}60` },
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                  onClick={() => handleFollow(user._id)}
                  startIcon={<FiPlus size={12} />}
                >
                  Follow
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
