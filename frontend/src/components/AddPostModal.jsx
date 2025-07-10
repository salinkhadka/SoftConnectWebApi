"use client"

import { Modal, Box, IconButton } from "@mui/material"
import { FiX, FiEdit3 } from "react-icons/fi"
import AddPostComponent from "../components/Admin/AddPost"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const AddPostModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-post-modal"
      aria-describedby="create-post-form"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
    >
      <Box
        sx={{
          width: { xs: "95%", sm: "90%", md: 800 },
          maxWidth: "95vw",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: `0 20px 60px ${PURPLE}30`,
          border: `1px solid ${LAVENDER}40`,
          outline: "none",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 text-center relative"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <FiEdit3 size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">Create New Post</h2>
          </div>
          <p className="text-white/80 text-sm mt-1">Share your thoughts with the community</p>

          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: WHITE,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            aria-label="close"
          >
            <FiX size={20} />
          </IconButton>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <AddPostComponent />
        </div>
      </Box>
    </Modal>
  )
}

export default AddPostModal
