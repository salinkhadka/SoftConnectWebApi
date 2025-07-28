"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { FiX, FiAlertTriangle } from "react-icons/fi"

interface ConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          iconColor: "text-red-500",
          confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          iconBg: "bg-red-100 dark:bg-red-900/20",
        }
      case "warning":
        return {
          iconColor: "text-yellow-500",
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
          iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
        }
      case "info":
        return {
          iconColor: "text-blue-500",
          confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          iconBg: "bg-blue-100 dark:bg-blue-900/20",
        }
      default:
        return {
          iconColor: "text-yellow-500",
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
          iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
        }
    }
  }

  const styles = getTypeStyles()

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white dark:bg-[#1e1b29] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-200 scale-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiX size={20} className="text-gray-500 dark:text-gray-400" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${styles.iconBg}`}>
            <FiAlertTriangle size={24} className={styles.iconColor} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">{title}</h3>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 ${styles.confirmButton}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
