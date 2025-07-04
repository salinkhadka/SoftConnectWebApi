import React, { useContext } from 'react';
import {
  FiX,
  FiMessageCircle,
  FiLock,
  FiUsers,
  FiGlobe,
} from 'react-icons/fi';
import { getBackendImageUrl } from '../utils/getBackendImageUrl';
import { AuthContext } from '../auth/AuthProvider';
import LikeButton from '../components/LikeButton';

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?background=ddd&color=888&name=U';

const getPrivacyIcon = (privacy) => {
  switch (privacy) {
    case 'public':
      return { icon: <FiGlobe size={16} />, label: 'Public' };
    case 'private':
      return { icon: <FiLock size={16} />, label: 'Private' };
    case 'friends':
      return { icon: <FiUsers size={16} />, label: 'Friends' };
    default:
      return { icon: <FiGlobe size={16} />, label: 'Public' };
  }
};

function formatFacebookDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function PostModal({ isOpen, onClose, post }) {
  const { user } = useContext(AuthContext);

  if (!isOpen || !post) return null;

  const {
    userId: postUser = {},
    content = '',
    imageUrl = '',
    privacy = 'public',
    createdAt,
    _id: postId,
  } = post;

  const { icon, label } = getPrivacyIcon(privacy);
  const username = postUser?.username || 'Unknown User';
  const profilePhoto =
    postUser?.profilePhoto && postUser.profilePhoto.trim() !== ''
      ? getBackendImageUrl(postUser.profilePhoto)
      : DEFAULT_AVATAR;
  const dateStr = formatFacebookDate(createdAt);
  const postImage =
    imageUrl && imageUrl.trim() !== '' ? getBackendImageUrl(imageUrl) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-[#1e1b29] w-full max-w-2xl rounded-2xl shadow-lg relative p-0 transition-all duration-300">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 dark:text-gray-300 z-10"
          onClick={onClose}
        >
          <FiX size={22} />
        </button>

        {/* Card body */}
        <div className="p-6 pb-3">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-2">
            <img
              src={profilePhoto}
              alt="avatar"
              className="w-11 h-11 rounded-full object-cover border border-gray-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {username}
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-300 gap-1">
                <span>{dateStr}</span>
                <span>·</span>
                {icon}
                <span>{label}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-lg text-gray-900 dark:text-gray-100 whitespace-pre-line mb-3">
            {content}
          </div>
        </div>

        {/* Optional Image */}
        {postImage && (
          <div className="bg-black flex justify-center items-center">
            <img
              src={postImage}
              alt="Post"
              className="w-full max-h-[520px] object-contain rounded-b-2xl"
              style={{ background: '#17171a' }}
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between px-8 mt-2 py-3 border-t border-gray-200 dark:border-gray-700">
          <LikeButton postId={postId} />
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-100">
            <FiMessageCircle size={20} />
            <span>Comment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
