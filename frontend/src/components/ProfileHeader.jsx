"use client"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../auth/AuthProvider"
import { useUserPosts } from "../hooks/Admin/getPostByUser"
import { useFollowing } from "../hooks/friendsHook"
import ProfileImage from "./ProfileImage"
import ProfileInfo from "./ProfileInfo"
import ProfileActions from "./ProfileActions"
import EditProfileDialog from "./EditProfileDialog"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const ProfileHeader = ({ user, onUpdateUser }) => {
  const { logout, user: loggedInUser } = useContext(AuthContext)
  const isOwnProfile = loggedInUser?._id === user?._id

  const [openEdit, setOpenEdit] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [previewPhoto, setPreviewPhoto] = useState(null)

  const { data: posts, isLoading: postsLoading } = useUserPosts(user?._id)
  const { data: followingData, isLoading: followingLoading } = useFollowing(loggedInUser?._id)

  const isFollowing =
    !followingLoading && followingData?.data?.some((follow) => follow.followee._id.toString() === user._id.toString())

  useEffect(() => {
    console.log("Logged-in user:", loggedInUser)
    console.log("Profile user:", user)
  }, [loggedInUser, user])

  useEffect(() => {
    console.log("Posts loading:", postsLoading)
    if (posts) console.log(`User has ${posts.length} posts`)
  }, [posts, postsLoading])

  useEffect(() => {
    console.log("Following loading:", followingLoading)
    if (followingData) {
      console.log(`Logged-in user is following ${followingData.data.length} users`)
      console.log("Is following this profile?", isFollowing)
    }
  }, [followingData, followingLoading, isFollowing])

  return (
    <div className="flex justify-center mt-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {/* Background Card */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Background */}
          <div
            className="h-48 sm:h-64 relative"
            style={{
              background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Decorative Elements */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-6 sm:px-8 lg:px-12 pb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 -mt-16 sm:-mt-20">
              {/* Profile Image */}
              <div className="relative z-10">
                <ProfileImage
                  user={user}
                  onEditClick={() => {
                    setPreviewPhoto(null)
                    setOpenEdit(true)
                    console.log("Edit clicked")
                  }}
                />
              </div>

              {/* Profile Info & Actions */}
              <div className="flex-1 w-full lg:mt-8">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                  <div className="flex-1">
                    <ProfileInfo user={user} posts={posts} postsLoading={postsLoading} />
                  </div>

                  <div className="flex justify-center lg:justify-end">
                    <ProfileActions
                      isOwnProfile={isOwnProfile}
                      anchorEl={anchorEl}
                      viewedUserId={user?._id}
                      isFollowing={isFollowing}
                      onEditClick={() => {
                        setPreviewPhoto(null)
                        setOpenEdit(true)
                        console.log("Edit clicked via ProfileActions")
                      }}
                      onLogout={() => {
                        logout()
                        console.log("User logged out")
                      }}
                      onSettingsClick={(e) => {
                        setAnchorEl(e.currentTarget)
                        console.log("Settings menu opened")
                      }}
                      onCloseSettings={() => {
                        setAnchorEl(null)
                        console.log("Settings menu closed")
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Dialog */}
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
      </div>
    </div>
  )
}

export default ProfileHeader
