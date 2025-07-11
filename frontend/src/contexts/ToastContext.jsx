"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"
const ERROR_BG = "#4A1C1C"
const ERROR_BORDER = "#FF6B6B"
const ERROR_SHADOW = "rgba(255, 107, 107, 0.25)"

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const Toast = ({ toast, onRemove }) => {
  const getIcon = () => {
    const iconStyle = { color: toast.type === "error" ? ERROR_BORDER : LAVENDER }
    switch (toast.type) {
      case "success":
        return <FiCheckCircle size={20} style={iconStyle} />
      case "error":
        return <FiAlertCircle size={20} style={iconStyle} />
      case "info":
      default:
        return <FiInfo size={20} style={iconStyle} />
    }
  }

  const backgroundColor = toast.type === "error" ? ERROR_BG : PURPLE
  const borderLeftColor = toast.type === "error" ? ERROR_BORDER : LAVENDER
  const boxShadow =
    toast.type === "error"
      ? `0 8px 32px ${ERROR_SHADOW}`
      : `0 8px 32px ${PURPLE}25`

  return (
    <div
      className={`
        flex items-start gap-3 p-4 mb-3 rounded-xl shadow-lg border-l-[4px]
        transform transition-all duration-300 ease-in-out
        hover:shadow-xl hover:scale-[1.02]
        animate-in slide-in-from-right-full
      `}
      style={{
        backgroundColor,
        color: WHITE,
        borderLeftColor,
        backdropFilter: "blur(10px)",
        boxShadow,
      }}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 p-1 rounded-lg transition-colors"
        style={{
          color: WHITE,
          backgroundColor: "transparent",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#B8A6E633"
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "transparent"
        }}
      >
        <FiX size={16} />
      </button>
    </div>
  )
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random()
    const newToast = { id, message, type, duration }

    setToasts((prev) => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = {
    success: (message, duration) => addToast(message, "success", duration),
    error: (message, duration) => addToast(message, "error", duration),
    info: (message, duration) => addToast(message, "info", duration),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] w-full max-w-sm pointer-events-none">
        <div className="pointer-events-auto">
          {toasts.map((toastItem) => (
            <Toast key={toastItem.id} toast={toastItem} onRemove={removeToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
