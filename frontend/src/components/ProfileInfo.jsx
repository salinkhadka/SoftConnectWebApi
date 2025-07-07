import React, { useState, useEffect } from "react";
import { FiMail, FiUser, FiCalendar } from "react-icons/fi";
import { useFollowers, useFollowing } from "../hooks/friendsHook";
import FollowersFollowingModal from "./FollowersFollowingModal";

const ProfileInfo = ({ user, posts, postsLoading }) => {
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const { data: followersData } = useFollowers(user._id);
  const { data: followingData } = useFollowing(user._id);

  useEffect(() => {
    if (followersData?.data) {
      setFollowersList(followersData.data);
    }
  }, [followersData]);

  useEffect(() => {
    if (followingData?.data) {
      setFollowingList(followingData.data);
    }
  }, [followingData]);

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
        <button onClick={() => setFollowersOpen(true)} className="hover:underline">
          <b>{followersList.length}</b> followers
        </button>
        <button onClick={() => setFollowingOpen(true)} className="hover:underline">
          <b>{followingList.length}</b> following
        </button>
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

      {/* Modals */}
      <FollowersFollowingModal
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        title="Followers"
        users={followersList}
      />
      <FollowersFollowingModal
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
        title="Following"
        users={followingList}
      />
    </div>
  );
};

export default ProfileInfo;
