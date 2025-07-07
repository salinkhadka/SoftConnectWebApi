import React from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import { useUser } from "../hooks/Admin/adminUserhook";

export default function UserProfile() {
  const { userid } = useParams();
  const { data: user, isLoading, error } = useUser(userid);

  const onUpdateUser = (formData) => {
    console.log("Update user:", formData);
    // implement update user logic here (API call)
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading user</div>;
  if (!user) return <div>User not found</div>;

  return <ProfileHeader user={user} onUpdateUser={onUpdateUser} />;
}
