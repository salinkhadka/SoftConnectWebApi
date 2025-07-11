"use client"

import { useState } from "react"
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Chip,
  Avatar,
} from "@mui/material"
import { FiEye, FiEdit2, FiTrash2, FiImage, FiCalendar } from "react-icons/fi"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import DeleteModal from "../DeleteModal"
import { getBackendImageUrl } from "../../utils/getBackendImageUrl"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const EditSchema = Yup.object({
  content: Yup.string().required("Content is required"),
})

const PostTable = ({ posts, onDelete, onUpdate }) => {
  const [openView, setOpenView] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [editImage, setEditImage] = useState(null)

  const handleView = (post) => {
    setSelectedPost(post)
    setOpenView(true)
  }

  const handleEdit = (post) => {
    setSelectedPost(post)
    setEditImage(null)
    setOpenEdit(true)
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

  const getPrivacyChip = (privacy) => {
    const configs = {
      public: { color: "#10b981", label: "Public" },
      friends: { color: "#3b82f6", label: "Friends" },
      private: { color: "#ef4444", label: "Private" },
    }
    const config = configs[privacy] || configs.public
    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          backgroundColor: `${config.color}15`,
          color: config.color,
          fontWeight: "600",
          fontSize: "0.75rem",
        }}
      />
    )
  }

  return (
    <>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: `0 8px 32px ${PURPLE}15`,
          border: `1px solid ${LAVENDER}30`,
        }}
        className="bg-white dark:bg-gray-800"
      >
        <div
          className="px-6 py-4 border-b"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
            borderColor: `${LAVENDER}40`,
          }}
        >
          <Typography variant="h6" sx={{ color: WHITE, fontWeight: "bold" }}>
            Posts Management
          </Typography>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }} className="dark:bg-gray-700">
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">Image</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">Author</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">Content</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">Privacy</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">Created</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} align="center" className="dark:text-purple-300">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts && posts.length ? (
                posts.map((post) => (
                  <TableRow
                    key={post._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: `${LAVENDER}08`,
                      },
                    }}
                    className="dark:hover:bg-gray-700"
                  >
                    <TableCell>
                      {post.imageUrl ? (
                        <Avatar
                          src={getBackendImageUrl(post.imageUrl)}
                          alt="post"
                          variant="rounded"
                          sx={{ width: 60, height: 60 }}
                        />
                      ) : (
                        <div className="w-15 h-15 bg-gray-100 rounded-lg flex items-center justify-center dark:bg-gray-700">
                          <FiImage size={24} className="text-gray-400 dark:text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={
                            post.userId?.profilePhoto
                              ? getBackendImageUrl(post.userId.profilePhoto)
                              : `https://ui-avatars.com/api/?name=${post.userId?.username || "U"}`
                          }
                          sx={{ width: 32, height: 32 }}
                        />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{post.userId?.username || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="truncate text-sm text-gray-800 dark:text-gray-300">{post.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getPrivacyChip(post.privacy)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <FiCalendar size={14} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleView(post)}
                          startIcon={<FiEye size={14} />}
                          sx={{
                            minWidth: "auto",
                            px: 1.5,
                            borderColor: "#10b981",
                            color: "#10b981",
                            "&:hover": {
                              backgroundColor: "#10b98115",
                            },
                          }}
                          className="dark:text-green-400"
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEdit(post)}
                          startIcon={<FiEdit2 size={14} />}
                          sx={{
                            minWidth: "auto",
                            px: 1.5,
                            borderColor: PURPLE,
                            color: PURPLE,
                            "&:hover": {
                              backgroundColor: `${PURPLE}15`,
                            },
                          }}
                          className="dark:text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleDelete(post)}
                          startIcon={<FiTrash2 size={14} />}
                          sx={{
                            minWidth: "auto",
                            px: 1.5,
                            borderColor: "#ef4444",
                            color: "#ef4444",
                            "&:hover": {
                              backgroundColor: "#ef444415",
                            },
                          }}
                          className="dark:text-red-500"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <div className="text-center">
                      <FiImage size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                      <Typography variant="h6" color="text.secondary" className="dark:text-gray-400">
                        No posts found
                      </Typography>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>

      {/* View Modal */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 20px 60px ${PURPLE}20`,
          },
          className: "bg-white dark:bg-gray-800",
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
            color: WHITE,
            fontWeight: "bold",
          }}
        >
          View Post
        </DialogTitle>
        <DialogContent sx={{ p: 4 }} className="bg-white dark:bg-gray-800">
          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar
                  src={
                    selectedPost.userId?.profilePhoto
                      ? getBackendImageUrl(selectedPost.userId.profilePhoto)
                      : `https://ui-avatars.com/api/?name=${selectedPost.userId?.username || "U"}`
                  }
                />
                <div>
                  <Typography variant="subtitle1" fontWeight="bold" className="text-gray-900 dark:text-gray-100">
                    {selectedPost.userId?.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" className="dark:text-gray-400">
                    {new Date(selectedPost.createdAt).toLocaleString()}
                  </Typography>
                </div>
              </div>
              <Typography variant="body1" className="text-gray-800 dark:text-gray-300">{selectedPost.content}</Typography>
              {selectedPost.imageUrl && (
                <img
                  src={getBackendImageUrl(selectedPost.imageUrl) || "/placeholder.svg"}
                  alt="post"
                  className="w-full rounded-lg max-h-96 object-contain bg-gray-100 dark:bg-gray-700"
                />
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }} className="bg-white dark:bg-gray-800">
          <Button onClick={() => setOpenView(false)} variant="outlined" className="dark:text-white">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={openEdit}
        onClose={() => {
          setOpenEdit(false)
          setEditImage(null)
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 20px 60px ${PURPLE}20`,
          },
          className: "bg-white dark:bg-gray-800",
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
            color: WHITE,
            fontWeight: "bold",
          }}
        >
          Edit Post
        </DialogTitle>
        <DialogContent sx={{ p: 4 }} className="bg-white dark:bg-gray-800">
          {selectedPost && (
            <Formik
              initialValues={{
                content: selectedPost.content,
              }}
              validationSchema={EditSchema}
              onSubmit={(values, { setSubmitting }) => {
                const formData = new FormData()
                formData.append("content", values.content)
                if (editImage) formData.append("imageUrl", editImage)

                onUpdate(selectedPost._id, formData)
                setSubmitting(false)
                setOpenEdit(false)
                setSelectedPost(null)
                setEditImage(null)
              }}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar
                        src={
                          selectedPost.userId?.profilePhoto
                            ? getBackendImageUrl(selectedPost.userId.profilePhoto)
                            : `https://ui-avatars.com/api/?name=${selectedPost.userId?.username || "U"}`
                        }
                      />
                      <Typography variant="subtitle1" fontWeight="bold" className="text-gray-900 dark:text-gray-100">
                        {selectedPost.userId?.username}
                      </Typography>
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
                          backgroundColor: "white",
                          color: "black",
                          "&:hover fieldset": {
                            borderColor: LAVENDER,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: PURPLE,
                          },
                        },
                        ".MuiInputLabel-root": {
                          color: "black",
                          "&.Mui-focused": {
                            color: PURPLE,
                          },
                        },
                        ".MuiFormHelperText-root": {
                          color: "red",
                        },
                        ".MuiOutlinedInput-root.Mui-focused": {
                          backgroundColor: "white",
                        },
                      }}
                      className="[&_.MuiOutlinedInput-root]:bg-white dark:[&_.MuiOutlinedInput-root]:bg-gray-700 [&_.MuiOutlinedInput-root]:text-gray-900 dark:[&_.MuiOutlinedInput-root]:text-gray-100 [&_.MuiInputLabel-root]:text-gray-700 dark:[&_.MuiInputLabel-root]:text-gray-300 [&_input]:text-gray-900 dark:[&_input]:text-gray-100"
                    />

                    {(editImage || selectedPost.imageUrl) && (
                      <div className="relative">
                        <img
                          src={editImage ? URL.createObjectURL(editImage) : getBackendImageUrl(selectedPost.imageUrl)}
                          alt="post"
                          className="w-full rounded-lg max-h-64 object-contain bg-gray-100 dark:bg-gray-700"
                        />
                      </div>
                    )}

                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<FiImage />}
                      sx={{
                        borderColor: LAVENDER,
                        color: PURPLE,
                        "&:hover": {
                          backgroundColor: `${LAVENDER}15`,
                        },
                      }}
                      className="dark:text-purple-300"
                    >
                      Change Image
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

                  <DialogActions sx={{ px: 0, pt: 3 }} className="bg-white dark:bg-gray-800">
                    <Button
                      onClick={() => {
                        setOpenEdit(false)
                        setEditImage(null)
                      }}
                      variant="outlined"
                      className="dark:text-gray-300 dark:border-gray-400 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                        "&:hover": {
                          background: `linear-gradient(135deg, ${LAVENDER} 0%, ${PURPLE} 100%)`,
                        },
                        "&:disabled": {
                          background: "#9ca3af",
                        },
                      }}
                    >
                      Save Changes
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

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
    </>
  )
}

export default PostTable
