import React, { useState, useMemo } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Paper, Avatar, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// Helper to get backend image
const getImageUrl = (filename) => {
  if (!filename) return "";
  const clean = filename.replace(/^[/\\]+/, "");
  return `http://localhost:2000/${clean}`;
};

const EditUserSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.string().required("Role is required"),
});

const ROLE_OPTIONS = [
  "student",
  "facultymember",
  "marketing dep",
  "teaching assistant"
];

export default function UserTableComponent({ users, onUpdate, onDelete }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editImage, setEditImage] = useState(null);

  // Stable: only recompute user when id changes
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
    <Paper sx={{ width: "100%", overflow: "auto", p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Photo</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell align="center">Actions</TableCell>
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
                        ? getImageUrl(user.profilePhoto)
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`
                    }
                    alt={user.username}
                  />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => handleEdit(user)}
                    sx={{ mr: 1 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => onDelete(user)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Modal */}
      <Dialog open={openEdit} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
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
              enableReinitialize={false}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                  <Field
                    as={TextField}
                    margin="dense"
                    label="Username"
                    name="username"
                    fullWidth
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.username && Boolean(errors.username)}
                    helperText={touched.username && errors.username}
                  />
                  <Field
                    as={TextField}
                    margin="dense"
                    label="Email"
                    name="email"
                    fullWidth
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    select
                    margin="dense"
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
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Image preview */}
                  {(editImage || editingUser.profilePhoto) && (
                    <img
                      src={
                        editImage
                          ? URL.createObjectURL(editImage)
                          : getImageUrl(editingUser.profilePhoto)
                      }
                      alt="User"
                      style={{ width: "100%", marginTop: 16, marginBottom: 8 }}
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setEditImage(e.target.files[0]);
                    }}
                    style={{ marginTop: 8 }}
                  />

                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
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
    </Paper>
  );
}
