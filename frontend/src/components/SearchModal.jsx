import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FiSearch } from 'react-icons/fi';
import { useGetUsers } from '../hooks/Admin/adminUserhook'; // your custom hook
import {getBackendImageUrl} from '../utils/getBackendImageUrl'


const SearchPanel = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce input to avoid fetching on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch users based on debounced search term
  const { data, isLoading, error } = useGetUsers({ search: debouncedSearch });

  const users = data?.data || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="search-panel"
      aria-describedby="search-users"
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        pointerEvents: 'none', // modal blocks page but not the input box
      }}
    >
      <Box
        sx={{
          width: 350,
          height: '100%',
          bgcolor: 'background.paper',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          p: 3,
          ml: '23%',
          borderRight: '1px solid #ddd',
          pointerEvents: 'auto',
          position: 'relative',
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
          background: 'linear-gradient(to bottom, #ffffff, #f3f0ff)',
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          transform: open ? 'translateX(0)' : 'translateX(-20px)',
          opacity: open ? 1 : 0,
          overflowY: 'auto',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: '#37225C' }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        <h2 style={{ color: '#37225C' }} className="text-2xl font-bold mb-4">
          Search
        </h2>

        <div className="relative mb-6">
          <FiSearch className="absolute top-3 left-3 text-[#B8A6E6]" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B8A6E6] shadow-sm"
          />
        </div>

        <h3 style={{ color: '#37225C' }} className="text-md font-semibold mb-2">
          Results
        </h3>

        {isLoading && <div className="text-gray-500 text-sm">Loading users...</div>}
        {error && <div className="text-red-500 text-sm">Failed to load users.</div>}
        {!isLoading && !error && users.length === 0 && (
          <div className="text-gray-500 text-sm">No users found.</div>
        )}

        <ul className="overflow-y-auto max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-350px)]">

          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-center gap-3 p-2 rounded hover:bg-[#f0eaff] cursor-pointer"
            >
              <img
                src={getBackendImageUrl(user.profilePhoto) || 'data:image/png;base64,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'}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-[#37225C]">{user.username}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            </li>
          ))}
        </ul>
      </Box>
    </Modal>
  );
};

export default SearchPanel;
