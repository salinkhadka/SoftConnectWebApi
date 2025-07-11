"use client"

import { useState } from "react"
import { getBackendImageUrl } from "../utils/getBackendImageUrl"
import { FiLock, FiUsers, FiGlobe, FiTrash2, FiEdit2, FiX, FiImage, FiCalendar } from "react-icons/fi"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import DeleteModal from "../components/DeleteModal"
import LikeButton from "../components/LikeButton"
import CommentCount from "./CommentButton"
import PostModalStandalone from "../components/PostModalStandalone"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=ddd&color=888&name=U"

const getPrivacyIcon = (privacy) => {
  switch (privacy) {
    case "public":
      return { icon: <FiGlobe size={16} className="text-green-500" />, label: "Public" }
    case "private":
      return { icon: <FiLock size={16} className="text-red-500" />, label: "Private" }
    case "friends":
      return { icon: <FiUsers size={16} className="text-blue-500" />, label: "Friends" }
    default:
      return { icon: <FiGlobe size={16} className="text-green-500" />, label: "Public" }
  }
}

function formatFacebookDate(dateStr) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const now = new Date()
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

const EditSchema = Yup.object({
  content: Yup.string().required("Content is required"),
})

// Image component with better error handling
const PostImage = ({ src, alt, className, onError }) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
    onError && onError()
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  if (imageError) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center`}
      >
        <div className="text-center p-6">
          <FiImage size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-500">Image unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} relative overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: isLoading ? "none" : "block" }}
      />
    </div>
  )
}

export default function UserPostsGrid({ posts, user, onUpdate, onDelete }) {
  const [editOpen, setEditOpen] = useState(false)
  const [editImage, setEditImage] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPost, setModalPost] = useState(null)

  const handleEdit = (post) => {
    setSelectedPost(post)
    setEditImage(null)
    setEditOpen(true)
  }

  const handleDelete = (post) => {
    setDeleteId(post._id)
    setSelectedPost(post)
  }

  const confirmDelete = () => {
    onDelete(deleteId)
    setDeleteId(null)
    setSelectedPost(null)
  }

  const openPostModal = (post) => {
    setModalPost(post)
    setModalOpen(true)
  }

  const closePostModal = () => {
    setModalPost(null)
    setModalOpen(false)
  }

  // Handle different data structures - posts might be nested in data property
  const postsArray = Array.isArray(posts) ? posts : posts?.data || []

  if (!postsArray || postsArray.length === 0)
    return (
      <div className="flex justify-center px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white dark:bg-[#1b1a22] rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 w-full max-w-6xl">
          <div className="text-center py-16">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-16">
              <FiImage size={80} className="mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">No posts yet</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Start sharing your thoughts with the community!
              </p>
            </div>
          </div>
        </div>
      </div>
    )

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
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
            boxShadow: `0 20px 60px ${PURPLE}20`,
            border: `1px solid ${LAVENDER}30`,
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
            color: WHITE,
            fontWeight: "bold",
            fontSize: "1.25rem",
            textAlign: "center",
            py: 3,
          }}
        >
          <FiEdit2 style={{ marginRight: 8, display: "inline" }} />
          Edit Post
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedPost && (
            <Formik
              initialValues={{ content: selectedPost.content }}
              validationSchema={EditSchema}
              onSubmit={(values, { setSubmitting }) => {
                const formData = new FormData()
                formData.append("content", values.content)
                if (editImage) formData.append("imageUrl", editImage)

                onUpdate(selectedPost._id, formData)
                setSubmitting(false)
                setEditOpen(false)
                setSelectedPost(null)
                setEditImage(null)
              }}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={
                          user?.profilePhoto
                            ? getBackendImageUrl(user.profilePhoto)
                            : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${user?.username || "U"}`
                        }
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border-2"
                        style={{ borderColor: LAVENDER }}
                      />
                      <div>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: PURPLE }}>
                          {selectedPost.userId?.username || user?.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Editing post
                        </Typography>
                      </div>
                    </div>

                    <Field
                      as={TextField}
                      label="Content"
                      name="content"
                      fullWidth
                      multiline
                      rows={4}
                      value={values.content}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.content && Boolean(errors.content)}
                      helperText={touched.content && errors.content}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: LAVENDER,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: PURPLE,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: PURPLE,
                        },
                      }}
                    />

                    {(editImage || selectedPost.imageUrl) && (
                      <div className="relative rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={editImage ? URL.createObjectURL(editImage) : getBackendImageUrl(selectedPost.imageUrl)}
                          alt="post"
                          className="w-full max-h-64 object-contain"
                        />
                        {editImage && (
                          <button
                            type="button"
                            onClick={() => setEditImage(null)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                    )}

                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<FiImage />}
                      sx={{
                        borderColor: LAVENDER,
                        color: PURPLE,
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: `${LAVENDER}15`,
                          borderColor: PURPLE,
                        },
                      }}
                    >
                      {editImage || selectedPost.imageUrl ? "Change Image" : "Add Image"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setEditImage(e.target.files[0])
                          }
                        }}
                      />
                    </Button>
                  </div>

                  <DialogActions sx={{ px: 0, pt: 4, gap: 2 }}>
                    <Button
                      onClick={() => {
                        setEditOpen(false)
                        setEditImage(null)
                      }}
                      variant="outlined"
                      sx={{
                        borderColor: "#e5e7eb",
                        color: "#6b7280",
                        borderRadius: 2,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                        color: WHITE,
                        borderRadius: 2,
                        px: 4,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${LAVENDER} 0%, ${PURPLE} 100%)`,
                        },
                      }}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
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

      {/* Posts Container - Bigger and wider */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white dark:bg-[#1b1a22] rounded-3xl shadow-2xl p-8 sm:p-12 md:p-16 w-full max-w-6xl">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Your Posts</h3>

            {/* Post Grid - 2 columns, bigger cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {postsArray.map((post) => {
                const { icon, label } = getPrivacyIcon(post.privacy)
                const username = post.userId?.username || user?.username || "Unknown User"
                const profilePhoto =
                  user?.profilePhoto && user.profilePhoto.trim() !== ""
                    ? getBackendImageUrl(user.profilePhoto)
                    : post.userId?.profilePhoto && post.userId.profilePhoto.trim() !== ""
                      ? getBackendImageUrl(post.userId.profilePhoto)
                      : DEFAULT_AVATAR
                const createdAt = formatFacebookDate(post.createdAt)

                // Better image URL handling
                const postImageUrl =
                  post.imageUrl && post.imageUrl.trim() !== "" ? getBackendImageUrl(post.imageUrl) : null

                return (
                  <div
                    key={post._id}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group cursor-pointer transform hover:scale-[1.02]"
                    onClick={() => openPostModal(post)}
                  >
                    {/* Edit/Delete Buttons */}
                    <div className="absolute top-4 right-4 flex gap-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:text-purple-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(post)
                        }}
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-600 hover:text-red-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(post)
                        }}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>

                    {/* Post Image - Bigger aspect ratio */}
                    {postImageUrl && (
                      <PostImage
                        src={postImageUrl}
                        alt={`Post by ${username}`}
                        className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                      />
                    )}

                    {/* Content - More spacious */}
                    <div className="p-6 space-y-4">
                      {/* User Info */}
                      <div className="flex items-center gap-4">
                        <img
                          src={profilePhoto || "/placeholder.svg"}
                          alt={`Avatar of ${username}`}
                          className="w-12 h-12 rounded-full object-cover border-2"
                          style={{ borderColor: LAVENDER }}
                          onError={(e) => {
                            e.target.src = DEFAULT_AVATAR
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-lg text-gray-900 dark:text-white truncate">{username}</span>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                              {icon}
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                            <FiCalendar size={14} />
                            <span>{createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Post Content - Bigger text */}
                      <div className="text-base text-gray-800 dark:text-gray-200 leading-relaxed">{post.content}</div>

                      {/* Actions - More spacious */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div onClick={(e) => e.stopPropagation()}>
                          <LikeButton postId={post._id} postOwnerId={post.userId?._id} />
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <CommentCount postId={post._id} openPostModal={() => openPostModal(post)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
