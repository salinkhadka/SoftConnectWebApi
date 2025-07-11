"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPostService } from "../../services/Admin/postService"
import { useToast } from "../../contexts/ToastContext"

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: createPostService,
    mutationKey: ["create_post"],
    onSuccess: () => {
      toast.success("Post created successfully!")
      queryClient.invalidateQueries(["all_posts"])
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create post")
    },
  })
}
