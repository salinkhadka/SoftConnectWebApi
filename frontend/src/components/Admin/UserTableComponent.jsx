"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Typography,
} from "@mui/material"
import { FiEdit2, FiTrash2, FiUser, FiMail, FiCalendar, FiCamera } from "react-icons/fi"
import { getBackendImageUrl } from "../../utils/getBackendImageUrl"
import { Formik, Form } from "formik"
import * as Yup from "yup"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const EditUserSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
})

const ROLE_OPTIONS = ["student", "facultymember", "marketing dep", "teaching assistant"]

const getRoleChip = (role) => {
  const colors = {
    student: "#3b82f6",
    facultymember: "#10b981",
    "marketing dep": "#f59e0b",
    "teaching assistant": "#8b5cf6",
  }
  const color = colors[role] || "#6b7280"
  return (
    <Chip
      label={role}
      size="small"
      sx={{
        backgroundColor: `${color}15`,
        color: color,
        fontWeight: "600",
        textTransform: "capitalize",
      }}
    />
  )
}

export default function UserTableComponent({ users, onUpdate, onDelete }) {
  const [openEdit, setOpenEdit] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [editImage, setEditImage] = useState(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const editingUser = useMemo(() => users.find((u) => u._id === editingUserId), [editingUserId, users])

  const handleEdit = (user) => {
    setEditingUserId(user._id)
    setOpenEdit(true)
    setEditImage(null)
  }

  const handleClose = () => {
    setOpenEdit(false)
    setEditingUserId(null)
    setEditImage(null)
  }

  return (
    <div className="w-full">
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: `0 8px 32px ${PURPLE}15`,
          border: `1px solid ${LAVENDER}30`,
          backgroundColor: "var(--paper-bg)",
        }}
        className="bg-white dark:bg-gray-800"
      >
        <div
          className="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <Typography variant="h6" sx={{ color: WHITE, fontWeight: "bold" }}>
            Users Management
          </Typography>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50 dark:bg-gray-700">
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">
                  Photo
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">
                  Username
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">
                  Email
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">
                  Role
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">
                  Created At
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} className="dark:text-purple-300">
                  Updated At
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} align="center" className="dark:text-purple-300">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.length ? (
                users.map((user) => (
                  <TableRow key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <TableCell>
                      <Avatar
                        src={
                          user.profilePhoto
                            ? getBackendImageUrl(user.profilePhoto)
                            : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${encodeURIComponent(user.username)}`
                        }
                        alt={user.username}
                        sx={{
                          width: 48,
                          height: 48,
                          border: `2px solid ${LAVENDER}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FiUser size={16} style={{ color: PURPLE }} />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FiMail size={16} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <FiCalendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <FiCalendar size={14} />
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(user)}
                          startIcon={<FiEdit2 size={14} />}
                          sx={{
                            minWidth: "auto",
                            px: 1.5,
                            borderColor: PURPLE,
                            color: PURPLE,
                            "&:hover": {
                              backgroundColor: `${PURPLE}15`,
                              borderColor: PURPLE,
                            },
                          }}
                          className="text-purple-700 dark:text-white"
                        >
                          Update
                        </Button>


                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setUserToDelete(user)
                            setOpenDelete(true)
                          }}
                          startIcon={<FiTrash2 size={14} />}
                          sx={{
                            minWidth: "auto",
                            px: 1.5,
                            borderColor: "#ef4444",
                            color: "#ef4444",
                            "&:hover": {
                              backgroundColor: "#ef444415",
                              borderColor: "#ef4444",
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <div className="text-center">
                      <FiUser size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                      <Typography variant="h6" className="text-gray-500 dark:text-gray-400">
                        No users found
                      </Typography>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit}
        onClose={handleClose}
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
            textAlign: "center",
          }}
        >
          Edit User Profile
        </DialogTitle>
        <DialogContent sx={{ p: 4 }} className="bg-white dark:bg-gray-800">
          {editingUser && (
            <Formik
              initialValues={{
                username: editingUser.username || "",
                email: editingUser.email || "",
                role: editingUser.role || "",
              }}
              validationSchema={EditUserSchema}
              onSubmit={(values, { setSubmitting }) => {
                const formData = new FormData()
                Object.entries(values).forEach(([k, v]) => formData.append(k, v))
                if (editImage) formData.append("profilePhoto", editImage)
                onUpdate(editingUser._id, formData)
                setSubmitting(false)
                handleClose()
              }}
              enableReinitialize={true}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <div className="space-y-4">
                    {/* Profile Photo Section */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative group">
                        <Avatar
                          src={
                            editImage
                              ? URL.createObjectURL(editImage)
                              : editingUser.profilePhoto
                                ? getBackendImageUrl(editingUser.profilePhoto)
                                : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${editingUser.username}`
                          }
                          alt="User"
                          sx={{
                            width: 100,
                            height: 100,
                            border: `3px solid ${LAVENDER}`,
                            boxShadow: `0 4px 15px ${PURPLE}20`,
                          }}
                        />
                        <Button
                          component="label"
                          sx={{
                            position: "absolute",
                            bottom: -8,
                            right: -8,
                            minWidth: "auto",
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            backgroundColor: PURPLE,
                            color: WHITE,
                            "&:hover": {
                              backgroundColor: LAVENDER,
                            },
                          }}
                        >
                          <FiCamera size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                              if (e.target.files?.[0]) setEditImage(e.target.files[0])
                            }}
                          />
                        </Button>
                      </div>
                      <Typography variant="caption" className="text-gray-500 dark:text-gray-400 mt-2">
                        Click camera to change photo
                      </Typography>
                    </div>

                    <TextField
                      label="Username"
                      name="username"
                      fullWidth
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && Boolean(errors.username)}
                      helperText={touched.username && errors.username}
                      sx={{
                        "& .MuiOutlinedInput-root": {
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
                      className="[&_.MuiOutlinedInput-root]:bg-white dark:[&_.MuiOutlinedInput-root]:bg-gray-700 [&_.MuiInputLabel-root]:text-gray-700 dark:[&_.MuiInputLabel-root]:text-gray-300 [&_input]:text-gray-900 dark:[&_input]:text-gray-100"
                    />

                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      sx={{
                        "& .MuiOutlinedInput-root": {
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
                      className="[&_.MuiOutlinedInput-root]:bg-white dark:[&_.MuiOutlinedInput-root]:bg-gray-700 [&_.MuiInputLabel-root]:text-gray-700 dark:[&_.MuiInputLabel-root]:text-gray-300 [&_input]:text-gray-900 dark:[&_input]:text-gray-100"
                    />

                    <TextField
                      select
                      label="Role"
                      name="role"
                      fullWidth
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.role && Boolean(errors.role)}
                      helperText={touched.role && errors.role}
                      sx={{
                        "& .MuiOutlinedInput-root": {
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
                      className="[&_.MuiOutlinedInput-root]:bg-white dark:[&_.MuiOutlinedInput-root]:bg-gray-700 [&_.MuiInputLabel-root]:text-gray-700 dark:[&_.MuiInputLabel-root]:text-gray-300 [&_input]:text-gray-900 dark:[&_input]:text-gray-100"
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <MenuItem key={option} value={option} className="dark:bg-gray-700 dark:text-gray-100">
                          <div className="flex items-center gap-2">{getRoleChip(option)}</div>
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>

                  <DialogActions sx={{ px: 0, pt: 4, gap: 2 }}>
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      sx={{
                        borderColor: "#6b7280",
                        color: "#6b7280",
                        "&:hover": {
                          borderColor: "#4b5563",
                          backgroundColor: "#f9fafb",
                        },
                      }}
                      className="dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-700"
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
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 20px 60px ${PURPLE}20`,
          },
          className: "bg-white dark:bg-gray-800",
        }}
      >
        <DialogTitle sx={{ textAlign: "center", color: "#ef4444", fontWeight: "bold" }}>Confirm Deletion</DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 3 }} className="bg-white dark:bg-gray-800">
          <Avatar
            src={
              userToDelete?.profilePhoto
                ? getBackendImageUrl(userToDelete.profilePhoto)
                : `https://ui-avatars.com/api/?name=${userToDelete?.username}`
            }
            sx={{ width: 64, height: 64, mx: "auto", mb: 2 }}
          />
          <Typography className="text-gray-900 dark:text-gray-100">
            Are you sure you want to delete user <strong>{userToDelete?.username}</strong>?
          </Typography>
          <Typography variant="body2" className="text-gray-500 dark:text-gray-400 mt-2">
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }} className="bg-white dark:bg-gray-800">
          <Button
            onClick={() => setOpenDelete(false)}
            variant="outlined"
            sx={{
              borderColor: "#6b7280",
              color: "#6b7280",
              "&:hover": {
                borderColor: "#4b5563",
                backgroundColor: "#f9fafb",
              },
            }}
            className="dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (userToDelete) {
                onDelete(userToDelete)
                setOpenDelete(false)
                setUserToDelete(null)
              }
            }}
            variant="contained"
            sx={{
              backgroundColor: "#ef4444",
              "&:hover": {
                backgroundColor: "#dc2626",
              },
            }}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
