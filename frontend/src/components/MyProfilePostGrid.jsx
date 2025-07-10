import React, { useState } from "react";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";
import {
  FiLock,
  FiUsers,
  FiGlobe,
  FiMessageCircle,
  FiTrash2,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import DeleteModal from "../components/DeleteModal";
import LikeButton from "../components/LikeButton";
import CommentCount from "./CommentButton";

// Import the new modal component for full post + comments
import PostModalStandalone from "../components/PostModalStandalone";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U";

const getPrivacyIcon = (privacy) => {
  switch (privacy) {
    case "public":
      return { icon: <FiGlobe size={14} />, label: "Public" };
    case "private":
      return { icon: <FiLock size={14} />, label: "Private" };
    case "friends":
      return { icon: <FiUsers size={14} />, label: "Friends" };
    default:
      return { icon: <FiGlobe size={14} />, label: "Public" };
  }
};

function formatFacebookDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const EditSchema = Yup.object({
  content: Yup.string().required("Content is required"),
});

export default function UserPostsGrid({ posts, user, onDelete, onUpdate }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editImage, setEditImage] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // New state for post modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState(null);

  const handleEdit = (post) => {
    setSelectedPost(post);
    setEditImage(null);
    setEditOpen(true);
  };

  const handleDelete = (post) => {
    setDeleteId(post._id);
    setSelectedPost(post);
  };

  const confirmDelete = () => {
    onDelete(deleteId);
    setDeleteId(null);
    setSelectedPost(null);
  };

  // Open post modal on card click
  const openPostModal = (post) => {
    setModalPost(post);
    setModalOpen(true);
  };

  // Close post modal
  const closePostModal = () => {
    setModalPost(null);
    setModalOpen(false);
  };

  if (!posts || posts.length === 0)
    return <div className="text-gray-400 text-center mt-12">No posts yet.</div>;

  return (
    <>
      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Post"
        description={
          selectedPost?.content
            ? `Are you sure you want to delete this post? Content: "${selectedPost.content}"`
            : "Are you sure you want to delete this post?"
        }
      />

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Formik
              initialValues={{ content: selectedPost.content }}
              validationSchema={EditSchema}
              onSubmit={(values, { setSubmitting }) => {
                const formData = new FormData();
                formData.append("content", values.content);
                if (editImage) formData.append("imageUrl", editImage);

                onUpdate(selectedPost._id, formData);
                setSubmitting(false);
                setEditOpen(false);
                setSelectedPost(null);
                setEditImage(null);
              }}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <Typography variant="subtitle2">
                    <b>Author:</b> {selectedPost.userId?.username || user?.username}
                  </Typography>
                  <Field
                    as={TextField}
                    margin="dense"
                    label="Content"
                    name="content"
                    fullWidth
                    multiline
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.content && Boolean(errors.content)}
                    helperText={touched.content && errors.content}
                  />

                  {(editImage || selectedPost.imageUrl) && (
                    <img
                      src={
                        editImage
                          ? URL.createObjectURL(editImage)
                          : getBackendImageUrl(selectedPost.imageUrl)
                      }
                      alt="post"
                      style={{ width: "100%", marginTop: 16, marginBottom: 8 }}
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditImage(e.target.files[0]);
                      }
                    }}
                    style={{ marginTop: 8 }}
                  />

                  <DialogActions>
                    <Button
                      onClick={() => {
                        setEditOpen(false);
                        setEditImage(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                      Save Changes
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      {/* Post Modal */}
      <PostModalStandalone post={modalPost} isOpen={modalOpen} onClose={closePostModal} />

      {/* Post Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 px-4">
        {posts.map((post) => {
          const { icon, label } = getPrivacyIcon(post.privacy);
          const username = post.userId?.username || user?.username || "Unknown User";
          const profilePhoto =
            user?.profilePhoto && user.profilePhoto.trim() !== ""
              ? getBackendImageUrl(user.profilePhoto)
              : post.userId?.profilePhoto && post.userId.profilePhoto.trim() !== ""
              ? getBackendImageUrl(post.userId.profilePhoto)
              : DEFAULT_AVATAR;
          const createdAt = formatFacebookDate(post.createdAt);

          return (
            <div
              key={post._id}
              className="bg-white dark:bg-[#1e1b29] rounded-2xl shadow p-4 flex flex-col border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow group relative"
              onClick={() => openPostModal(post)} // OPEN modal here on card click
            >
              {/* Edit/Delete Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-60 group-hover:opacity-100 transition">
                <button
                  className="text-gray-500 hover:text-purple-700 bg-white dark:bg-[#2a223a] dark:text-gray-300 rounded-full p-1 shadow"
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(post);
                  }}
                >
                  <FiEdit2 size={18} />
                </button>
                <button
                  className="text-gray-500 hover:text-red-600 bg-white dark:bg-[#2a223a] dark:text-gray-300 rounded-full p-1 shadow"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post);
                  }}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center mb-2 gap-3">
                <img
                  src={profilePhoto}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{username}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-300 gap-1">
                    <span>{createdAt}</span>
                    <span>·</span>
                    {icon}
                    <span>{label}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-base text-gray-900 dark:text-gray-100 whitespace-pre-line mb-2">
                {post.content}
              </div>

              {/* Image */}
              {post.imageUrl && (
                <div className="overflow-hidden rounded-xl mb-2 bg-black flex items-center justify-center w-full aspect-square">
                  <img
                    src={getBackendImageUrl(post.imageUrl)}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Like/Comment Actions */}
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div
                  className="py-2 px-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LikeButton postId={post._id} postOwnerId={post.userId?._id} />
                </div>
                <div onClick={(e) => e.stopPropagation()}>
    <CommentCount postId={post._id} openPostModal={() => openPostModal(post)} />
  </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
