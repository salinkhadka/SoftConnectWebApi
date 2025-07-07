import axios from "./api";

// Follow a user (token required)
// data should be an object: { followeeId: "..." }
export const followUserApi = (data) => {
  const token = localStorage.getItem("token");
  return axios.post("friends/follow", data, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Unfollow a user (token required)
// data should be an object: { followeeId: "..." }
export const unfollowUserApi = (data) => {
  const token = localStorage.getItem("token");
  return axios.post("friends/unfollow", data, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Get followers of a user (token optional)
export const getFollowersApi = (userId) => {
  const token = localStorage.getItem("token");
  return axios.get(`friends/followers/${userId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Get users that the user is following (token optional)
export const getFollowingApi = (userId) => {
  const token = localStorage.getItem("token");
  return axios.get(`friends/following/${userId}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};
