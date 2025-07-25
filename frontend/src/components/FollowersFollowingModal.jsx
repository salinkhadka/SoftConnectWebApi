import React from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";

const DEFAULT_AVATAR = (name) =>
  `https://ui-avatars.com/api/?background=ddd&color=888&name=${encodeURIComponent(name?.charAt(0) || "U")}`;

const FollowersFollowingModal = ({ open, onClose, title, users }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {title}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {users?.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">No users to display.</div>
        ) : (
          <ul className="space-y-3">
            {users.map((entry) => {
              const userObj = entry.follower.username ? entry.follower : entry.followee;
              const username = userObj?.username || "Unknown User";
              const userId = userObj?._id;

              const profilePhoto = userObj?.profilePhoto?.trim()
                ? getBackendImageUrl(userObj.profilePhoto)
                : DEFAULT_AVATAR(username);

              return (
                <li
                  key={entry._id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition"
                  onClick={() => {
                    navigate(`/${userId}`);
                    onClose(); // Optional: close the modal after navigation
                  }}
                >
                  <img
                    src={profilePhoto}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-100 font-medium">
                    {username}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FollowersFollowingModal;
