import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import DeleteModal from "../components/DeleteModal";

export default function ChatBox({ messages, senderId, onDelete }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedMessageId(id);
    setOpenModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMessageId) {
      onDelete(selectedMessageId);
      setSelectedMessageId(null);
    }
    setOpenModal(false);
  };

  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`relative max-w-[60%] p-2 rounded-md ${
            msg.sender === senderId
              ? "ml-auto bg-blue-500 text-white"
              : "mr-auto bg-gray-200"
          }`}
        >
          {msg.content}

          {msg.sender === senderId && (
            <button
              onClick={() => handleDeleteClick(msg._id)}
              className="absolute top-1 right-1 text-white/80 hover:text-red-300"
              title="Delete"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      ))}

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        description="Are you sure you want to delete this message?"
      />
    </div>
  );
}
