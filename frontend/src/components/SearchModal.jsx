"use client"

import { useState, useEffect } from "react"
import { Modal, Box, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { FiSearch, FiUser, FiMail } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { useGetUsers } from "../hooks/Admin/adminUserhook"
import { getBackendImageUrl } from "../utils/getBackendImageUrl"

const PURPLE = "#37225C"
const LAVENDER = "#B8A6E6"
const WHITE = "#FFFFFF"

const SearchPanel = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const { data, isLoading, error } = useGetUsers({ search: debouncedSearch })
  const users = data?.data || []

  const handleUserClick = (userId) => {
    onClose()
    navigate(`/${userId}`)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="search-panel"
      aria-describedby="search-users"
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "stretch",
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          width: 400,
          height: "100%",
          bgcolor: "background.paper",
          boxShadow: `0 20px 60px ${PURPLE}30`,
          p: 0,
          ml: "20%",
          borderRight: `1px solid ${LAVENDER}40`,
          pointerEvents: "auto",
          position: "relative",
          borderTopRightRadius: 24,
          borderBottomRightRadius: 24,
          background: `linear-gradient(145deg, ${WHITE} 0%, #f8fafc 100%)`,
          transition: "transform 0.3s ease, opacity 0.3s ease",
          transform: open ? "translateX(0)" : "translateX(-20px)",
          opacity: open ? 1 : 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",

          // Dark mode background override
          "&.dark": {
            background: `linear-gradient(145deg, #1F2937 0%, #111827 100%)`, // Tailwind slate-800 to slate-900
            borderRight: `1px solid ${LAVENDER}40`,
            color: WHITE,
          },
        }}
        className="dark:bg-gray-900 dark:border-gray-700"
      >
        {/* Header */}
        <div
          className="p-6 text-center relative"
          style={{
            background: `linear-gradient(135deg, ${PURPLE} 0%, ${LAVENDER} 100%)`,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: WHITE,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          <h2 className="text-2xl font-bold text-white mb-2">Search Users</h2>
          <p className="text-white/80">Find and connect with people</p>
        </div>

        {/* Search Input */}
        <div className="p-6">
          <div className="relative">
            <FiSearch
              className="absolute top-1/2 left-4 transform -translate-y-1/2"
              size={20}
              style={{ color: PURPLE }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 shadow-sm transition-all duration-200
                         dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:border-purple-600 dark:focus:ring-purple-600"
              style={{
                borderColor: `${LAVENDER}60`,
              }}
            />
          </div>
        </div>

        {/* Results */}
        <div
          className="px-6 pb-6"
          style={{
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: "calc(100% - 148px)", // header + search input + padding approx
          }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: PURPLE }}>
            Search Results
          </h3>

          {isLoading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 dark:bg-gray-700"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-500 text-4xl mb-2">⚠️</div>
              <p className="text-red-600 dark:text-red-400">Failed to load users</p>
            </div>
          )}

          {!isLoading && !error && users.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <FiUser
                size={48}
                className="mx-auto mb-4 text-gray-400 dark:text-gray-500"
              />
              <p className="text-gray-500 dark:text-gray-400">No users found</p>
            </div>
          )}

          {!searchTerm && (
            <div className="text-center py-8">
              <FiSearch
                size={48}
                className="mx-auto mb-4 text-gray-400 dark:text-gray-500"
              />
              <p className="text-gray-500 dark:text-gray-400">
                Start typing to search for users
              </p>
            </div>
          )}

          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 group hover:scale-[1.02]"
              >
                <div className="relative">
                  <img
                    src={
                      getBackendImageUrl(user.profilePhoto) ||
                      `https://ui-avatars.com/api/?background=${LAVENDER.slice(
                        1,
                      ) || "/placeholder.svg"}&color=${PURPLE.slice(
                        1,
                      )}&name=${user.username}`
                    }
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border-2 group-hover:scale-110 transition-transform duration-200"
                    style={{ borderColor: LAVENDER }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-600 transition-colors">
                      {user.username}
                    </h4>
                    <div
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${LAVENDER}20`,
                        color: PURPLE,
                      }}
                    >
                      {user.role}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <FiMail size={14} />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default SearchPanel
