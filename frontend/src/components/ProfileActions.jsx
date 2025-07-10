"use client"

import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { IconButton, Menu, MenuItem, Button } from "@mui/material"
import { FiSettings, FiLogOut, FiMessageCircle, FiUserPlus, FiUserMinus } from "react-icons/fi"
import { useFollowUser, useUnfollowUser } from "../hooks/friendsHook"
import { AuthContext } from "../auth/AuthProvider"
import { toast } from "react-toastify"
import { createNotificationService } from "../services/notificationService"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const ProfileActions = ({
  isOwnProfile,
  anchorEl,
  onEditClick,
  onLogout,
  onSettingsClick,
  onCloseSettings,
  viewedUserId,
  isFollowing,
}) => {
  const { user: currentUser } = useContext(AuthContext)
  const followUser = useFollowUser()
  const unfollowUser = useUnfollowUser()
  const navigate = useNavigate()

  const handleFollow = () => {
    if (!viewedUserId || !currentUser?._id || viewedUserId === currentUser._id) return

    followUser.mutate(viewedUserId, {
      onSuccess: () => {
        createNotificationService({
          recipient: viewedUserId,
          type: "follow",
          message: `${currentUser.username} started following you.`,
          relatedId: currentUser._id,
        }).catch((err) => {
          console.error("Failed to create follow notification:", err)
        })
      },
    })
  }

  const handleUnfollow = () => {
    if (!viewedUserId || !currentUser?._id || viewedUserId === currentUser._id) return
    unfollowUser.mutate(viewedUserId)
  }

  const handleMessage = () => {
    if (!isFollowing) {
      toast.warning("You must follow this user to message them.", {
        position: "top-center",
        autoClose: 3000,
      })
      return
    }
    navigate(`/${viewedUserId}/message`)
  }

  const handleChangePassword = () => {
    onCloseSettings()
    navigate("/changepassword")
  }

  if (isOwnProfile) {
    return (
      <div className="flex gap-3 items-center">
        <Button
          variant="outlined"
          onClick={onEditClick}
          startIcon={<FiSettings size={18} />}
          sx={{
            textTransform: "none",
            fontWeight: "600",
            borderColor: "rgba(255,255,255,0.5)",
            color: WHITE,
            borderRadius: "12px",
            paddingX: 3,
            paddingY: 1.5,
            fontSize: "1rem",
            borderWidth: 2,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.1)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
              borderColor: WHITE,
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Edit Profile
        </Button>

        <IconButton
          onClick={onSettingsClick}
          sx={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: WHITE,
            width: 48,
            height: 48,
            backdropFilter: "blur(10px)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.25)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <FiSettings size={20} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onCloseSettings}
          PaperProps={{
            sx: {
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: `0 10px 40px ${PURPLE}20`,
              border: `1px solid ${LAVENDER}40`,
              minWidth: 200,
            },
          }}
        >
          <MenuItem
            onClick={handleChangePassword}
            sx={{
              color: PURPLE,
              fontWeight: "500",
              py: 1.5,
              px: 2,
              "&:hover": {
                bgcolor: `${LAVENDER}15`,
                color: PURPLE,
              },
            }}
          >
            <FiSettings style={{ marginRight: 12 }} />
            Change Password
          </MenuItem>
          <MenuItem
            onClick={onLogout}
            sx={{
              color: "#dc2626",
              fontWeight: "500",
              py: 1.5,
              px: 2,
              "&:hover": {
                bgcolor: "#fef2f2",
                color: "#dc2626",
              },
            }}
          >
            <FiLogOut style={{ marginRight: 12 }} />
            Logout
          </MenuItem>
        </Menu>
      </div>
    )
  }

  return (
    <div className="flex gap-3 items-center">
      {isFollowing ? (
        <Button
          variant="outlined"
          onClick={handleUnfollow}
          disabled={unfollowUser.isLoading}
          startIcon={<FiUserMinus size={18} />}
          sx={{
            borderColor: "rgba(220, 38, 38, 0.7)",
            color: "#dc2626",
            backgroundColor: "rgba(255,255,255,0.9)",
            textTransform: "none",
            fontWeight: "600",
            borderRadius: "12px",
            paddingX: 3,
            paddingY: 1.5,
            fontSize: "1rem",
            borderWidth: 2,
            backdropFilter: "blur(10px)",
            "&:hover": {
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              borderColor: "#dc2626",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(220, 38, 38, 0.3)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {unfollowUser.isLoading ? "Unfollowing..." : "Unfollow"}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={handleFollow}
          disabled={followUser.isLoading}
          startIcon={<FiUserPlus size={18} />}
          sx={{
            background: "rgba(255,255,255,0.9)",
            color: PURPLE,
            textTransform: "none",
            fontWeight: "600",
            borderRadius: "12px",
            paddingX: 3,
            paddingY: 1.5,
            fontSize: "1rem",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            "&:hover": {
              background: WHITE,
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {followUser.isLoading ? "Following..." : "Follow"}
        </Button>
      )}

      <Button
        variant="outlined"
        onClick={handleMessage}
        startIcon={<FiMessageCircle size={18} />}
        sx={{
          borderColor: "rgba(255,255,255,0.5)",
          color: WHITE,
          backgroundColor: "rgba(255,255,255,0.1)",
          textTransform: "none",
          fontWeight: "600",
          borderRadius: "12px",
          paddingX: 3,
          paddingY: 1.5,
          fontSize: "1rem",
          borderWidth: 2,
          backdropFilter: "blur(10px)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.2)",
            borderColor: WHITE,
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Message
      </Button>
    </div>
  )
}

export default ProfileActions
