import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPostComponent from '../components/Admin/AddPost'; // Adjust path if needed

const AddPostModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-post-modal"
      aria-describedby="create-post-form"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          maxWidth: '95%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 3,
          p: 3,
          outline: 'none',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.600' }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        <AddPostComponent />
      </Box>
    </Modal>
  );
};

export default AddPostModal;
