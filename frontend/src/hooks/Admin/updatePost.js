"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePostService } from "../../services/Admin/postService"
import { useToast } from "../../contexts/ToastContext"

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ postId, formData }) => updatePostService(postId, formData),
    mutationKey: ["update_post"],
    onSuccess: () => {
      toast.success("Post updated successfully!")
      queryClient.invalidateQueries(["all_posts"])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update post")
    },
  })
}
