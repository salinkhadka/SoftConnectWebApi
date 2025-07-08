import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  sendMessageService,
  getMessagesService,
  markMessagesAsReadService,
  getConversationsService,
} from "../services/messageService";

// ✅ Fetch conversation messages between two users
export const useMessages = (user1Id, user2Id) =>
  useQuery({
    queryKey: ["messages", user1Id, user2Id],
    queryFn: () => getMessagesService(user1Id, user2Id),
    enabled: !!user1Id && !!user2Id,
    onError: (err) => {
      toast.error(err?.message || "Failed to load messages");
    },
  });

// ✅ Send a message
export const useSendMessage = (user1Id, user2Id) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipientId, content }) =>
      sendMessageService(recipientId, content),
    mutationKey: ["send_message"],
    onSuccess: () => {
      toast.success("Message sent");
      queryClient.invalidateQueries(["messages", user1Id, user2Id]);
      queryClient.invalidateQueries(["conversations", user1Id]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to send message");
    },
  });
};

export const useMarkAsRead = (user1Id, user2Id) => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn now accepts an object { otherUserId }
    mutationFn: ({ otherUserId }) => markMessagesAsReadService(otherUserId),
    mutationKey: ["mark_as_read"],
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", user1Id, user2Id]);
      queryClient.invalidateQueries(["conversations", user1Id]);
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to mark as read");
    },
  });
};


// ✅ Fetch users with whom the user has conversations
export const useConversations = (userId) =>
  useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => getConversationsService(userId),
    enabled: !!userId,
    onError: (err) => {
      toast.error(err?.message || "Failed to load conversations");
    },
  });
