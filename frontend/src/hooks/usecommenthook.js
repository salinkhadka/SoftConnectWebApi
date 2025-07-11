"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../contexts/ToastContext"
import { getPostCommentsService, createCommentService, deleteCommentService } from "../services/commentService"

export const usePostComments = (postId) =>
  useQuery({
    queryKey: ["post_comments", postId],
    queryFn: () => getPostCommentsService(postId),
    enabled: !!postId,
  })

export const useCreateComment = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (commentData) => createCommentService(commentData),
    mutationKey: ["create_comment"],
    onSuccess: (_, variables) => {
      toast.success("Comment added!")
      if (variables?.postId) {
        queryClient.invalidateQueries(["post_comments", variables.postId])
      }
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to add comment")
    },
  })
}

export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (commentId) => deleteCommentService(commentId),
    mutationKey: ["delete_comment"],
    onSuccess: (_, commentId) => {
      toast.success("Comment deleted!")
      queryClient.invalidateQueries({ queryKey: ["post_comments"] })
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete comment")
    },
  })
}
