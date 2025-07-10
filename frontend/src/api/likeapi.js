import axios from "./api";

// Like a post
export const likePost = (postId) => {
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user"))?._id; // or get userId however you store it

  return axios.post(
    `like/like`,  // match your backend route
    { userId, postId }, // send as JSON body
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};


export const unlikePost = ({ userId, postId }) => {
  const token = localStorage.getItem("token");

  return axios.post(
    `like/unlike`, // ✅ match backend
    { userId, postId },
    {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );
};


// Get likes of a post
export const getPostLikes = (postId) => axios.get(`like/like/${postId}`);
