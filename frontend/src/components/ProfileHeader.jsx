import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { FiSettings, FiLogOut, FiEdit2 } from "react-icons/fi";
import { AuthContext } from "../auth/AuthProvider";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";

export default function ProfileHeader({ user, onUpdateUser }) {
  const [openEdit, setOpenEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const { logout } = useContext(AuthContext);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseSettings();
  };

  return (
    <div className="flex justify-center mt-6 px-4 sm:px-6 lg:px-8">
      <div
        className="
        bg-white dark:bg-[#1b1a22]
        rounded-3xl shadow-lg
        p-6 sm:p-10 md:p-12
        w-full max-w-4xl flex flex-col md:flex-row
        items-center md:items-start gap-10
        transition-all duration-300
      "
      >
        {/* Profile Image */}
        <div className="shrink-0">
          <img
            src={
              user.profilePhoto
                ? getBackendImageUrl(user.profilePhoto)
                : `https://ui-avatars.com/api/?background=ddd&color=888&name=${user.username}`
            }
            alt="profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-gray-200 shadow"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col w-full space-y-4">
          {/* Top Row: Name + Buttons */}
          <div className="flex justify-between items-start">
            <h1 className="text-2xl md:text-3xl font-bold">{user.username}</h1>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="small"
                startIcon={<FiEdit2 />}
                onClick={() => {
                  setPreviewPhoto(null);
                  setOpenEdit(true);
                }}
              >
                Edit Profile
              </Button>
              <IconButton onClick={handleSettingsClick}>
                <FiSettings />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseSettings}
                PaperProps={{
                  className: "dark:bg-[#2d2b3d] bg-white text-sm",
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <FiLogOut className="mr-2" /> Logout
                </MenuItem>
              </Menu>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 text-sm text-gray-700 dark:text-gray-300">
            <span>
              <b>{user.postCount}</b> posts
            </span>
            <span>
              <b>{user.followerCount}</b> followers
            </span>
            <span>
              <b>{user.followingCount}</b> following
            </span>
          </div>

          {/* Full Name + Bio */}
          <div className="space-y-1">
            <div className="font-semibold text-base">{user.fullName}</div>
            <p className="text-gray-700 dark:text-gray-200 text-sm break-words">
              {user.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Update Popup (Edit Profile) */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "20px",
            backgroundColor: "#fdfdfd",
            padding: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", fontSize: "1.4rem", color: "#333" }}
        >
          Edit Your Profile
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
            email: Yup.string()
              .email("Invalid email")
              .required("Email is required"),
            bio: Yup.string().max(300, "Bio must be under 300 characters"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append("username", values.username);
            formData.append("email", values.email);
            formData.append("bio", values.bio);
            if (values.profilePhoto) {
              formData.append("profilePhoto", values.profilePhoto);
            }
            onUpdateUser(formData);
            setSubmitting(false);
            setOpenEdit(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              <DialogContent dividers>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  margin="normal"
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  margin="normal"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  multiline
                  minRows={3}
                  value={values.bio}
                  onChange={handleChange}
                  margin="normal"
                  error={touched.bio && Boolean(errors.bio)}
                  helperText={touched.bio && errors.bio}
                />

                <div className="mt-4 mb-2">
                  <label className="text-sm font-medium text-gray-600">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="profilePhoto"
                    onChange={(e) => {
                      const file = e.currentTarget.files[0];
                      setFieldValue("profilePhoto", file);
                      setPreviewPhoto(URL.createObjectURL(file));
                    }}
                    style={{ display: "block", marginTop: 8 }}
                  />
                </div>

                {(previewPhoto || user.profilePhoto) && (
                  <Avatar
                    src={previewPhoto || getBackendImageUrl(user.profilePhoto)}
                    alt="Profile Preview"
                    sx={{ width: 80, height: 80, mt: 2 }}
                  />
                )}
              </DialogContent>

              <DialogActions>
                <Button
                  onClick={() => setOpenEdit(false)}
                  disabled={isSubmitting}
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ textTransform: "none" }}
                >
                  Save Changes
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
}
