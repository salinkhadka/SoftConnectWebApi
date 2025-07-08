import React from "react";

export default function ChatBox({ messages, senderId }) {
  return (
    <div className="space-y-2">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`max-w-[60%] p-2 rounded-md ${
            msg.sender === senderId
              ? "ml-auto bg-blue-500 text-white"
              : "mr-auto bg-gray-200"
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
