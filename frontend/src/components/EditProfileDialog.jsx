import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getBackendImageUrl } from "../utils/getBackendImageUrl";

export default function EditProfileDialog({
  open,
  setOpen,
  user,
  onUpdateUser,
  previewPhoto,
  setPreviewPhoto,
}) {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
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
          setOpen(false);
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
                onClick={() => setOpen(false)}
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
  );
}
