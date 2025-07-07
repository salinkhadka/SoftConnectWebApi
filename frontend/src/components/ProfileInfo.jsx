import React from "react";
import { FiMail, FiUser, FiCalendar } from "react-icons/fi";

const ProfileInfo = ({ user, posts, postsLoading }) => {
  return (
    <div className="flex-1 space-y-5 w-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {user.username}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          <FiUser className="inline mr-1" /> {user.role} | ID: {user.StudentId}
        </p>
      </div>

      <div className="flex gap-10 text-sm text-gray-700 dark:text-gray-300">
        <span>
          <b>{postsLoading ? "..." : posts?.data?.length || 0}</b> posts
        </span>
        <span>
          <b>{user.followersCount}</b> followers
        </span>
        <span>
          <b>{user.followingCount}</b> following
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-300">
        <p>
          <FiMail className="inline mr-2 text-gray-500" />
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <p>
          <FiCalendar className="inline mr-2 text-gray-500" />
          <span className="font-medium">Joined:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
        {user.bio && (
          <p className="md:col-span-2">
            <span className="font-medium">Bio:</span> {user.bio}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
