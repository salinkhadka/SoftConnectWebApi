"use client"

import { useState, useContext } from "react"
import { Avatar, TextField, Button, Typography, IconButton, Chip } from "@mui/material"
import { FiImage, FiX, FiGlobe, FiUsers, FiLock } from "react-icons/fi"
import { AuthContext } from "../../auth/AuthProvider"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useCreatePost } from "../../hooks/Admin/createPost"
import { getBackendImageUrl } from "../../utils/getBackendImageUrl"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const AddPostSchema = Yup.object({
  content: Yup.string().required("Content is required"),
  privacy: Yup.string().required("Privacy setting is required"),
})

const privacyOptions = [
  { value: "public", label: "Public", icon: <FiGlobe size={16} />, color: "#10b981" },
  { value: "friends", label: "Friends", icon: <FiUsers size={16} />, color: "#3b82f6" },
  { value: "private", label: "Private", icon: <FiLock size={16} />, color: "#ef4444" },
]

const AddPostComponent = () => {
  const { user } = useContext(AuthContext)
  const createPost = useCreatePost()
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleRemoveImage = () => {
    setImage(null)
    setPreviewUrl(null)
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-300 rounded-lg">
      <Formik
        initialValues={{ content: "", privacy: "friends" }}
        validationSchema={AddPostSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          const formData = new FormData()
          formData.append("userId", user._id)
          formData.append("content", values.content)
          formData.append("privacy", values.privacy)
          if (image) formData.append("imageUrl", image)

          createPost.mutate(formData, {
            onSuccess: () => {
              resetForm()
              setImage(null)
              setPreviewUrl(null)
              setSubmitting(false)
            },
            onError: () => setSubmitting(false),
          })
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
          <Form>
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar
                  src={
                    user?.avatar ||
                    (user?.profilePhoto ? getBackendImageUrl(user.profilePhoto) : null) ||
                    `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${user?.username || "User"}`
                  }
                  alt={user?.username}
                  sx={{
                    width: 64,
                    height: 64,
                    border: `3px solid ${LAVENDER}`,
                    boxShadow: `0 4px 15px ${PURPLE}20`,
                    bgcolor: (theme) => theme.palette.mode === "dark" ? "#2a2a2a" : undefined,
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: PURPLE,
                    fontSize: "1.25rem",
                  }}
                  className="dark:text-purple-300"
                >
                  {user?.username || "User"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="dark:text-gray-400"
                >
                  What's on your mind?
                </Typography>
              </div>
            </div>

            {/* Content Input */}
            <TextField
              name="content"
              placeholder={`What's happening, ${user?.username || "User"}?`}
              fullWidth
              multiline
              minRows={4}
              maxRows={8}
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.content && Boolean(errors.content)}
              helperText={touched.content && errors.content}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "#1e293b" : "inherit"),
                  color: (theme) => (theme.palette.mode === "dark" ? "#e0e0e0" : "inherit"),
                  "&:hover fieldset": {
                    borderColor: LAVENDER,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: PURPLE,
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: PURPLE,
                },
                "& .MuiFormHelperText-root": {
                  color: (theme) => (theme.palette.mode === "dark" ? "#f87171" : undefined),
                },
              }}
            />

            {/* Privacy Selection */}
            <div className="mb-4">
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "600", color: PURPLE }} className="dark:text-purple-300">
                Who can see this post?
              </Typography>
              <div className="flex gap-2 flex-wrap">
                {privacyOptions.map((option) => (
                  <Chip
                    key={option.value}
                    icon={option.icon}
                    label={option.label}
                    onClick={() => setFieldValue("privacy", option.value)}
                    variant={values.privacy === option.value ? "filled" : "outlined"}
                    sx={{
                      borderColor: option.color,
                      color: values.privacy === option.value ? WHITE : option.color,
                      backgroundColor: values.privacy === option.value ? option.color : "transparent",
                      fontWeight: "600",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: values.privacy === option.value ? option.color : `${option.color}15`,
                      },
                      ...(values.privacy === option.value && {
                        boxShadow: `0 0 8px ${option.color}AA`,
                      }),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mb-4 relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full max-h-80 object-contain"
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    color: WHITE,
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.8)",
                    },
                  }}
                  aria-label="Remove image"
                >
                  <FiX size={20} />
                </IconButton>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outlined"
                component="label"
                startIcon={<FiImage />}
                sx={{
                  textTransform: "none",
                  fontWeight: "600",
                  borderColor: LAVENDER,
                  color: PURPLE,
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    backgroundColor: `${LAVENDER}15`,
                    borderColor: PURPLE,
                  },
                }}
              >
                Add Photo
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!values.content.trim() || isSubmitting || createPost.isPending}
                sx={{
                  textTransform: "none",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                  boxShadow: `0 4px 15px ${PURPLE}40`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${LAVENDER} 0%, ${PURPLE} 100%)`,
                    boxShadow: `0 6px 20px ${PURPLE}50`,
                  },
                  "&:disabled": {
                    background: "#e5e7eb",
                    color: "#9ca3af",
                  },
                }}
              >
                {isSubmitting || createPost.isPending ? "Posting..." : "Share Post"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddPostComponent
