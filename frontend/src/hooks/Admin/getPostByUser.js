import { useQuery } from "@tanstack/react-query";
import { getUserPostsService } from "../../services/Admin/postService";

export const useUserPosts = (userId) => {
  return useQuery({
    queryKey: ["user_posts", userId],
    queryFn: () => getUserPostsService(userId),
    enabled: !!userId,
  });
};
