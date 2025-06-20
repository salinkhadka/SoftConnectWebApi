import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete confirmation",
  description = "Are you sure you want to delete?",
}) {
  return (
    <Dialog open={!!isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
