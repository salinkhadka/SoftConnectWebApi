import { useQuery } from "@tanstack/react-query";
import { getAllPostsService } from "../../services/Admin/postService";

export const useAllPosts = () => {
  return useQuery({
    queryKey: ["all_posts"],
    queryFn: getAllPostsService,
  });
};
