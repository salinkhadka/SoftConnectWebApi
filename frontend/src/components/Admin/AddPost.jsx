import React, { useState, useContext } from "react";
import { Paper, Avatar, TextField, Button, Box, MenuItem } from "@mui/material";
import { AuthContext } from "../../auth/AuthProvider"; // Adjust path if needed
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreatePost } from "../../hooks/Admin/createPost"; // Adjust path if needed

const AddPostSchema = Yup.object({
  content: Yup.string().required("What's on your mind?"),
  privacy: Yup.string().oneOf(["public", "private", "friends"], "Invalid privacy").required(),
});

const AddPostComponent = () => {
  const { user } = useContext(AuthContext);
  const createPost = useCreatePost();

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  return (
    <Paper sx={{ p: 2, mb: 2, maxWidth: 500, mx: "auto" }} elevation={2}>
      <Box display="flex" gap={2}>
        <Avatar
          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || "User"}`}
          alt={user?.username || "User"}
        />
        <Formik
          initialValues={{ content: "", privacy: "public" }}
          validationSchema={AddPostSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            const formData = new FormData();
            formData.append("userId", user._id); // from AuthContext!
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
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form style={{ flex: 1 }}>
              <TextField
                name="content"
                placeholder={`What's on your mind${user?.username ? `, ${user.username}` : ""}?`}
                fullWidth
                multiline
                minRows={2}
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.content && Boolean(errors.content)}
                helperText={touched.content && errors.content}
                sx={{ mb: 1 }}
              />
              <TextField
                select
                name="privacy"
                label="Privacy"
                value={values.privacy}
                onChange={handleChange}
                sx={{ mb: 1 }}
                size="small"
                fullWidth
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="friends">Friends</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </TextField>
              {previewUrl && (
                <Box mb={1}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: "100%", borderRadius: 8 }}
                  />
                </Box>
              )}
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                        setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </Button>
                <Box flex={1} />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!values.content.trim() || isSubmitting || createPost.isPending}
                >
                  Post
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Paper>
  );
};

export default AddPostComponent;
