"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../contexts/ToastContext"
import {
  sendMessageService,
  getMessagesService,
  markMessagesAsReadService,
  getConversationsService,
  deleteMessageService,
} from "../services/messageService"

export const useMessages = (user1Id, user2Id) =>
  useQuery({
    queryKey: ["messages", user1Id, user2Id],
    queryFn: () => getMessagesService(user1Id, user2Id),
    enabled: !!user1Id && !!user2Id,
  })

export const useSendMessage = (user1Id, user2Id) => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ recipientId, content }) => sendMessageService(recipientId, content),
    mutationKey: ["send_message"],
    onSuccess: () => {
      // toast.success("Message sent")
      queryClient.invalidateQueries(["messages", user1Id, user2Id])
      queryClient.invalidateQueries(["conversations", user1Id])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to send message")
    },
  })
}

export const useMarkAsRead = (user1Id, user2Id) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ otherUserId }) => markMessagesAsReadService(otherUserId),
    mutationKey: ["mark_as_read"],
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", user1Id, user2Id])
      queryClient.invalidateQueries(["conversations", user1Id])
    },
  })
}

export const useConversations = (userId) =>
  useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => getConversationsService(userId),
    enabled: !!userId,
  })

export const useDeleteMessage = (user1Id, user2Id) => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (messageId) => deleteMessageService(messageId),
    mutationKey: ["delete_message"],
    onSuccess: () => {
      toast.success("Message deleted")
      queryClient.invalidateQueries(["messages", user1Id, user2Id])
      queryClient.invalidateQueries(["conversations", user1Id])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete message")
    },
  })
}
