import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import ProfileHeader from "../components/ProfileHeader";
import UserPostsGrid from "../components/MyProfilePostGrid";
import { useUserPosts } from "../hooks/Admin/getPostByUser";
import { useUpdatePost } from "../hooks/Admin/updatePost";
import { useDeletePost } from "../hooks/Admin/deletePost";
import { useUpdateUser } from "../hooks/Admin/adminUserhook"; 
import { useFollowers,useFollowing } from "../hooks/friendsHook";

export default function MyProfileSection() {
  const { user, loading } = useContext(AuthContext);
  const { data, isLoading, isError, refetch } = useUserPosts(user?._id);
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const updateUser = useUpdateUser();

  // Fetch followers and following lists from backend
  const { data: followersData } = useFollowers(user?._id);
  const { data: followingData } = useFollowing(user?._id);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in.</div>;

  // Calculate counts from fetched data
  const followerCount = followersData?.data?.length ?? 0;
  const followingCount = followingData?.data?.length ?? 0;

  const headerUser = {
    ...user,
    fullName: user.username,
    postCount: data?.data?.length ?? 0,
    followerCount,
    followingCount,
  };

  // Handler to update profile info
  const handleUserUpdate = (formData) => {
    updateUser.mutate(
      { id: user._id, formData },
      {
        onSuccess: () => {
          refetch && refetch();
        },
      }
    );
  };

  const handleUpdate = (postId, formData) => {
    updatePost.mutate(
      { postId, formData },
      {
        onSuccess: () => refetch && refetch(),
      }
    );
  };

  const handleDelete = (postId) => {
    deletePost.mutate(postId, {
      onSuccess: () => refetch && refetch(),
    });
  };

  return (
    <div>
      <ProfileHeader user={headerUser} onUpdateUser={handleUserUpdate} />
      {isLoading ? (
        <div className="text-center mt-10">Loading posts...</div>
      ) : isError ? (
        <div className="text-center mt-10 text-red-500">Failed to load posts.</div>
      ) : (
        <UserPostsGrid posts={data?.data || []} user={user} onUpdate={handleUpdate} onDelete={handleDelete} />
      )}
    </div>
  );
}
