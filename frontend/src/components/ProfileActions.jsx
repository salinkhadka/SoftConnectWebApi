import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useFollowUser, useUnfollowUser } from "../hooks/friendsHook";
import { AuthContext } from "../auth/AuthProvider";
import { toast } from "react-toastify"; // ✅ Toast

const PURPLE = "#37225C";
const LAVENDER = "#B8A6E6";
const WHITE = "#FFFFFF";

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
  const { user: currentUser } = useContext(AuthContext);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const navigate = useNavigate();

  const handleFollow = () => {
    if (!viewedUserId || !currentUser?._id || viewedUserId === currentUser._id) return;
    followUser.mutate(viewedUserId);
  };

  const handleUnfollow = () => {
    if (!viewedUserId || !currentUser?._id || viewedUserId === currentUser._id) return;
    unfollowUser.mutate(viewedUserId);
  };

  const handleMessage = () => {
    if (!isFollowing) {
      toast.warning("You must follow this user to message them.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    navigate(`/${viewedUserId}/message`);
  };

  if (isOwnProfile) {
    return (
      <div className="flex gap-3 items-center" style={{ marginBottom: 8 }}>
        <Button
          variant="outlined"
          onClick={onEditClick}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            borderColor: PURPLE,
            color: PURPLE,
            borderRadius: "8px",
            paddingX: 3,
            paddingY: 1.25,
            fontSize: "1.1rem",
            "&:hover": {
              backgroundColor: LAVENDER,
              color: PURPLE,
              borderColor: LAVENDER,
            },
          }}
        >
          Edit
        </Button>
        <IconButton
          onClick={onSettingsClick}
          sx={{
            color: PURPLE,
            "&:hover": {
              color: LAVENDER,
              backgroundColor: "transparent",
            },
            marginBottom: 2,
            fontSize: 28,
          }}
          size="large"
        >
          <FiSettings size={24} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={onCloseSettings}
          PaperProps={{
            sx: {
              bgcolor: "background.paper",
              color: PURPLE,
              borderRadius: 2,
              boxShadow: `0 2px 8px ${LAVENDER}80`,
            },
          }}
        >
          <MenuItem
            onClick={onLogout}
            sx={{
              color: PURPLE,
              fontWeight: "bold",
              "&:hover": {
                bgcolor: LAVENDER,
                color: WHITE,
              },
            }}
          >
            <FiLogOut style={{ marginRight: 8 }} /> Logout
          </MenuItem>
        </Menu>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-center" style={{ marginBottom: 8 }}>
      {isFollowing ? (
        <Button
          variant="outlined"
          onClick={handleUnfollow}
          disabled={unfollowUser.isLoading}
          sx={{
            borderColor: PURPLE,
            color: PURPLE,
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px",
            paddingX: 3,
            paddingY: 1.25,
            fontSize: "1.1rem",
            "&:hover": {
              backgroundColor: LAVENDER,
              color: WHITE,
              borderColor: LAVENDER,
            },
          }}
        >
          {unfollowUser.isLoading ? "Unfollowing..." : "Unfollow"}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={handleFollow}
          disabled={followUser.isLoading}
          sx={{
            backgroundColor: PURPLE,
            color: WHITE,
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px",
            paddingX: 3,
            paddingY: 1.25,
            fontSize: "1.1rem",
            boxShadow: `0 4px 10px ${LAVENDER}80`,
            "&:hover": {
              backgroundColor: LAVENDER,
              color: PURPLE,
            },
          }}
        >
          {followUser.isLoading ? "Following..." : "Follow"}
        </Button>
      )}

      <Button
        variant="outlined"
        onClick={handleMessage}
        sx={{
          borderColor: LAVENDER,
          color: PURPLE,
          textTransform: "none",
          fontWeight: "bold",
          borderRadius: "8px",
          paddingX: 3,
          paddingY: 1.25,
          fontSize: "1.1rem",
          "&:hover": {
            backgroundColor: LAVENDER,
            color: WHITE,
            borderColor: LAVENDER,
          },
        }}
      >
        Message
      </Button>
    </div>
  );
};

export default ProfileActions;
