"use client"

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Avatar, IconButton } from "@mui/material"
import { FiX, FiCamera, FiUser, FiMail, FiEdit3 } from "react-icons/fi"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { getBackendImageUrl } from "../utils/getBackendImageUrl"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function EditProfileDialog({ open, setOpen, user, onUpdateUser, previewPhoto, setPreviewPhoto }) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
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
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          color: WHITE,
          fontWeight: "bold",
          fontSize: "1.5rem",
          position: "relative",
          textAlign: "center",
          py: 3,
        }}
      >
        <FiEdit3 style={{ marginRight: 8, display: "inline" }} />
        Edit Your Profile
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: WHITE,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <FiX size={20} />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={{
          username: user.username || "",
          email: user.email || "",
          bio: user.bio || "",
          profilePhoto: null,
        }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          email: Yup.string().email("Invalid email").required("Email is required"),
          bio: Yup.string().max(300, "Bio must be under 300 characters"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData = new FormData()
          formData.append("username", values.username)
          formData.append("email", values.email)
          formData.append("bio", values.bio)
          if (values.profilePhoto) {
            formData.append("profilePhoto", values.profilePhoto)
          }
          onUpdateUser(formData)
          setSubmitting(false)
          setOpen(false)
        }}
      >
        {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent sx={{ py: 4, px: 4 }}>
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <Avatar
                    src={previewPhoto || getBackendImageUrl(user.profilePhoto)}
                    alt="Profile Preview"
                    sx={{
                      width: 120,
                      height: 120,
                      border: `4px solid ${LAVENDER}`,
                      boxShadow: `0 8px 32px ${PURPLE}20`,
                    }}
                  />
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <IconButton
                      component="label"
                      sx={{
                        backgroundColor: WHITE,
                        color: PURPLE,
                        "&:hover": {
                          backgroundColor: LAVENDER,
                          color: WHITE,
                        },
                      }}
                    >
                      <FiCamera size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.currentTarget.files[0]
                          setFieldValue("profilePhoto", file)
                          setPreviewPhoto(URL.createObjectURL(file))
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to change profile photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="relative">
                  <FiUser
                    size={20}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: PURPLE,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        paddingLeft: "48px",
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
                </div>

                <div className="relative">
                  <FiMail
                    size={20}
                    style={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: PURPLE,
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        paddingLeft: "48px",
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
                </div>

                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  rows={4}
                  value={values.bio}
                  onChange={handleChange}
                  error={touched.bio && Boolean(errors.bio)}
                  helperText={touched.bio && errors.bio}
                  placeholder="Tell us about yourself..."
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
              </div>
            </DialogContent>

            <DialogActions sx={{ px: 4, pb: 4, gap: 2 }}>
              <Button
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderColor: "#e5e7eb",
                  color: "#6b7280",
                  fontWeight: "500",
                  borderRadius: 2,
                  px: 3,
                  "&:hover": {
                    borderColor: "#d1d5db",
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  textTransform: "none",
                  background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
                  color: WHITE,
                  fontWeight: "600",
                  borderRadius: 2,
                  px: 4,
                  boxShadow: `0 4px 15px ${PURPLE}40`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${LAVENDER} 0%, ${PURPLE} 100%)`,
                    boxShadow: `0 6px 20px ${PURPLE}50`,
                  },
                }}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
