import {
  followUserApi,
  unfollowUserApi,
  getFollowersApi,
  getFollowingApi,
} from "../api/friendsApi";

export const followUserService = async (followeeId) => {
  try {
    const response = await followUserApi({ followeeId }); // wrap inside object
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to follow user" };
  }
};

export const unfollowUserService = async (followeeId) => {
  try {
    const response = await unfollowUserApi({ followeeId }); // wrap inside object
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to unfollow user" };
  }
};


// ✅ Get followers of a user
export const getFollowersService = async (userId) => {
  try {
    const response = await getFollowersApi(userId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch followers" };
  }
};

// ✅ Get following users
export const getFollowingService = async (userId) => {
  try {
    const response = await getFollowingApi(userId);
    return response.data;
  } catch (err) {
    console.error(err);
    throw err.response?.data || { message: "Failed to fetch following" };
  }
};
