import React, { useState, useContext } from "react";
import {
  Paper, Avatar, TextField, Button, Box, Typography
} from "@mui/material";
import { AuthContext } from "../../auth/AuthProvider";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreatePost } from "../../hooks/Admin/createPost";

const AddPostSchema = Yup.object({
  content: Yup.string().required(),
  privacy: Yup.string().required(),
});

const AddPostComponent = () => {
  const { user } = useContext(AuthContext);
  const createPost = useCreatePost();

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  return (
    <Paper
      sx={{
        p: 3,
        maxWidth: 750,
        mx: "auto",
        borderRadius: 4,
        mt: 4,
      }}
      elevation={2}
    >
      <Formik
        initialValues={{ content: "", privacy: "friends" }}
        validationSchema={AddPostSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          const formData = new FormData();
          formData.append("userId", user._id);
          formData.append("content", values.content);
          formData.append("privacy", values.privacy);
          if (image) formData.append("imageUrl", image);

          createPost.mutate(formData, {
            onSuccess: () => {
              resetForm();
              setImage(null);
              setPreviewUrl(null);
              setSubmitting(false);
            },
            onError: () => setSubmitting(false),
          });
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
          <Form>
            {/* Avatar and Username */}
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.username || "User"}`
                }
                alt={user?.username}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <Typography fontWeight={600} fontSize="1.5rem">
                {user?.username}
              </Typography>
            </Box>

            {/* Content Input */}
            <TextField
              name="content"
              placeholder={`What's on your mind, ${user?.username || "User"}?`}
              fullWidth
              multiline
              minRows={4}
              value={values.content}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.content && Boolean(errors.content)}
              helperText={touched.content && errors.content}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: "1.2rem" },
              }}
              sx={{ mb: 2 }}
            />

            {/* Image Preview and Remove Button */}
            {previewUrl && (
              <Box mb={2}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    borderRadius: 10,
                    objectFit: "contain",
                    marginBottom: 10,
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleRemoveImage}
                  sx={{ fontSize: "0.9rem", textTransform: "none" }}
                >
                  Remove Image
                </Button>
              </Box>
            )}

            {/* Buttons */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              borderTop="1px solid #ccc"
              pt={2}
            >
              <Button
                variant="text"
                component="label"
                sx={{
                  textTransform: "none",
                  color: "#1877F2",
                  fontWeight: 500,
                  fontSize: "1.2rem",
                }}
              >
                Add image to your post
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={
                  !values.content.trim() || isSubmitting || createPost.isPending
                }
                sx={{
                  fontSize: "1.2rem",
                  px: 4,
                  py: 1.5,
                }}
              >
                Post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default AddPostComponent;
