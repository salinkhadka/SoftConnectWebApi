import React from "react";
import PostTable from "../../components/Admin/PostTableComponent";
import { useAllPosts } from "../../hooks/Admin/getAllPosts";
import { useDeletePost } from "../../hooks/Admin/deletePost";
import { useUpdatePost } from "../../hooks/Admin/updatePost";

export default function PostPageAdmin() {
  const { data, isLoading, isError } = useAllPosts();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  // Handler for updating post
  const handleUpdate = (postId, formData) => {
    updatePost.mutate({ postId, formData });
  };

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error loading posts.</div>;

  return (
    <div>
      <h2>All Posts (Admin)</h2>
      <PostTable
        posts={data?.data || []}
        onDelete={(postId) => deletePost.mutate(postId)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
