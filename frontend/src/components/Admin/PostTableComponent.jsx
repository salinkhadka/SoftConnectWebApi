import React, { useState } from "react";
// import {getBackendImageUrl}=require("../../utils/getBackendImageUrl");

import {
  Button, Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField
} from "@mui/material";
// import DeleteModal from "../DeleteModal";
import DeleteModal from "../DeleteModal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const getImageUrl = (filename) => {
  if (!filename) return "";
  const clean = filename.replace(/^[/\\]+/, "");
  return `http://localhost:2000/${clean}`;
};

const EditSchema = Yup.object({
  content: Yup.string().required("Content is required"),
});

const PostTable = ({ posts, onDelete, onUpdate }) => {
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editImage, setEditImage] = useState(null); // For image preview

  const handleView = (post) => {
    setSelectedPost(post);
    setOpenView(true);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setEditImage(null); // Reset image preview
    setOpenEdit(true);
  };

  const handleDelete = (post) => {
    setDeleteId(post._id);
    setSelectedPost(post);
  };

  const confirmDelete = () => {
    onDelete(deleteId);
    setDeleteId(null);
    setSelectedPost(null);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "auto" }}>
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

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {posts && posts.length ? (
            posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>
                  {post.imageUrl ? (
                    <img
                      src={getImageUrl(post.imageUrl)}
                      alt="post"
                      style={{ width: 60, height: 60, objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#aaa" }}>No Image</span>
                  )}
                </TableCell>
                <TableCell>{post.userId?.username || "N/A"}</TableCell>
                <TableCell>{post.content}</TableCell>
                <TableCell>
                  {new Date(post.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(post.updatedAt).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleView(post)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(post)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(post)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No posts found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* View Modal */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
        <DialogTitle>View Post</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <>
              <Typography variant="subtitle1"><b>Author:</b> {selectedPost.userId?.username}</Typography>
              <Typography variant="subtitle2"><b>Content:</b> {selectedPost.content}</Typography>
              {selectedPost.imageUrl && (
                <img
                  src={getImageUrl(selectedPost.imageUrl)}
                  alt="post"
                  style={{ width: "100%", marginTop: 16 }}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal with Formik & Yup */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Formik
              initialValues={{
                content: selectedPost.content,
              }}
              validationSchema={EditSchema}
              onSubmit={(values, { setSubmitting }) => {
                const formData = new FormData();
                formData.append("content", values.content);
                if (editImage) formData.append("imageUrl", editImage);

                onUpdate(selectedPost._id, formData);
                setSubmitting(false);
                setOpenEdit(false);
                setSelectedPost(null);
                setEditImage(null);
              }}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
                <Form>
                  <Typography variant="subtitle2">
                    <b>Author:</b> {selectedPost.userId?.username}
                  </Typography>
                  <Field
                    as={TextField}
                    margin="dense"
                    label="Content"
                    name="content"
                    fullWidth
                    multiline
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.content && Boolean(errors.content)}
                    helperText={touched.content && errors.content}
                  />

                  {/* Image Preview: show selected new image, else old */}
                  {(editImage || selectedPost.imageUrl) && (
                    <img
                      src={
                        editImage
                          ? URL.createObjectURL(editImage)
                          : getImageUrl(selectedPost.imageUrl)
                      }
                      alt="post"
                      style={{ width: "100%", marginTop: 16, marginBottom: 8 }}
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setEditImage(e.target.files[0]);
                      }
                    }}
                    style={{ marginTop: 8 }}
                  />
                  <DialogActions>
                    <Button onClick={() => {
                      setOpenEdit(false);
                      setEditImage(null);
                    }}>
                      Cancel
                    </Button>
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
};

export default PostTable;
