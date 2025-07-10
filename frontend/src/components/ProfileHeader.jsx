import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { useUserPosts } from "../hooks/Admin/getPostByUser";
import { useFollowing } from "../hooks/friendsHook"; // Your hook for following list
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import ProfileActions from "./ProfileActions";
import EditProfileDialog from "./EditProfileDialog";

const ProfileHeader = ({ user, onUpdateUser }) => {
  const { logout, user: loggedInUser } = useContext(AuthContext);
  const isOwnProfile = loggedInUser?._id === user?._id;

  const [openEdit, setOpenEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const { data: posts, isLoading: postsLoading } = useUserPosts(user?._id);

  const { data: followingData, isLoading: followingLoading } = useFollowing(loggedInUser?._id);

  // Compute if logged-in user is following this profile user
  const isFollowing =
    !followingLoading &&
    followingData?.data?.some(
      (follow) => follow.followee._id.toString() === user._id.toString()
    );

  // Console logs for debugging
  useEffect(() => {
    console.log("Logged-in user:", loggedInUser);
    console.log("Profile user:", user);
  }, [loggedInUser, user]);

  useEffect(() => {
    console.log("Posts loading:", postsLoading);
    if (posts) console.log(`User has ${posts.length} posts`);
  }, [posts, postsLoading]);

  useEffect(() => {
    console.log("Following loading:", followingLoading);
    if (followingData) {
      console.log(
        `Logged-in user is following ${followingData.data.length} users`
      );
      console.log("Is following this profile?", isFollowing);
    }
  }, [followingData, followingLoading, isFollowing]);

  return (
    <div className="flex justify-center mt-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-[#1b1a22] rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 w-full max-w-5xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          <ProfileImage
            user={user}
            onEditClick={() => {
              setPreviewPhoto(null);
              setOpenEdit(true);
              console.log("Edit clicked");
            }}
          />
          <div className="flex-1 w-full space-y-4">
            <div
              className="flex justify-between"
              style={{ alignItems: "flex-start" }}
            >
              <ProfileInfo
                user={user}
                posts={posts}
                postsLoading={postsLoading}
              />
              <div style={{ marginTop: -12 }}>
                <ProfileActions
                  isOwnProfile={isOwnProfile}
                  anchorEl={anchorEl}
                  viewedUserId={user?._id}
                  isFollowing={isFollowing}
                  onEditClick={() => {
                    setPreviewPhoto(null);
                    setOpenEdit(true);
                    console.log("Edit clicked via ProfileActions");
                  }}
                  onLogout={() => {
                    logout();
                    console.log("User logged out");
                  }}
                  onSettingsClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    console.log("Settings menu opened");
                  }}
                  onCloseSettings={() => {
                    setAnchorEl(null);
                    console.log("Settings menu closed");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <EditProfileDialog
          open={openEdit}
          user={user}
          previewPhoto={previewPhoto}
          setOpen={setOpenEdit}
          setPreviewPhoto={setPreviewPhoto}
          onUpdateUser={onUpdateUser}
        />
      )}
    </div>
  );
};

export default ProfileHeader;
