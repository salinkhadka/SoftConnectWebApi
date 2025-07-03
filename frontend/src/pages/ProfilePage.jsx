import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import ProfileHeader from "../components/ProfileHeader";
import UserPostsGrid from "../components/MyProfilePostGrid";
import { useUserPosts } from "../hooks/Admin/getPostByUser";
import { useUpdatePost } from "../hooks/Admin/updatePost";
import { useDeletePost } from "../hooks/Admin/deletePost";
import { useUpdateUser } from "../hooks/Admin/adminUserhook"; // ✅ Use your existing hook

export default function MyProfileSection() {
  const { user, loading } = useContext(AuthContext);
  const { data, isLoading, isError, refetch } = useUserPosts(user?._id);
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const updateUser = useUpdateUser(); // ✅ Use update hook

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in.</div>;

  const headerUser = {
    ...user,
    fullName: user.username,
    postCount: data?.data?.length ?? 0,
    followerCount: 239,
    followingCount: 330,
  };

  // ✅ Handler to update profile info
  const handleUserUpdate = (formData) => {
    updateUser.mutate({ id: user._id, formData }, {
      onSuccess: () => {
        refetch && refetch();
      },
    });
  };

  const handleUpdate = (postId, formData) => {
    updatePost.mutate({ postId, formData }, {
      onSuccess: () => refetch && refetch(),
    });
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
        <UserPostsGrid
          posts={data?.data || []}
          user={user}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
