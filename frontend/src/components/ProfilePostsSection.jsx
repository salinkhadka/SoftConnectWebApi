import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useUserPosts } from "../hooks/Admin/getPostByUser";
import { useFollowing } from "../hooks/friendsHook";
import UserPostsGrid from "./UserPostsView";

const ProfilePostsSection = ({ user }) => {
  const { user: loggedInUser } = useContext(AuthContext);
  const isOwnProfile = loggedInUser?._id === user?._id;

  const { data: posts, isLoading: postsLoading } = useUserPosts(user?._id);

  // Fetch the users the logged-in user is following
  const { data: followingData, isLoading: followingLoading } = useFollowing(loggedInUser?._id);

  // Compute if logged-in user is following this profile user
  const isFollowing = !followingLoading && followingData?.data?.some((follow) => {
  if (!follow.followee?._id || !user?._id) return false;
  return follow.followee._id.toString() === user._id.toString();
});


  // Determine if posts should be shown
  const shouldShowPosts = isOwnProfile || isFollowing;

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 mt-8">
      <div className="bg-white dark:bg-[#1b1a22] rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 w-full max-w-5xl">
        {shouldShowPosts ? (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isOwnProfile ? "Your Posts" : `${user?.username || user?.name}'s Posts`}
            </h3>
            
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <UserPostsGrid posts={posts} user={user} />
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
              <div className="text-gray-600 dark:text-gray-400 text-lg font-medium mb-2">
                Posts are private
              </div>
              <p className="text-gray-500 dark:text-gray-500">
                Follow {user?.username || user?.name} to see their posts
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePostsSection;