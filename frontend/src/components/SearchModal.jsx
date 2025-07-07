import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // <-- import navigate
import { useGetUsers } from '../hooks/Admin/adminUserhook';
import { getBackendImageUrl } from '../utils/getBackendImageUrl';

const SearchPanel = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const navigate = useNavigate();  // <-- hook

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, error } = useGetUsers({ search: debouncedSearch });
  const users = data?.data || [];

  // Handler for clicking user
  const handleUserClick = (userId) => {
    onClose();               // close modal
    navigate(`/${userId}`);  // navigate to profile route
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="search-panel" aria-describedby="search-users"
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        pointerEvents: 'none',
      }}
    >
      <Box sx={{
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
      }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: '#37225C' }} aria-label="close">
          <CloseIcon />
        </IconButton>

        <h2 style={{ color: '#37225C' }} className="text-2xl font-bold mb-4">Search</h2>

        <div className="relative mb-6">
          <FiSearch className="absolute top-3 left-3 text-[#B8A6E6]" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search users"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#B8A6E6] shadow-sm"
          />
        </div>

        <h3 style={{ color: '#37225C' }} className="text-md font-semibold mb-2">Results</h3>

        {isLoading && <div className="text-gray-500 text-sm">Loading users...</div>}
        {error && <div className="text-red-500 text-sm">Failed to load users.</div>}
        {!isLoading && !error && users.length === 0 && <div className="text-gray-500 text-sm">No users found.</div>}

        <ul className="overflow-y-auto max-h-[calc(100vh-300px)] sm:max-h-[calc(100vh-350px)]">
          {users.map(user => (
            <li
              key={user._id}
              onClick={() => handleUserClick(user._id)}
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
