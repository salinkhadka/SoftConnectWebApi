import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useMessages, useSendMessage } from '../hooks/messagehooks.js';
import ChatBox from "./ChatBox.jsx";
import ChatInput from "./ChatInput.jsx";
import { AuthContext } from "../auth/AuthProvider.jsx";

export default function MessagePage() {
  const { user } = useContext(AuthContext);
  const senderId = user?.id || user?._id;
  const { userid: recipientId } = useParams();

  // Fetch messages sorted descending by createdAt (newest first)
  const { data: messages = [] } = useMessages(senderId, recipientId);

  const { mutate: sendMessage } = useSendMessage(senderId, recipientId);

  const handleSend = (text) => {
    if (!text.trim()) return;
    sendMessage({ recipientId, content: text });
  };

  if (!senderId) return <div>Loading user info...</div>;
  if (!recipientId) return <div>No recipient selected.</div>;

  // messages are newest first, so no reversal needed
  // pass messages as-is if ChatBox expects newest on top

  return (
    <div className="flex flex-col h-[85vh] border rounded-md m-4">
      <div className="p-3 font-semibold bg-gray-100 border-b">
        Chat with {recipientId}
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse">
        {/* flex-col-reverse will visually reverse messages so newest is bottom (chat style) */}
        <ChatBox messages={messages} senderId={senderId} />
      </div>
      <div className="p-3 border-t">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
