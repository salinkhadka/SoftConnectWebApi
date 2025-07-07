import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";

const DEFAULT_AVATAR = (name) =>
  `https://ui-avatars.com/api/?background=ddd&color=888&name=${encodeURIComponent(name?.charAt(0) || "U")}`;

const FollowersFollowingModal = ({ open, onClose, title, users }) => {
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
              // Your current format: follower is ID, followee is the user object
              const userObj = entry.follower.username ? entry.follower : entry.followee;
              const username = userObj?.username || "Unknown User";

              const profilePhoto = userObj?.profilePhoto?.trim()
                ? getBackendImageUrl(userObj.profilePhoto)
                : DEFAULT_AVATAR(username);

              return (
                <li key={entry._id} className="flex items-center gap-3">
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
