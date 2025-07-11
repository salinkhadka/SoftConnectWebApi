"use client";

import React, { useState, useMemo } from "react";
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
} from "@mui/material";
import {
  FiEdit2,
  FiTrash2,
  FiUser,
  FiMail,
  FiCalendar,
  FiCamera,
} from "react-icons/fi";
import { getBackendImageUrl } from "../../utils/getBackendImageUrl";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const PURPLE = "#37225C";
const LAVENDER = "#B8A6E6";
const WHITE = "#FFFFFF";

const EditUserSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
});

const ROLE_OPTIONS = ["student", "facultymember", "marketing dep", "teaching assistant"];

const getRoleChip = (role) => {
  const colors = {
    student: "#3b82f6",
    facultymember: "#10b981",
    "marketing dep": "#f59e0b",
    "teaching assistant": "#8b5cf6",
  };
  const color = colors[role] || "#6b7280";
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
  );
};

export default function UserTableComponent({ users, onUpdate, onDelete }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const editingUser = useMemo(
    () => users.find((u) => u._id === editingUserId),
    [editingUserId, users]
  );

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setOpenEdit(true);
    setEditImage(null);
  };

  const handleClose = () => {
    setOpenEdit(false);
    setEditingUserId(null);
    setEditImage(null);
  };

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
      >
        <div
          className="px-6 py-4 border-b"
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
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }}>Photo</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }}>Updated At</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: PURPLE }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.length ? (
                users.map((user) => (
                  <TableRow key={user._id}>
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
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(user)}
                        startIcon={<FiEdit2 size={14} />}
                        sx={{
                          px: 1.5,
                          mr: 1,
                          borderColor: PURPLE,
                          color: PURPLE,
                          "&:hover": {
                            backgroundColor: `${PURPLE}15`,
                          },
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setUserToDelete(user);
                          setOpenDelete(true);
                        }}
                        startIcon={<FiTrash2 size={14} />}
                        sx={{
                          px: 1.5,
                          borderColor: "#ef4444",
                          color: "#ef4444",
                          "&:hover": {
                            backgroundColor: "#ef444415",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <div className="text-center">
                      <FiUser size={48} className="mx-auto mb-4 text-gray-400" />
                      <Typography variant="h6" color="text.secondary">
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
      <Dialog open={openEdit} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {editingUser && (
            <Formik
              initialValues={{
                username: editingUser.username || "",
                email: editingUser.email || "",
                role: editingUser.role || "",
              }}
              validationSchema={EditUserSchema}
              onSubmit={(values, { setSubmitting }) => {
                const formData = new FormData();
                Object.entries(values).forEach(([k, v]) => formData.append(k, v));
                if (editImage) formData.append("profilePhoto", editImage);

                onUpdate(editingUser._id, formData);
                setSubmitting(false);
                handleClose();
              }}
              enableReinitialize={true}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <div className="flex flex-col items-center mb-4">
                    <Avatar
                      src={
                        editImage
                          ? URL.createObjectURL(editImage)
                          : editingUser.profilePhoto
                            ? getBackendImageUrl(editingUser.profilePhoto)
                            : `https://ui-avatars.com/api/?background=${LAVENDER.slice(1)}&color=${PURPLE.slice(1)}&name=${editingUser.username}`
                      }
                      sx={{
                        width: 100,
                        height: 100,
                        border: `3px solid ${LAVENDER}`,
                        boxShadow: `0 4px 15px ${PURPLE}20`,
                        mb: 2,
                      }}
                    />
                    <Button
                      component="label"
                      variant="contained"
                      sx={{
                        backgroundColor: PURPLE,
                        "&:hover": { backgroundColor: LAVENDER },
                      }}
                    >
                      <FiCamera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          if (e.target.files?.[0]) setEditImage(e.target.files[0]);
                        }}
                      />
                    </Button>
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
                    sx={{ mb: 2 }}
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
                    sx={{ mb: 2 }}
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
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {getRoleChip(option)}
                      </MenuItem>
                    ))}
                  </TextField>

                  <DialogActions sx={{ mt: 3 }}>
                    <Button onClick={handleClose} variant="outlined">
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      Save Changes
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user <strong>{userToDelete?.username}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (userToDelete) {
                onDelete(userToDelete);
                setOpenDelete(false);
                setUserToDelete(null);
              }
            }}
            color="error"
            variant="contained"
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
