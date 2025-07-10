import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import {
  useMessages,
  useSendMessage,
  useDeleteMessage,
} from "../hooks/messagehooks.js";
import ChatBox from "./ChatBox.jsx";
import ChatInput from "./ChatInput.jsx";
import { AuthContext } from "../auth/AuthProvider.jsx";

export default function MessagePage() {
  const { user } = useContext(AuthContext);
  const senderId = user?.id || user?._id;
  const { userid: recipientId } = useParams();

  const { data: messages = [] } = useMessages(senderId, recipientId);
  const { mutate: sendMessage } = useSendMessage(senderId, recipientId);
  const { mutate: deleteMessage } = useDeleteMessage(senderId, recipientId);

  const handleSend = (text) => {
    if (!text.trim()) return;
    sendMessage({ recipientId, content: text });
  };

  const handleDelete = (messageId) => {
    deleteMessage(messageId);
  };

  if (!senderId) return <div>Loading user info...</div>;
  if (!recipientId) return <div>No recipient selected.</div>;

  return (
    <div className="flex flex-col h-[85vh] border rounded-md m-4">
      <div className="p-3 font-semibold bg-gray-100 border-b">
        Chat with {recipientId}
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse">
        <ChatBox
          messages={messages}
          senderId={senderId}
          onDelete={handleDelete} // ✅ Pass delete function here
        />
      </div>
      <div className="p-3 border-t">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
