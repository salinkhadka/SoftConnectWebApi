"use client"

import { IconButton } from "@mui/material"
import { FiEdit2, FiCamera } from "react-icons/fi"
import { getBackendImageUrl } from "../utils/getBackendImageUrl"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const ProfileImage = ({ user, isOwnProfile, onEditClick }) => {
  return (
    <div className="relative group">
      {/* Profile Image */}
      <div className="relative">
        <img
          src={
            user.profilePhoto
              ? getBackendImageUrl(user.profilePhoto)
              : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${user.username}&size=200`
          }
          alt="profile"
          className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-2xl transition-all duration-300 group-hover:scale-105"
        />

        {/* Online Status Indicator */}
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-3 border-white dark:border-gray-700 shadow-lg"></div>

        {/* Edit Button Overlay */}
        {isOwnProfile && (
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <IconButton
              onClick={onEditClick}
              className="transform scale-0 group-hover:scale-100 transition-all duration-300"
              sx={{
                backgroundColor: `${WHITE}`,
                color: PURPLE,
                width: 48,
                height: 48,
                boxShadow: `0 4px 20px ${PURPLE}40`,
                "&:hover": {
                  backgroundColor: LAVENDER,
                  color: WHITE,
                  transform: "scale(1.1)",
                },
              }}
            >
              <FiCamera size={20} />
            </IconButton>
          </div>
        )}
      </div>

      {/* Floating Edit Button (Alternative) */}
      {isOwnProfile && (
        <IconButton
          onClick={onEditClick}
          className="absolute -bottom-2 -right-2 shadow-lg transform hover:scale-110 transition-all duration-200"
          sx={{
            backgroundColor: PURPLE,
            color: WHITE,
            width: 40,
            height: 40,
            "&:hover": {
              backgroundColor: LAVENDER,
              boxShadow: `0 8px 25px ${PURPLE}60`,
            },
          }}
        >
          <FiEdit2 size={16} />
        </IconButton>
      )}
    </div>
  )
}

export default ProfileImage
