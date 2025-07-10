"use client"

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material"
import { FiAlertTriangle } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete confirmation",
  description = "Are you sure you want to delete?",
}) {
  return (
    <Dialog
      open={!!isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: `0 20px 60px ${PURPLE}20`,
          border: `1px solid ${LAVENDER}30`,
          minWidth: 400,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          py: 3,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#fef2f2" }}
          >
            <FiAlertTriangle size={32} className="text-red-500" />
          </div>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#374151",
              fontSize: "1.25rem",
            }}
          >
            {title}
          </Typography>
        </div>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", py: 3, px: 4 }}>
        <Typography
          sx={{
            color: "#6b7280",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 4, gap: 2, justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#e5e7eb",
            color: "#6b7280",
            fontWeight: "500",
            borderRadius: 2,
            px: 4,
            py: 1,
            "&:hover": {
              borderColor: "#d1d5db",
              backgroundColor: "#f9fafb",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#dc2626",
            color: WHITE,
            fontWeight: "600",
            borderRadius: 2,
            px: 4,
            py: 1,
            boxShadow: "0 4px 15px #dc262640",
            "&:hover": {
              backgroundColor: "#b91c1c",
              boxShadow: "0 6px 20px #dc262650",
            },
          }}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
