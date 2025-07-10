import React from "react";
import { IconButton } from "@mui/material";
import { FiEdit2 } from "react-icons/fi";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";

const ProfileImage = ({ user, isOwnProfile, onEditClick }) => {
  return (
    <div className="shrink-0 relative">
      <img
        src={
          user.profilePhoto
            ? getBackendImageUrl(user.profilePhoto)
            : `https://ui-avatars.com/api/?background=ddd&color=888&name=${user.username}`
        }
        alt="profile"
        className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow-lg"
      />
      {isOwnProfile && (
        <IconButton
          className="absolute bottom-2 right-2 bg-white shadow"
          onClick={onEditClick}
        >
          <FiEdit2 />
        </IconButton>
      )}
    </div>
  );
};

export default ProfileImage;
